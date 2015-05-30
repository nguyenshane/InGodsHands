pc.script.create('LightController', function (context) {
    // Creates a new instance
    var LightController = function (entity) {
        this.entity = entity;
        this.beliefTimer;
        this.intensity;
        this.lightUp;
    };

  	

    LightController.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.intensity = this.entity.light.intensity;
            this.beliefTimer = 180;
            this.lightUp = false;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	if (this.lightUp){
        		this.shineBeliefLight();
        	}
        },

        startShineBeliefLight: function(){
        	this.lightUp = true;
        	this.shineBeliefLight();
        },

        shineBeliefLight: function (deltaTime){
        	if (this.beliefTimer === 0){ 
        		this.intensity = 1;
        		this.lightUp = false;
        		this.beliefTimer = 180;
        		return;
        	} else if (this.beliefTimer > 90){
        		this.entity.light.intensity += 0.25;
        	} else {
        		this.entity.light.intensity -= 0.25;
        	}

        	this.beliefTimer--;
        },

    };

    return LightController;
});