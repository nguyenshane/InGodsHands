/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

var GLOBAL = {
    TEMPERATURE : 0,
    ANIMALS : 1,
    FAULTS : 2,
    PUNISH : 3,
    ROTATION : 4,
    BELIEF : 5,
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
			scripts = pc.fw.Application.getApplication('application-canvas').context.root.findByName("Rv1-stable").script;
			camera = pc.fw.Application.getApplication('application-canvas').context.root.findByName("Rv1-stable").findByName("Camera");
			
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
			
            //global[GLOBAL.TEMPERATURE] = 50;
            //globalMax[GLOBAL.TEMPERATURE] = 100;
            //globalMin[GLOBAL.TEMPERATURE] = 0;
			
            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");

            //this.stormEffect = pc.fw.Application.getApplication('application-canvas').context.root.findByName("Rv1-stable").findByName("Camera").script.vignette.effect;

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

            this.setupSnapshots();
            this.setupGlobalVariables();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

            if (!isPaused) {
                // Update globalTime, do not update anywhere else
                globalTime += dt;
                inactiveTimer += dt;

                TWEEN.update();

                /*
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
                */

                //Move global vars closer to their destination
                for (var i = 0; i < global.length; ++i) {
                    this.lerpToDestination(i);
                }


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

                if (globalTime - lastSnapshotTime > 5 && !isPaused) {
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
                //canvas.style.display = "none";
            }
        },

        endGame: function() {
            // all tribes gone, or not enough belief
            // jump to end game screen
            console.log("END GAME");
            //this.setupEndScreen();
            this.drawEndScreen();
            this.condenseSnapshots();
            localStorage.setItem('snapshots', JSON.stringify(snapshots));
            $.ajax({
                url:"https://api.myjson.com/bins/195hc",
                type:"PUT",
                data: JSON.stringify(snapshots),
                contentType:"application/json; charset=utf-8",
                dataType:"json",
                success: function(data, textStatus, jqXHR){
                    console.log("AJAX success", data, textStatus, jqXHR);
                }
            });

            setTimeout(function() { location.href = 'http://in-gods-hands.info/end/end.html' },5000);
        },

        setupGlobalVariables: function() {

            global = [];
            global[GLOBAL.TEMPERATURE] = 50;
            global[GLOBAL.ANIMALS] = 50;
            global[GLOBAL.FAULTS] = 50;
            global[GLOBAL.PUNISH] = 50;
            global[GLOBAL.ROTATION] = 50;
            global[GLOBAL.BELIEF] = 50;

            globalMax = [];
            globalMax[GLOBAL.TEMPERATURE] = 100;
            globalMax[GLOBAL.ANIMALS] = 100;
            globalMax[GLOBAL.FAULTS] = 100;
            globalMax[GLOBAL.PUNISH] = 100;
            globalMax[GLOBAL.ROTATION] = 100;
            globalMax[GLOBAL.BELIEF] = 100;

            globalMin = [];
            globalMin[GLOBAL.TEMPERATURE] = 0;
            globalMin[GLOBAL.ANIMALS] = 0;
            globalMin[GLOBAL.FAULTS] = 0;
            globalMin[GLOBAL.PUNISH] = 0;
            globalMin[GLOBAL.ROTATION] = 0;
            globalMin[GLOBAL.BELIEF] = 0;

            globalDest = [];
            globalDest[GLOBAL.TEMPERATURE] = 50;
            globalDest[GLOBAL.ANIMALS] = 50;
            globalDest[GLOBAL.FAULTS] = 50;
            globalDest[GLOBAL.PUNISH] = 50;
            globalDest[GLOBAL.ROTATION] = 50;
            globalDest[GLOBAL.BELIEF] = 50;

            globalPrev = [];
            globalPrev[GLOBAL.TEMPERATURE] = 50;
            globalPrev[GLOBAL.ANIMALS] = 50;
            globalPrev[GLOBAL.FAULTS] = 50;
            globalPrev[GLOBAL.PUNISH] = 50;
            globalPrev[GLOBAL.ROTATION] = 50;
            globalPrev[GLOBAL.BELIEF] = 50;

            endColors = [];
            endColors[GLOBAL.TEMPERATURE] = '#ff0000';
            endColors[GLOBAL.ANIMALS] = '#ffff00';
            endColors[GLOBAL.FAULTS] = '#00ff00';
            endColors[GLOBAL.PUNISH] = '#00ffff';
            endColors[GLOBAL.ROTATION] = '#0000ff';
            endColors[GLOBAL.BELIEF] = '#ff00ff';

            month = 0;
            year = 30000;
        },

        lerpToDestination: function(elem) {
            if (global[elem] != globalDest[elem]) {
                global[elem] += (globalDest[elem] - globalPrev[elem])/30;
                if (global[elem] > Math.max(globalDest[elem], globalPrev[elem]) || global[elem] < Math.min(globalDest[elem], globalPrev[elem])) {
                    global[elem] = globalDest[elem];
                    globalPrev[elem] = globalDest[elem];
                }
            }
        },

        setupSnapshots: function() {
            snapshots = {
                labels: [],
                datasets: [
                    {
                        label: "Temperature",
                        fillColor: "rgba(255,79,70,0.1)",
                        strokeColor: "rgba(255,79,70,1)",
                        pointColor: "rgba(255,79,70,1)",
                        //pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        //pointHighlightStroke: "rgba(255,79,70,1)",
                        data: []
                    },
                    {
                        label: "Animal Migration",
                        fillColor: "rgba(232,152,43,0.1)",
                        strokeColor: "rgba(232,152,43,1)",
                        pointColor: "rgba(232,152,43,1)",
                        //pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        //pointHighlightStroke: "rgba(232,152,43,1)",
                        data: []
                    },
                    {
                        label: "Plate Tectonics",
                        fillColor: "rgba(107,246,255,0.1)",
                        strokeColor: "rgba(107,246,255,1)",
                        pointColor: "rgba(107,246,255,1)",
                        //pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        //pointHighlightStroke: "rgba(107,246,255,1)",
                        data: []
                    },
                    {
                        label: "Punishment",
                        fillColor: "rgba(255,244,64,0.1)",
                        strokeColor: "rgba(255,244,64,1)",
                        pointColor: "rgba(255,244,64,1)",
                        //pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        //pointHighlightStroke: "rgba(255,244,64,1)",
                        data: []
                    },
                    {
                        label: "World Rotation",
                        fillColor: "rgba(105,232,111,0.1)",
                        strokeColor: "rgba(105,232,111,1)",
                        pointColor: "rgba(105,232,111,1)",
                        //pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        //pointHighlightStroke: "rgba(105,232,111,1)",
                        data: []
                    }/*,
                    {
                        label: "Total Belief",
                        fillColor: "rgba(220,220,220,0.1)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: []
                    }*/
                ]
            };
        },

        condenseSnapshots: function() {

            var divisions = 50;
            var divider = Math.ceil(snapshots.labels.length/divisions);
            for (var i = 0; i < divisions + 1; ++i) {
                for (var j = 1; j < divider; ++j) {
                    if (snapshots.labels[i*divider + j]) snapshots.labels[i*divider + j] = "";
                }
            }
        },

        takeSnapshot: function() {
            //console.log(snapshots);
            
            for (var i = 0; i < snapshots.datasets.length; ++i) {
                snapshots.datasets[i].data.push(global[i]);
            }
            snapshots.labels.push(year + " BC");
            /*var label;
            switch(month) {
                case 0:
                    label = "January " + year + " BC";
                    break;
                case 1:
                    label = "February " + year + " BC";
                    break;
                case 2:
                    label = "March " + year + " BC";
                    break;
                case 3:
                    label = "April " + year + " BC";
                    break;
                case 4:
                    label = "May " + year + " BC";
                    break;
                case 5:
                    label = "June " + year + " BC";
                    break;
                case 6:
                    label = "July " + year + " BC";
                    break;
                case 7:
                    label = "August " + year + " BC";
                    break;
                case 8:
                    label = "September " + year + " BC";
                    break;
                case 9:
                    label = "October " + year + " BC";
                    break;
                case 10:
                    label = "November " + year + " BC";
                    break;
                case 11:
                    label = "December " + year + " BC";
                    break;
            }
            snapshots.labels.push(label);

            month = (month + 1) % 12;
            if (month = 0) {
                --year;
            }*/

            --year;
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
            /*canvas.style.display = "inline";
            ctx.fillStyle = '#999999';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.drawSnapLine(GLOBAL.TEMPERATURE, '#ff0000');
            this.drawSnapLine(GLOBAL.BELIEF, '#00ff00');*/
        },

        drawSnapLine: function(element, color) {
            ctx.beginPath();
            ctx.moveTo(0, canvas.height - (snapshots[0][element] - globalMin[element]) * canvas.height/(globalMax[element] - globalMin[element]));
            for (var i = 1; i < snapshots.length; ++i) {
                ctx.lineTo(i * canvas.width/(snapshots.length-1), canvas.height - (snapshots[i][element] - globalMin[element]) * canvas.height/(globalMax[element] - globalMin[element]));
            }

            ctx.strokeStyle = color;
            ctx.stroke();
            console.log('snapshots', snapshots);
        }
    };

    return GlobalVariables;
});