///
// Description: ANIMALS
///

pc.script.attribute('stackBuffer', 'number', 2); // change this number to optimal the buffer


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
            /*
            var randomTiles = [];
            for (var size = ico.tiles.length-1; size >= 0; size--) randomTiles[size] = size;
            var noOcean = false;
            while (this.animal_stack.length < this.stackBuffer && !noOcean) {
                shuffleArray(randomTiles);
                
                var tile = ico.tiles[randomTiles[0]];
                for (var i = 1; i < ico.tiles.length && tile.isOcean; i++) {
                    tile = ico.tiles[randomTiles[i]];
                }
                
                if (!tile.isOcean) this.makeAnimal(tile.getLatitude() - 90, -tile.getLongitude() - 90, 0);
                else noOcean = true;
            */
                //this.makeTree(x, 0, z);
            //}

            while (this.animal_stack.length < this.stackBuffer){
                var x = Math.floor((Math.random() * 360) + 0);
                var z = Math.floor((Math.random() * 360) + 0);
                var y = Math.floor((Math.random() * 360) + 0);
                console.log("here", x,z);
                this.makeAnimal(x, y, z);
            }



        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //var x = Math.floor((Math.random() * 360) + 0);
            //var z = Math.floor((Math.random() * 360) + 0);
			
            if (this.animal_stack.length >= this.stackBuffer) {
                var e = this.animal_stack.shift();
                var destroyable = this.checkDestroyable(e);
                
                if (destroyable) e.destroy();
                else {
					this.animal_stack.unshift(e);
				}
            }
        },
        
        makeAnimal: function(x,y,z) {
            var e = this.animals.clone(); // Clone Atmosphere
            console.log('called');
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            
            e.rotateLocal(x, y, z);
            console.log(this.animal_stack);
            
            var animaltype = Math.floor((Math.random() * 2) + 0);
            var animal;
            //console.log("treetype", treetype)

            if(animaltype == 0)
                animal = e.findByName("fox");
            else animal = e.findByName("pig");

            animal.enabled = true;
            var scale = Math.floor((Math.random() * 1.5) + 1.0) * animal.getLocalScale.x;
            animal.setLocalScale(scale, scale, scale);


            this.animal_stack.push(e);
            
        },
        
        
        checkDestroyable: function(e) {            
            return false;
            
        },
    };

    return Animals;
});