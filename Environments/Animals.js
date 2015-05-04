///
// Description: ANIMALS
///


pc.script.attribute('stackBuffer', 'number', 2); // change this number to optimal the buffer


pc.script.create('Animals', function (context) {
    // Creates a new Animal instance
    var Animals = function (entity) {
        this.entity = entity;
    };

    Animals.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
			var t1 = new Date();
			
			if (scripts === undefined) scripts = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script;
			
            this.animals = context.root.findByName("Animals");
            this.animal_stack = [];
			
			//Spawn initial set of animals
            var randomTiles = [];
            for (var s = ico.tiles.length-1; s >= 0; s--) randomTiles[s] = s;
			shuffleArray(randomTiles);
			
			for (var i = 0; i < randomTiles.length && this.animal_stack.length < this.stackBuffer; i++) {
				var tile = ico.tiles[randomTiles[i]];
				tile.spawnAnimal(tile.getTemperature(), 3.0);
			}
			
			var t2 = new Date();
			debug.log(DEBUG.INIT, "animal init time: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			for (var i = 0; i < this.animal_stack.length; i++) {
				if (this.animal_stack[i].destroyFlag) {
					var e = this.animal_stack[i];
					this.animal_stack.splice(i, 1);
					e.destroy();
				}
			}
        },
        
        makeAnimal: function(position, rotation, type, size) {
            var animalOrig, stats;
            // Temporarily only doing the first type, cause Nick is making new optimized models
            switch (0) {
                case 0:
                    animalOrig = this.animals.findByName("fox");
					stats = Tile.animalStats.fox;
                    break;
                case 1:
                    animalOrig = this.animals.findByName("pig");
					stats = Tile.animalStats.pig;
                    break;
                case 2:
                    animalOrig = this.animals.findByName("cow");
					stats = Tile.animalStats.cow;
                    break;
                default:
                    animalOrig = this.animals.findByName("fox");
					stats = Tile.animalStats.fox;
            }
            
            var animal = animalOrig.clone();
            this.entity.getParent().addChild(animal);
            
            animal.stats = stats;
            
            animal.size = size;
            animal.baseScale = animal.getLocalScale().x;
            var s = size * animal.baseScale;
            animal.setLocalScale(s, s, s);
            animal.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
            animal.setPosition(position);
            
            animal.enabled = true;
			animal.destroyFlag = false;
            this.animal_stack.push(animal);
			return animal;
        },
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Animals;
});