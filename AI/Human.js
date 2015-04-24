pc.script.create('Human', function (context) {
    // Creates a new Human instance
    var Human = function (entity) {
        this.entity = entity;
        
        this.tribeParent = null;

        this.tile = null;
        this.destinationTile;
        this.startPosition;
        this.influencedTiles = [];

        // Variables for lerp, in milliseconds

        this.foodPopTimer = 0;
        this.travelTime = 3000;
        this.travelStartTime;

        this.currentAction = null;

    };

    Human.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            //this.entity.setLocalScale(.005, .005, .005); 
        },


        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(this.currentAction != null) this.currentAction();

            if(this.tile != null){
                this.rotation = this.tile.getRotationAlignedWithNormal();
                //console.log("Rotation : " + this.rotation);
                this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
            }
        },

        start: function() {
            if(this.tribeParent != null){
                this.tile = this.tribeParent.tile.neighbora; 

                this.entity.setPosition(this.tile.center);
                this.rotation = this.tile.getRotationAlignedWithNormal();

                //this.setDestination(this.tile.neighbora.neighborb.neighbora); 
            }
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
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
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
                this.setCurrentAction(null);
            }
        },

        setDestination: function(destination) {
            console.log("Hey we're here");
            this.destinationTile = destination;
            this.startPosition = this.entity.getPosition();
            this.setCurrentAction(this.move);   

            var timer = new Date();
            this.travelStartTime = timer.getTime();
        },

        wander: function() { 

        },

        setCurrentAction: function(newAction) {
            this.previousAction = this.currentAction;
            this.currentAction = newAction;
        }

        
    };

    return Human;
});