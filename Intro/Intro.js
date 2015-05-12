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


pc.script.create('Intro', function (context) {
    var Intro = function (entity) {
        this.entity = entity;
		pc.events.attach(this);
		
		this.currentPos = {L:0, R:0};

		this.T_L,this.T_R,this.A_L,this.A_R,this.P_L,this.P_R,this.E_L,this.E_R,this.W_L,this.W_R;
        this.game = context.root.findByName("Shell");
    };

    Intro.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        	this.worlds = [
                365042, // intro
                350057 // Rv1-stable
            ];

            console.log('context', context);

            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');
			/*
			this.stringT = context.root._children[0].script.HIDInterface.stringT;
			this.stringA = context.root._children[0].script.HIDInterface.stringA;
			this.stringP = context.root._children[0].script.HIDInterface.stringP;
			this.stringE = context.root._children[0].script.HIDInterface.stringE;
			this.stringW = context.root._children[0].script.HIDInterface.stringW;
			*/

        	this.T_L = context.root.findByName("T_L");
        	this.T_R = context.root.findByName("T_R");
        	this.A_L = context.root.findByName("A_L");
        	this.A_R = context.root.findByName("A_R");
        	this.P_L = context.root.findByName("P_L");
        	this.P_R = context.root.findByName("P_R");
        	this.E_L = context.root.findByName("E_L");
        	this.E_R = context.root.findByName("E_R");
        	this.W_L = context.root.findByName("W_L");
        	this.W_R = context.root.findByName("W_R");

        	startTween(this.from_L, this.to_L, this.duration, this.currentPos, this.reverseAfter);
        	//startTween(this.from_R, this.to_R, this.duration, this.currentPos, this.reverseAfter);
        },

        onActivate: function() {
        	this.entity.enabled = true;
        },

        onDeactivate: function() {
        	this.entity.enabled = false;

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	TWEEN.update();

        	this.middleT = this.stringT.isMiddle;
			this.middleA = this.stringA.isMiddle;
			this.middleP = this.stringP.isMiddle;
			this.middleE = this.stringE.isMiddle;
			this.middleW = this.stringW.isMiddle;

        	if(this.middleT && this.middleA	&& this.middleP	&& this.middleE	&& this.middleW) {
        		console.log("This will send to new scene");
        		this.game.script.game.completeLevel(1);
        		this.onDeactivate();
        	}

        	var T_currentPos = this.T_L.getLocalPosition();
        	if(!this.middleT){
	        	this.T_L.setLocalPosition(this.currentPos.L,T_currentPos.y,T_currentPos.z);
				this.T_R.setLocalPosition(this.currentPos.R,T_currentPos.y,T_currentPos.z);
			} else { 
				this.T_L.setLocalPosition(this.to_L,T_currentPos.y,T_currentPos.z);
				this.T_R.setLocalPosition(-this.to_L,T_currentPos.y,T_currentPos.z);
			}

			var A_currentPos = this.A_L.getLocalPosition();
			if(!this.middleA){
				this.A_L.setLocalPosition(this.currentPos.L,A_currentPos.y,A_currentPos.z);
				this.A_R.setLocalPosition(this.currentPos.R,A_currentPos.y,A_currentPos.z);
			} else { 
				this.A_L.setLocalPosition(this.to_L,A_currentPos.y,A_currentPos.z);
				this.A_R.setLocalPosition(-this.to_L,A_currentPos.y,A_currentPos.z);
			}

			var P_currentPos = this.P_L.getLocalPosition();
			if(!this.middleP){
				this.P_L.setLocalPosition(this.currentPos.L,P_currentPos.y,P_currentPos.z);
				this.P_R.setLocalPosition(this.currentPos.R,P_currentPos.y,P_currentPos.z);
			} else { 
				this.P_L.setLocalPosition(this.to_L,P_currentPos.y,P_currentPos.z);
				this.P_R.setLocalPosition(-this.to_L,P_currentPos.y,P_currentPos.z);
			}

			var E_currentPos = this.E_L.getLocalPosition();
			if(!this.middleE){
				this.E_L.setLocalPosition(this.currentPos.L,E_currentPos.y,E_currentPos.z);
				this.E_R.setLocalPosition(this.currentPos.R,E_currentPos.y,E_currentPos.z);
			} else { 
				this.E_L.setLocalPosition(this.to_L,E_currentPos.y,E_currentPos.z);
				this.E_R.setLocalPosition(-this.to_L,E_currentPos.y,E_currentPos.z);
			}

			var W_currentPos = this.W_L.getLocalPosition();
			if(!this.middleW){
				this.W_L.setLocalPosition(this.currentPos.L,W_currentPos.y,W_currentPos.z);
				this.W_R.setLocalPosition(this.currentPos.R,W_currentPos.y,W_currentPos.z);
			} else { 
				this.W_L.setLocalPosition(this.to_L,W_currentPos.y,W_currentPos.z);
				this.W_R.setLocalPosition(-this.to_L,W_currentPos.y,W_currentPos.z);
			}

        },

    };

    return Intro;
});