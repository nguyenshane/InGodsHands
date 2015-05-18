pc.script.create("animation_blending", function (app) {
    var states = {
        idle: {
            animation: 'humanwalk'
        }
    };

    var AnimationBlender = function (entity) {
        this.entity = entity;
        this.blendTime = 0.2;

        this.setState('idle');

        app.keyboard.on(pc.EVENT_KEYDOWN, this.keyDown, this);
        app.keyboard.on(pc.EVENT_KEYUP, this.keyUp, this);
    };

    AnimationBlender.prototype = {
        setState: function (state) {
            this.state = state;
            // Set the current animation, taking 0.2 seconds to blend from
            // the current animation state to the start of the target animation.
            console.log("Setting anim");
            //console.log("The nodes " + states[state].animation.getNodes());


            this.entity.animation.play('humanwalk', this.blendTime);
        }

        // keyDown: function (e) {
        //     if ((e.key === pc.KEY_P) && (this.state !== 'punch')) {
        //         this.setState('punch');
        //     }
        // },

        // keyUp: function (e) {
        //     if ((e.key === pc.KEY_P) && (this.state === 'punch')) {
        //         this.setState('idle');
        //     }
        // }
    };

    return AnimationBlender;
});