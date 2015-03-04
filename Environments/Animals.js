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

            var randomTiles = [];
            for (var size = ico.tiles.length-1; size >= 0; size--) randomTiles[size] = size;
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
            /*
            while (this.animal_stack.length < this.stackBuffer){
                var x = Math.floor((Math.random() * 360) + 0);
                var z = Math.floor((Math.random() * 360) + 0);
                var y = Math.floor((Math.random() * 360) + 0);
                //console.log("here", x,z);
                this.makeAnimal(x, y, z);
            }*/



        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //var x = Math.floor((Math.random() * 360) + 0);
            //var z = Math.floor((Math.random() * 360) + 0);
			
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
            var e = this.animals.clone(); // Clone Atmosphere
            //console.log('called');
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            

            //console.log(this.animal_stack);
            
            var animaltype = Math.floor((Math.random() * 3) + 0);
            var animal;

            // if(animaltype == 0)
            //     animal = e.findByName("fox");
            // else animal = e.findByName("pig");

            switch (animaltype) {
                case 0:
                    animal = e.findByName("fox");
                    break;
                case 1:
                    animal = e.findByName("pig");
                    break;
                case 2:
                    animal = e.findByName("cow");
                    break;
                default:
                    animal = e.findByName("fox");
            }

            animal.rotate(rotation.x - 90, rotation.y, rotation.z);
            animal.setPosition(position);
            animal.enabled = true;

            this.animal_stack.push(e);
        },
        
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Animals;
});