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



        this.pinA = false; //S
        this.pinB = false; //D
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
            /* FRAME DRIVING */

        },


        /* EVENT DRIVING */
        
        doEncoderA: function (){
            //console.log('called A');
            // false->true on A
            if(this.pinA){
                // check direction on B
                if(this.pinB == false) this.currentPos += 1; // CW
                else this.currentPos -= 1; // CCW
            }
            else { // true->false on A
                // check direction on B
                if(this.pinB) this.currentPos += 1; // CW
                else this.currentPos -= 1; // CCW
            }
            console.log(this.currentPos);
        },

        doEncoderB: function (){
            //console.log("called B");
            // false->true on B
            if(this.pinB){
                // check direction on A
                if(this.pinA) this.currentPos += 1; // CW
                else this.currentPos -= 1; // CCW
            }
            else { // true->false on A
                // check direction on B
                if(this.pinA == false) this.currentPos += 1; // CW
                else this.currentPos -= 1; // CCW
            }
            console.log(this.currentPos);
        },


        // Event handler called when key is pressed
        
        onKeyDown: function (event) {
            // Check event.key to detect which key has been pressed
            if (event.key === pc.KEY_S) {
                if(!this.pinA){
                    this.pinA = true;
                    this.doEncoderA();
                    console.log("S is pressing");
                }
                
            }
            if (event.key === pc.KEY_D) {
                if(!this.pinB){
                    this.pinB = true;
                    this.doEncoderB();
                    console.log("D is pressing");
                }
                
            }

            // When the space bar is pressed this scrolls the window.
            // Calling preventDefault() on the original browser event stops this.
            event.event.preventDefault();
        },

        
        // Event handler called when key is released
        
        onKeyUp: function (event) {
            // Check event.key to detect which key has been pressed
            if (event.key === pc.KEY_S) {
                if(this.pinA){
                    console.log("S is NOT pressing");
                    this.pinA = false;
                    this.doEncoderA();
                }
            }
            if (event.key === pc.KEY_D) {
                if(this.pinB){
                    console.log("D is NOT pressing");
                    this.pinB = false;
                    this.doEncoderB();
                }
            }
        }, 
    };

    return stringTAPEW;
});