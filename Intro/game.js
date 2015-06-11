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
            '365042.json', // Calibration, is taken out if has_hardware = false
            '350057.json'  // Rv1-stable
        ];

        this.currentRootIndex = 0;
        this.enableBGM = false;
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            if(!this.has_hardware) {
                this.ROOTS.splice(1,1);
                console.log("Doesn't have hardware, ROOTS are", this.ROOTS);
            }
            // always load the menu first
            this.loadRoot(0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        loadNextRoot: function () {
            this.unloadRoot();
            
            if (this.currentRootIndex === this.ROOTS.length) {
                this.currentRootIndex = 0;
            }
            this.currentRootIndex++;
            this.loadRoot(this.currentRootIndex);
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
        }
    };

    return Game;
});