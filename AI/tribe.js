pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
        this.population = 1;
        this.idealTemperature = 65;
        this.belief;
        this.tile;
        this.destinationTile;
        this.rules = [];
        var deltaVec;
    };

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            deltaVec = new pc.Vec3();

            // create mesh
            this.tile = ico.tiles[0]; // list of tiles
            this.calculateFood()

            this.entity.setPosition(this.tile.calculateCenter());
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalScale(.5, .5, .5);

            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();

            //this.currTileTemperature = this.tile.temperature;
            this.createRuleList();
            this.destinationTile = ico.tiles[0];
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            // Rules system is run through each from, sorted by weight
            // if the NPC is moving to another tile, moveTo is called instead
            this.rules.sort(function(a, b){return b.weight - a.weight});
            if(this.tile.equals(this.destinationTile)){
                for(var i = 0; i < this.rules.length; i++){
                    if(this.rules[i].testConditions(this)){
                        this.rules[i].consequence(this);
                    }
                }
            } else {
                this.moveTo();
            }

            // Calculate food every frame in case whether changes tile food count
            this.calculateFood();

            // Set lighting in shader
            //this.material.setParameter('sunDir', [sun.localRotation.x, sun.localRotation.y, sun.localRotation.z]);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalEulerAngles(this.rotation.x + 90, this.rotation.y, this.rotation.z);
            //this.entity.rotateLocal(90, 0, 0);
        },

        // Called every movement frame, lerps from one tile center to the next
        moveTo: function() {
            deltaVec.lerp(this.entity.getPosition(), this.destinationTile.center, .01);
            this.entity.setPosition(deltaVec);   
            //console.log("Curr pos: " + this.entity.getPosition().x);
            //console.log("dest pos: " + this.destinationTile.center.x);


            // Once tribe is at next tile's center, movement is done.
            if(this.atDestination()){
                this.tile = this.destinationTile;
                this.currTileTemperature = this.tile.getTemperature();
                this.calculatePopulation();
            }
        },

        setDestination: function(destination) {
            this.destinationTile = destination;
        },

        // Tests if tribe is at the dest position, rounds it to the 100th place because the lerp
        atDestination: function() {
            var tempDestPosX = Math.round(100*this.destinationTile.center.x)/100;
            var tempDestPosY = Math.round(100*this.destinationTile.center.y)/100;
            var tempDestPosZ = Math.round(100*this.destinationTile.center.z)/100;

            var tempCurrPosX = Math.round(100*this.entity.getPosition().x)/100;
            var tempCurrPosY = Math.round(100*this.entity.getPosition().y)/100;
            var tempCurrPosZ = Math.round(100*this.entity.getPosition().z)/100;

            if (tempCurrPosX === tempDestPosX &&
                tempCurrPosY === tempDestPosY &&
                tempCurrPosZ === tempDestPosZ ){

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

        increaseBelief: function() {
            ++this.belief;
        },

        decreaseBelief: function() {
            --this.belief;
        },

        calculateFood: function() {
            this.food = this.tile.getFood();
            console.log("Current Food: " + this.food);
        },

        calculatePopulation: function() {
            var popGrowth;

            popGrowth = this.food - this.population;
            this.population += popGrowth;
            console.log(this.population);
        },

        // Constructs the NPC's list of rules
        createRuleList: function() {
            //this.rules.push(new wantToMoveNorthColder());
            //this.rules.push(new wantToMoveNorthWarmer());
            //this.rules.push(new wantToMoveSouthColder());
            //this.rules.push(new wantToMoveSouthWarmer());
            this.rules.push(new wantToMigrate());
        }
    };

    return Tribe;
});