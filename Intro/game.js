pc.script.create('game', function (context) {
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        
        this.ROOTS = [
            '365042.json', // intro
            //'371102.json', // Tutorial
            '350057.json'  // Rv1-stable
        ];

        this.currentRoot = null;
        this.currentRootIndex = 0;
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
            //this.currentRoot = context.root._children[index+1]; //jump over the Shell
            console.log("currentRoot loading", index, context.root);
        }
    };

    return Game;
});