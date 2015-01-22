///
// Description: This is the control input for each string
///
pc.script.create('stringTAPEW', function (context) {
    // Creates a new Test instance
    var stringTAPEW = function (entity) {
        this.entity = entity;

        this.id = 0;
        this.currentPos = 0;
        this.lastVelocity = 0.0;
        this.lastDistance = 0.0;



        this.pinA = false;
        this.pinB = false;
        this.pinAcache = false;
        this.pinBcache = false;

    };

    stringTAPEW.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            context.keyboard.on("keydown", this.onKeyDown, this);
            context.keyboard.on("keyup", this.onKeyUp, this);

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },

        /*
        * Event handler called when key is pressed
        */
        onKeyDown: function (event) {
            // Check event.key to detect which key has been pressed
            if (event.key === pc.KEY_S) {
                console.log("S is pressing");
            }
            if (event.key === pc.KEY_D) {
                console.log("D is pressing");
            }

            // When the space bar is pressed this scrolls the window.
            // Calling preventDefault() on the original browser event stops this.
            event.event.preventDefault();
        },

        /*
        * Event handler called when key is released
        */
        onKeyUp: function (event) {
            // Check event.key to detect which key has been pressed
            if (event.key === pc.KEY_S) {
                console.log("S is NOT pressing");
            }
            if (event.key === pc.KEY_D) {
                console.log("D is NOT pressing");
            }
        },
    };

    return stringTAPEW;
});