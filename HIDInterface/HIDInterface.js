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

    HIDInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');
			
			temperatureChange = false;
			temperatureDest = 0.0;
			velocity = 0.0;
			
			this.stringT.on("moved", this.move_T, this.direction, this.distance, this.speed);
			this.stringA.on("moved", this.move_A, this.direction, this.distance, this.speed);
			this.stringP.on("moved", this.move_P, this.direction, this.distance, this.speed);
			this.stringE.on("moved", this.move_E, this.direction, this.distance, this.speed);
			this.stringW.on("moved", this.move_W, this.direction, this.distance, this.speed);

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	if(temperatureChange == true){
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

        	//console.log(globalTemperature);
        	//console.log(temperatureDest);
        },
		
		move_T: function(position, distance, speed) {
			console.log("FIRED string T: ", position, distance, speed);
			temperatureChange = true;
			temperatureStart = globalTemperature;
			temperatureDest = globalTemperature + distance;
			velocity = Math.abs((speed) * 500);
			timer = new Date();
			lerpStartTime = timer.getTime();
			console.log("Global Temp: " + globalTemperature);
			for (var i = 0; i < 20; ++i) {
				console.log(ico.tiles[i].getTemperature());
			}

		},
		
		move_A: function(position, distance, speed) {
			console.log("FIRED string A: ", position, distance, speed);

		},
		
		move_P: function(position, distance, speed) {
			console.log("FIRED string P: ", position, distance, speed);

		},
		
		move_E: function(position, distance, speed) {
			console.log("FIRED string E: ", position, distance, speed);
			// Temporarily here, will make it a function call to tile eventually
			var tribe = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("BaseTribe").script.tribe;
			tribe.startCowering();
		},
		
		move_W: function(position, distance, speed) {
			console.log("FIRED string W: ", position, distance, speed);
			
		},

    };

    return HIDInterface;
});