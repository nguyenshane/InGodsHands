function addTribe () {
    for (var i = 0; i < tribes.length; i++) {
        if (!tribes[i].enabled) {
            tribes[i].enabled = true;
            break;
        }
    }
}

pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
        
        this.humanParent;
        this.humans = [];

        this.population = 1;
        this.MAXPOPULATION = 5;
        this.MINPOPULATION = 1;
        
        this.increasePopulationTimer = 0;

        this.idealTemperature = Math.floor((Math.random() * 20) + 55);
        this.currTileTemperature;

        this.fear = 0;

        this.tile;
        this.destinationTile;
        this.startPosition;
        this.influencedTiles = [];
        
        this.icons = [];
        this.sunIcon;
        this.rainIcon;
        this.stormIcon;
        this.praiseIcon;

        this.stormEffect;

        this.rules = [];

        this.isBusy = false;
        this.isSpiteful = false;
        this.inSun = false;
        this.previousAction;
        this.currentAction;
        this.prayerTimer = 0;
        this.cowerTimer = 0;
        this.denounceTimer = 0;
        this.praiseTimer = 0;
        this.noSunTimer = 0;
        
        this.predatorsInInfluence = []; //tile references that have aggressive animals on it within this tribe's influence area
		this.preyInInfluence = [];
    
        // Variables for lerp, in milliseconds

        //this.foodPopTimer = 0;
        this.travelTime = 3000;
        this.travelStartTime;

    };

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {

            this.humanParent = context.root.findByName("Humans");
			var t1 = new Date();
			
			var availStartingTiles = getConnectedTilesInArea(ico, initialContinentLocation, 5);
            this.tile = ico.tiles[availStartingTiles[Math.floor(pc.math.random(0, availStartingTiles.length))]]; //initial tribe location
            

            totalBelief = 300;
            prevTotalBelief = totalBelief;

            this.entity.setPosition(this.tile.center);
            this.tile.hasTribe = true;

            this.rotation = this.tile.getRotationAlignedWithNormal();

            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            
            this.createRuleList();

            this.calculateInfluence();

            //this.icons = this.entity.getChildren();
            this.rainIcon = this.entity.findByName("PrayClouds");
            this.sunIcon = this.entity.findByName("PraySun");
            this.stormIcon = this.entity.findByName("FearStorm");
            this.praiseIcon = this.entity.findByName("PraiseHands");
            this.stormEffect = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera").script.vignette.effect;
	
            this.audio = context.root._children[0].script.AudioController;
			
            this.addHuman();

			var t2 = new Date();
			debug.log(DEBUG.INIT, "tribe initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            //////////////////////////////////////////////////////////////////////////////////////
            // Rules system is run through each from, sorted by weight                          //
            // if the NPC is busy (moving, praying, etc.), currentAction is called instead      //
            // Current Action is a different function depending on which rule has been fired    //
            //////////////////////////////////////////////////////////////////////////////////////

            //console.log("Tribe is busy? " + this.tile.index + " " + this.isBusy);

            if (!isPaused) {
                if (!this.isBusy) {
                    this.increasePopulationTimer += dt;
                    this.runRuleList();
                } else {
                    this.currentAction(dt);
                }

                // Set temperature of tile
                this.currTileTemperature = this.tile.getTemperature();

                // Set lighting in shader
                this.rotation = this.tile.getRotationAlignedWithNormal();
                this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);

                // God inaction timer goes up so long as God doesn't act (Duh)
                //this.godInactionTimer += dt;

                // Increase no sun timer whenever tribe doesn't have sun
                if(!this.inSun){
                    this.noSunTimer += dt;
                } else {
                    this.noSunTimer = 0;
                }

                this.increasePopulationTimer += dt;

                if (this.increasePopulationTimer >= 50){
                    this.increasePopulation();
                    this.increasePopulationTimer = 0;
                }

                //Check influenced tiles for predators or prey
                this.predatorsInInfluence = [];
                this.preyInInfluence = [];
                for (var i = this.influencedTiles.length-1; i >= 0; i--) {
                    var tile = this.influencedTiles[i];
                    if (tile.hasAnimal) {
                        if (tile.animal.stats.aggressiveness > 0) this.predatorsInInfluence.push(tile);
                        else this.preyInInfluence.push(tile);
                    }
                }
			}
        },

        //////////////////////////////////
        //  Tribe move action functions //
        //////////////////////////////////

        // Called every movement frame, lerps from one tile center to the next
        move: function(deltaTime) {

            // Find change in time since the start, and divide by the desired total travel time
            // This will give you the percentage of the travel time covered. Send this for the lerp
            // rather than changing lerp's start position each frame.
            // Delta vec used as middle man for setting tribe's position.

            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            var deltaVec = new pc.Vec3;

            deltaVec.lerp(this.startPosition, this.destinationTile.center, percentTravelled);
            this.entity.setPosition(deltaVec);   
            //console.log("Start tile: " + this.startPosition);
            //console.log("Destination tile: " + this.destinationTile.center);
            //console.log("Current percent: " + percentTravelled);

            // Once tribe is at next tile's center, movement is done.
            if(percentTravelled >= 1){
                this.tile.hasTribe = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasTribe = true;
                this.migrate();
            }
        },

        setDestination: function(destination) {
            this.isBusy = true;
            this.destinationTile = destination;
            this.startPosition = this.entity.getPosition().clone();
            this.setCurrentAction(this.move);   

            var timer = new Date();
            this.travelStartTime = timer.getTime();
        },

        migrate: function() {
            if(!(this.currTileTemperature > (this.idealTemperature - 5) &&
                 this.currTileTemperature < (this.idealTemperature + 5))){

                var possibleTiles = [this.tile];

                if (!this.tile.neighbora.isOcean && !this.tile.neighbora.hasTribe){
                    possibleTiles.push(this.tile.neighbora);
                }
                if (!this.tile.neighborb.isOcean && !this.tile.neighborb.hasTribe){
                    possibleTiles.push(this.tile.neighborb);
                }
                if (!this.tile.neighborc.isOcean && !this.tile.neighborc.hasTribe){
                    possibleTiles.push(this.tile.neighborc);
                }

                var bestTile = possibleTiles[min(possibleTiles, function(v, a) {return Math.abs(a - v.getTemperature())}, this.idealTemperature)];
                /*
                bestTile = this.tile;
                for (var i = 0; i < possibleTiles.length; i++){
                    if (Math.abs(this.idealTemperature - bestTile.getTemperature()) > 
                        Math.abs(this.idealTemperature - possibleTiles[i].getTemperature())){
                        bestTile = possibleTiles[i];
                    }
                }
                */

                if (bestTile.equals(this.tile)){
                    this.isBusy = false;
                    this.isSpiteful = false;
                } else {
                   this.setDestination(bestTile); 
                }

            } else {
                //this.calculatePopulation();
                this.calculateInfluence();
                this.isBusy = false;
                this.isSpiteful = false;
            }

        },

        ////////////////////////////////////
        //  Tribe prayer action functions //
        ////////////////////////////////////

        prayForTemperature: function (deltaTime) {
            if(this.currTileTemperature > this.idealTemperature){
                this.rainIcon.enabled = true;
            } else {
                this.sunIcon.enabled = true;
            }

            if(this.prayerTimer <= 0){
                //console.log("Prayer timer up");
                this.prayerTimer = 0;
                this.decreaseBelief();
                this.isSpiteful = true;
                this.isBusy = false;
                this.sunIcon.enabled = false;
                this.rainIcon.enabled = false;
            }

            if ((this.currTileTemperature > (this.idealTemperature - 5) &&
                 this.currTileTemperature < (this.idealTemperature + 5)) &&
                 this.prayerTimer > 0){

                //console.log("Prayer fulfilled!");
                this.prayerTimer = 0;
                this.isBusy = false;
                this.sunIcon.enabled = false;
                this.rainIcon.enabled = false;
                this.startPraise();
            }

            //console.log(this.currTileTemperature);

            this.prayerTimer -= deltaTime;
        },

        startPrayForTemperature: function (time) {
            //console.log("TIME TO PRAY");
            this.prayerTimer = time;
            this.setCurrentAction(this.prayForTemperature);
            this.isBusy = true;

            this.audio.sound_TribePray();
        },

        ///////////////////////////
        //  Tribe fear functions //
        ///////////////////////////
       
        startCowering: function () {
            //console.log("Tribe is now cowering");
            this.cowerTimer = 6;
            this.setCurrentAction(this.cower);
            this.isBusy = true;
            this.stormIcon.enabled = true;
            //this.stormEffect.enabled = true;            
            while(this.stormEffect.darkness < this.cowerTimer){
                this.stormEffect.darkness += .005;
            }            
        },

        cower: function(deltaTime) {
            // Depending on what the tribe was doing before hand, their fear
            // and belief will increase and decrease accordingly.
            if(this.cowerTimer <= 0){
                switch(this.previousAction){
                    case this.denounce:
                        this.increaseFear();
                        this.increaseBelief();
                        this.isBusy = false
                        
                        //console.log("THOU HAST BEEN SMITED");
                        break;

                    case this.cower:
                        this.decreaseBelief();
                        this.isBusy = false;
                        //console.log("Stop scaring me!");
                        break;

                    default:
                        this.increaseFear();
                        this.increaseBelief();
                        this.setCurrentAction(this.previousAction);
                        //console.log("Cower done");
                        break;
                }
                this.stormIcon.enabled = false;
                this.cowerTimer = 0;                    
            }

            this.cowerTimer -= deltaTime;
            if(this.stormEffect.darkness > 1){
                this.stormEffect.darkness -= deltaTime;
            } else {
                this.stormEffect.darkness = 1;
            }
        },

        //////////////////////////////
        // Tribe feedback functions //
        //////////////////////////////

        startPraise: function() {
            //console.log("I love god!");
            this.increaseBelief();
            this.praiseTimer = 6;
            this.setCurrentAction(this.praise);
            this.isBusy = true;
            this.praiseIcon.enabled = true;
            this.audio.sound_TribePraise();
            // Play animation here
        },

        praise: function(deltaTime) {
            this.praiseIcon.enabled = true;
            if(this.praiseTimer <= 0){
                //console.log("God is good!");
                this.increaseBelief();
                this.praiseTimer = 0;
                this.praiseIcon.enabled = false;
                this.isBusy = false;
            }
            this.praiseTimer -= deltaTime;
        },

        startDenouncing: function() {
            this.denounceTimer = 10;
            this.setCurrentAction(this.denounce);
            this.isBusy = true;
            this.audio.sound_TribeDenounce();
        },

        denounce: function(deltaTime) {
            if(this.denounceTimer <= 0){
                //console.log("DENOUNCED GOD");
                this.decreaseBelief();
                this.denounceTimer = 0;
                this.isBusy = false;
            }
            
            this.denounceTimer -= deltaTime;
        },

        /////////////////////////////////
        //  Tribe data acces functions //
        /////////////////////////////////

        resetInactionTimer: function() {
            this.godInactionTimer = 0;
        },

        getPopulation: function() {
            return this.population;
        },

        setPopulation: function(population) {
            this.population = population;
        },

        getIdealTemperature: function() {
            return this.idealTemperature;
        },

        increaseBelief: function() {
            prevTotalBelief = totalBelief;
            ++totalBelief;
        },

        decreaseBelief: function() {
            prevTotalBelief = totalBelief;
            --totalBelief;
        },

        increaseFear: function() {
            ++this.fear;
        },

        decreaseFear: function() {
            --this.fear;
        },

        setCurrentAction: function(newAction) {
            this.previousAction = this.currentAction;
            this.currentAction = newAction;
            this.sunIcon.enabled = false;
            this.rainIcon.enabled = false;
            this.stormIcon.enabled = false;
            this.praiseIcon.enabled = false;
        },

        increasePopulation: function() {
            ++this.population;
            if (this.population > this.MAXPOPULATION){
                addTribe();
                this.setPopulation(2);
            }
        },

        decreasePopulation: function() {
            --this.population;
            if (this.population < MINPOPULATION){
                // call kill tribe
            }
        },

        calculateInfluence: function() {
            var influenceRate;
            if (this.population < 15){
                influenceRate = 9;
            } else {
                influenceRate = 18;
            }

            // Sick tile influence calculation algorithm
            // basically a BFS
            this.influencedTiles = [];            
            this.influencedTiles.push(this.tile);
            var currTile;
            var counter = influenceRate;
            var queue = [this.tile.neighbora, this.tile.neighborb, this.tile.neighborc];

            while (counter > 0) {
                currTile = queue.shift();
                queue.push(currTile.neighbora, currTile.neighborb, currTile.neighborc);
                if (this.influencedTiles.indexOf(currTile) === -1) {
                    this.influencedTiles.push(currTile);
                    counter--;
                }
            }
        },
		
        addHuman: function() {
            var e = this.humanParent.clone();
            this.entity.getParent().addChild(e);
            var newHuman = e.findByName("human1");
            newHuman.enabled = true;
            debug.log(DEBUG.AI, "New human "  + newHuman);
            newHuman.script.Human.tribeParent = this;
            this.humans.push(newHuman);
            newHuman.script.Human.start();
            newHuman.script.Human.chooseState();
        },

        // Constructs the NPC's list of rules
        createRuleList: function() {
            this.rules.push(new wantToMigrate());
            this.rules.push(new needTemperatureChange());
            this.rules.push(new wantToDenounceInactive());
            this.rules.push(new wantToDenounceNoSun());
        },

        runRuleList: function() { 
            this.rules.sort(function(a, b){return b.weight - a.weight});
            for(var i = 0; i < this.rules.length; i++){
                if(this.rules[i].testConditions(this)){
                    this.rules[i].consequence(this);
                    break;
                }
            }            
        }
    };

    return Tribe;
});