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
			var t1 = new Date();
			
			if (scripts === undefined) scripts = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script;
			
            this.trees = context.root.findByName("Trees");
            this.trees_stack = [];
			
			//Spawn initial set of trees
            var randomTiles = [];
            for (var s = ico.tiles.length-1; s >= 0; s--) randomTiles[s] = s;
			shuffleArray(randomTiles);
			
			for (var i = 0; i < randomTiles.length; i++) {
				var tile = ico.tiles[randomTiles[i]];
				tile.spawnTree(tile.getTemperature(), (Math.random() * 2) + 1.3);
			}
			
			var t2 = new Date();
			debug.log(DEBUG.INIT, "tree init time: " + (t2-t1));
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
			
			/*
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
			*/
        },
        
        makeTree: function(position, rotation, type, size) {
			if (this.trees_stack.length < this.stackBuffer) {
                var treeOrig, stats;
                switch (type) {
                    case 0:
						treeOrig = this.trees.findByName("tree1");
						stats = Tile.treeStats.tree1;
						break;
					case 1:
						treeOrig = this.trees.findByName("tree2");
						stats = Tile.treeStats.tree2;
						break;
					case 2:
						treeOrig = this.trees.findByName("tree4");
						stats = Tile.treeStats.tree4;
						break;
					case 3:
						treeOrig = this.trees.findByName("tree3");
						stats = Tile.treeStats.tree3;
						break;
					default:
						treeOrig = this.trees.findByName("tree1");
						stats = Tile.treeStats.tree1;
                }
                
                var tree = treeOrig.clone();
                this.entity.getParent().addChild(tree);
                
                tree.stats = stats;
                
                tree.size = size;
                tree.baseScale = tree.getLocalScale().x;
                var s = size * tree.baseScale;
                tree.setLocalScale(s, s, s);
                tree.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
                tree.setPosition(position);
                
                tree.enabled = true;
                tree.destroyFlag = false;
                this.trees_stack.push(tree);
                return tree;
			}
        },
        
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Trees;
});