pc.script.create("trigger", function (app) {

    var zeroVec = pc.Vec3.ZERO;

    var Trigger = function (entity) {
        this.entity = entity;

        this.tribesInTrigger = [];
    };

    Trigger.prototype = {
        initialize: function () {
            this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
            this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
        },

        onTriggerEnter: function (entity) {
            // Tribe knows it is lit by sun            
            
            entity.script.tribe.inSun = true;
            this.tribesInTrigger.push(entity);
            //console.log("We've entered the trigger!!!! Tribe lit: " + entity.script.tribe.inSun);
        },

        onTriggerLeave: function (entity) {
            // Tribe knows it isn't lit by sun

            entity.script.tribe.inSun = false;
            var removedIndex = this.tribesInTrigger.indexOf(entity);
            if(this.tribesInTrigger.indexOf(entity) != -1){
                this.tribesInTrigger.splice(removedIndex);
            }
            //console.log("\nWe've exited the trigger!!!!\n Tribe lit: " + entity.script.tribe.inSun);
        },

        scareTribes: function () {
            for(var i = 0; i < this.tribesInTrigger.length; i++){
                this.tribesInTrigger[i].script.tribe.startCowering();
            }
        }
    };

    return Trigger;
})