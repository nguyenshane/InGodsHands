///
// Description: This is the control input for all strings
// Modify move_* functions or use .on("move") events to listen to the strings' movement
///

pc.script.create('HIDInterface', function (context) {
    // Creates a new TestString instance
    var HIDInterface = function (entity) {
        this.entity = entity;
		pc.events.attach(this);
		
		this.position, this.distance, this.speed = 0;
        
    };

    HIDInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');
			
			this.stringT.on("move", this.move_T, this.position, this.distance, this.speed);
			this.stringA.on("move", this.move_A, this.position, this.distance, this.speed);
			this.stringP.on("move", this.move_P, this.position, this.distance, this.speed);
			this.stringE.on("move", this.move_E, this.position, this.distance, this.speed);
			this.stringW.on("move", this.move_W, this.position, this.distance, this.speed);

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			
        },
		
		move_T: function(position, distance, speed) {
			console.log("FIRED string T: ", position, distance, speed);
		},
		
		move_A: function(position, distance, speed) {
			console.log("FIRED string A: ", position, distance, speed);
		},
		
		move_P: function(position, distance, speed) {
			console.log("FIRED string P: ", position, distance, speed);
		},
		
		move_E: function(position, distance, speed) {
			console.log("FIRED string E: ", position, distance, speed);
		},
		
		move_W: function(position, distance, speed) {
			console.log("FIRED string W: ", position, distance, speed);
		},

    };

    return HIDInterface;
});