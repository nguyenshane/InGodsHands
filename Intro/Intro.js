///
// Description: This is the Intro screen script that controls the string calibration
///

pc.script.create('Intro', function (app) {
    var Intro = function (entity) {
        this.entity = entity;
		pc.events.attach(this);

		this.stringT = new pc.StringTAPEW('T');
		this.stringA = new pc.StringTAPEW('A');
		this.stringP = new pc.StringTAPEW('P');
		this.stringE = new pc.StringTAPEW('E');
		this.stringW = new pc.StringTAPEW('W');

		this.left = {};
		
        
    };

    Intro.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        	var T_L = app.root.findByName("T_L");
        	var T_R = app.root.findByName("T_R");
        	var A_L = app.root.findByName("A_L");
        	var A_R = app.root.findByName("A_R");
        	var P_L = app.root.findByName("P_L");
        	var P_R = app.root.findByName("P_R");
        	var E_L = app.root.findByName("E_L");
        	var E_R = app.root.findByName("E_R");
        	var W_L = app.root.findByName("W_L");
        	var W_R = app.root.findByName("W_R");
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	
        },
		

    };

    return Intro;
});