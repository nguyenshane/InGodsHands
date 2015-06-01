///
// Description: This is the control input for swipe
///
pc.script.attribute('swipeAsset', 'asset', []);

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
        
        var T_LH, T_RH,
            A_LH, A_RH,
            P_LH, P_RH,
            E_LH, E_RH,
            W_LH, W_RH;
    };

    SwipeInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var t1 = new Date();

            var TLactive = context.assets.find("TLactive", "texture").getFileUrl();
            var TRactive = context.assets.find("TRactive", "texture").getFileUrl();
            var ALactive = context.assets.find("ALactive", "texture").getFileUrl();
            var ARactive = context.assets.find("ARactive", "texture").getFileUrl();
            var PLactive = context.assets.find("PLactive", "texture").getFileUrl();
            var PRactive = context.assets.find("PRactive", "texture").getFileUrl();
            var ELactive = context.assets.find("ERactive", "texture").getFileUrl();
            var ERactive = context.assets.find("ERactive", "texture").getFileUrl();
            var WLactive = context.assets.find("WLactive", "texture").getFileUrl();
            var WRactive = context.assets.find("WRactive", "texture").getFileUrl();


            var TLidle = context.assets.find("TLidle", "texture").getFileUrl();
            var TRidle = context.assets.find("TRidle", "texture").getFileUrl();
            var ALidle = context.assets.find("ALidle", "texture").getFileUrl();
            var ARidle = context.assets.find("ARidle", "texture").getFileUrl();
            var PLidle = context.assets.find("PLidle", "texture").getFileUrl();
            var PRidle = context.assets.find("PRidle", "texture").getFileUrl();
            var ELidle = context.assets.find("ERidle", "texture").getFileUrl();
            var ERidle = context.assets.find("ERidle", "texture").getFileUrl();
            var WLidle = context.assets.find("WLidle", "texture").getFileUrl();
            var WRidle = context.assets.find("WRidle", "texture").getFileUrl();

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
                    width: 30%;
                    background: none;
                    float:left;
                    box-shadow: none;
                    position: relative;
                }
                .left img {
                    height: 50%;
                    top: 25%;
                    left: 5%;
                    position: absolute;
                    pointer-events: none;
                    float: left;
                    transition: all 1.0s ease;
                }

                .left img.active{
                    opacity: 0;
                    transition: all 0.8s ease;
                }
                .center{
                    height:20%;
                    width: 40%;
                    background: none;
                    float:left;
                }
                .right{
                    height:20%;
                    width: 30%;
                    background: none;
                    float:left;
                    position: relative;
                }
                .right img {
                    height: 50%;
                    top: 25%;
                    right: 5%;
                    position: absolute;
                    pointer-events: none;
                    float: right;
                }

                .right img.active{
                    opacity: 0;
                    transition: all 0.8s ease;
                }

                .T_L{ background: linear-gradient(to right, rgba(63,64,63,1) 40%, rgba(0,0,0,0) 100%); transition: all 1.0s ease;}
                .A_L{ background: linear-gradient(to right, rgba(126,127,125,1) 30%, rgba(0,0,0,0) 100%); transition: all 1.0s ease;}
                .P_L{ background: linear-gradient(to right, rgba(188,191,188,1) 20%, rgba(0,0,0,0) 100%); transition: all 1.0s ease;}
                .E_L{ background: linear-gradient(to right, rgba(126,127,125,1) 30%, rgba(0,0,0,0) 100%); transition: all 1.0s ease;}
                .W_L{ background: linear-gradient(to right, rgba(63,64,63,1) 40%, rgba(0,0,0,0) 100%);  transition: all 1.0s ease;}
                
                .T_L_active{ transition: box-shadow 1.0s ease; background: rgba(48,76,80,1); box-shadow: 0 0 2em white;}
                .A_L_active{ transition: box-shadow 1.0s ease; background: rgba(54,65,85,1); box-shadow: 0 0 2em white;}
                .P_L_active{ transition: box-shadow 1.0s ease; background: rgba(40,43,62,1); box-shadow: 0 0 2em white;}
                .E_L_active{ transition: box-shadow 1.0s ease; background: rgba(127,83,108,1); box-shadow: 0 0 2em white;}
                .W_L_active{ transition: box-shadow 1.0s ease; background: rgba(216,94,112,1); box-shadow: 0 0 2em white;}
                

                .T_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(63,64,63,1) 60%); transition: all 1.0s ease;}
                .A_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(126,127,125,1) 70%); transition: all 1.0s ease;}
                .P_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(188,191,188,1) 80%); transition: all 1.0s ease;}
                .E_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(126,127,125,1) 70%); transition: all 1.0s ease;}
                .W_R{ background: linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(63,64,63,1) 60%); transition: all 1.0s ease;}

                .T_R_active{ transition: box-shadow 1.0s ease; background: rgba(48,76,80,1); box-shadow: 0 0 2em white;}
                .A_R_active{ transition: box-shadow 1.0s ease; background: rgba(54,65,85,1); box-shadow: 0 0 2em white;}
                .P_R_active{ transition: box-shadow 1.0s ease; background: rgba(40,43,62,1); box-shadow: 0 0 2em white;}
                .E_R_active{ transition: box-shadow 1.0s ease; background: rgba(127,83,108,1); box-shadow: 0 0 2em white;}
                .W_R_active{ transition: box-shadow 1.0s ease; background: rgba(216,94,112,1); box-shadow: 0 0 2em white;}

                
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
                '<div class="left T_L" id="T_L"><img id="TLidle" src="'+TLidle+'"/><img id="TLactive" class="active" src="'+TLactive+'"/></div><div class="center"></div><div class="right T_R" id="T_R"><img id="TRidle" src="'+TRidle+'"/><img id="TRactive" class="active" src="'+TRactive+'"/></div>',

                '<div class="left A_L" id="A_L"><img id="ALidle" src="'+ALidle+'"/><img id="ALactive" class="active" src="'+ALactive+'"/></div><div class="center"></div><div class="right A_R" id="A_R"><img id="ARidle" src="'+ARidle+'"/><img id="ARactive" class="active" src="'+ARactive+'"/></div>',

                '<div class="left P_L" id="P_L"><img id="PLidle" src="'+PLidle+'"/><img id="PLactive" class="active" src="'+PLactive+'"/></div><div class="center"></div><div class="right P_R" id="P_R"><img id="PRidle" src="'+PRidle+'"/><img id="PRactive" class="active" src="'+PRactive+'"/></div>',

                '<div class="left E_L" id="E_L"><img id="ELidle" src="'+ELidle+'"/><img id="ELactive" class="active" src="'+ELactive+'"/></div><div class="center"></div><div class="right E_R" id="E_R"><img id="ERidle" src="'+ERidle+'"/><img id="ERactive" class="active" src="'+ERactive+'"/></div>',

                '<div class="left W_L" id="W_L"><img id="WLidle" src="'+WLidle+'"/><img id="WLactive" class="active" src="'+WLactive+'"/></div><div class="center"></div><div class="right W_R" id="W_R"><img id="WRidle" src="'+WRidle+'"/><img id="WRactive" class="active" src="'+WRactive+'"/></div>',
                ].join('\n');
            document.body.appendChild(swipeWrapper);

            this.T_L = $("#T_L"); this.T_R = $("#T_R");
            this.A_L = $("#A_L"); this.A_R = $("#A_R");
            this.P_L = $("#P_L"); this.P_R = $("#P_R");
            this.E_L = $("#E_L"); this.E_R = $("#E_R");
            this.W_L = $("#W_L"); this.W_R = $("#W_R");

            var HIDInterface = context.root._children[0].script.HIDInterface;


            this.T_L.swipe({
                tap:function(event, target) {
                  //console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);

                  jtarget.addClass('T_L_active');
                  console.log("jtarget.children ", jtarget.children(".active"));
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_T', -1, 0, 0);
                },
                hold:function(event, target) {
                  //anything here is ontouchstart
                  this.T_LH = true;
                  console.log("tap start ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  //jtarget.children().attr('src', TLactive)
                  jtarget.addClass('T_L_active');
                  jtarget.on('touchend', function(){
                    //anything here is ontouchend
                    console.log("tap end ", event, " target ", target);
                    this.T_LH = false;
                    $(this).removeClass('T_L_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("event", event);
                  //console.log("You swiped T_L" + " distance " + -distance, " duration " + duration);  
                  HIDInterface.moved_T(-1,-distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  //jtarget.children().attr('src', TLidle)
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('T_L_active');
                  
                },
                //threshold:75
                longTapThreshold:0
            });

            this.T_R.swipe({
                tap:function(event, target) {
                  console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);

                  jtarget.addClass('T_R_active');
                  console.log("jtarget.children ", jtarget.children(".active"));
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_T', 1, 0, 0);
                },
                hold:function(event, target) {
                  //console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('T_R_active');
                  jtarget.on('touchend', function(){
                    //anything here is ontouchend
                    $(this).removeClass('T_R_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("event", event);
                  //console.log("You swiped T_L" + " distance " + -distance, " duration " + duration);  
                  HIDInterface.moved_T(1,distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('T_R_active');
                },
                //threshold:0
                longTapThreshold:0
            });

            this.A_L.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('A_L_active');
                  console.log("jtarget.children ", jtarget.children(".active"));
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_A', -1, 0, 0);
                },
                hold:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('A_L_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('A_L_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped A_L" + " distance " + -distance, " duration " + duration);  
                  HIDInterface.moved_A(-1,-distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('A_L_active');
                },
                longTapThreshold:0
            });

            this.A_R.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('A_R_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_A', 1, 0, 0);
                },
                hold:function(event, target) {
                  //console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('A_R_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('A_R_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped A_R" + " distance " + distance, " duration " + duration); 
                  HIDInterface.moved_A(1,distance/50,(distance/50)/duration); 
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('A_R_active');
                },
                longTapThreshold:0
            });

            this.P_L.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('P_L_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_P', -1, 0, 0);
                },
                hold:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('P_L_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('P_L_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped P_L" + " distance " + -distance, " duration " + duration);  
                  HIDInterface.moved_P(-1,-distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('P_L_active');
                },
                longTapThreshold:0
            });

            this.P_R.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('P_R_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_P', 1, 0, 0);
                },
                hold:function(event, target) {
                  //console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('P_R_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('P_R_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped P_R" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_P(1,distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('P_R_active');
                },
                longTapThreshold:0
            });

            this.E_L.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('E_L_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_E', -1, 0, 0);
                },
                hold:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('E_L_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('E_L_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped E_L" + " distance " + -distance, " duration " + duration); 
                  HIDInterface.moved_E(-1,-distance/50,(distance/50)/duration); 
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('E_L_active');
                },
                longTapThreshold:0
            });

            this.E_R.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('E_R_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_E', 1, 0, 0);
                },
                hold:function(event, target) {
                  //console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('E_R_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('E_R_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped E_R" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moved_E(1,distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('E_R_active');
                },
                longTapThreshold:0
            });

            this.W_L.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('W_L_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_W', -1, 0, 0);
                },
                hold:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('W_L_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('W_L_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount, fingerData) {
                  //console.log("You swiped W_L" + " distance " + -distance, " duration " + duration);  
                  HIDInterface.moving_W(-1,-distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('W_L_active');
                },
                longTapThreshold:0
            });

            this.W_R.swipe({
                tap:function(event, target) {
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('W_R_active');
                  var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                  stringPull.script.send('HIDInterface', 'moving_W', 1, 0, 0);
                },
                hold:function(event, target) {
                  //console.log("tap event ", event, " target ", target);
                  var jtarget = $(target);
                  jtarget.children(".active").css('opacity', 0.8);
                  jtarget.addClass('W_R_active');
                  jtarget.on('touchend', function(){
                    $(this).removeClass('W_R_active');
                  });
                },
                //Generic swipe handler for all directions
                swipeRight:function(event, direction, distance, duration, fingerCount, fingerData) {
                  console.log("You swiped W_R" + " distance " + distance, " duration " + duration);  
                  HIDInterface.moving_W(1,distance/50,(distance/50)/duration);
                  var jtarget = $(event.srcElement);
                  jtarget.children(".active").css('opacity', 0);
                  jtarget.removeClass('W_R_active');
                },
                longTapThreshold:0
            });


            var t2 = new Date();
            debug.log(DEBUG.INIT, "swipeWrapper initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            if (this.T_LH) {
              console.log("holdingTL");
                var stringPull = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                    stringPull.script.send('HIDInterface', 'moving_T', -1, 0, 0);
            }
        },
        

    };

    return SwipeInterface;
});