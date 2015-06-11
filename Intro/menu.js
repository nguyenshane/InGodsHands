///
// Description: This is the control input for swipe
///
pc.script.attribute('menuAsset', 'asset', []);

pc.script.create('menu', function (context) {
    // Creates a new TestString instance
    var Menu = function (entity) {
        this.entity = entity;
        pc.events.attach(this);

        this.activateStart = false;
        this.lightIntesity = 32;
    };

    Menu.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var t1 = new Date();

            var css = function () {/*
              .menuWrapper{
                  z-index: 0;
                  position: absolute;
                  top: 25%;
                  left: 40%;
                  width: 20%;
                  opacity: 1;
                  -webki-totuch-callout: none;
                  -webkit-user-select: none; 
              }
              .btn {
                  background: #304c50;
                  background-image: -webkit-linear-gradient(top, #304c50, #000000);
                  background-image: -moz-linear-gradient(top, #304c50, #000000);
                  background-image: -ms-linear-gradient(top, #304c50, #000000);
                  background-image: -o-linear-gradient(top, #304c50, #000000);
                  background-image: linear-gradient(to bottom, #304c50, #000000);
                  -webkit-border-radius: 11;
                  -moz-border-radius: 11;
                  border-radius: 11px;
                  text-shadow: 1px 1px 3px #304c50;
                  font-family: Arial;
                  color: #ffffff;
                  font-size: 20px;
                  padding: 10px 20px 10px 20px;
                  text-decoration: none;
                  border: none;
                  margin: 20px;
                  text-align: center;
              }
              .btn:hover {
                  background: #304c50;
                  text-decoration: none;
              }
              .logo {
                  width:100%;
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
            var logo_img = context.assets.find("logo", "texture").getFileUrl();
            var menuWrapper = document.createElement('div');
            menuWrapper.className = 'menuWrapper';
            menuWrapper.innerHTML = [
                '<img class="logo" id="logo" src="'+logo_img+'"/>',
                '<div class="btn start" id="start">Start</div>'
                ].join('\n');
            document.body.appendChild(menuWrapper);

            this.start_button = $("#start");
            this.logo = $("#logo");

            //var HIDInterface = context.root.findByName("Rv1-stable").script.HIDInterface;
            //this.HIDInterface = HIDInterface;
            var self = this;
            //this.audio = context.root.findByName("Rv1-stable").script.AudioController;
            this.shell = context.root.findByName("Shell");

            //this.menuWrapper = $(".menuWrapper");
            this.spotLight = context.root.findByName("SpotLight");
            this.start_button.click(function(){
              self.start_button.fadeOut();
              self.logo.fadeOut();
              self.activateStart = true;
            });

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(this.lightIntesity == 0){
              console.log("go to tutorial");
              this.activateStart = false;
              this.shell.script.game.loadNextRoot();
            }

            if(this.activateStart) {
              this.spotLight.light.intensity = this.lightIntesity--;
            }
        },



    };
    return Menu;
});