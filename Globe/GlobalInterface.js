/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

pc.script.attribute('globalSunRotation', 'number', 30);

pc.script.create('globalInterface', function (context) {
    // Creates a new GlobalVariables instance
    var GlobalVariables = function (entity) {
        this.entity = entity;
        //isPaused = false;

        this.isPaused = false;

        isPaused = this.isPaused;
    };
	
    var camera;

    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {

        	globalTime = 0;
			
			//Global references to PlayCanvas components
			scripts = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script;
			camera = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera");
			
			animalDensity = 0.02;
			
			treeDensity = 0.3; //this and scripts are also defined in Trees.js since it is sometimes called before this one...
			
			this.fogChance = 0.002;
			this.rainChance = 0.0004;
			
			this.intermittentUpdateDuration = 4.0; //How long it takes for intermittentUpdate to traverse all tiles; this directly affects tree respawn rate as well as performance of atmosphere, might be wise to separate the two
			var m = this.intermittentUpdateDuration / 1280;
			
			fogChance = 0.3 * m; //Base clouds created per second for the entire globe
			fogHumidityChance = 2.0 * m; //Added to chance based on current humidity and temperature
			
			rainChance = 0.1 * m;
			rainHumidityChance = 1.2 * m;
			
            globalTemperature = 90;
            globalTemperatureMax = 100;
			
            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");

            maxTotalBelief = 200;
            totalBelief = maxTotalBelief;
            prevTotalBelief = totalBelief;
			

			//tribes = [];
			tribes = context.root.findByName("TribeParent").getChildren();

			// Checks how long the player has been inactive
			inactiveTimer = 0;
			
            // test vertex neighbors init
            this.testVerts = [];
            for (var i = 0; i < 10; ++i) {
            	this.testVerts[i] = Math.floor(pc.math.random(0, 600));
            }
			
            this.eroder = new Eroder(0, 150);
			
			this.init = false;

            // Test faultlines
            this.fault;
            this.faultIndex = 0;
            this.faultMoveCount = 0;
            this.faultMoveMax = 20;
            this.faultIncrement = 0.01;
            this.faultDir = -1;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if(!isPaused) {
                /*
                var grass = 0, desert = 0, dry = 0;
                for (var i = 0; i < ico.tiles.length; i++) {
                    ico.tiles[i].assignType();

                    switch (ico.tiles[i].type) {
                        case TILETYPES.GRASSPLANE:
                        grass++;
                        break;

                        case TILETYPES.DESERT:
                        desert++;
                        break;

                        case TILETYPES.DRYPLANE:
                        dry++;
                        break;
                    }
                }
                
                console.log (grass + " " + dry + " " + desert);
                */

                // Update globalTime, do not update anywhere else

                globalTime += dt;
                inactiveTimer += dt;


                //Only called on first update (since ico isn't defined in initialize)
                if (!this.init) {
                    //Initialize variables for intermittentUpdate
                    this.lastUpdatedTile = 0;
                    this.randomTiles = [];
                    for (var size = ico.tiles.length-1; size >= 0; size--) this.randomTiles[size] = size;
                    shuffleArray(this.randomTiles);
                    
                    this.init = true;
                }


                //Update all tiles
                var tiles = ico.tiles;
                for (var i = tiles.length-1; i >= 0; i--) {
                    //tiles[i].update(dt);
                }


                //Call intermittent update on a subset of tiles
                var tilesToUpdate = ico.tiles.length * dt / this.intermittentUpdateDuration;
                if (tilesToUpdate > ico.tiles.length) tilesToUpdate = ico.tiles.length;
                tilesToUpdate = Math.floor(tilesToUpdate);

                if (ico.tiles.length - this.lastUpdatedTile < tilesToUpdate) {
                    //Do remaining tiles, then continue from the beginning in next block
                    for (var i = this.lastUpdatedTile; i < ico.tiles.length; i++) {
                        //ico.tiles[i].intermittentUpdate();
                    }
                    
                    tilesToUpdate -= ico.tiles.length - this.lastUpdatedTile;
                    this.lastUpdatedTile = 0;
                    shuffleArray(this.randomTiles);
                }

                for (var i = this.lastUpdatedTile; i < tilesToUpdate + this.lastUpdatedTile; i++) {
                    //ico.tiles[i].intermittentUpdate();
                }
                this.lastUpdatedTile += tilesToUpdate;


                // Test vertex neighbors update
                for (var i = 0; i < this.testVerts.length; ++i) {
                    //this.vertexMovementTest(i, Math.floor((globalTime/2) % 8), Math.floor((globalTime/2 + 4) % 8));
                    //this.vertexMovementTest(i, DIRECTION.EAST, DIRECTION.NORTHEAST);
                    //this.vertexMovementTest(i, (i + (Math.floor((globalTime/2) % 2) * 4)) % 8, (i + (Math.floor((globalTime/2) % 2) * 4) + 4) % 8);
                }


                // Eroder agent update. Comment to not have erosion on continents
                //this.eroder.update();

                // Update prevTotalBelief for all tribes
                prevTotalBelief = totalBelief;

                sun.setPosition(0, 0, 0);
          }
        },

        vertexMovementTest: function(vertex, direction, backup) {
            	ico.vertexGraph[this.testVerts[vertex]].setHeight(1.5);
            	if (ico.vertexGraph[this.testVerts[vertex]].getNeighbor(direction, backup) != -1) {
            		this.testVerts[vertex] = ico.vertexGraph[this.testVerts[vertex]].getNeighbor(direction, backup);
            	}
            	ico.vertexGraph[this.testVerts[vertex]].setHeight(2);
        },

        pauseGame: function() {
            if(!this.isPaused){
                context.timeScale = 0;
                this.isPaused = true;
                isPaused = this.isPaused;
            }
            else{ 
                context.timeScale = 1;
                this.isPaused = false;
                isPaused = this.isPaused;
            }
        },
    };

    return GlobalVariables;
});