///
// Description: TREES
///

pc.script.attribute('stackBuffer', 'number', 50); // change this number to optimal the buffer


pc.script.create('trees', function (context) {
    // Creates a new Tree instance
    var Trees = function (entity) {
        this.entity = entity;
    };

    Trees.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.trees = context.root.findByName("Trees");
            this.trees_stack = [];
			
            var randomTiles = [];
            for (var size = ico.tiles.length-1; size >= 0; size--) randomTiles[size] = size;
            var noOcean = false;
            while (this.trees_stack.length < this.stackBuffer && !noOcean) {
                shuffleArray(randomTiles);
                
                var tile = ico.tiles[randomTiles[0]];
                for (var i = 1; i < ico.tiles.length && (tile.isOcean || tile.hasTree); i++) {
                    tile = ico.tiles[randomTiles[i]];
                }
                
                if (!tile.isOcean && !tile.hasTree) {
					var normal = new pc.Vec3(tile.normal.x, tile.normal.y, tile.normal.z);
					normal.normalize();
					var center = new pc.Vec3(tile.center.x, tile.center.y, tile.center.z);
					center.normalize();
					multScalar(center, 2);
					normal.add(center);
					
					var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
					var angle = m.getEulerAngles();
					
					this.makeTree(tile.center, angle);
					tile.hasTree = true;
				} else noOcean = true;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
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
        
        makeTree: function(position, rotation) {
            var e = this.trees.clone(); // Clone Atmosphere
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
            var treetype = Math.floor((Math.random() * 2) + 0);
            var tree;
            if (treetype == 0) tree = e.findByName("tree1");
            else tree = e.findByName("tree2");
			
            var scale = Math.floor((Math.random() * 2) + 1.3)/5;
            tree.setLocalScale(scale, scale, scale);
			tree.rotate(rotation.x - 90, rotation.y, rotation.z);
			tree.setPosition(position);
			
			tree.enabled = true;
            this.trees_stack.push(e);
        },
        
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Trees;
});