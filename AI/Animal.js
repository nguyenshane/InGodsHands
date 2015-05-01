pc.script.create('Animal', function (context) {
    // Creates a new Animal instance
    var Animal = function (entity) {
        this.entity = entity;
        
        this.tribeParent = null;
        this.tile = null;
        this.influencedTiles = [];
        
        this.startPosition;
        this.destinationTile;
        this.path;
        this.pathIndex;
        
        // Variables for lerp, in milliseconds
        this.foodPopTimer = 0;
        this.turnSpeed = 1.0;
        this.travelTime = 1200.0;
        this.travelStartTime;
        
        this.currentAction = null;
        this.currentState = null;
        this.prevState = null;
    };

    Animal.prototype = {

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
                    this.entity.rotateLocal(0, -90, 0);
                    //this.entity.setEulerAngles(this.rotation.x, this.rotation.y - 90, this.rotation.z);
                }
            }
        },

        start: function() {
            this.tile = this.entity.tile;

            this.entity.setPosition(this.tile.center);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.chooseState();
        },

        //////////////////////////////////
        //  Animal move action functions //
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
                this.tile.hasAnimal = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasAnimal = true;
                this.tile.animal = this.entity;
                this.setCurrentAction(null);
                this.chooseState();
            }
        },

        wander: function() {
            if (this.tile.type.movementCost >= 0) {
                this.goToTile(getRandom(ico.tiles));
            } else {
                this.setDestination(this.tile.getRandomNeighbor());
            }
        },
        
        follow: function(entity) {
        },
        
        attack: function(entity) {
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
                //this.setCurrentAction(this.wander);
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
                this.tile.hasAnimal = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasAnimal = true;
                this.tile.animal = this.entity;
                
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
            if (this.currentAction != this.move && this.currentAction != this.followPath) {
                this.wander();
            }
        }
    };

    return Animal;
});