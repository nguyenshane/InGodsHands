pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
        
        this.population = 1;
        this.stockpile = 0;
        this.incomingFood = 0;
        
        this.idealTemperature = 65;
        this.currTileTemperature;

        this.belief = 1;
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

        this.rules = [];
        this.isBusy = false;
        this.isSpiteful = false;
        this.previousAction;
        this.currentAction;
        this.prayerTimer = 0;
        this.cowerTimer = 0;
        this.denounceTimer = 0;
        this.praiseTimer = 0;
        this.godInactionTimer = 0;
        
        // COMMENT TO TEST NEW GIT PROCEDURE

    };

    // Variables for lerp, in milliseconds

    var _foodPopTimer = 0;
    var _travelTime = 3000;
    var _travelStartTime;

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // create mesh

            this.tile = ico.tiles[1034]; // list of tiles
            this.calculateFood();

            this.entity.setPosition(this.tile.center);
            this.tile.hasTribe = true;

            this.rotation = this.tile.getRotationAlignedWithNormal();
            //this.entity.setLocalScale(.1, .1, .1);
            console.log('localscale',this.rotation, this);

            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            
            this.createRuleList();

            this.calculateInfluence();

            //this.icons = this.entity.getChildren();
            this.rainIcon = this.entity.findByName("PrayClouds");
            this.sunIcon = this.entity.findByName("PraySun");
            this.stormIcon = this.entity.findByName("FearStorm");
            this.praiseIcon = this.entity.findByName("PraiseHands");
            console.log("Rain: " + this.rainIcon.getName() + "\nSun: " + this.sunIcon.getName() + "\nStorm: " + this.stormIcon.getName() + "\nPraise: " + this.praiseIcon.getName());

           // console.log("The influenced tiles length: " + this.influencedTiles.length);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            //////////////////////////////////////////////////////////////////////////////////////
            // Rules system is run through each from, sorted by weight                          //
            // if the NPC is busy (moving, praying, etc.), currentAction is called instead      //
            // Current Action is a different function depending on which rule has been fired    //
            //////////////////////////////////////////////////////////////////////////////////////

            //console.log("busy: " + this.isBusy +
            //            "\nDenounce timer: " + this.denounceTimer + 
            //            "\nAction: " + this.currentAction);

            if(!this.isBusy){
                this.runRuleList();
                this.foodAndPopTimer(dt);
            } else {
                this.currentAction(dt);
            }

            // Set temperature of tile
            this.currTileTemperature = this.tile.getTemperature();

            // Set lighting in shader
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);

            // God inaction timer goes up so long as God doesn't act (Duh)
            this.godInactionTimer += dt;
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
            var timeSinceTravelStarted = timer.getTime() - _travelStartTime;
            var percentTravelled = timeSinceTravelStarted / _travelTime;
            
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
            this.startPosition = this.entity.getPosition();
            this.setCurrentAction(this.move);   

            var timer = new Date();
            _travelStartTime = timer.getTime();
        },

        migrate: function() {
            if(!(this.currTileTemperature > (this.idealTemperature - 5) &&
                 this.currTileTemperature < (this.idealTemperature + 5))){

                var possibleTiles = [];

                if (!this.tile.neighbora.isOcean){
                    possibleTiles.push(this.tile.neighbora);
                }
                if (!this.tile.neighborb.isOcean){
                    possibleTiles.push(this.tile.neighborb);
                }
                if (!this.tile.neighborc.isOcean){
                    possibleTiles.push(this.tile.neighborc);
                }

                var bestTile = this.tile;
                for (var i = 0; i < possibleTiles.length; i++){
                    if (Math.abs(this.idealTemperature - bestTile.getTemperature()) > 
                        Math.abs(this.idealTemperature - possibleTiles[i].getTemperature())){
                        bestTile = possibleTiles[i];
                    }
                }

                if (bestTile.equals(this.tile)){
                    this.isBusy = false;
                    this.isSpiteful = false;
                } else {
                   this.setDestination(bestTile); 
                }

            } else {
                this.calculatePopulation();
                this.calculateInfluence();
                this.isBusy = false;
                this.isSpiteful = false;
            }

        },

        ////////////////////////////////////
        //  Tribe prayer action functions //
        ////////////////////////////////////

        prayForTemperature: function (deltaTime) {
            if(this.prayerTimer <= 0){
                console.log("Prayer timer up");
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

                console.log("Prayer fulfilled!");
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
            console.log("TIME TO PRAY");
            this.prayerTimer = time;
            this.setCurrentAction(this.prayForTemperature);
            this.isBusy = true;
            if(this.currTileTemperature > this.idealTemperature){
                this.rainIcon.enabled = true;
            } else {
                this.sunIcon.enabled = true;
            }
        },

        ///////////////////////////
        //  Tribe fear functions //
        ///////////////////////////
       
        startCowering: function () {
            console.log("Tribe is now cowering");
            this.cowerTimer = 5;
            this.setCurrentAction(this.cower);
            this.isBusy = true;
            this.stormIcon.enabled = true;
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
                        this.stormIcon.enabled = false;
                        console.log("THOU HAST BEEN SMITED");
                        break;

                    default:
                        this.increaseFear();
                        this.increaseBelief();
                        this.setCurrentAction(this.previousAction);
                        console.log("Cower done");
                        this.stormIcon.enabled = false;
                        break;
                }

                this.cowerTimer = 0;                    
            }

            this.cowerTimer -= deltaTime;
        },

        //////////////////////////////
        // Tribe feedback functions //
        //////////////////////////////

        startPraise: function() {
            console.log("I love god!");
            this.increaseBelief();
            this.praiseTimer = 6;
            this.setCurrentAction(this.praise);
            this.isBusy = true;
            this.praiseIcon.enabled = true;
            // Play animation here
        },

        praise: function(deltaTime) {
            if(this.praiseTimer <= 0){
                console.log("God is good!");
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
        },

        denounce: function(deltaTime) {
            if(this.denounceTimer <= 0){
                console.log("DENOUNCED GOD");
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

        getIdealTemperature: function() {
            return this.idealTemperature;
        },

        increaseBelief: function() {
            ++this.belief;
        },

        decreaseBelief: function() {
            --this.belief;
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
        },

        foodAndPopTimer: function(dt) {
            _foodPopTimer += dt
            if(_foodPopTimer >= 8){
                _foodPopTimer = 0;
                this.calculateFood();
                this.calculatePopulation();
            }
            //console.log("Timer: " _foodPopTimer);
        },

        calculateFood: function() {
            var tilesForFood = [];
            this.incomingFood = 0;

            // Take the food from the highest foodcount tiles in the sphere of influence
            // depending on how much population you have. (ex. 2 pop = 2 highest tiles food)
            this.influencedTiles.sort(function(a, b){return b.getFood() - a.getFood()});
            for (var i = 0; i < this.population + 1 && i < this.influencedTiles.length; i++){
                this.incomingFood += this.influencedTiles[i].getFood();
            }

            //this.incomingFood = this.tile.getFood();
            console.log(this.population);
            console.log(this.incomingFood);
        },

        calculatePopulation: function() {
            this.stockpile += (this.incomingFood - this.population)/100;
            console.log("Stockpile" + this.stockpile);

            // Increase population when stockpile is at 100% of required food
            // Take any additional food beyond 100 and add it back to the stock
            if(this.stockpile >= 1){
                ++this.population;
                --this.stockpile;
            } else if(this.stockpile <= -1){
                --this.population;
                ++this.stockpile;
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
            this.calculateFood();
        },
		
		
        // Constructs the NPC's list of rules
        createRuleList: function() {
            this.rules.push(new wantToMigrate());
            this.rules.push(new needTemperatureChange());
            this.rules.push(new wantToDenounce());
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