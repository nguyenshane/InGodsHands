pc.script.create('LightController', function (context) {
    // Creates a new instance
    var LightController = function (entity) {
        this.entity = entity;
        this.beliefTimer;
        this.intensity;
        this.lightUp;
        this.lightningOn;
        this.origColor;
        this.lightningTimer;
        var tribes = context.root.findByName("TribeParent");
    };

  	

    LightController.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.intensity = this.entity.light.intensity;
            this.beliefTimer = 180;
            this.lightUp = false;
            this.origColor = this.entity.light.color;
            this.lightningTimer = 40;
            this.lightningOn = false;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	if (this.lightUp){
        		this.shineBeliefLight();
        	} else if (this.lightningOn){
                this.shineLightning();
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

        startLightning: function(){
            this.lightningOn = true;
            this.entity.light.color = new pc.Color(1, 1, 1, 1);
            this.enabled = true;
            this.shineLightning();
        },

        shineLightning: function(){
            if (this.lightningTimer <= 0){ 
                this.entity.light.intensity = 1;
                this.lightningOn = false;
                this.lightningTimer = 40;
                this.entity.light.color = this.origColor;
                var indexOfSelf = this.entity.getParent().getChildren().indexOf(this.entity);
                if (!tribes[indexOfSelf].enabled) this.entity.enabled = false;
                return;
            } else if (this.lightningTimer < 40 && this.lightningTimer > 30){
                this.entity.light.intensity = 15;
            } else if (this.lightningTimer < 22 && this.lightningTimer > 15){
                this.entity.light.intensity = 20;
            } else {
                this.entity.light.intensity = 2;
            }

            this.lightningTimer--;
        }

    };

    return LightController;
});