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
				tile.spawnAnimal(tile.getTemperature(), 1.0);
			}
			
			var t2 = new Date();
			console.log("animal init time: " + (t2-t1));
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
            var e = this.animals.clone(); // Clone Animal
			
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
            var animal;
            switch (type) {
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
			
			//animal.setLocalScale(size, size, size);
            animal.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
            animal.setPosition(position);
			
            animal.enabled = true;
			e.destroyFlag = false;
            this.animal_stack.push(e);
			return e;
        },
        
        checkDestroyable: function(e) {            
            return false;
        },
    };

    return Animals;
});