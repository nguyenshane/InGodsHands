///
// Description: This is the control input for swipe
///
pc.script.create('SwipeInterface', function (context) {
    // Creates a new TestString instance
    var SwipeInterface = function (entity) {
        this.entity = entity;
        pc.events.attach(this);
        
    };

    var timer = new Date();

    SwipeInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var t1 = new Date();

            var css = function () {/*
                .swipeWrapper{
                    z-index: 101;
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.5
                }
                .left{
                    height:20%;
                    width: 20%;
                    background: black;
                    float:left;
                }
                .center{
                    height:20%;
                    width: 60%;
                    background: none;
                    float:left;
                }
                .right{
                    height:20%;
                    width: 20%;
                    background: red;
                    float:left;
                }
                .T{ background: #304C50; }
                .A{ background: #364155; }
                .P{ background: #282B3E; }
                .E{ background: #7F536C; }
                .W{ background: #D85E70; }
            */}.toString().trim();
            css = css.slice(css.indexOf('/*') + 2).slice(0, -3);

            // append css to style
            if (document.head) {
                var style = document.createElement('style');
                style.type = 'text/css';
                if (style.styleSheet){
                  style.styleSheet.cssText = css;
                } else {
                  style.appendChild(document.createTextNode(css));
                }

                document.head.appendChild(style);
            }
        
            var swipeWrapper = document.createElement('div');
            swipeWrapper.className = 'swipeWrapper';
            swipeWrapper.innerHTML = [
                '<div class="string left T"></div> <div class="center"></div> <div class="string right T"></div>',
                '<div class="string left A"></div> <div class="center"></div> <div class="string right A"></div>',
                '<div class="string left P"></div> <div class="center"></div> <div class="string right P"></div>',
                '<div class="string left E"></div> <div class="center"></div> <div class="string right E"></div>',
                '<div class="string left W"></div> <div class="center"></div> <div class="string right W"></div>'
                ].join('\n');
            document.body.appendChild(swipeWrapper);


            var t2 = new Date();
            debug.log(DEBUG.INIT, "swipeWrapper initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {


        },
        
        moved_T: function(position, distance, speed) {
            //console.log("String T moved: ", position, distance, speed);
            
            temperatureChange = true;
            temperatureStart = globalTemperature;
            temperatureDest = globalTemperature + distance;
            velocity = Math.abs((speed) * 50);
            timer = new Date();
            lerpStartTime = timer.getTime();

            var newStringTvalue = parseInt(UI.StringsliderT.value) + distance;

            if (!UI.StringsliderT.mouseIsOver){
                UI.StringsliderT.value = newStringTvalue;
            }
            
            debug.log(DEBUG.HARDWARE, "Global Temp: " + globalTemperature);
            for (var i = 0; i < 20; ++i) {
                //console.log(ico.tiles[i].getTemperature());
            }
            
            inactiveTimer = 0;
        },
        
        moved_A: function(position, distance, speed) {
            //console.log("String A moved: ", position, distance, speed);
            
            animalDensity += (distance * 0.0004);
            animalDensity = pc.math.clamp(animalDensity, 0.005, 0.1);
            
            var newStringAvalue = parseInt(UI.StringsliderA.value) + distance;
            
            if (!UI.StringsliderA.mouseIsOver){
                UI.StringsliderA.value = newStringAvalue;
            }
            
            inactiveTimer = 0;
        },
        
        moved_P: function(position, distance, speed) {
            //console.log("String P moved: ", position, distance, speed);
            
            //tribes[0].addTribe();
            // for (var i = 0; i < tribes.length; i++) {
            //  if (!tribes[i].enabled) {
            //      tribes[i].enabled = true;
            //      break;
            //  }
            // }

            var newStringPvalue = parseInt(UI.StringsliderP.value) + distance;
            
            if (!UI.StringsliderP.mouseIsOver){
                UI.StringsliderP.value = newStringPvalue;
            }

            // Convert distance relative to 0-100
            // Get increment and distance based on speed
            ico.faultNumMove = Math.abs(distance);
            ico.faultIncrement = Math.abs(ico.faultIncrement) * position;

            inactiveTimer = 0;
        },
        
        moved_E: function(position, distance, speed) {
            //console.log("String E moved: ", position, distance, speed);
            
            scripts.Atmosphere.makeStorm(distance, speed);
            this.stormTriggerBox.scareTribes();

            var newStringEvalue = parseInt(UI.StringsliderE.value) + distance;
            
            if (!UI.StringsliderE.mouseIsOver){
                UI.StringsliderE.value = newStringEvalue;
            }
            
            inactiveTimer = 0;
        },
        
        moved_W: function(position, distance, speed) {
            //console.log("String W moved: ", position, distance, speed);
            
            var newStringWvalue = parseInt(UI.StringsliderW.value) + distance;
            
            if (!UI.StringsliderW.mouseIsOver){
                UI.StringsliderW.value = newStringWvalue;
            }
            
            inactiveTimer = 0;
        },



        moving_T: function(position, distance, speed) {
            debug.log(DEBUG.HARDWARE, "String T moving: ", position, distance, speed);

        },
        
        moving_A: function(position, distance, speed) {
            debug.log(DEBUG.HARDWARE, "String A moving: ", position, distance, speed);

        },
        
        moving_P: function(position, distance, speed) {
            debug.log(DEBUG.HARDWARE, "String P moving: ", position, distance, speed);

        },
        
        moving_E: function(position, distance, speed) {
            debug.log(DEBUG.HARDWARE, "String E moving: ", position, distance, speed);

        },
        
        moving_W: function(position, distance, speed) {
            if (!hasStopped) {
                debug.log(DEBUG.HARDWARE, "String W moving: ", position, distance, speed);
                camera.script.Camera.move_W(position,distance,speed);
            }
        },

    };

    return SwipeInterface;
});