pc.script.create('Human', function (context) {
    // Animation states
    var states = {
        cower: {
            animation: 'cower1'
        },
        pray: {
            animation: 'pray2'
        },
        denounce: {
            animation: 'denounce1'
        },
        praise: {
            animation: 'praise1'
        },
        idle: {
            animation: 'idle2'
        },
        walk: {
            animation: 'humanwalk'
        }
    };

    // Creates a new Human instance
    var Human = function (entity) {
        this.entity = entity;
        
        this.blendTime = 0.2;

        this.tribeParent = null;
        this.tile = null;
        this.influencedTiles = [];
        
        this.startPosition;
        this.destinationTile;
        this.path;
        this.pathIndex;
        this.underAttack = false;
        
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

        //this.setAnimState('idle');
        
        this.rotation;
        this.facingDirection = Math.random() * 360;
    };

    Human.prototype = {

        initialize: function (){
        },

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
                            this.entity.setEulerAngles(this.rotation);
                        } else {
                            /*
                            this.rotation = this.tile.getRotationAlignedWithNormal();
                            this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
                            this.entity.rotateLocal(0, this.facingDirection, 0);
                            */
                        }
                    } else {
                        this.rotation = this.tile.getRotationAlignedWithNormal();
                        this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
                        this.entity.rotateLocal(0, this.facingDirection, 0);
                    }
                }
            }
        },

        start: function() {
            if (this.tribeParent != null || this.tribeParent != undefined) {
                this.entity.particlesystem.stop();

                var randomInfluencedTile = getRandom(this.tribeParent.influencedTiles);
                this.tile = randomInfluencedTile; 

                this.entity.setPosition(this.tile.center);
                this.rotation = this.tile.getRotationAlignedWithNormal();
                this.entity.setLocalEulerAngles(this.rotation.x - 90, this.rotation.y, this.rotation.z);
                this.entity.rotateLocal(0, this.facingDirection, 0);
                
                this.chooseState();

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

            this.setAnimState('walk');
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
            
            var deltaVec = actualLerp(this.destinationTile.center, 
                                      this.startPosition, 
                                      percentTravelled);

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
            if (!this.tribeParent.isBusy && 
                this.currentAction != this.move && 
                this.currentAction != this.followPath) {

                this.wander();

            }
        },

        setAnimState: function(state){
            //this.state = state;
            // Set animation and blend from previous animation over 0.2 seconds
            this.entity.animation.play(states[state].animation, this.blendTime);
        }
        
    };

    return Human;
});