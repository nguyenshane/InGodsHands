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
			var t1 = new Date();
			
            this.animals = context.root.findByName("Animals");
            this.animal_stack = [];
			
			//Spawn initial set of animals
            var randomTiles = [];
            for (var s = ico.tiles.length-1; s >= 0; s--) randomTiles[s] = s;
			shuffleArray(randomTiles);
			
			for (var i = 0; i < randomTiles.length && this.animal_stack.length < this.stackBuffer; i++) {
				var tile = ico.tiles[randomTiles[i]];
				
				if (!tile.isOcean && !tile.hasAnimal) {
					//Add a new animal to the tile
					var normal = new pc.Vec3(tile.normal.x, tile.normal.y, tile.normal.z);
                    var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
                    var angle = m.getEulerAngles();
                    
                    tile.animal = this.makeAnimal(tile.center, angle);
					tile.hasAnimal = true;;
				}
			}
			
			/*
            var noOcean = false;
            while (this.animal_stack.length < this.stackBuffer && !noOcean) {
                shuffleArray(randomTiles);
                
                var tile = ico.tiles[randomTiles[0]];
                for (var i = 1; i < ico.tiles.length && (tile.isOcean); i++) {
                    tile = ico.tiles[randomTiles[i]];
                }
                
                if (!tile.isOcean) {
                    var normal = new pc.Vec3(tile.normal.x, tile.normal.y, tile.normal.z);
                    normal.normalize();
                    var center = new pc.Vec3(tile.center.x, tile.center.y, tile.center.z);
                    center.normalize();
                    multScalar(center, 2);
                    normal.add(center);
                    
                    var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
                    var angle = m.getEulerAngles();
                    
                    this.makeAnimal(tile.center, angle);
                } else noOcean = true;
            }
			*/
			
            /*
            while (this.animal_stack.length < this.stackBuffer){
                var x = Math.floor((Math.random() * 360) + 0);
                var z = Math.floor((Math.random() * 360) + 0);
                var y = Math.floor((Math.random() * 360) + 0);
                //console.log("here", x,z);
                this.makeAnimal(x, y, z);
            }*/
			
			var t2 = new Date();
			console.log("animal initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var destroyFailed = false;
            while (this.animal_stack.length >= this.stackBuffer && !destroyFailed) {
                var e = this.animal_stack.shift();
                var destroyable = this.checkDestroyable(e);
                
                if (destroyable) e.destroy();
                else {
                    this.animal_stack.unshift(e);
                    destroyFailed = true;
                }
            }
        },
        
        makeAnimal: function(position, rotation) {
            var e = this.animals.clone(); // Clone Animal
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            
            var animaltype = Math.floor((Math.random() * 3) + 0);
            var animal;
            switch (animaltype) {
                case 0:
                    animal = e.findByName("fox");
					e.stats = Tile.animalStats.fox;
                    break;
                case 1:
                    animal = e.findByName("pig");
					e.stats = Tile.animalStats.pig;
                    break;
                case 2:
                    animal = e.findByName("cow");
					e.stats = Tile.animalStats.cow;
                    break;
                default:
                    animal = e.findByName("fox");
					e.stats = Tile.animalStats.fox;
            }

            animal.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
            animal.setPosition(position);
            animal.enabled = true;

            this.animal_stack.push(e);
			return e;
        },
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Animals;
});