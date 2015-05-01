///
// Description: This is the Intro screen script that controls the string calibration
///

pc.script.attribute('from_L', 'vector');
pc.script.attribute('to_L', 'vector');
pc.script.attribute('from_R', 'vector');
pc.script.attribute('to_R', 'vector');
pc.script.attribute('duration', 'number', 0.5);
pc.script.attribute('easeIn', 'string', 'Linear');
pc.script.attribute('easeOut', 'string', 'None');
pc.script.attribute('reverseAfter', 'number', 1);


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
            

            var T_L_Tween = new startTween(this.from_L, this.to_L, this.duration, this.T_L, this.easeIn, this.easeOut, this.reverseAfter);
            var T_R_Tween = new startTween(this.from_R, this.to_R, this.duration, this.T_R, this.easeIn, this.easeOut, this.reverseAfter);
            var A_L_Tween = new startTween(this.from_L, this.to_L, this.duration, this.A_L, this.easeIn, this.easeOut, this.reverseAfter);
            var A_R_Tween = new startTween(this.from_R, this.to_R, this.duration, this.A_R, this.easeIn, this.easeOut, this.reverseAfter);
            var P_L_Tween = new startTween(this.from_L, this.to_L, this.duration, this.P_L, this.easeIn, this.easeOut, this.reverseAfter);
            var P_R_Tween = new startTween(this.from_R, this.to_R, this.duration, this.P_R, this.easeIn, this.easeOut, this.reverseAfter);
            var E_L_Tween = new startTween(this.from_L, this.to_L, this.duration, this.E_L, this.easeIn, this.easeOut, this.reverseAfter);
            var E_R_Tween = new startTween(this.from_R, this.to_R, this.duration, this.E_R, this.easeIn, this.easeOut, this.reverseAfter);
            var P_L_Tween = new startTween(this.from_L, this.to_L, this.duration, this.W_L, this.easeIn, this.easeOut, this.reverseAfter);
            var P_R_Tween = new startTween(this.from_R, this.to_R, this.duration, this.W_R, this.easeIn, this.easeOut, this.reverseAfter);
            
        },


        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	
        },
		

    };

    return Intro;
});