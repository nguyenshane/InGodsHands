pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
    };

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            //console.log(ico.tiles[0]);
            // create mesh
            this.tile = ico.tiles[4600];
            this.entity.setLocalScale(1,20,1);
            //console.log(this.entity.model);
            //this.entity.addChild(node);
            
            
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //this.moveRandom();
            //console.log("tile normal: " + this.tile.normal);
            //this.entity.setLocalEulerAngles(this.tile.normal); 
            this.entity.setPosition(Globe.ico.vertices[this.tile.vertexIndices[0] * 3 + 0], 
                                    Globe.ico.vertices[this.tile.vertexIndices[0] * 3 + 1], 
                                    Globe.ico.vertices[this.tile.vertexIndices[0] * 3 + 2]);

            var p = this.entity.getPosition();
            //console.log("Test Position: (" + p.x + ", " + p.y + ", " + p.z + ")");
            //console.log("Tile Position: (" +ico.vertices[this.tile.vertexIndices[0] * 3 + 0] + ", " + 
            //                                ico.vertices[this.tile.vertexIndices[0] * 3 + 1] + ", " + 
            //                                ico.vertices[this.tile.vertexIndices[0] * 3 + 2] + ")");
            //console.log("Player entity: " + p);
          
        },
        
        moveRandom: function() {
            var rand = Math.random();
            //console.log("Testing moveRandom()");
            if (rand < .033) {
                //console.log("Neighbora Position: (" + ico.vertices[this.tile.neighbora.vertexIndices[0] * 3 + 0] + ", " + ico.vertices[this.tile.neighbora.vertexIndices[0] * 3 + 1] + ", " + ico.vertices[this.tile.neighbora.vertexIndices[0] * 3 + 2] + ")");
                this.tile = this.tile.neighbora;
            } else if (rand < .066) {
                //console.log("Neighborb Position: (" + ico.vertices[this.tile.neighborb.vertexIndices[0] * 3 + 0] + ", " + ico.vertices[this.tile.neighborb.vertexIndices[0] * 3 + 1] + ", " + ico.vertices[this.tile.neighborb.vertexIndices[0] * 3 + 2] + ")");
                this.tile = this.tile.neighborb;
            } else if (rand < .099) {
                //console.log("Neighborc Position: (" + ico.vertices[this.tile.neighborc.vertexIndices[0] * 3 + 0] + ", " + ico.vertices[this.tile.neighborc.vertexIndices[0] * 3 + 1] + ", " + ico.vertices[this.tile.neighborc.vertexIndices[0] * 3 + 2] + ")");
                this.tile = this.tile.neighborc;
            }
        }
    };

    return Tribe;
});