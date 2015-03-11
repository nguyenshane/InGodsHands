pc.script.create('Human', function (context) {
    // Creates a new Tribe instance
    var Human = function (entity) {
        this.entity = entity;
        
        this.tile;
        this.destinationTile;
        this.startPosition;
        this.influencedTiles = [];

    };

    // Variables for lerp, in milliseconds

    var _foodPopTimer = 0;
    var _travelTime = 3000;
    var _travelStartTime;

    Human.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // create mesh

            this.tile = ico.tiles[1034]; // list of tiles

            this.entity.setPosition(this.tile.center);

            this.rotation = this.tile.getRotationAlignedWithNormal();
            //this.entity.setLocalScale(.1, .1, .1);
            console.log('localscale',this.rotation, this);

            // get current tile's temperature that the tribe is on
            this.currTileTemperature = this.tile.getTemperature();
            
            this.createRuleList();

            this.calculateInfluence();

           // console.log("The influenced tiles length: " + this.influencedTiles.length);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            // Set lighting in shader
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
        },

        //////////////////////////////////
        //  Human move action functions //
        //////////////////////////////////

        // Called every movement frame, lerps from one tile center to the next
        move: function(deltaTime) {

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
                this.tile.hasTribe = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasTribe = true;
                this.migrate();
            }
        },

        setDestination: function(destination) {
            this.isBusy = true;
            this.destinationTile = destination;
            this.startPosition = this.entity.getPosition();
            this.setCurrentAction(this.move);   

            var timer = new Date();
            _travelStartTime = timer.getTime();
        },

		

        
    };

    return Human;
});