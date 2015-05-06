pc.script.create('Human', function (context) {
    // Creates a new Human instance
    var Human = function (entity) {
        this.entity = entity;
        
        this.tribeParent = null;
        this.tile = null;
        this.influencedTiles = [];
        
        this.startPosition;
        this.destinationTile;
        this.path;
        this.pathIndex;
        
		this.strength = 1.0;
		
		this.turnSpeed = 1.0;
		this.moveSpeed = 1.0;
		
		// Variables for lerp, in milliseconds
        this.foodPopTimer = 0;
		this.travelTime = 2000.0 / this.moveSpeed;
        this.travelStartTime;
        
        this.currentAction = null;
        this.currentState = null;
        this.prevState = null;
    };

    Human.prototype = {

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (!isPaused) {
                this.chooseState();
                if (this.currentAction != null) this.currentAction();

                if (this.tile != null) {
                    if (this.destinationTile != null) {
                        var position = this.entity.getPosition();
                        var target = this.destinationTile.center;
                        if (distSq(position, target) > 0.001) {
                            var up = this.tile.normal;
                            var m = new pc.Mat4().setLookAt(position, target, up);
                            this.rotation = m.getEulerAngles();
                        }
                    }
                    
                    this.entity.setEulerAngles(this.rotation);
                    //this.entity.setEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
                }
            }
        },

        start: function() {
            if(this.tribeParent != null){
                this.tile = this.tribeParent.tile.neighbora; 

                this.entity.setPosition(this.tile.center);
                this.rotation = this.tile.getRotationAlignedWithNormal();
                this.chooseState();
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
            
            var deltaVec = actualLerp(this.destinationTile.center, this.startPosition, percentTravelled);
            //var deltaVec = new pc.Vec3;
            //deltaVec.lerp(this.startPosition, this.destinationTile.center, percentTravelled);
            this.entity.setPosition(deltaVec);
            
            // Once tribe is at next tile's center, movement is done.
            if (percentTravelled >= 1) {
                this.tile.hasHuman = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasHuman = true;
                this.setCurrentAction(null);
                this.chooseState();
            }
        },

        wander: function() {
            var randomInfluencedTile = getRandom(this.tribeParent.influencedTiles);
            var randomNeighbor = this.tile.getRandomNeighbor();

            if (this.tile.type.movementCost >= 0) {
                this.goToTile(randomInfluencedTile);
                //this.goToTile(getRandom(ico.tiles));
            } else {
                this.setDestination(randomNeighbor);
            }
        },
        
        goToTile: function(destinationTile) {
            this.path = dijkstras(this.tile, destinationTile);
            if (this.path !== null) {
                this.pathIndex = this.path.length-1; //path array starts from destination
                
                this.startPosition = this.entity.getPosition().clone();
                var timer = new Date();
                this.travelStartTime = timer.getTime();
                
                this.setCurrentAction(this.followPath);
            } else {
                this.setCurrentAction(this.wander);
            }
        },
        
        followPath: function() {
            this.destinationTile = this.path[this.pathIndex];
            
            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            var deltaVec = actualLerp(this.destinationTile.center, this.startPosition, percentTravelled);
            this.entity.setPosition(deltaVec);
            
            // Once tribe is at next tile's center, movement is done.
            if (percentTravelled >= 1) {
                this.tile.hasHuman = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasHuman = true;
                
                this.startPosition = this.entity.getPosition().clone();
                var timer2 = new Date();
                this.travelStartTime = timer2.getTime();
                this.pathIndex--;
            }
            
            if (this.pathIndex < 0) {
                //Arrived at destination
                this.setCurrentAction(null);
                this.chooseState();
            }
        },
        
        setDestination: function(destination) {
            this.destinationTile = destination;
            this.startPosition = this.entity.getPosition().clone();
            
            this.setCurrentAction(this.move);   

            var timer = new Date();
            this.travelStartTime = timer.getTime();
        },

        setCurrentAction: function(newAction) {
            this.previousAction = this.currentAction;
            this.currentAction = newAction;
        },

        chooseState: function(){
            // choose which starter function to call
            if (!this.tribeParent.isBusy && this.currentAction != this.move && this.currentAction != this.followPath) {
                this.wander();
            }
        }

        
    };

    return Human;
});