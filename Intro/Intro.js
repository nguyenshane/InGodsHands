///
// Description: This is the Intro screen script that controls the string calibration
///

pc.script.attribute('from_L', 'number', -0.4);
pc.script.attribute('to_L', 'number', -0.13);
pc.script.attribute('from_R', 'number', 0.4);
pc.script.attribute('to_R', 'number', 0.13);
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
		this.currentPos_L, this.currentPos_R;
        
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

        	startTween(this.from_L, this.to_L, this.duration, this.currentPos_L, this.reverseAfter);
        	startTween(this.from_R, this.to_R, this.duration, this.currentPos_R, this.reverseAfter);
        },


        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	TWEEN.update();
        	
        	T_L.setLocalPosition(this.currentPos_L,0,0);
			T_R.setLocalPosition(this.currentPos_R,0,0);
			A_L.setLocalPosition(this.currentPos_L,0,0);
			A_R.setLocalPosition(this.currentPos_R,0,0);
			P_L.setLocalPosition(this.currentPos_L,0,0);
			P_R.setLocalPosition(this.currentPos_R,0,0);
			E_L.setLocalPosition(this.currentPos_L,0,0);
			E_R.setLocalPosition(this.currentPos_R,0,0);
			W_L.setLocalPosition(this.currentPos_L,0,0);
			W_R.setLocalPosition(this.currentPos_R,0,0);
        },
		

    };

    return Intro;
});