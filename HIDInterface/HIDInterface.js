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
    var hasStopped;

    HIDInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');
			
			//tribe = context.root.findByName("BaseTribe").script.tribe;
			//storm = context.root.findByName("Storm");
			camera = context.root.findByName("Camera");

			temperatureChange = false;
			temperatureDest = 0.0;
			velocity = 0.0;

			UI = context.root.findByName("Rv1-stable").script.developer;

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

				if((globalTemperature - temperatureDest) == 0.0) {
					temperatureChange = false;
					console.log("Done temp change");
				}
        	}
        },
		
		moved_T: function(position, distance, speed) {
			//console.log("String T moved: ", position, distance, speed);
			
			temperatureChange = true;
			temperatureStart = globalTemperature;
			temperatureDest = globalTemperature + distance;
			velocity = Math.abs((speed) * 50);
			timer = new Date();
			lerpStartTime = timer.getTime();
			
			console.log("Global Temp: " + globalTemperature);
			for (var i = 0; i < 20; ++i) {
				//console.log(ico.tiles[i].getTemperature());
			}
			
			inactiveTimer = 0;
		},
		
		moved_A: function(position, distance, speed) {
			//console.log("String A moved: ", position, distance, speed);
			
			animalDensity += (distance * 0.0004);
			animalDensity = pc.math.clamp(animalDensity, 0.005, 0.1);
			
			inactiveTimer = 0;
		},
		
		moved_P: function(position, distance, speed) {
			//console.log("String P moved: ", position, distance, speed);
			
			//tribes[0].addTribe();
			for(var i = 0; i < tribes.length; i++){
				if(!tribes[i].enabled){
					tribes[i].enabled = true;
					break;
				}
			}

			inactiveTimer = 0;
		},
		
		moved_E: function(position, distance, speed) {
			//console.log("String E moved: ", position, distance, speed);
			
			/*
			// Temporarily here, will make it a function call to tile eventually
			if (speed > 30 && Math.abs(distance) > 5) {
				tribe.startCowering();
				console.log("Sufficient string pull for storm");
			}
			*/
			
			scripts.Atmosphere.makeStorm(distance, speed);
			
			for(var i = 0; i < tribes.length; i++){
				if (tribes[i].enabled){
					if(tribes[i].script.tribe.tile.isStormy){
						console.log("i for tribes: " + tribes[i]);
						tribes[i].script.tribe.startCowering();
					}
				}
			}

			inactiveTimer = 0;
		},
		
		moved_W: function(position, distance, speed) {
			//console.log("String W moved: ", position, distance, speed);
			
			inactiveTimer = 0;
		},



		moving_T: function(position, distance, speed) {
			console.log("String T moving: ", position, distance, speed);

		},
		
		moving_A: function(position, distance, speed) {
			console.log("String A moving: ", position, distance, speed);

		},
		
		moving_P: function(position, distance, speed) {
			console.log("String P moving: ", position, distance, speed);

		},
		
		moving_E: function(position, distance, speed) {
			console.log("String E moving: ", position, distance, speed);

		},
		
		moving_W: function(position, distance, speed) {
			if(!hasStopped){
			console.log("String W moving: ", position, distance, speed);
			camera.script.Camera.move_W(position,distance,speed);
			}
		},

    };

    return HIDInterface;
});