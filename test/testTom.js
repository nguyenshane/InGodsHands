pc.script.create("animation_blending", function (app) {
    var states = {
        idle: {
            animation: 'praise1'
        },

        walk: {
            animation: 'humanwalk'
        }
    };

    var AnimationBlender = function (entity) {
        this.entity = entity;
        this.blendTime = 0.2;

        app.keyboard.on(pc.EVENT_KEYDOWN, this.keyDown, this);
        app.keyboard.on(pc.EVENT_KEYUP, this.keyUp, this);
    };

    AnimationBlender.prototype = {
        initialize: function () {
            this.setState('walk');      
        },

        setState: function (state) {
            this.state = state;
            // Set the current animation, taking 0.2 seconds to blend from
            // the current animation state to the start of the target animation.

            this.entity.animation.play(states[state].animation, this.blendTime);
        },

        keyDown: function (e) {
            if ((e.key === pc.KEY_P) && (this.state !== 'idle')) {
                this.setState('idle');
            }
        },

        keyUp: function (e) {
            if ((e.key === pc.KEY_P) && (this.state !== 'walk')) {
                this.setState('walk');
            }
        }
    };

    return AnimationBlender;
});