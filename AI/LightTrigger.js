pc.script.create("trigger", function (app) {

    var zeroVec = pc.Vec3.ZERO;

    var Trigger = function (entity) {
        this.entity = entity;
    };

    Trigger.prototype = {
        initialize: function () {
            this.entity.collision.on('triggerenter', this.onTriggerEnter, this);
        },

        onTriggerEnter: function (entity) {
            // Reset back to roughly the position the entity started in.

            entity.getName();

            // var position = entity.getPosition();
            // entity.setPosition(position.x, 10, 0);

            // entity.rigidbody.linearVelocity = zeroVec;
            // entity.rigidbody.angularVelocity = zeroVec;
            // entity.rigidbody.syncEntityToBody();
        }
    };

    return Trigger;
})