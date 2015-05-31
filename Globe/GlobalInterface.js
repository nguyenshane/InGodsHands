/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

var GLOBAL = {
    TEMPERATURE : 0,
    BELIEF : 1,
}

pc.script.attribute('globalSunRotation', 'number', 30);

pc.script.create('globalInterface', function (context) {
    // Creates a new GlobalVariables instance
    var GlobalVariables = function (entity) {
        this.entity = entity;
        //isPaused = false;

        this.isPaused = false;

        isPaused = this.isPaused;

        globalInterface = this;
    };
	
    var camera;

    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {

        	globalTime = 0;
            lastSnapshotTime = 0;

            seed = new seed(Math.floor(pc.math.random(0, 32768)));
            debug.log(DEBUG.INIT, "Seed: " + seed.seed);
			
			//Global references to PlayCanvas components
			scripts = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script;
			camera = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera");
			
			animalDensity = 0.0225; // 0.07 too high
            animalMigrationOffset = 0;
			
			treeDensity = 0.1; //this and scripts are also defined in Trees.js since it is sometimes called before this one...
			
			this.fogChance = 0.002;
			this.rainChance = 0.0004;
			
			this.intermittentUpdateDuration = 4.0; //How long it takes for intermittentUpdate to traverse all tiles; this directly affects tree respawn rate as well as performance of atmosphere, might be wise to separate the two
			var m = this.intermittentUpdateDuration / 1280;
			
			fogChance = 0.3 * m; //Base clouds created per second for the entire globe
			fogHumidityChance = 2.0 * m; //Added to chance based on current humidity and temperature
			
			rainChance = 0.1 * m;
			rainHumidityChance = 1.2 * m;
			
            globalTemperature = 90;
            globalTemperatureMax = 140;
            globalTemperatureMin = 40;
			
            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");

            //this.stormEffect = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera").script.vignette.effect;

            maxTotalBelief = 250;
            totalBelief = 0;
            prevTotalBelief = totalBelief;
            minTotalBelief = 150;
			
			tribes = context.root.findByName("TribeParent").getChildren();

            tribeLights = context.root.findByName("Camera").findByName("TribeLights").getChildren();
            this.assignTribeBeliefLights();

            // Queue of tribe actions, only want two running at once.
            tribeActionQ = [];

            // list of colors for tribes / icons / objects
            colors = [];
            colors[0] = new pc.Color(0, 234, 255);
            colors[1] = new pc.Color(150, 0, 0);
            colors[2] = new pc.Color(255, 254, 254);
            colors[3] = new pc.Color(0, 0, 254);

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

            this.setupEndScreen();
            this.setupSnapshots();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            if (!isPaused) {
                // Update globalTime, do not update anywhere else
                globalTime += dt;
                inactiveTimer += dt;

                TWEEN.update();

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
                    tiles[i].update(dt);
                }


                //Call intermittent update on a subset of tiles
                var tilesToUpdate = ico.tiles.length * dt / this.intermittentUpdateDuration;
                if (tilesToUpdate > ico.tiles.length) tilesToUpdate = ico.tiles.length;
                tilesToUpdate = Math.floor(tilesToUpdate);

                if (ico.tiles.length - this.lastUpdatedTile < tilesToUpdate) {
                    //Do remaining tiles, then continue from the beginning in next block
                    for (var i = this.lastUpdatedTile; i < ico.tiles.length; i++) {
                        ico.tiles[i].intermittentUpdate();
                    }
                    
                    tilesToUpdate -= ico.tiles.length - this.lastUpdatedTile;
                    this.lastUpdatedTile = 0;
                    shuffleArray(this.randomTiles);
                }

                for (var i = this.lastUpdatedTile; i < tilesToUpdate + this.lastUpdatedTile; i++) {
                    ico.tiles[i].intermittentUpdate();
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
                //prevTotalBelief = totalBelief;

                sun.setPosition(0, 0, 0);

                // if(this.stormEffect.darkness > 1){
                //     this.stormEffect.darkness -= dt;
                // } else {
                //     this.stormEffect.darkness = 1;
                // }

                if (globalTime - lastSnapshotTime > 1 && !isPaused) {
                        this.takeSnapshot();
                        lastSnapshotTime = globalTime;
                        //debug.obj(DEBUG.TESTING, snapshots, "Snapshot taken");
                }
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
                globalInterface.drawEndScreen();
            }
            else{ 
                context.timeScale = 1;
                this.isPaused = false;
                isPaused = this.isPaused;
                canvas.style.display = "none";
            }
        },

        endGame: function() {
            // all tribes gone, or not enough belief
            // jump to end game screen
            console.log("END GAME");
            //this.setupEndScreen();
            this.drawEndScreen();
        },

        setupSnapshots: function() {
            snapshots = [];

            globalMax = [];
            globalMax[GLOBAL.TEMPERATURE] = globalTemperatureMax;
            globalMax[GLOBAL.BELIEF] = maxTotalBelief;

            globalMin = [];
            globalMin[GLOBAL.TEMPERATURE] = globalTemperatureMin;
            globalMin[GLOBAL.BELIEF] = minTotalBelief;
        },

        takeSnapshot: function() {
            var snapshot = [];
            snapshot[GLOBAL.TEMPERATURE] = globalTemperature;
            snapshot[GLOBAL.BELIEF] = totalBelief;
            
            snapshots.push(snapshot);
            //this.drawEndScreen();
        },

        doTribesExist: function() {
            for (var i = 0; i < tribes.length; i++) {
                if (tribes[i].enabled) return;
            }
			
			console.log("All tribes dead");
            this.endGame();
        },

        assignTribeBeliefLights: function() {
            for (var i = 0; i < tribes.length; i++){
                tribes[i].script.tribe.beliefLight = tribeLights[i];
            }
        },

        setBeliefLightsOff: function() {
            for (var i = 0; i < tribes.length; i++){
                if (!tribes[i].enabled) tribeLights[i].enabled = false;
                console.log(tribeLights[i].enabled);
            }
        },

        setupEndScreen: function() {
            var endCanvas = document.createElement('canvas');
            endCanvas.id     = "endCanvas";
            endCanvas.style.width  = '50%';
            endCanvas.style.height = '50%';
            endCanvas.style.left  = '25%';
            endCanvas.style.top = '25%';
            endCanvas.style.zIndex   = 8;
            endCanvas.style.position = "absolute";
            endCanvas.style.border   = "2px solid";
            document.body.appendChild(endCanvas);

            canvas = document.getElementById("endCanvas");
            ctx = canvas.getContext("2d");
            canvas.style.display = "none";
        },

        drawEndScreen: function() {
            canvas.style.display = "inline";
            ctx.fillStyle = '#999999';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.drawSnapLine(GLOBAL.TEMPERATURE, '#ff0000');
            this.drawSnapLine(GLOBAL.BELIEF, '#00ff00');
        },

        drawSnapLine: function(element, color) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - (snapshots[0][element] - globalMin[element]) * canvas.height/(globalMax[element] - globalMin[element]));
            for (var i = 1; i < snapshots.length; ++i) {
                ctx.lineTo(i * canvas.width/(snapshots.length-1), canvas.height - (snapshots[i][element] - globalMin[element]) * canvas.height/(globalMax[element] - globalMin[element]));
            }

            ctx.strokeStyle = color;
            ctx.stroke();
        }
    };

    return GlobalVariables;
});