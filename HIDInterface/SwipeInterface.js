///
// Description: This is the control input for swipe
///
pc.script.create('SwipeInterface', function (context) {
    // Creates a new TestString instance
    var SwipeInterface = function (entity) {
        this.entity = entity;
        pc.events.attach(this);

        var T_L, T_R,
            A_L, A_R,
            P_L, P_R,
            E_L, E_R,
            W_L, W_R;
        
    };

    SwipeInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var t1 = new Date();

            var css = function () {/*
                .swipeWrapper{
                    z-index: 0;
                    position: relative;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.65;
                }
                .left{
                    height:20%;
                    width: 20%;
                    background: none;
                    float:left;
                    box-shadow: none;
                    position: relative;
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
                    background: none;
                    float:left;
                    position: relative;
                }
                .up{ opacity: 1 }

                .T_L{ background: linear-gradient(to right, rgba(48,76,80,1) 40%, rgba(0,0,0,0) 100%); }
                
                .T_L_active{ position: absolute;
                      content: '';
                      top: 0;
                      left: 0;
                      width: 100%;
                      height: 100%;
                      transition: box-shadow 1.5s ease, opacity 1.5s ease, visibility 0s linear;
                      background: rgba(48,76,80,1); box-shadow: 0 0 2em red; opacity: 0;}

                #A_L{ background: linear-gradient(to right, rgba(54,65,85,1) 40%, rgba(0,0,0,0) 100%); }
                #P_L{ background: linear-gradient(to right, rgba(40,43,62,1) 40%, rgba(0,0,0,0) 100%); }
                #E_L{ background: linear-gradient(to right, rgba(127,83,108,1) 40%, rgba(0,0,0,0) 100%); }
                #W_L{ background: linear-gradient(to right, rgba(216,94,112,1) 40%, rgba(0,0,0,0) 100%); }

                #T_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(48,76,80,1) 60%); }
                #A_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(54,65,85,1) 60%); }
                #P_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(40,43,62,1) 60%); }
                #E_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(127,83,108,1) 60%); }
                #W_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(216,94,112,1) 60%); }
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
                '<div class="left T_L" id="T_L"></div> <div class="center"></div> <div class="right T_R" id="T_R"></div>',
                '<div class="left A_L" id="A_L"></div> <div class="center"></div> <div class="right A_R" id="A_R"></div>',
                '<div class="left P_L" id="P_L"></div> <div class="center"></div> <div class="right P_R" id="P_R"></div>',
                '<div class="left E_L" id="E_L"></div> <div class="center"></div> <div class="right E_R" id="E_R"></div>',
                '<div class="left W_L" id="W_L"></div> <div class="center"></div> <div class="right W_R" id="W_R"></div>'
                ].join('\n');
            document.body.appendChild(swipeWrapper);

            this.T_L = $("#T_L"); this.T_R = $("#T_R");
            this.A_L = $("#A_L"); this.A_R = $("#A_R");
            this.P_L = $("#P_L"); this.P_R = $("#P_R");
            this.E_L = $("#E_L"); this.E_R = $("#E_R");
            this.W_L = $("#W_L"); this.W_R = $("#W_R");

            var HIDInterface = context.root._children[0].script.HIDInterface;


            this.T_L.swipe({
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("event", event);
                  console.log("You swiped T_L" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_T(-1,distance/50,(distance/50)/duration);
                },
                //threshold:75
            });

            this.T_R.swipe({
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped T_R" + " distance " + distance, " duration " + duration);
                  HIDInterface.moved_T(1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });

            this.A_L.swipe({
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped A_L" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_A(-1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });

            this.A_R.swipe({
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped A_R" + " distance " + distance, " duration " + duration); 
                  HIDInterface.moved_A(1,distance/50,(distance/50)/duration); 
                },
                threshold:0
            });

            this.P_L.swipe({
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped P_L" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_P(-1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });

            this.P_R.swipe({
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped P_R" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_P(1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });

            this.E_L.swipe({
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped E_L" + " distance " + distance, " duration " + duration); 
                  HIDInterface.moved_E(-1,distance/50,(distance/50)/duration); 
                },
                threshold:0
            });

            this.E_R.swipe({
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped E_R" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_E(1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });

            this.W_L.swipe({
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped W_L" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moving_W(-1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });

            this.W_R.swipe({
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped W_R" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moving_W(1,distance/50,(distance/50)/duration);
                },
                threshold:0
            });


            var t2 = new Date();
            debug.log(DEBUG.INIT, "swipeWrapper initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {


        },
        

    };

    return SwipeInterface;
});