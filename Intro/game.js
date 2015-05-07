pc.script.create('game', function (context) {
    // Creates a new Game instance
    var Game = function (entity) {
        this.entity = entity;
        
        this.LEVELS = [
            365042, // intro
            350057 // Rv1-stable
        ];
    };

    Game.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.currentPack = null;
            this.loadLevel(0);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        },
        
        completeLevel: function (level) {
            this.unloadLevel(level-1);
            if (level === this.LEVELS.length) {
                level = 0;
            }
            this.loadLevel(level);
        },
        
        unloadLevel: function () {
            // Destroy all Entities and components created from the previous Pack.
            this.currentPack.hierarchy.destroy(context.systems);
            this.currentPack = null;
        },
        
        loadLevel: function (index) {
            var self = this;
            var pack = this.LEVELS[index];
    
            // Create a request for a Pack, using the Pack GUID as the identifier.
            var request = new pc.resources.PackRequest(pack);
            console.log('request',request);
            // Make the request through the Resource Loader
            context.loader.request(request).then(function (resources) {
                // resources[0] is a loaded pc.fw.Pack object
                var pack = resources[0];
                
                self.currentPack = pack;
                
                // pack.hierarchy is the Entity hierarchy, you need to add this to the main hierarchy
                context.root.addChild(pack.hierarchy);
                
                // This should be done for you, but for now you need to 
                // initialise any systems with an initialize() method after pack is loaded
                pc.fw.ComponentSystem.initialize(pack.hierarchy);
            });
        }
    };

    return Game;
});