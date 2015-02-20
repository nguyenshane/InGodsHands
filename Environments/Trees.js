///
// Description: This is the Atmosphere Particle Effects
///

pc.script.attribute('stackBuffer', 'number', 5); // change this number to optimal the buffer


pc.script.create('trees', function (context) {
    // Creates a new Atmosphere instance
    var Trees = function (entity) {
        this.entity = entity;
        
    };

    Trees.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.trees = context.root.findByName("Trees");
            this.trees_stack = [];
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var x = Math.floor((Math.random() * 360) + 0);
            var z = Math.floor((Math.random() * 360) + 0);
            
            if (this.trees_stack.length < this.stackBuffer ){
                //this.makeTree(x,0,z);
                var tile = ico.tiles[Math.floor(Math.random() * ico.tiles.length)];
                while (tile.isOcean) {
                    tile = ico.tiles[Math.floor(Math.random() * ico.tiles.length)];
                }
                console.log(tile);
                //x = tile.getRotationAlignedWithPrimitiveCenter().x;
                //z = tile.getRotationAlignedWithPrimitiveCenter().z;
                console.log(tile.getRotationAlignedWithNormal());
                this.makeTree(x,0,z);
            }
            
            
            if (this.trees_stack.length >= this.stackBuffer){
                var e = this.trees_stack.shift();
                var destroyable = this.checkDestroyable(e);
                
                if (destroyable) e.destroy();
                else this.trees_stack.unshift(e)
            }
            
        },
        
        makeTree: function(x,y,z) {
            var e = this.trees.clone(); // Clone Atmosphere
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            
            e.rotateLocal(x, y, z);

            var x = Math.floor((Math.random() * 360) + 0);
            var z = Math.floor((Math.random() * 360) + 0);
            
            var treetype = Math.floor((Math.random() * 2) + 0);
            console.log("treetype", treetype)

            if(treetype == 0)
                e.findByName("tree1").enabled = true;
            else e.findByName("tree2").enabled = true;
            
            
            this.trees_stack.push(e);
        },
        
        
        checkDestroyable: function(e) {            
            return false;
            
        },
    };

    return Trees;
});