pc.script.create('Animal', function (context) {
    // Creates a new Animal instance
    var Animal = function (entity) {
        this.entity = entity;
        this.entity.migrationFlag = false;
        
        this.tile = null;
        
        this.startPosition;
        this.destinationTile;
        this.path;
        this.pathIndex;
		
		this.strength = 1.0;
        
        this.turnSpeed = 1.0;
		this.moveSpeed = 1.5;
		
		// Variables for lerp, in milliseconds
        this.travelTime = 2000.0 / this.moveSpeed;
        this.travelStartTime;

        this.migrateCounter = 0;
        
        this.currentAction = null;
        this.previousAction = null;
        
        this.currentState = null;
        this.prevState = null;
        
        this.externalBehaviorInterruptFlag = false;
        
        this.rotation;
        this.facingDirection = Math.random() * 360;
        
        this.initialLatitude, this.initialLongitude;
        this.currentMigrationOffset;
    };

    Animal.prototype = {
        
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (!isPaused) {
                if (!this.externalBehaviorInterruptFlag) {
                    this.chooseState();
                } else {
                    this.externalBehaviorInterruptFlag = false;
                }
                
                if (this.currentAction != null) this.currentAction(dt);
                
                if (this.tile != null) {
                    if (this.destinationTile != null) {
                        var position = this.entity.getPosition();
                        var target = this.destinationTile.center;
                        
                        if (distSq(position, target) > 0.001) {
                            var up = this.tile.normal;
                            var m = new pc.Mat4().setLookAt(position, target, up);
                            this.rotation = m.getEulerAngles();
                            this.entity.setEulerAngles(this.rotation);
                            this.entity.rotateLocal(0, -90, 0);
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
            this.tile = this.entity.tile;
            this.initialLatitude = this.tile.latitude;
            this.initialLongitude = this.tile.longitude;
            
            this.entity.setPosition(this.tile.center);
            this.rotation = this.tile.getRotationAlignedWithNormal();
            this.chooseState();
        },

        //////////////////////////////////
        //  Animal move action functions //
        //////////////////////////////////

        // Called every movement frame, lerps from one tile center to the next
        move: function() {
            
            // Find change in time since the start, and divide by the desired total travel time
            // This will give you the percentage of the travel time covered. Send this for the lerp
            // rather than changing lerp's start position each frame.
            // Delta vec used as middle man for setting tribe's position.

            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            //var deltaVec = actualLerp(this.destinationTile.center, this.startPosition, percentTravelled);
            var deltaVec = new pc.Vec3;
            deltaVec.lerp(this.startPosition, this.destinationTile.center, percentTravelled);
            this.entity.setPosition(deltaVec);
            
            // Once tribe is at next tile's center, movement is done.
            if (percentTravelled >= 1) {
                this.tile.hasAnimal = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasAnimal = true;
                this.tile.animal = this.entity;
                if(this.migrateCounter > 0) this.migrateCounter--;
                else this.migrateCounter++;
                this.checkMigrate();
                //this.setCurrentAction(null);
                //this.chooseState();
            }
        },
		
        moveOnce: function() {
            this.startPosition = this.entity.getPosition().clone();
            var timer = new Date();
            this.travelStartTime = timer.getTime();
            
            this.setCurrentAction(this.moveOnceState);
        },
        
		//Returns to previous state after moving
		moveOnceState: function() {
            if (this.pathIndex < 0) {
                this.setCurrentAction(this.previousAction);
                return;
            }
            
			this.destinationTile = this.path[this.pathIndex];
            
			var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            //var deltaVec = actualLerp(this.destinationTile.center, this.startPosition, percentTravelled);
            var deltaVec = new pc.Vec3;
            deltaVec.lerp(this.startPosition, this.destinationTile.center, percentTravelled);
            this.entity.setPosition(deltaVec);
            
            if (percentTravelled >= 1) {
                this.tile.hasAnimal = false;
                this.tile = this.destinationTile;
                this.entity.setPosition(this.destinationTile.center);
                this.tile.hasAnimal = true;
                this.tile.animal = this.entity;
				this.pathIndex--;
                this.setCurrentAction(this.previousAction);
            }
		},
        
        beginMigration: function() {
            this.migrationDelay = 0;//Math.random() * 2.5;
            this.setCurrentAction(this.migrate);
        },
        
        migrate: function(dt) {
            this.migrationDelay -= dt;
            
            if (this.migrationDelay < 0) {
                var migrationLatitude = this.initialLatitude + (global[GLOBAL.ANIMALS] - 50)*50;
                var migrationLongitude = this.initialLongitude;
                
                //restricting to a longitude band and sorting by latitudinal distance (excluding all tiles that aren't between the desired latitude/z-position and current z-position) might be a good idea
                //sort tiles by longitudinal distance, then split this sorted array into sections of 20 or so tiles, sort these sections by latitudinal distance and iterate through them, break after the 4th or so section
                //or use apsp instead of searching multiple times, iterate through visited tiles to find the best one with a valid path
                
                var apsp = dijkstrasAPSP(this.tile);
                var prev = apsp.prev;
                
                var dists = [];
                dists[ico.tiles.length-1] = null;
                
                for (var i = 0; i < ico.tiles.length; i++) {
                    var tile = ico.tiles[i];
                    dists[i] = {dist: llDistSq(migrationLatitude, migrationLongitude, tile.latitude, tile.longitude), index: i};
                }
                
                dists.sort(function(a, b) {return a.dist - b.dist;});
                
                for (var i = 0; i < dists.length; i++) {
                    var tile = ico.tiles[dists[i].index];
                    if (prev[tile.index] !== -1) {
                        this.path = [];
                        while (prev[tile.index] !== -2) {
                            this.path.push(tile);
                            tile = prev[tile.index];
                        }
                        this.path.push(tile);
                        this.setPath(null, this.migrateAlongPath);
                        this.currentMigrationOffset = global[GLOBAL.ANIMALS];
                        return;
                    }
                }
                
                this.setCurrentAction(null);
                this.chooseState();
            }
        },

        // Keeps calling set dest to the north/south tile 
        // for however much the player pulled the string
        // stupid fucking check for pathable tiles 
        // probably could be done way better
        checkMigrate: function() {
            var neighborTiles = this.tile.getNeighbors();
            if(this.migrateCounter >= 1){
                if(this.tile.getNorthNeighbor().isPathable){
                    this.setDestination(this.tile.getNorthNeighbor());
                } else {
                    this.setDestination(this.tile.getRandomNeighbor());
                }
            } else if(this.migrateCounter <= -1){
                if(this.tile.getSouthNeighbor().isPathable){
                    this.setDestination(this.tile.getSouthNeighbor());
                } else {
                    this.setDestination(this.tile.getRandomNeighbor());
                }
            }

            if( this.migrateCounter < 1 && this.migrateCounter > -1) {
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
        
        idle: function() {
            this.chooseState();
        },
        
        attackTribe: function(tribe) {
            var availableHumans = [];
            for (var i = 0; i < tribe.humans.length; i++) {
                var human = tribe.humans[i];
                
                if (!human.underAttack) {
                    availableHumans.push(human);
                }
            }
            
            if (availableHumans.length > 0) {
                //Move to attack the nearest human
                var m = min(availableHumans,
                    function(v, a) {
                        return distSq(a.entity.getPosition(), v.getPosition());
                    }, this);
                
                var humanToAttack = availableHumans[m].script.Human;
                humanToAttack.underAttack = true;
                this.follow(humanToAttack);
                this.externalBehaviorInterruptFlag = true;
            }
        },
        
        follow: function(object) {
			this.target = object;
			this.targetTile = this.target.tile;
			this.setPath(this.targetTile, this.followTarget);
        },
		
		followTarget: function() {
			if (this.tile.isAdjacent(this.targetTile) ||
                this.tile.equals(this.targetTile)) {
				this.attack(this.target);
                this.setCurrentAction(null);
				this.chooseState();
				return;
			}
			
			if (this.target.tile.index !== this.targetTile.index) {
                this.targetTile = this.target.tile;
				this.setPath(this.targetTile, this.moveOnceState); //Target has moved, calculate a new path
			} else if (this.path != null) {
                this.moveOnce(); //Take the next step along the path
            } else {
                this.setCurrentAction(null);
                this.chooseState(); //No path found
            }
		},
        
        attack: function(object) {
            var human = object;
            human.underAttack = false;
            
            if (Math.random() < 0.5) {
                //human.killSelf();
            }
        },
        
        goToTile: function(destinationTile) {
			this.setPath(destinationTile, this.followPath);
        },
        
        migrateAlongPath: function() {
            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            var offsetDiff = Math.abs(this.currentMigrationOffset - global[GLOBAL.ANIMALS]);
            if (percentTravelled >= 1 && offsetDiff > 1.0) {
                this.beginMigration();
            } else {
                this.followPath();
            }
        },
        
        followPath: function() {
            this.destinationTile = this.path[this.pathIndex];
            
            var timer = new Date();
            var timeSinceTravelStarted = timer.getTime() - this.travelStartTime;
            var percentTravelled = timeSinceTravelStarted / this.travelTime;
            
            //var deltaVec = actualLerp(this.destinationTile.center, this.startPosition, percentTravelled);
            var deltaVec = new pc.Vec3;
            deltaVec.lerp(this.startPosition, this.destinationTile.center, percentTravelled);
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
		
		setPath: function(destination, action) {
			if (destination !== null) this.path = dijkstras(this.tile, destination);
            
            if (this.path != null) {
                this.pathIndex = this.path.length-1; //path array starts from destination
                
                this.startPosition = this.entity.getPosition().clone();
                var timer = new Date();
                this.travelStartTime = timer.getTime();
                
                this.setCurrentAction(action);
                
                return true;
            } else {
                this.setCurrentAction(null);
                this.chooseState();
                
                return false;
            }
		},

        setCurrentAction: function(newAction) {
            this.previousAction = this.currentAction;
            this.currentAction = newAction;
        },

        chooseState: function() {
            // choose which starter function to call
            if (this.currentAction == null ||
                this.currentAction == this.idle) {
                
                //this.wander();
                
                if (this.entity.migrationFlag) {
                    this.entity.migrationFlag = false;
                    //this.beginMigration();
                    this.checkMigrate();
                }
                
                return;
            }
            
            //this.currentAction = this.idle;
        }
    };

    return Animal;
});