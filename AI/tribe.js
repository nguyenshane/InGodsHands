pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
        this.population = 1;
        this.idealTemperature = 65;
        this.tile;      
        //this.currTileTemperature = 90;
        this.rules = [];
    };

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // create mesh
            this.tile = ico.tiles[5]; // list of tiles
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalScale(.5, .5, .5);
            // get list of rules from Rules.js on 'AI' object
            //this.rules = context.root.findByName('AI').script.Rules.tribeRules;
            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            //this.currTileTemperature = this.tile.temperature;
            this.createRuleList();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) { 
            this.rules.sort(function(a, b){return b.weight-a.weight});
            for(var i = 0; i < this.rules.length; i++){
                if(this.rules[i].testConditions(this)){
                    this.rules[i].consequence(this);
                }
            }
            //this.moveRandom();
            //this.entity.setPosition(ico.vertices[this.tile.vertexIndices[0] * 3 + 0], 
            //                        ico.vertices[this.tile.vertexIndices[0] * 3 + 1], 
            //                        ico.vertices[this.tile.vertexIndices[0] * 3 + 2]);
        },
        
        moveRandom: function() {
            var rand = Math.random();
            //console.log("Testing moveRandom()");
            if (rand < .033) {
                //console.log("Neighbora Position: (" + ico.vertices[this.tile.neighbora.vertexIndices[0] * 3 + 0] + ", " + ico.vertices[this.tile.neighbora.vertexIndices[0] * 3 + 1] + ", " + ico.vertices[this.tile.neighbora.vertexIndices[0] * 3 + 2] + ")");
                this.tile = this.tile.neighbora;
                this.rotation = this.tile.getRotationAlignedWithNormal();
                //console.log(this.rotation);
                this.entity.setLocalEulerAngles(this.rotation.x, this.rotation.y, this.rotation.z);
                this.entity.rotateLocal(90, 0, 0);

                //console.log(this.tile.normal);
            } else if (rand < .066) {
                //console.log("Neighborb Position: (" + ico.vertices[this.tile.neighborb.vertexIndices[0] * 3 + 0] + ", " + ico.vertices[this.tile.neighborb.vertexIndices[0] * 3 + 1] + ", " + ico.vertices[this.tile.neighborb.vertexIndices[0] * 3 + 2] + ")");
                this.tile = this.tile.neighborb;
                this.rotation = this.tile.getRotationAlignedWithNormal();
                //console.log(this.rotation);
                this.entity.setLocalEulerAngles(this.rotation.x, this.rotation.y, this.rotation.z);
                this.entity.rotateLocal(90, 0, 0);

                //console.log(this.tile.normal);
            } else if (rand < .099) {
                //console.log("Neighborc Position: (" + ico.vertices[this.tile.neighborc.vertexIndices[0] * 3 + 0] + ", " + ico.vertices[this.tile.neighborc.vertexIndices[0] * 3 + 1] + ", " + ico.vertices[this.tile.neighborc.vertexIndices[0] * 3 + 2] + ")");
                this.tile = this.tile.neighborc;
                this.rotation = this.tile.getRotationAlignedWithNormal();
                //console.log(this.rotation);
                this.entity.setLocalEulerAngles(this.rotation.x, this.rotation.y, this.rotation.z);
                this.entity.rotateLocal(90, 0, 0);
                
                //console.log(this.tile.normal);
            }
        },

        moveTo: function(destinationTile) {
            this.tile = destinationTile;
            this.entity.setPosition(ico.vertices[this.tile.vertexIndices[0] * 3 + 0], 
                                    ico.vertices[this.tile.vertexIndices[0] * 3 + 1], 
                                    ico.vertices[this.tile.vertexIndices[0] * 3 + 2]);
        },

        getPopulation: function() {
            return this.population;
        },

        getIdealTemperature: function() {
            return this.idealTemperature;
        },

        // Constructs the NPC's list of rules
        createRuleList: function() {
            this.rules.push(new wantToMoveNorthColder());
            this.rules.push(new wantToMoveNorthWarmer());
            this.rules.push(new wantToMoveSouthColder());
            this.rules.push(new wantToMoveSouthWarmer());
        }
    };

    return Tribe;
});