function addTribe () {
    for (var i = 0; i < tribes.length; i++) {
        if (!tribes[i].enabled) {
            tribes[i].enabled = true;

            var app = pc.fw.Application.getApplication('application-canvas').context;
            var tribeInfo = app.root.findByName('Rv1-stable').script.developer;

            tribeInfo.addTribeDiv = true;

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

        this.population = 0;
        this.MAXPOPULATION = 5;
        this.MINPOPULATION = 1;

        this.tribeMessage = " ";
        
        this.increasePopulationTimer = 0;

        this.idealTemperature = Math.floor((Math.random() * 20) + 55);
        this.currTileTemperature;

        this.belief = 0;
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
        this.paganStatue;
        this.hq;
        this.idolAngleChange;

        this.stormEffect;

        this.rules = [];
        this.events = [];

        this.isBusy = false;
        this.isSpiteful = false;
        this.inSun = false;
        this.previousAction;
        this.currentAction;
        this.prayerTimer = 0;
        this.cowerTimer = 0;
        this.denounceTimer = 0;
        this.adaptTimer = 0;
        this.praiseTimer = 0;
        this.noSunTimer = 0;
        this.falseIdolTimer = 0;
        this.sacrificeTimer = 0;
        this.ruleCooldownTimer = 0;
        this.eventTimer = 240;

        this.praySmokeIsPlaying;
        
        this.predatorsInInfluence = []; //tile references that have aggressive animals on it within this tribe's influence area
		this.preyInInfluence = [];
        
        this.strength = 3.0;
        
        this.attackImmunityTime = 5.0;
        this.attackImmunityTimer = this.attackImmunityTime;
        
        this.animalDecisionTime = 1.5;
        this.animalDecisionTimer = this.animalDecisionTime;
    
        // Variables for lerp, in milliseconds

        //this.foodPopTimer = 0;
        this.travelTime = 3000;
        this.travelStartTime;

    };

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {

            this.humanParent = context.root.findByName("Humans" + tribes.indexOf(this.entity));
            this.humans = this.humanParent.getChildren();

			var t1 = new Date();
			
			//var availStartingTiles = getConnectedTilesInArea(ico, initialContinentLocation, 5);
            //this.tile = ico.tiles[availStartingTiles[Math.floor(pc.math.random(0, availStartingTiles.length))]]; //initial tribe location
            
            var randomTiles = [];
            for (var s = ico.tiles.length-1; s >= 0; s--) randomTiles[s] = s;
			shuffleArray(randomTiles);
            
            this.tile = ico.tiles[Math.floor(seed.step(8191, 0, ico.tiles.length-1))];
            for (var i = 0; i < randomTiles.length; i++) {
				var tile = ico.tiles[randomTiles[i]];
                if (tile.isPathable && tile.latitude < 45 && tile.latitude > -45) {
                    this.tile = tile;
                    break;
                }
			}
            
            this.entity.setPosition(this.tile.center);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.tile.hasTribe = true;
            
            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            
            totalBelief += this.belief;
            prevTotalBelief = totalBelief;
            
            this.createRuleList();

            this.calculateInfluence();

            //this.icons = this.entity.getChildren();
            this.rainIcon = this.entity.findByName("PrayClouds");
            this.sunIcon = this.entity.findByName("PraySun");
            this.stormIcon = this.entity.findByName("FearStorm");
            this.praiseIcon = this.entity.findByName("PraiseHands");
            this.stormEffect = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera").script.vignette.effect;
            this.praySmoke = this.entity.findByName("TestFogTribe");

            this.praySmokeIsPlaying = false;

            this.hq = this.entity.findByName("HQ");
            this.hq.enabled = true;
            this.paganStatue = this.entity.findByName("PaganStatue");
            this.paganStatue.setLocalEulerAngles(this.rotation.x - 180, this.rotation.y, this.rotation.z);

            this.paganStatue.enabled = true;
            this.idolAngleChange = 0; // 3 seconds to rotate at 60fps
	
            this.audio = context.root._children[0].script.AudioController;
			
            this.tribeColor = colors[colors.length-1];
            colors.pop(); // pop, but the first element
            
            this.increasePopulation();
            this.increasePopulation();

			var t2 = new Date();
			debug.log(DEBUG.INIT, "tribe initialization: " + (t2-t1)); 
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            //////////////////////////////////////////////////////////////////////////////////////
            // Rules system is run through each from, sorted by weight                          //
            // if the NPC is busy (moving, praying, etc.), currentAction is called instead      //
            // Current Action is a different function depending on which rule has been fired    //
            // Event system overrides normal rule system; every few min. an event happens       //
            //////////////////////////////////////////////////////////////////////////////////////

            if (!isPaused) {
                this.eventTimer -= dt;

                if (!this.isBusy) {                
                    if(this.ruleCooldownTimer < 0){
                        this.runRuleList();
                    } else this.ruleCooldownTimer -= dt;
                } else {
                    this.currentAction(dt);
                }

                // Set temperature of tile
                this.currTileTemperature = this.tile.getTemperature();

                // Set lighting in shader
                this.rotation = this.tile.getRotationAlignedWithNormal();
                this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);

                // Increase no sun timer whenever tribe doesn't have sun
                if(!this.inSun){
                    this.noSunTimer += dt;
                } else {
                    this.noSunTimer = 0;
                }

                this.increasePopulationTimer += dt;

                // use 1 for testing 
                if (this.increasePopulationTimer >= 25 && !this.isBusy) {
                    this.increasePopulation();
                    this.increasePopulationTimer = 0;
                }

                //Check influenced tiles for predators or prey
                this.predatorsInInfluence = [[], [], []];
                this.preyInInfluence = [];
                for (var i = this.influencedTiles.length-1; i >= 0; i--) {
                    var tile = this.influencedTiles[i];
                    if (tile.hasAnimal) {
                        if (tile.animal.stats.aggressiveness > 0) {
                            switch (tile.animal.stats.type) {
                                case "fox":
                                    this.predatorsInInfluence[0].push(tile.animal);
                                    break;
                                    
                                case "pig":
                                    this.predatorsInInfluence[1].push(tile.animal);
                                    break;
                                    
                                case "cow":
                                    this.predatorsInInfluence[2].push(tile.animal);
                                    break;
                            }
                        } else this.preyInInfluence.push(tile.animal);
                    }
                }
                
                this.influencedAnimalAI(dt);
			}
        },
        
        influencedAnimalAI: function(dt) {
            this.animalDecisionTimer -= dt;
            this.attackImmunityTimer -= dt;
            if (this.attackImmunityTimer < -1) this.attackImmunityTimer = -1;
            
            if (this.animalDecisionTimer < 0) {
                this.animalDecisionTimer = this.animalDecisionTime;
                
                for (var i = 0; i < this.predatorsInInfluence.length; i++) {
                    var predators = this.predatorsInInfluence[i];
                    var totalAnimalStrength = 0;
                    
                    for (var j = 0; j < predators.length; j++) {
                        totalAnimalStrength += predators[i].script.Animal.strength;
                    }
                    
                    if (totalAnimalStrength > 0) {
                        if (totalAnimalStrength >= this.strength) {
                            var chanceToAttack = (totalAnimalStrength / this.strength) / 2;
                            
                            if (Math.random() < chanceToAttack) {
                                if (this.attackImmunityTimer < 0) {
                                    for (var j = 0; j < predators.length; j++) {
                                        predators[i].script.Animal.attackTribe(this);
                                    }
                                    
                                    this.attackImmunityTimer = this.attackImmunityTime;
                                }
                            }
                        }
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

                if (bestTile.equals(this.tile)){
                    this.isBusy = false;
                    this.isSpiteful = false;
                } else {
                   this.setDestination(bestTile); 
                }

            } else {
                this.calculateInfluence();
                
                this.isBusy = false;
                this.isSpiteful = false;
            }

        },

        ////////////////////////////////////
        //  Tribe prayer action functions //
        ////////////////////////////////////

        // Display smoke for prayer notification
        prayForSomething: function () {
            //this.praySmoke.enabled = !this.praySmoke.enabled;
            //console.log(this.praySmoke);
            if (!this.praySmokeIsPlaying){
                this.praySmoke.particlesystem.play();
                this.praySmokeIsPlaying = true;
            } else {
                this.praySmoke.particlesystem.stop();
                this.praySmokeIsPlaying = false;
            }
        },

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
                this.decreasePopulation();
                this.isSpiteful = true;

                this.isBusy = false;
                this.sunIcon.enabled = false;
                this.rainIcon.enabled = false;
                this.prayForSomething();
            }

            if ((this.currTileTemperature > (this.idealTemperature - 5) &&
                 this.currTileTemperature < (this.idealTemperature + 5)) &&
                 this.prayerTimer > 0){

                //console.log("Prayer fulfilled!");
                this.tribeMessage = ("Prayer fulfilled!");
                this.prayerTimer = 0;
                
                this.isBusy = false;
                this.sunIcon.enabled = false;
                this.rainIcon.enabled = false;
                this.startPraise();
                this.prayForSomething();
            }

            //console.log(this.currTileTemperature);

            this.prayerTimer -= deltaTime;
        },

        startPrayForTemperature: function () {
            //console.log("TIME TO PRAY");
            this.prayerTimer = 15;
            this.setCurrentAction(this.prayForTemperature);
            this.prayForSomething();
            this.isBusy = true;

            this.audio.sound_TribePray();
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("pray");
            }
        },

        ///////////////////////////
        //  Tribe fear functions //
        ///////////////////////////
       
        startCowering: function () {
            //console.log("Tribe is now cowering");
            this.tribeMessage = ("Tribe is now cowering");
            this.cowerTimer = 6;
            this.setCurrentAction(this.cower);
            this.isBusy = true;
            this.stormIcon.enabled = true;
            //this.stormEffect.enabled = true;            
            while(this.stormEffect.darkness < this.cowerTimer){
                this.stormEffect.darkness += .005;
            }
            this.idolAngleChange = 0;
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("cower");
            }
        },

        cower: function(deltaTime) {
            // Depending on what the tribe was doing before hand, their fear
            // and belief will increase and decrease accordingly.
            if (this.cowerTimer <= 0) {
                switch (this.previousAction) {
                    case this.sacrifice:
                        for (var i = this.humans.length-1; i >= 0; i--) {
                            if (this.humans[i].enabled) this.humans[i].particlesystem.stop();
                        }
                        this.increaseFear();
                        this.decreaseBelief();
                        this.isBusy = false;

                    case this.worshipFalseIdol:
                        this.increaseFear();
                        this.increaseBelief();
                        this.isBusy = false;

                    case this.denounce:
                        this.increaseFear();
                        this.increaseBelief();
                        this.isBusy = false;
                        
                        //console.log("THOU HAST BEEN SMITED");
                        break;

                    case this.cower:
                        this.decreaseBelief();
                        this.isBusy = false;
                        //console.log("Stop scaring me!");
                        this.tribeMessage = ("Stop scaring me!");
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

            // if(this.previousAction === this.worshipFalseIdol){
            //     this.lowerPagan(deltaTime);
            // }

            if (this.idolAngleChange < 180 && this.previousAction == this.worshipFalseIdol){
                this.lowerPagan(this.idolAngleChange++);
            }

        },

        //////////////////////////////
        // Tribe feedback functions //
        //////////////////////////////

        startPraise: function() {
            //console.log("I love god!");
            this.tribeMessage = ("I love god!");
            this.increaseBelief();
            this.praiseTimer = 6;
            this.setCurrentAction(this.praise);
            this.isBusy = true;
            this.praiseIcon.enabled = true;
            this.audio.sound_TribePraise();
            // Play animation here
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("praise");
            }
        },

        praise: function(deltaTime) {
            this.praiseIcon.enabled = true;
            if(this.praiseTimer <= 0){
                //console.log("God is good!");
                this.tribeMessage = ("God is good!");
                this.increaseBelief();
                this.praiseTimer = 0;
                this.praiseIcon.enabled = false;
                this.isBusy = false;
            }
            this.praiseTimer -= deltaTime;
        },

        startDenouncing: function() {
            this.denounceTimer = 15;
            this.setCurrentAction(this.denounce);
            this.isBusy = true;
            this.audio.sound_TribeDenounce();
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("denounce");
            }
        },

        denounce: function(deltaTime) {
            if(this.denounceTimer <= 0){
                //console.log("DENOUNCED GOD");
                this.tribeMessage = ("DENOUNCED GOD");
                this.decreaseBelief();
                this.denounceTimer = 0;
                
                this.isBusy = false;
            }
            
            this.denounceTimer -= deltaTime;
        },


        // Tribe adapts to new temperature when ignored by god
        startAdapting: function() {
            this.adaptTimer = 10;
            this.setCurrentAction(this.adapt);
            this.isBusy = true;
            if(this.currTileTemperature < this.idealTemperature - 5){
                this.idealTemperature -= 5;
            } else if(this.currTileTemperature > this.idealTemperature + 5){
                this.idealTemperature += 5;
            }
            //CHANGE THIS WHEN WE GET SOUND
            this.audio.sound_TribeDenounce();
        },

        adapt: function(deltaTime) {
            if(this.adaptTimer <= 0){
                //console.log("ADAPTED TO TEMP");
                this.tribeMessage = ("ADAPTED TO TEMP");
                this.idealTemperature 
                this.decreaseBelief();
                this.adaptTimer = 0;
                this.isSpiteful = false;
                this.isBusy = false;
            }
            
            this.adaptTimer -= deltaTime;
        },

        /////////////////////////////////
        //  Tribe Events ////////////////
        /////////////////////////////////

        startFalseIdol: function() {
            this.setCurrentAction(this.worshipFalseIdol);
            this.isBusy = true;
            console.log("WE SHALL BEAR FALSE IDOLSZ");
            this.tribeMessage = ("WE SHALL BEAR FALSE IDOLSZ");
            this.idolAngleChange = 180;
        },

        worshipFalseIdol: function(deltaTime) {
            if(this.falseIdolTimer > 8){
                this.decreaseBelief();
                this.falseIdolTimer = 0;
            }

            if (this.idolAngleChange > 0){
                this.raisePagan(this.idolAngleChange--);
            }

            this.falseIdolTimer += deltaTime;
        },

        raisePagan: function(angleChange) {
            this.hq.enabled = false;
            this.paganStatue.setLocalEulerAngles(this.paganStatue.rotation.x + (180 - angleChange), this.rotation.y, this.rotation.z);
        },

        lowerPagan: function(angleChange) {
            this.hq.enabled = true;
            this.paganStatue.setLocalEulerAngles(this.paganStatue.rotation.x + (180 - angleChange), this.rotation.y, this.rotation.z);
        },

        startSacrifice: function() {
            this.sacrificeTimer = 30;
            this.setCurrentAction(this.sacrifice);
            this.isBusy = true;
            console.log("starting sacrifice");
            tribeMessage = ("starting sacrifice");
            // Play praise animation for all humans except the one being sacrificed
            var lastHuman = true;
            for (var i = this.humans.length-1; i >= 0; i--) {
                var human = this.humans[i];
                if (human.enabled) {
                    if (lastHuman) {
                        lastHuman = false;
                        human.particlesystem.play();
                        human.script.Human.setAnimState('cower');
                    } else {
                        human.script.Human.setAnimState('praise');
                    }
                }
            }
        },

        sacrifice: function(deltaTime) {
            if(this.sacrificeTimer <= 0){
                this.increaseBelief();
                this.decreasePopulation();
            }

            this.sacrificeTimer -= deltaTime;
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
            for (var i = 0; i < this.humans.length; i++) {
                this.humans[i].enabled = false
            }

            this.population = population;

            for(var i = 0; i < population; i++){
                this.increasePopulation();
            }

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

            // Every time belief is decreased, check if it is too low
            if (totalBelief < minTotalBelief){
                console.log("Not enough belief. Please End Game.");
                context.root._children[0].script.globalInterface.endGame();
            }  
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
            this.addHuman();
            if (this.population > this.MAXPOPULATION){
                addTribe();
                this.setPopulation(2);
            }
        },

        decreasePopulation: function() {
            this.decrementPopulation();
            // Decrease humans on screen to current population
            if (this.entity.enabled && this.population >= 0) {
                for (var i = this.humans.length-1; i >= 0; i--) {
                    if (this.humans[i].enabled) {
                        this.humans[i].enabled = false;
                        break;
                    }
                }
            }
        },
        
        decrementPopulation: function() {
            --this.population;
            
            if (this.population < this.MINPOPULATION){
                // Kill the tribe
                this.entity.enabled = false;
                context.root._children[0].script.globalInterface.doTribesExist();
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
            // Step through humans' pool and activate a new one 
            for (var i = 0; i < this.humans.length; i++) {
                var human = this.humans[i];
                if (!human.enabled) {
                    human.enabled = true;
                    human.script.Human.tribeParent = this;
                    human.script.Human.start();
                    human.script.Human.chooseState();
                    break;
                }            
            }

            // Old animation code, keeping around til we figure this shit out
            //newHuman.script.Human.setAnimState("idle");
        },

        // Constructs the NPC's list of rules
        createRuleList: function() {
            this.rules.push(new wantToMigrate());
            this.rules.push(new needTemperatureChange());
            this.rules.push(new wantToDenounceInactive());
            this.rules.push(new wantToDenounceNoSun());
            this.rules.push(new needToAdapt());
            this.rules.push(new wantToWorshipFalseIdol());
            this.rules.push(new wantToSacrifice());
        },

        runRuleList: function() { 
            this.rules.sort(function(a, b){return b.weight - a.weight});
            for (var i = 0; i < this.rules.length; i++) {
                if (this.rules[i].testConditions(this)) {
                    this.rules[i].consequence(this);
                    break;
                }
            }            
        }
    };

    return Tribe;
});