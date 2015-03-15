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
			//if (treeDensity === undefined) treeDensity = 0.35;
			
            this.trees = context.root.findByName("Trees");
            this.trees_stack = [];
			
			//Spawn initial set of trees
            var randomTiles = [];
            for (var s = ico.tiles.length-1; s >= 0; s--) randomTiles[s] = s;
			shuffleArray(randomTiles);
			
			for (var i = 1; i < ico.tiles.length; i++) {
				var tile = ico.tiles[randomTiles[i]];
				tile.spawnTree(tile.getTemperature(), Math.floor((Math.random() * 2) + 1.3)/8);
			}
			
			/*
            var noOcean = false;
            while (this.trees_stack.length < this.stackBuffer && !noOcean) {
                shuffleArray(randomTiles);
                
                var tile = ico.tiles[randomTiles[0]];
                for (var i = 1; i < ico.tiles.length && (tile.isOcean || tile.hasTree); i++) {
                    tile = ico.tiles[randomTiles[i]];
                }
                
                if (!tile.isOcean && !tile.hasTree) {
					tile.createTree();
				} else noOcean = true;
            }
			*/
			
			var t2 = new Date();
			
			console.log("tree init time: " + (t2-t1));
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
        
        makeTree: function(position, rotation, type, size) {
			if (this.trees_stack.length < this.stackBuffer) {
				var e = this.trees.clone(); // Clone Trees
				
				this.entity.getParent().addChild(e); // Add it as a sibling to the original
				
				//var treetype = Math.floor((Math.random() * 2) + 0);
				var tree;
				switch (type) {
					case 0:
						tree = e.findByName("tree1");
						e.stats = Tile.treeStats.tree1;
						/*
						e.minTemp = 20;
						e.maxTemp = 70;
						e.idealTemp = 50;
						e.minWater = 50;
						e.maxWater = 100;
						e.idealWater = 80;
						e.waterUsage = 1.0;
						*/
						break;
					case 1:
						tree = e.findByName("tree2");
						e.stats = Tile.treeStats.tree2;
						/*
						e.minTemp = 50;
						e.maxTemp = 95;
						e.idealTemp = 75;
						e.minWater = 30;
						e.maxWater = 100;
						e.idealWater = 50;
						e.waterUsage = 0.6;
						*/
						break;
					default:
						tree = e.findByName("tree1");
						e.stats = Tile.treeStats.tree1;
						/*
						e.minTemp = 30;
						e.maxTemp = 80;
						e.idealTemp = 55;
						e.minWater = 40;
						e.maxWater = 60;
						e.idealWater = 50;
						e.waterUsage = 1.0;
						*/
				}
				
				//var scale = Math.floor((Math.random() * 2) + 1.3)/8;
				tree.setLocalScale(size, size, size);
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