pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
        this.population = 1;
        this.idealTemperature = 65;
        this.tile;
        this.destinationTile;
        //this.currTileTemperature = 90;
        this.rules = [];
        var deltaVec;
    };

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            deltaVec = new pc.Vec3();

            // create mesh
            this.tile = ico.tiles[21]; // list of tiles
            this.entity.setPosition(this.tile.center);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalScale(.5, .5, .5);

            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();

            //this.currTileTemperature = this.tile.temperature;
            this.createRuleList();
            console.log(this.currTileTemperature);
            this.destinationTile = ico.tiles[0];
            console.log("Current tile pos: " + this.entity.getPosition().toString() +  " dest tile pos: " + this.destinationTile.center.toString());

            // A shader definition used to create a new shader.
            var shaderDefinition = {
                attributes: {
                    aPosition: pc.SEMANTIC_POSITION,
                    aUv0: pc.SEMANTIC_TEXCOORD0
                },
                vshader: [
                    "attribute vec3 aPosition;",
                    "attribute vec2 aUv0;",
                    "",
                    "uniform mat4 matrix_model;",
                    "uniform mat4 matrix_viewProjection;",
                    "",
                    "varying vec3 fPosition;",
                    "",
                    "void main(void)",
                    "{",
                    "    fPosition = aPosition;",
                    "    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);",
                    "}"
                ].join("\n"),
                fshader: [
                    "precision " + context.graphicsDevice.precision + " float;",
                    "",
                    "varying vec3 fPosition;",
                    "",
                    "//uniform sampler2D uDiffuseMap;",
                    "//uniform sampler2D uHeightMap;",
                    "uniform vec3 sunDir;",
                    "uniform float ambient;",
                    "",
                    "void main(void)",
                    "{",
                    "    float intensity = max(dot(normalize(fPosition), normalize(sunDir)), ambient);",
                    "    vec4 color = intensity * vec4(1.0, 0.0, 0.0, 1.0);",
                    "    gl_FragColor = color;",
                    "}"
                ].join("\n")
            };

            
            // Create the shader from the definition
            this.shader = new pc.Shader(context.graphicsDevice, shaderDefinition);
        
            // Create a new material and set the shader
            this.material = new pc.Material();
            this.material.setShader(this.shader);

            this.material.setParameter('sunDir', [sun.localRotation.x, sun.localRotation.y, sun.localRotation.z]);

            console.log(this);
            this.entity.model.data.model.meshInstances[0].material = this.material;


        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            // Rules system is run through each from, sorted by weight
            // if the NPC is moving to another tile, moveTo is called instead

            this.rules.sort(function(a, b){return b.weight-a.weight});
            if(this.tile.equals(this.destinationTile)){
                for(var i = 0; i < this.rules.length; i++){
                    if(this.rules[i].testConditions(this)){
                        this.rules[i].consequence(this);
                    }
                }
            } else {
                this.moveTo();
            }

            // Set lighting in shader
            this.material.setParameter('sunDir', [sun.localRotation.x, sun.localRotation.y, sun.localRotation.z]);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            //this.entity.setLocalEulerAngles(this.rotation.x, this.rotation.y, this.rotation.z);
            //this.entity.rotateLocal(90, 0, 0);
        },

        // Called every movement frame, lerps from one tile center to the next
        moveTo: function() {
            deltaVec.lerp(this.entity.getPosition(), this.destinationTile.center, .1);
            this.entity.setPosition(deltaVec);   
            //console.log("Curr pos: " + this.entity.getPosition().x);
            //console.log("dest pos: " + this.destinationTile.center.x);


            // Once tribe is at next tile's center, movement is done.
            if(this.atDestination()){
                this.tile = this.destinationTile;
            }
        },

        setDestination: function(destination) {
            this.destinationTile = destination;
        },

        atDestination: function() {
            if( this.entity.getPosition().x <= (this.destinationTile.center.x - .1) &&
                this.entity.getPosition().y <= (this.destinationTile.center.y - .1) &&
                this.entity.getPosition().z <= (this.destinationTile.center.z - .1) ){

                this.entity.setPosition(this.destinationTile.center);
                return true;
            } else {
                return false;
            }
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