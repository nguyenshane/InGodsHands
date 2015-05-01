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
		
		this.currentPos = {L:0, R:0};
		this.T_L,this.T_R,this.A_L,this.A_R,this.P_L,this.P_R,this.E_L,this.E_R,this.W_L,this.W_R;
        
    };

    Intro.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        	this.T_L = app.root.findByName("T_L");
        	this.T_R = app.root.findByName("T_R");
        	this.A_L = app.root.findByName("A_L");
        	this.A_R = app.root.findByName("A_R");
        	this.P_L = app.root.findByName("P_L");
        	this.P_R = app.root.findByName("P_R");
        	this.E_L = app.root.findByName("E_L");
        	this.E_R = app.root.findByName("E_R");
        	this.W_L = app.root.findByName("W_L");
        	this.W_R = app.root.findByName("W_R");

        	startTween(this.from_L, this.to_L, this.duration, this.currentPos, this.reverseAfter);
        	//startTween(this.from_R, this.to_R, this.duration, this.currentPos, this.reverseAfter);
        },


        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	TWEEN.update();
        	
        	var T_currentPos = this.T_L.getLocalPosition();
        	this.T_L.setLocalPosition(this.currentPos.L,T_currentPos.y,T_currentPos.z);
			this.T_R.setLocalPosition(this.currentPos.R,T_currentPos.y,T_currentPos.z);

			var A_currentPos = this.A_L.getLocalPosition();
			this.A_L.setLocalPosition(this.currentPos.L,A_currentPos.y,A_currentPos.z);
			this.A_R.setLocalPosition(this.currentPos.R,A_currentPos.y,A_currentPos.z);

			var P_currentPos = this.P_L.getLocalPosition();
			this.P_L.setLocalPosition(this.currentPos.L,P_currentPos.y,P_currentPos.z);
			this.P_R.setLocalPosition(this.currentPos.R,P_currentPos.y,P_currentPos.z);

			var E_currentPos = this.E_L.getLocalPosition();
			this.E_L.setLocalPosition(this.currentPos.L,E_currentPos.y,E_currentPos.z);
			this.E_R.setLocalPosition(this.currentPos.R,E_currentPos.y,E_currentPos.z);

			var W_currentPos = this.W_L.getLocalPosition();
			this.W_L.setLocalPosition(this.currentPos.L,W_currentPos.y,W_currentPos.z);
			this.W_R.setLocalPosition(this.currentPos.R,W_currentPos.y,W_currentPos.z);
        },

    };

    return Intro;
});