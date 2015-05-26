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
	//var tribe;
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
			this.stormTriggerBox = context.root.findByName("Camera").findByName("Sun").findByName("Light").script.trigger;

			//console.log("The box: " + this.stormTriggerBox.tribesInTrigger.length);

			temperatureChange = false;
			temperatureDest = 0.0;
			velocity = 0.0;

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

			var t2 = new Date();
			debug.log(DEBUG.INIT, "HIDInterface initialization: " + (t2-t1));

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	var app = pc.fw.Application.getApplication('application-canvas').context;

        	if(app.timeScale == 0){
        		hasStopped = true;
        	}
        	else{
        		hasStopped = false
        	}

        	//console.log("isPaused value: " + UI.isPaused);

        	if(temperatureChange == true  && !hasStopped){
        		timer = new Date();
        		var timeSinceStartedLerp = timer.getTime() - lerpStartTime;
        		var percentLerped = timeSinceStartedLerp / velocity;
        		globalTemperature = pc.math.lerp( temperatureStart, temperatureDest, percentLerped );

				//console.log("time since started lerp: " + timeSinceStartedLerp + " velocity: " + velocity);
				//console.log("Temp subtract: " + (globalTemperature - temperatureDest));

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

        	// update middle status
        	// this.middleT = this.stringT.isMiddle;
        	// this.middleA = this.stringA.isMiddle;
        	// this.middleP = this.stringP.isMiddle;
        	// this.middleE = this.stringE.isMiddle;
        	// this.middleW = this.stringW.isMiddle;

        	//console.log("middle status" + this.middleT+this.middleA+this.middleP+this.middleE+this.middleW);
        },
		
		moved_T: function(position, distance, speed) {
			//console.log("String T moved: ", position, distance, speed);
			
			temperatureChange = true;
			temperatureStart = globalTemperature;
			temperatureDest = globalTemperature + (distance);

			//NaN
			if(isNaN(speed)) speed = 1;

			//console.log("distance = " + distance + " speed = " + speed);


			velocity = Math.abs((speed) * 50);
			timer = new Date();
			lerpStartTime = timer.getTime();

			var newStringTvalue = parseInt(UI.StringsliderT.value) + (distance);

			if (!UI.StringsliderT.mouseIsOver){
                UI.StringsliderT.value = newStringTvalue;
            }
			
			debug.log(DEBUG.HARDWARE, "Global Temp: " + globalTemperature);
			
			inactiveTimer = 0;
			if (position < 0){
				this.coldEffect.particlesystem.play();
				this.coldEffect.particlesystem.isPlaying = true;
			} else if (position > 0) {
				this.heatEffectL.particlesystem.play();
				this.heatEffectL.particlesystem.isPlaying = true;
				this.heatEffectR.particlesystem.play();
				this.heatEffectR.particlesystem.isPlaying = true;
			}

		},
		
		moved_A: function(position, distance, speed) {
			//console.log("String A moved: ", position, distance, speed);
			
			//NaN
			if(speed != speed) speed = 1;

			/*
            animalDensity += ((distance * position) * 0.0004);
			animalDensity = pc.math.clamp(animalDensity, 0.005, 0.1);
			*/
            
            animalMigrationOffset += distance * 1.5;
            
            var animals = scripts.Animals.animal_stack;
            for (var i = 0; i < animals.length; i++) {
                animals[i].migrationFlag = true;
            }
            
			var newStringAvalue = parseInt(UI.StringsliderA.value) + distance;
            
			if (!UI.StringsliderA.mouseIsOver){
                UI.StringsliderA.value = newStringAvalue;
            }
			
			inactiveTimer = 0;
		},
		
		moved_P: function(position, distance, speed) {
			//console.log("String P moved: ", position, distance, speed);
			
			//tribes[0].addTribe();
			// for (var i = 0; i < tribes.length; i++) {
			// 	if (!tribes[i].enabled) {
			// 		tribes[i].enabled = true;
			// 		break;
			// 	}
			// }

			//NaN
			if(speed != speed) speed = 1;

			var newStringPvalue = parseInt(UI.StringsliderP.value) + distance;
			
			if (!UI.StringsliderP.mouseIsOver){
                UI.StringsliderP.value = newStringPvalue;
            }

			// Convert distance relative to 0-100
			// Get increment and distance based on speed
			ico.faultNumMove = Math.abs((distance * position));
			ico.faultIncrement = Math.abs(ico.faultIncrement) * position;

			inactiveTimer = 0;
		},
		
		moved_E: function(position, distance, speed) {
			//console.log("String E moved: ", position, distance, speed);
			
			//NaN
			if(speed != speed) speed = 1;

			scripts.Atmosphere.makeStorm((distance * position), speed);
			this.stormTriggerBox.scareTribes();

			var newStringEvalue = parseInt(UI.StringsliderE.value) + distance;
			
			if (!UI.StringsliderE.mouseIsOver){
                UI.StringsliderE.value = newStringEvalue;
            }
			
			inactiveTimer = 0;
		},
		
		moved_W: function(position, distance, speed) {
			console.log("String W moved: ", position, distance, speed);
			
			//NaN
			if(speed != speed) speed = 1;

			var newStringWvalue = parseInt(UI.StringsliderW.value) + distance;
			
			if (!UI.StringsliderW.mouseIsOver){
                UI.StringsliderW.value = newStringWvalue;
            }
            
			inactiveTimer = 0;
		},



		moving_T: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String T moving: ", position, distance, speed);

		},
		
		moving_A: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String A moving: ", position, distance, speed);

		},
		
		moving_P: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String P moving: ", position, distance, speed);

		},
		
		moving_E: function(position, distance, speed) {
			debug.log(DEBUG.HARDWARE, "String E moving: ", position, distance, speed);

		},
		
		moving_W: function(position, distance, speed) {
			if (!hasStopped) {
                debug.log(DEBUG.HARDWARE, "String W moving: ", position, distance, speed);
                camera.script.Camera.move_W(position,(distance * position),speed);
			}
		},

    };

    return HIDInterface;
});