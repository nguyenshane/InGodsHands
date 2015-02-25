pc.script.create('tribe', function (context) {
    // Creates a new Tribe instance
    var Tribe = function (entity) {
        this.entity = entity;
        
        this.population = 1;
        
        this.idealTemperature = 65;
        this.currTileTemperature;

        this.belief = 1;

        this.tile;
        this.destinationTile;
        this.startPosition;
        this.influencedTiles = [];
        
        this.rules = [];
        this.isBusy = false;
        this.isSpiteful = false;
        this.currentAction;
        this.prayerTimer;
        

    };

    // Variables for lerp, in milliseconds

    var _travelTime = 3000;
    var _travelStartTime;

    Tribe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // create mesh
            this.tile = ico.tiles[698]; // list of tiles
            this.calculateFood();

            this.entity.setPosition(this.tile.calculateCenter());
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalScale(.15, .5, .15);

            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            
            this.createRuleList();

            this.calculateInfluence();

            console.log("The influenced tiles length: " + this.influencedTiles.length);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            //////////////////////////////////////////////////////////////////////////////////////
            // Rules system is run through each from, sorted by weight                          //
            // if the NPC is busy (moving, praying, etc.), currentAction is called instead      //
            // Current Action is a different function depending on which rule has been fired    //
            //////////////////////////////////////////////////////////////////////////////////////
            this.rules.sort(function(a, b){return b.weight - a.weight});
            if(!this.isBusy){
                for(var i = 0; i < this.rules.length; i++){
                    if(this.rules[i].testConditions(this)){
                        this.rules[i].consequence(this);
                    }
                }
            } else {
                this.currentAction(dt);
            }
            ///////////////////////////////////////////////////////////////////////////////////////


            // Calculate food every frame in case weather changes tile food count
            this.calculateFood();

            // Set temperature of tile
            this.currTileTemperature = this.tile.getTemperature();

            // Set lighting in shader
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalEulerAngles(this.rotation.x + 90, this.rotation.y, this.rotation.z);
        },

        //////////////////////////////////
        //  Tribe move action functions //
        //////////////////////////////////

        // Called every movement frame, lerps from one tile center to the next
        moveTo: function(deltaTime) {

            // Find change in time since the start, and divide by the desired total travel time
            // This will give you the percentage of the travel time covered. Send this for the lerp
            // rather than changing lerp's start position each frame.
            // Delta vec used as middle man for setting tribe's position.

            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - _travelStartTime;
            var percentTravelled = timeSinceTravelStarted / _travelTime;
            
            var deltaVec = new pc.Vec3;

            deltaVec.lerp(this.startPosition, this.destinationTile.center, percentTravelled);
            this.entity.setPosition(deltaVec);   
            //console.log("Start tile: " + this.startPosition);
            //console.log("Destination tile: " + this.destinationTile.center);
            //console.log("Current percent: " + percentTravelled);

            // Once tribe is at next tile's center, movement is done.
            if(percentTravelled >= 1){
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.calculatePopulation();
                this.calculateInfluence();
                this.isBusy = false;
            }
        },

        setDestination: function(destination) {
            this.isBusy = true;
            this.destinationTile = destination;
            this.startPosition = this.entity.getPosition();
            this.currentAction = this.moveTo;   

            var timer = new Date();
            _travelStartTime = timer.getTime();
        },

        // // Tests if tribe is at the dest position, rounds it to the 100th place because the lerp
        // atDestination: function() {
        //     // var tempDestPosX = Math.round(100*this.destinationTile.center.x)/100;
        //     // var tempDestPosY = Math.round(100*this.destinationTile.center.y)/100;
        //     // var tempDestPosZ = Math.round(100*this.destinationTile.center.z)/100;

        //     // var tempCurrPosX = Math.round(100*this.entity.getPosition().x)/100;
        //     // var tempCurrPosY = Math.round(100*this.entity.getPosition().y)/100;
        //     // var tempCurrPosZ = Math.round(100*this.entity.getPosition().z)/100;

        //     if (this.destinationTile.center.x === this.entity.getPosition().x &&
        //         this.destinationTile.center.y === this.entity.getPosition().y &&
        //         this.destinationTile.center.z === this.entity.getPosition().z ){

        //         this.entity.setPosition(this.destinationTile.center);
        //         return true;
            
        //     } else {
        //         return false;
        //     }
        // },

        ////////////////////////////////////
        //  Tribe prayer action functions //
        ////////////////////////////////////

        waitForTemperaturePrayerAnswer: function (deltaTime) {
            if(this.prayerTimer <= 0){
                console.log("Prayer timer up");
                this.prayerTimer = 0;
                this.denounceGod();
                this.isSpiteful = true;
                this.isBusy = false;
            }

            if((this.currTileTemperature > (this.idealTemperature - 5) &&
                this.currTileTemperature < (this.idealTemperature + 5)) &&
                this.prayerTimer > 0){

                console.log("Prayer fulfilled!");
                this.praiseGod();
                this.prayerTimer = 0;
                this.isBusy = false;
            }

            //console.log(this.currTileTemperature);

            this.prayerTimer -= deltaTime;
        },

        prayForTemperature: function (time) {
            console.log("TIME TO PRAY");
            this.prayerTimer = time;
            this.currentAction = this.waitForTemperaturePrayerAnswer;
            this.isBusy = true;
        },

        //////////////////////////////
        // Tribe feedback functions //
        //////////////////////////////

        praiseGod: function() {
            this.increaseBelief();
            // Play animation here
        },

        denounceGod: function() {
            this.decreaseBelief();
            // play animation
        },

        /////////////////////////////////
        //  Tribe data acces functions //
        /////////////////////////////////

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
        },

        calculatePopulation: function() {
            var popGrowth;

            popGrowth = this.food - this.population;
            this.population += popGrowth;
        },

        calculateInfluence: function() {
            var influenceRate;
            if (this.population < 15){
                influenceRate = 9;
            } else {
                influenceRate = 18;
            }

            // Sick tile influence calculation algorithm
            // basically a BFS            
            this.influencedTiles.push(this.tile);
            var currTile;
            var counter = influenceRate;
            var queue = [this.tile.neighbora, this.tile.neighborb, this.tile.neighborc];

            while (counter > 0) {
                currTile = queue.shift();
                queue.push(currTile.neighbora, currTile.neighborb, currTile.neighborc);
                if (this.influencedTiles.indexOf(currTile) === -1) {
                    this.influencedTiles.push(currTile);
                    counter--;
                }
            }
        },
		
		
        // Constructs the NPC's list of rules
        createRuleList: function() {
            this.rules.push(new wantToMigrate());
            this.rules.push(new needTemperatureChange());
        }
    };

    return Tribe;
});