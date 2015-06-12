///
// Description: This is the control the shell
///
pc.script.attribute('has_hardware', 'boolean', false);

pc.script.create('game', function (context) {
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        
        this.ROOTS = [
            '371485.json', // Menu
            '365042.json', // Calibration
            //'371102.json', // Tutorial
            '350057.json'  // Rv1-stable
        ];

        this.currentRootIndex = 0;
        this.enableBGM = false;
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.loadRoot(0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        loadNextRoot: function () {
            if(this.has_hardware) {
                this.unloadRoot();
                
                if (this.currentRootIndex === this.ROOTS.length) {
                    this.currentRootIndex = 0;
                }
                this.currentRootIndex++;
                this.loadRoot(this.currentRootIndex);
            }
            else this.loadMainGame();
        },

        reset: function () {
            this.unloadRoot();
            this.loadRoot(0);
        },
        
        unloadRoot: function () {
            // Destroy all Entities and components created from the previous Pack.
            console.log('currentRoot to destroy', context.root._children[1]);
            context.root._children[1].destroy();
        },
        
        loadRoot: function (index) {
            context.loadSceneHierarchy(this.ROOTS[index]);
            this.currentRootIndex = index;
            console.log("currentRoot loading", index, context.root);
        },

        loadMainGame: function () {
            // hacky, no reference back to Shell
            context.destroy();

            canvas = createCanvas();
            devices = createInputDevices(canvas);
            app = new pc.Application(canvas, {
                keyboard: devices.keyboard,
                mouse: devices.mouse,
                gamepads: devices.gamepads,
                touch: devices.touch
            });

            app.configure(CONFIG_FILENAME, function (err) {
                if (err) {
                    console.error(err);
                }

                configureCss(app._fillMode, app._width, app._height);
                reflow();


                app.loadScene(this.ROOTS[this.ROOTS.length-1], function (err, scene) {
                    if (err) {
                        console.error(err);
                    }
                    app.start();
                });
            
            });
        }
    };

    return Game;
});