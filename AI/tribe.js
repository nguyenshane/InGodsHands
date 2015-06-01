function addTribe() {
    for (var i = 0; i < tribes.length; i++) {
        if (!tribes[i].enabled && !tribes[i].script.tribe.died) {
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
        
        this.origin = new pc.Vec3(0,0,0);

        this.humanParent;
        this.humans = [];

        this.population = 0;
        this.MAXPOPULATION = 5;
        this.MINPOPULATION = 1;

        this.died = false;

        this.tribeMessage = " ";
        
        this.increasePopulationTimer = 0;

        this.idealTemperature = Math.floor((Math.random() * 20) + 90);
        this.currTileTemperature;

        this.belief = 4;
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
        this.animalIcon;
        this.paganStatue;
        this.hq;
        this.idolAngleChange;

        this.stormEffect;

        this.rules = [];
        this.events = [];

        this.isBusy = false;
        this.isSpiteful = false;
        this.inSun = false;
        this.previousAction = this.idle;
        this.currentAction = this.idle;
        this.prayerTimer = 0;
        this.cowerTimer = 0;
        this.denounceTimer = 0;
        this.adaptTimer = 0;
        this.praiseTimer = 0;
        this.noSunTimer = 0;
        this.falseIdolTimer = 0;
        this.sacrificeTimer = 0;
        this.ruleCooldownTimer = 10;
        this.eventTimer = 240;

        this.iconSmokeIsPlaying;
        this.beliefLight;
        
        this.predatorsInInfluence = []; //tile references that have aggressive animals on it within this tribe's influence area
		this.preyInInfluence = [];
        
        this.strength = 3.0;
        
        this.attackImmunityTime = 5.0;
        this.attackImmunityTimer = this.attackImmunityTime;
        
        this.animalDecisionTime = 1.5;
        this.animalDecisionTimer = this.animalDecisionTime;
    
        // Variables for lerp, in milliseconds

        //this.foodPopTimer = 0;
        this.travelTime = 6000;
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
                if (tile.isPathable && Math.abs(tile.latitude) < 45) {
                    var tribeTooClose = false;
                    
                    for (var j = 0; j < tribes.length; j++) {
                        if (tribes[j].enabled && distSq(tribes[j].position, tile.center) < 0.8*0.8) {
                            tribeTooClose = true;
                            break;
                        }
                    }
                    
                    if (!tribeTooClose) {
                        this.tile = tile;
                        break;
                    }
                }
			}
            
            this.entity.setPosition(this.tile.center);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.tile.hasTribe = true;
            this.tile.tribe = this.entity;
            
            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            
            totalBelief += this.belief;
            prevTotalBelief = totalBelief;
            
            this.createRuleList();

            this.calculateInfluence();

            // Get the textures for each feedback state
            this.rainIcon = this.entity.findByName("PrayClouds").model.model.meshInstances[0].material.opacityMap;
            this.sunIcon = this.entity.findByName("PraySun").model.model.meshInstances[0].material.opacityMap;
            this.stormIcon = this.entity.findByName("FearStorm").model.model.meshInstances[0].material.opacityMap;
            this.praiseIcon = this.entity.findByName("PraiseHands").model.model.meshInstances[0].material.opacityMap;
            this.animalIcon = this.entity.findByName("PrayAnimal").model.model.meshInstances[0].material.opacityMap;
            this.denounceIcon = this.entity.findByName("DenounceGod").model.model.meshInstances[0].material.opacityMap;


            this.iconSmoke = this.entity.findByName("TestFogTribe");
            this.iconSmoke.particlesystem.stop();
            this.iconSmokeIsPlaying = false;
            this.origIconColor = this.entity.findByName("TestFogTribe").particlesystem.colorGraph;
            this.praySmoke = this.entity.findByName("PraySmoke");
            this.praySmoke.particlesystem.stop();
            this.praySmokeIsPlaying = false;

            //this.iconSmoke.particlesystem.colorMap = this.praiseIcon;

            this.beliefLight.enabled = true;
            this.beliefLight.script.LightController.startShineBeliefLight();

            this.hq = this.entity.findByName("HQ");
            this.hq.enabled = true;
            this.hqBaseColor = this.hq.model.model.meshInstances[0].material.diffuse;
            this.hqGrayColor = this.hq.model.model.meshInstances[0].material.emissive;
            this.hqBrightnessInterval = 1.8;
            //console.log(this.hqBaseColor);
            this.paganStatue = context.root.findByName("PaganParent").findByName("PaganStatue" + tribes.indexOf(this.entity));
            this.paganStatue.setPosition(this.origin);

            this.paganStatue.enabled = true;
            this.idolAngleChange = 0; // 3 seconds to rotate at 60fps
	
            this.audio = context.root._children[0].script.AudioController;
			
            this.tribeColor = colors[colors.length-1];
            colors.pop(); // pop, but the first element
            
            this.setPopulation(3);

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

                // rotating statues properly
                this.rotation = this.tile.getRotationAlignedWithSphere();
                this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
                this.paganStatue.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
               
                // Increase no sun timer whenever tribe doesn't have sun
                if(!this.inSun){
                    this.noSunTimer += dt;
                } else {
                    this.noSunTimer = 0;
                }

                this.increasePopulationTimer += dt;

                // use 1 for testing 
                if (this.increasePopulationTimer >= 60 && !this.isBusy) {
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
                this.tile.tribe = this.entity;
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
		
		idle: function() {},

        ////////////////////////////////////
        //  Tribe prayer action functions //
        ////////////////////////////////////

        activatePraySmoke: function (icon) {
            this.iconSmoke.particlesystem.colorMap = icon;

            if (icon == this.denounceIcon) {
                this.iconSmoke.particlesystem.colorGraph = context.root.findByName("RedColorGraph").particlesystem.colorGraph;
                this.iconSmoke.particlesystem.intensity = 3;
            } else {
                this.iconSmoke.particlesystem.colorGraph = this.origIconColor;
                this.iconSmoke.particlesystem.intensity = 20;
            }

            this.iconSmoke.particlesystem.play();
            this.iconSmokeIsPlaying = true;
            this.praySmoke.particlesystem.play();
            this.praySmokeIsPlaying = true;    
        },

        deactivatePraySmoke: function () {
            this.iconSmoke.particlesystem.stop();
            this.iconSmokeIsPlaying = false;
            this.praySmoke.particlesystem.stop();
            this.praySmokeIsPlaying = false; 
            this.iconSmoke.particlesystem.colorMap = null;
        },

        // Display smoke for prayer notification
        prayForSomething: function () {
            //this.iconSmoke.enabled = !this.iconSmoke.enabled;
            //console.log(this.iconSmoke);
            if (!this.iconSmokeIsPlaying){
                this.iconSmoke.particlesystem.play();
                this.iconSmokeIsPlaying = true;
                this.praySmoke.particlesystem.play();
                this.praySmokeIsPlaying = true;
            } else {
                this.iconSmoke.particlesystem.stop();
                this.iconSmokeIsPlaying = false;
                this.praySmoke.particlesystem.stop();
                this.praySmokeIsPlaying = false;
            }
        },
		
		startPrayForTemperature: function () {
			this.tribeMessage = ("Praying for temperature change: " + Math.floor(this.currTileTemperature) + " " + this.idealTemperature);
            this.prayerTimer = 40;
            this.setCurrentAction(this.prayForTemperature);
            //this.prayForSomething();
            this.isBusy = true;

            if(this.currTileTemperature > this.idealTemperature){
                // this.iconSmoke.particlesystem.colorMap = this.rainIcon;
                this.activatePraySmoke(this.rainIcon);
            } else {
                // this.iconSmoke.particlesystem.colorMap = this.sunIcon;
                this.activatePraySmoke(this.sunIcon);
            }

            this.audio.sound_TribePray();
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("pray");
            }
        },

        prayForTemperature: function (deltaTime) {
            if(this.prayerTimer <= 0){
                //console.log("Prayer timer up");
                this.prayerTimer = 0;
                this.decreaseBelief();
                this.decreasePopulation();
                this.isSpiteful = true;

                this.isBusy = false;
                //this.prayForSomething();
                this.deactivatePraySmoke();
                this.startDenouncing();
            }

            if ((this.currTileTemperature > (this.idealTemperature - 8) &&
                 this.currTileTemperature < (this.idealTemperature + 8)) &&
                 this.prayerTimer > 0){

                //console.log("Prayer fulfilled!");
                this.tribeMessage = ("Temperature prayer fulfilled!");
                this.prayerTimer = 0;
                
                this.isBusy = false;

                this.startPraise();
                //this.prayForSomething();
                this.deactivatePraySmoke();
            }

            //console.log(this.currTileTemperature);

            this.prayerTimer -= deltaTime;
        },
		
        startPrayForAnimals: function () {
            // console.log("TIME TO PRAY FOR ANIMALS");
			this.tribeMessage = ("Praying for animals");
            this.prayerTimer = 35;
            this.setCurrentAction(this.prayForAnimals);

            // this.iconSmoke.particlesystem.colorMap = this.animalIcon;
            // this.prayForSomething();
            this.activatePraySmoke(this.animalIcon);
            this.isBusy = true;

            this.audio.sound_TribePray();
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("pray");
            }
        },

        prayForAnimals: function (deltaTime) {
            // Put symbol here when we have art for it
            ///////////////////////////////////////

            if(this.prayerTimer <= 0){
                // console.log("Animal Prayer timer up");
				this.tribeMessage = ("Animal Prayer failed!");
                this.prayerTimer = 0;
                this.decreaseBelief();
                this.decreasePopulation();
                this.isSpiteful = true;

                this.isBusy = false;
                // Turn off symbols here
                /////////////////////////
                this.deactivatePraySmoke();
                this.startDenouncing();
                //this.prayForSomething();
            }

            if (this.prayerTimer > 0){
                for (var i = 0; i < this.influencedTiles.length; i++) {
                    if (this.influencedTiles[i].hasAnimal){
                        //console.log("Prayer fulfilled!");
                        this.tribeMessage = ("Animal Prayer fulfilled!");
                        this.prayerTimer = 0;
                        
                        this.isBusy = false;
                        this.startPraise();
                        this.deactivatePraySmoke();
                    }
                }
            }
            
            this.prayerTimer -= deltaTime;
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
            //this.iconSmoke.particlesystem.colorMap = this.stormIcon;
            this.activatePraySmoke(this.stormIcon);

            this.idolAngleChange = 0;
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled){ 
                    this.humans[i].particlesystem.stop();
                    this.humans[i].script.Human.setAnimState("cower");
                }
            }

            var timer = new Date();
            this.travelStartTime = timer.getTime();
        },

        cower: function(deltaTime) {
            // Depending on what the tribe was doing before hand, their fear
            // and belief will increase and decrease accordingly.
            if (this.cowerTimer <= 0) {
				this.tribeMessage = ("Done cowering");
				
                switch (this.previousAction) {
                    case this.sacrifice:
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
                        this.isBusy = false;
                        //console.log("Cower done");
                        break;
                }
                //this.prayForSomething();
                this.deactivatePraySmoke();
                this.cowerTimer = 0;                    
            }

            this.cowerTimer -= deltaTime;

            if (this.previousAction == this.worshipFalseIdol){
                this.lowerPagan();
            }

        },

        //////////////////////////////
        // Tribe feedback functions //
        //////////////////////////////

        startPraise: function() {
            //console.log("I love god!");
            this.tribeMessage = ("I love god!");
            this.increaseBelief();
            this.praiseTimer = 5;
            this.setCurrentAction(this.praise);
            this.isBusy = true;
            // this.iconSmoke.particlesystem.colorMap = this.praiseIcon;
            // this.prayForSomething();
            this.activatePraySmoke(this.praiseIcon);
            this.audio.sound_TribePraise();
            // Play action animation for all humans
            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("praise");
            }
        },

        praise: function(deltaTime) {
            if(this.praiseTimer <= 0){
                //console.log("God is good!");
                this.tribeMessage = ("God is good!");
                this.praiseTimer = 0;
                // this.prayForSomething();
                this.deactivatePraySmoke();
                this.isBusy = false;
            }
            this.praiseTimer -= deltaTime;
        },

        startDenouncing: function() {
            this.denounceTimer = 10;
            this.setCurrentAction(this.denounce);
            this.isBusy = true;
            this.audio.sound_TribeDenounce();
            this.beliefLight.script.LightController.startDenounceLight();
            this.activatePraySmoke(this.denounceIcon);
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
                this.deactivatePraySmoke();
                this.isBusy = false;
            }
            
            this.denounceTimer -= deltaTime;
        },


        // Tribe adapts to new temperature when ignored by god
        startAdapting: function() {
			this.tribeMessage = ("Adapting to temperature");
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

            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("denounce");
            }
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

            this.startPosition = this.paganStatue.getPosition().clone();
            this.audio.sound_TribeWorshipFalseIdol();

            var timer = new Date();
            this.travelStartTime = timer.getTime();

            for (var i = 0; i < this.humans.length; i++) {
                if (this.humans[i].enabled) this.humans[i].script.Human.setAnimState("denounce");
            }
        },

        worshipFalseIdol: function(deltaTime) {
            if (this.falseIdolTimer > 8) {
                this.decreaseBelief();
                this.falseIdolTimer = 0;
            }

            this.raisePagan(this.idolAngleChange--);

            this.falseIdolTimer += deltaTime;
        },

        raisePagan: function(angleChange) {
            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            var deltaVec = new pc.Vec3;

            deltaVec.lerp(this.startPosition, this.tile.center, percentTravelled);
            if(percentTravelled <= 1){
                this.paganStatue.setPosition(deltaVec);
            }
            deltaVec.lerp(this.tile.center, this.origin, percentTravelled);
            if(percentTravelled <= 1){
                this.entity.setPosition(deltaVec);
            }  
        },

        lowerPagan: function(angleChange) {            
            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            var deltaVec = new pc.Vec3;

            deltaVec.lerp(this.tile.center, this.origin, percentTravelled);
            if(percentTravelled <= 1){
                this.paganStatue.setPosition(deltaVec);
            }
            deltaVec.lerp(this.origin, this.tile.center, percentTravelled);
            if(percentTravelled <= 1){
                this.entity.setPosition(deltaVec);
            }        
        },

        startSacrifice: function() {
            this.sacrificeTimer = 30;
            this.setCurrentAction(this.sacrifice);
            this.isBusy = true;
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
            if (this.sacrificeTimer <= 0) {
                this.increaseBelief();
                this.decreasePopulation();
                this.isBusy = false;
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

        getIdealTemperature: function() {
            return this.idealTemperature;
        },

        increaseBelief: function() {
            ++this.belief;
            prevTotalBelief = totalBelief;
            ++totalBelief;
            this.beliefLight.script.LightController.startShineBeliefLight();
            this.increaseHQBrightness();
        },

        decreaseBelief: function() {
            --this.belief;
            prevTotalBelief = totalBelief;
            --totalBelief;
            this.decreaseHQBrightness();

            // Every time belief is decreased, check if it is too low
            if (this.belief <= 0){
				console.log(this.belief + " " + totalBelief)
                console.log("Not enough belief. Tribe has died.");
                
                this.killSelf();
            }  
        },

        increaseHQBrightness: function() {
            var prevIntensity = this.hq.model.model.meshInstances[0].material.emissiveIntensity;
            this.hq.model.model.meshInstances[0].material.emissive = this.hqBaseColor;
            
            if (!(this.hq.model.model.meshInstances[0].material.emissive == this.hqBaseColor)){
                this.hq.model.model.meshInstances[0].material.emissive = this.hqBaseColor;
            } else if (prevIntensity < 9){
                this.hq.model.model.meshInstances[0].material.emissiveIntensity += this.hqBrightnessInterval;
            }

            this.hq.model.model.meshInstances[0].material.update();
        },

        decreaseHQBrightness: function() {
            var prevIntensity = this.hq.model.model.meshInstances[0].material.emissiveIntensity;

            if (prevIntensity <= this.hqBrightnessInterval && prevIntensity > 0){
                this.hq.model.model.meshInstances[0].material.emissiveIntensity = 0;
            } else if (prevIntensity > this.hqBrightnessInterval){
                this.hq.model.model.meshInstances[0].material.emissiveIntensity -= this.hqBrightnessInterval;
            } else if (this.hq.model.model.meshInstances[0].material.emissive == this.hqBaseColor){
                this.hq.model.model.meshInstances[0].material.emissive = this.hqGrayColor;
            }

            this.hq.model.model.meshInstances[0].material.update();
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

        increasePopulation: function() {
            ++this.population;
            this.addHuman();
            if (this.population > this.MAXPOPULATION) {
                addTribe();
                this.setPopulation(2);
            }
			
			this.calculateInfluence();
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
            
			this.calculateInfluence();
			
            if (this.population < this.MINPOPULATION){
                this.killSelf();
            }
        },
        
        setPopulation: function(population) {
            for (var i = 0; i < this.humans.length; i++) {
                this.humans[i].enabled = false
            }

            this.population = 0;

            for (var i = 0; i < population; i++) {
                this.increasePopulation();
            }
        },
        
        killSelf: function() {
            // Kill the tribe
            for (var i = this.humans.length-1; i >= 0; i--) {
                this.humans[i].enabled = false;
            }
            
            this.died = true;

            this.paganStatue.enabled = false;
            this.entity.enabled = false;
            
            context.root._children[0].script.globalInterface.doTribesExist();
        },

        calculateInfluence: function() {
            /*
            var influenceRate;
            if (this.population <= 3){
                influenceRate = 12;
            } else {
                influenceRate = 19;
            }
            */
            var influenceDistance = 0.8*0.8;
            if (this.population <= 3) influenceDistance = 0.8*0.8;
            
            // Sick tile influence calculation algorithm
            // basically a BFS
            this.influencedTiles = [];            
            this.influencedTiles.push(this.tile);
            var currTile;
            //var counter = influenceRate;
            var queue = [this.tile.neighbora, this.tile.neighborb, this.tile.neighborc];

            while (/*counter > 0*/queue.length > 0) {
                currTile = queue.shift();
                
                if (distSq(currTile.center, this.tile.center) < influenceDistance &&
                    this.influencedTiles.indexOf(currTile) === -1) {
                        
                    queue.push(currTile.neighbora, currTile.neighborb, currTile.neighborc);
                    this.influencedTiles.push(currTile);
                    //counter--;
                    
                    /*
                    //temp - shows influenced tiles
                    var normal = currTile.normal.clone();
                    multScalar(normal, -1);
                    var ind = currTile.index*3*3;
                    ico.normals[ind] = normal.x;
                    ico.normals[ind+1] = normal.y;
                    ico.normals[ind+2] = normal.z;
                    ind += 3;
                    ico.normals[ind] = normal.x;
                    ico.normals[ind+1] = normal.y;
                    ico.normals[ind+2] = normal.z;
                    ind += 3;
                    ico.normals[ind] = normal.x;
                    ico.normals[ind+1] = normal.y;
                    ico.normals[ind+2] = normal.z;
                    */
                }
            }
            
            //temp - shows influenced tiles
            //ico.updateReturnMesh();
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
            this.rules.push(new needAnimals());
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