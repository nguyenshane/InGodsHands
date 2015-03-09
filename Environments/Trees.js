///
// Description: TREES
///

pc.script.attribute('stackBuffer', 'number', 50); // change this number to optimal the buffer

pc.script.create('Trees', function (context) {
    // Creates a new Tree instance
    var Trees = function (entity) {
        this.entity = entity;
    };

    Trees.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
			if (scripts === undefined) scripts = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script;
			
            this.trees = context.root.findByName("Trees");
            this.trees_stack = [];
			
			//Spawn initial set of trees
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
					tile.spawnTree();
				} else noOcean = true;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			for (var i = 0; i < this.trees_stack.length; i++) {
				if (this.trees_stack[i].destroyFlag) {
					var e = this.trees_stack[i];
					this.trees_stack.splice(i, 1);
					e.destroy();
				}
			}
			
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
			if (this.trees_stack.length < this.stackBuffer) {
				var e = this.trees.clone(); // Clone Trees
				
				this.entity.getParent().addChild(e); // Add it as a sibling to the original
				
				var treetype = Math.floor((Math.random() * 2) + 0);
				var tree;
				switch (treetype) {
					case 0:
						tree = e.findByName("tree1");
						break;
					case 1:
						tree = e.findByName("tree2");
						break;
					default:
						tree = e.findByName("tree1");
				}
				
				var scale = Math.floor((Math.random() * 2) + 1.3)/8;
				tree.setLocalScale(scale, scale, scale);
				tree.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
				tree.setPosition(position);
				
				tree.enabled = true;
				e.destroyFlag = false;
				this.trees_stack.push(e);
				return e;
			}
        },
        
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Trees;
});