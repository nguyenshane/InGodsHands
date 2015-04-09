pc.script.create("trigger", function (app) {

    var zeroVec = pc.Vec3.ZERO;

    var Trigger = function (entity) {
        this.entity = entity;
    };

    Trigger.prototype = {
        initialize: function () {
            this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
            this.entity.collision.on('triggerleave', this.onTriggerLeave, this);
        },

        onTriggerEnter: function (entity) {
            // Tribe knows it is lit            
            
            entity.script.tribe.inSun = true;
            //console.log("We've entered the trigger!!!! Tribe lit: " + entity.script.tribe.inSun);
        },

        onTriggerLeave: function (entity) {
            // Tribe knows it isn't lit

            entity.script.tribe.inSun = false;
            //console.log("\nWe've exited the trigger!!!!\n Tribe lit: " + entity.script.tribe.inSun);
        }
    };

    return Trigger;
})