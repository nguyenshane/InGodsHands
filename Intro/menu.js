///
// Description: This is the control input for swipe
///
pc.script.attribute('menuAsset', 'asset', []);

pc.script.create('menu', function (context) {
    // Creates a new TestString instance
    var Menu = function (entity) {
        this.entity = entity;
        pc.events.attach(this);

    };

    Menu.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var t1 = new Date();

            var css = function () {/*
              .menuWrapper{
                  z-index: 0;
                  position: relative;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  opacity: 0.65;
                  -webki-totuch-callout: none;
                  -webkit-user-select: none; 
              }
              .button{
                  height:20%;
                  width: 30%;
                  background: none;
                  float:left;
                  box-shadow: none;
                  position: relative;
                  -webki-totuch-callout: none;
                  -webkit-user-select: none; 
              }
              
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
        
            var menuWrapper = document.createElement('div');
            menuWrapper.className = 'menuWrapper';
            menuWrapper.innerHTML = [
                '<div class="button start" id="start">Start</div>',
                '<div class="button tutorial" id="tutorial">Tutorial</div>'
                ].join('\n');
            document.body.appendChild(menuWrapper);

            this.start_button = $("#start");
            this.tutorial_button = $("#tutorial");

            var HIDInterface = context.root.findByName("Rv1-stable").script.HIDInterface;
            this.HIDInterface = HIDInterface;
            var self = this;
            var audio = context.root.findByName("Rv1-stable").script.AudioController;
            var shell = context.root.findByName("Shell");
            this.audio = audio;
            this.menuWrapper = $(".menuWrapper");
            this.menuWrapper.swipe({
                hold:function(event, target) {
                  if(shell.script.game.enableBGM === false){
                    audio.backgroundmusic.playPause();
                    shell.script.game.enableBGM = true;
                  }
                },
                //threshold:75
                longTapThreshold:0
            }),

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

        },



    };
    return Menu;
});