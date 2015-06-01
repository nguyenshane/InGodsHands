pc.script.create('game', function (context) {
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        
        this.ROOTS = [
            '365042.json', // intro
            '350057.json' // Rv1-stable
        ];

        this.currentRoot = null;
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.loadRoot(1);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        loadNextRoot: function (level) {
            this.unloadRoot(level-1);
            if (level === this.LEVELS.length) {
                level = 0;
            }
            this.loadRoot(level);
        },

        reset: function () {
            this.unloadRoot();
            this.loadRoot(0);
        },
        
        unloadRoot: function () {
            // Destroy all Entities and components created from the previous Pack.
            console.log('currentRoot to destroy', this.currentRoot);
            this.currentRoot.destroy();
            this.currentRoot = null;
        },
        
        loadRoot: function (index) {
            console.log("scene", context.loadSceneHierarchy(this.ROOTS[index]));
        }
    };

    return Game;
});