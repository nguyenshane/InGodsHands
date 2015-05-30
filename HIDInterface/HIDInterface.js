///
// Description: This is the control input for all strings
// Modify move_* functions or use .on("move") events to listen to the strings' movement
///

pc.script.create('HIDInterface', function (context) {
    // Creates a new TestString instance
    var HIDInterface = function (entity) {
        this.entity = entity;
		pc.events.attach(this);
		
		this.direction, this.distance, this.speed = 0;
    };

    var timer = new Date();
	var temperatureChange;
	var temperatureDest;
	var temperatureStart;
	var lerpStartTime;
	var velocity;
	var storm;
	var camera;

    var UI;
    var app; 
    var hasStopped;

    HIDInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
			var t1 = new Date();

            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');
			this.middleT = false;
			this.middleA = false;
			this.middleP = false;
			this.middleE = false;
			this.middleW = false;
			
			//tribe = context.root.findByName("BaseTribe").script.tribe;
			//storm = context.root.findByName("Storm");
			camera = context.root.findByName("Camera");
			this.stormEffect = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera").script.vignette.effect;
			this.stormTriggerBox = context.root.findByName("Camera").findByName("Sun").findByName("Light").script.trigger;
            
            temperatureEffectTimer = 1.0;
            
            ///*
			temperatureChange = false;
			temperatureDest = 0.0;
			velocity = 0.0;
            ///*/

			app = pc.fw.Application.getApplication('application-canvas').context;
			UI = context.root._children[0].script.developer;

			this.stringT.on("moved", this.moved_T, this.direction, this.distance, this.speed);
			this.stringA.on("moved", this.moved_A, this.direction, this.distance, this.speed);
			this.stringP.on("moved", this.moved_P, this.direction, this.distance, this.speed);
			this.stringE.on("moved", this.moved_E, this.direction, this.distance, this.speed);
			this.stringW.on("moved", this.moved_W, this.direction, this.distance, this.speed);

			this.stringT.on("moving", this.moving_T, this.direction, this.distance, this.speed);
			this.stringA.on("moving", this.moving_A, this.direction, this.distance, this.speed);
			this.stringP.on("moving", this.moving_P, this.direction, this.distance, this.speed);
			this.stringE.on("moving", this.moving_E, this.direction, this.distance, this.speed);
			this.stringW.on("moving", this.moving_W, this.direction, this.distance, this.speed);

			this.middleT = this.stringT.isMiddle;
        	this.middleA = this.stringA.isMiddle;
        	this.middleP = this.stringP.isMiddle;
        	this.middleE = this.stringE.isMiddle;
        	this.middleW = this.stringW.isMiddle;

        	this.coldEffect = context.root.findByName("ColdEffectPS");
        	this.coldEffect.particlesystem.stop();
        	this.heatEffectL = context.root.findByName("HeatEffectPSL");
        	this.heatEffectL.particlesystem.stop();      
        	this.heatEffectR = context.root.findByName("HeatEffectPSR");
        	this.heatEffectR.particlesystem.stop();   

            coldEffect = this.coldEffect;
            heatEffectL = this.heatEffectL;
            heatEffectR = this.heatEffectR;
            
            stormEffect = this.stormEffect;
            stormTriggerBox = this.stormTriggerBox;

			var t2 = new Date();
			debug.log(DEBUG.INIT, "HIDInterface initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	var app = pc.fw.Application.getApplication('application-canvas').context;

        	if (app.timeScale == 0) {
        		hasStopped = true;
        	} else {
        		hasStopped = false;
        	}
            
            /*
        	if (temperatureChange == true  && !hasStopped) {
        		timer = new Date();
        		var timeSinceStartedLerp = timer.getTime() - lerpStartTime;
        		var percentLerped = timeSinceStartedLerp / velocity;
        		globalTemperature = pc.math.lerp(temperatureStart, temperatureDest, percentLerped);

				if ((globalTemperature - temperatureDest) == 0.0) {
					temperatureChange = false;
					debug.log(DEBUG.HARDWARE, "Done temp change");
				}
        	}
            
        	if ((globalTemperature - temperatureDest <= 0.0) && this.coldEffect.particlesystem.isPlaying) {
        		this.coldEffect.particlesystem.stop();
        		this.coldEffect.particlesystem.isPlaying = false;
        	}

        	if ((globalTemperature - temperatureDest >= 0.0) && this.heatEffectL.particlesystem.isPlaying) {
        		this.heatEffectL.particlesystem.stop();
        		this.heatEffectL.particlesystem.isPlaying = false;
        		this.heatEffectR.particlesystem.stop();
        		this.heatEffectR.particlesystem.isPlaying = false;
        	}
            */
            
            ///*
            temperatureEffectTimer -= dt;
            if (temperatureEffectTimer < 0 && this.coldEffect.particlesystem.isPlaying) {
                this.coldEffect.particlesystem.stop();
        		this.coldEffect.particlesystem.isPlaying = false;
            }
            
            if (temperatureEffectTimer < 0 && this.heatEffectL.particlesystem.isPlaying) {
                this.heatEffectL.particlesystem.stop();
        		this.heatEffectL.particlesystem.isPlaying = false;
        		this.heatEffectR.particlesystem.stop();
        		this.heatEffectR.particlesystem.isPlaying = false;
            }
            ///*/
        },

    //---------------------------------------------------------------------------------------------

		moved_T: function(position, distance, speed) {
			//console.log("String T moved: ", position, distance, speed);
			
			//NaN
			if (isNaN(speed)) speed = 1;
            
            var newStringTvalue = parseInt(UI.StringsliderT.value) + (distance);

			if (!UI.StringsliderT.mouseIsOver) {
                UI.StringsliderT.value = newStringTvalue;
            }
            
            inactiveTimer = 0;
            
            ///*
            temperatureChange = true;
			temperatureStart = globalTemperature;
			temperatureDest = globalTemperature + (distance * 2.0);
            
			velocity = Math.abs((speed) * 50);
			timer = new Date();
			lerpStartTime = timer.getTime();

			debug.log(DEBUG.HARDWARE, "Global Temp: " + globalTemperature);
			
			if (position < 0) {
				coldEffect.particlesystem.play();
				coldEffect.particlesystem.isPlaying = true;
			} else if (position > 0) {
				heatEffectL.particlesystem.play();
				heatEffectL.particlesystem.isPlaying = true;
				heatEffectR.particlesystem.play();
				heatEffectR.particlesystem.isPlaying = true;
			}
            ///*/
		},
		
		moved_A: function(position, distance, speed) {
			//console.log("String A moved: ", position, distance, speed);
			
			//NaN
			if (speed != speed) speed = 1;
            
            var newStringAvalue = parseInt(UI.StringsliderA.value) + distance;
            
			if (!UI.StringsliderA.mouseIsOver) {
                UI.StringsliderA.value = newStringAvalue;
            }
            
			inactiveTimer = 0;
            
            ///*
            animalMigrationOffset += distance * 1.5;
            
            var animals = scripts.Animals.animal_stack;
            for (var i = 0; i < animals.length; i++) {
                animals[i].migrationFlag = true;
            }
            ///*/
		},
		
		moved_P: function(position, distance, speed) {
			//console.log("String P moved: ", position, distance, speed);
			
			//NaN
			if (speed != speed) speed = 1;

			var newStringPvalue = parseInt(UI.StringsliderP.value) + distance;
			
			if (!UI.StringsliderP.mouseIsOver) {
                UI.StringsliderP.value = newStringPvalue;
            }
            
			inactiveTimer = 0;
            
            ///*
			// Convert distance relative to 0-100
			// Get increment and distance based on speed
			ico.faultNumMove = Math.abs((distance * position));
			ico.faultIncrement = Math.abs(ico.faultIncrement) * position;
            ///*/
		},
		
		moved_E: function(position, distance, speed) {
			//console.log("String E moved: ", position, distance, speed);
			
			//NaN
			if (speed != speed) speed = 1;
            
            var newStringEvalue = parseInt(UI.StringsliderE.value) + distance;
			
			if (!UI.StringsliderE.mouseIsOver) {
                UI.StringsliderE.value = newStringEvalue;
            }
			
			inactiveTimer = 0;

			scripts.Atmosphere.makeStorm((distance * position), speed);
			
			if (stormTriggerBox != undefined) stormTriggerBox.scareTribes();

			while (stormEffect.darkness < 6) {
                stormEffect.darkness += .005;
            }
		},
		
		moved_W: function(position, distance, speed) {
			//console.log("String W moved: ", position, distance, speed);
			
			//NaN
			if (speed != speed) speed = 1;

			var newStringWvalue = parseInt(UI.StringsliderW.value) + distance;
			
			if (!UI.StringsliderW.mouseIsOver) {
                UI.StringsliderW.value = newStringWvalue;
            }
            
			inactiveTimer = 0;
		},

    //---------------------------------------------------------------------------------------------

		moving_T: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String T moving: ", position, distance, speed);
            
            //NaN
			if (speed != speed) speed = 1;
            
            var newStringTvalue = parseInt(UI.StringsliderT.value) + distance;
            
			if (!UI.StringsliderT.mouseIsOver){
                UI.StringsliderT.value = newStringTvalue;
            }
			
			inactiveTimer = 0;
            
            globalTemperature += (distance * 2.0);
            
			if (position < 0) {
				coldEffect.particlesystem.play();
				coldEffect.particlesystem.isPlaying = true;
			} else if (position > 0) {
				heatEffectL.particlesystem.play();
				heatEffectL.particlesystem.isPlaying = true;
				heatEffectR.particlesystem.play();
				heatEffectR.particlesystem.isPlaying = true;
			}
            
            temperatureEffectTimer = 1.0;
		},
		
		moving_A: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String A moving: ", position, distance, speed);
            
            //NaN
			if (speed != speed) speed = 1;
            
            var newStringAvalue = parseInt(UI.StringsliderA.value) + distance;
            
			if (!UI.StringsliderA.mouseIsOver){
                UI.StringsliderA.value = newStringAvalue;
            }
            
			inactiveTimer = 0;
            
            animalMigrationOffset += distance * 1.5;
            
            var animals = scripts.Animals.animal_stack;
            for (var i = 0; i < animals.length; i++) {
                animals[i].migrationFlag = true;
            }
		},
		
		moving_P: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String P moving: ", position, distance, speed);
            
            //NaN
			if (speed != speed) speed = 1;

			var newStringPvalue = parseInt(UI.StringsliderP.value) + distance;
			
			if (!UI.StringsliderP.mouseIsOver) {
                UI.StringsliderP.value = newStringPvalue;
            }
            
			inactiveTimer = 0;
            
			// Convert distance relative to 0-100
			// Get increment and distance based on speed
			ico.faultNumMove = Math.abs((distance * position));
			ico.faultIncrement = Math.abs(ico.faultIncrement) * position;
		},
		
		moving_E: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String E moving: ", position, distance, speed);
            
            //NaN
			if (speed != speed) speed = 1;
            
            var newStringEvalue = parseInt(UI.StringsliderE.value) + distance;
			
			if (!UI.StringsliderE.mouseIsOver) {
                UI.StringsliderE.value = newStringEvalue;
            }
            
			inactiveTimer = 0;
		},
		
		moving_W: function(position, distance, speed) {
            debug.log(DEBUG.HARDWARE, "String W moving: ", position, distance, speed);
            
            //NaN
			if (speed != speed) speed = 1;

			var newStringWvalue = parseInt(UI.StringsliderW.value) + distance;
			
			if (!UI.StringsliderW.mouseIsOver) {
                UI.StringsliderW.value = newStringWvalue;
            }
            
			inactiveTimer = 0;
            
			if (!hasStopped) {
                camera.script.Camera.move_W(position,(distance * position), speed);
			}
		},

    };

    return HIDInterface;
});