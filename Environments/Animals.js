///
// Description: This is the Atmosphere Particle Effects
///

pc.script.attribute('stackBuffer', 'number', 50); // change this number to optimal the buffer


pc.script.create('animals', function (context) {
    // Creates a new Animal instance
    var Animals = function (entity) {
        this.entity = entity;
        
    };

    Animals.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.animals = context.root.findByName("Animals");
            this.animal_stack = [];

            var randomTiles = [];
            for (var size = ico.tiles.length-1; size >= 0; size--) randomTiles[size] = size;
            var noOcean = false;
            while (this.trees_stack.length < this.stackBuffer && !noOcean) {
                shuffleArray(randomTiles);
                
                var tile = ico.tiles[randomTiles[0]];
                for (var i = 1; i < ico.tiles.length && tile.isOcean; i++) {
                    tile = ico.tiles[randomTiles[i]];
                }
                
                if (!tile.isOcean) this.makeTree(tile.getLatitude() - 90, -tile.getLongitude() - 90, 0);
                else noOcean = true;
                //this.makeTree(x, 0, z);
            }
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //var x = Math.floor((Math.random() * 360) + 0);
            //var z = Math.floor((Math.random() * 360) + 0);
			

			var destroyFailed = false;
            while (this.trees_stack.length >= this.stackBuffer && !destroyFailed) {
                var e = this.trees_stack.shift();
                var destroyable = this.checkDestroyable(e);
                
                if (destroyable) e.destroy();
                else {
					this.trees_stack.unshift(e);
					destroyFailed = true;
				}
            }
        },
        
        makeTree: function(x,y,z) {
            var e = this.trees.clone(); // Clone Atmosphere
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            
            e.rotateLocal(x, y, z);
            
            var treetype = Math.floor((Math.random() * 2) + 0);
            var tree;
            //console.log("treetype", treetype)

            if(treetype == 0)
                tree = e.findByName("tree1");
            else tree = e.findByName("tree2");

            tree.enabled = true;
            var scale = Math.floor((Math.random() * 2) + 1.3)/5;
            tree.setLocalScale(scale, scale, scale);

            this.trees_stack.push(e);
        },
        
        
        checkDestroyable: function(e) {            
            return false;
            
        },
    };

    return Animals;
});