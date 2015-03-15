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
    };
	
    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
			scripts = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script;
			
			this.intermittentUpdateDuration = 4.0; //How long it takes for intermittentUpdate to traverse all tiles; this directly affects tree respawn rate as well as performance of atmosphere, might be wise to separate the two
			var m = this.intermittentUpdateDuration / 1280;
			
			treeDensity = 0.3; //this and scripts are also defined in Trees.js since it is sometimes called before this one...
			
			fogChance = 1.6 * m; //Base clouds created per second for the entire globe
			fogHumidityChance = 3.5 * m; //Added to chance based on current humidity
			
			rainChance = 0.5 * m;
			rainHumidityChance = 0.8 * m;
			
            globalTemperature = 90;
            globalTemperatureMax = 100;
			
            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");
            //globalSunRotation = 50;

            maxTotalBelief = 100;
            totalBelief = maxTotalBelief;
            prevTotalBelief = totalBelief;
			
			this.init = false;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			//Only called on first update (since ico isn't defined in initialize)
			if (!this.init) {
				//Initialize variables for intermittentUpdate
				this.lastUpdatedTile = 0;
				this.randomTiles = [];
				for (var size = ico.tiles.length-1; size >= 0; size--) this.randomTiles[size] = size;
				shuffleArray(this.randomTiles);
				
				//Initialize rain/fog particle systems for all tiles
				var atmo = scripts.Atmosphere;
				for (var i = ico.tiles.length-1; i >= 0; i--) {
					var tile = ico.tiles[i];
					tile.rain = atmo.makeRain(extendVector(tile.center, tile.atmoHeight), tile.localRotCenter);
					tile.rain.enabled = false;
					tile.fog = scripts.Atmosphere.makeFog(extendVector(tile.center, tile.atmoHeight), tile.localRotCenter);
					tile.fog.enabled = false;
				}
				
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
			
			/*
			//Start rain/fog randomly (temporary)
			this.envRespawnTimer -= dt;
			if (this.envRespawnTimer <= 0) {
				this.envRespawnTimer += this.envRespawnTime;
				
				for (var i = 0; i < ico.tiles.length; i++) {
					ico.tiles[i].intermittentUpdate();
					
					/*
					var tile = ico.tiles[i];
					var temp = tile.getTemperature();
					if (temp < 0) temp = 0;
					else if (temp > 100) temp = 100;
					
					if (Math.random() < fogChance) {
						//tile.startFog();
					}
					
					if (Math.random() < rainChance * (300 / (temp * 4 + 100))) {
						//tile.startRain();
						//tile.startFog();
					}
					//*
				}
			}
			*/
			
			
            // Test temperature
            // time += dt;
            // var t = (time % 10);
            // globalTemperature = t*10;
            // End test temperature

            // Test belief
            if ((prevTotalBelief > totalBelief && totalBelief > 0) || totalBelief > maxTotalBelief) {
                prevTotalBelief = totalBelief;
                totalBelief -= dt* 10;
            } else {
                prevTotalBelief = totalBelief;
                totalBelief += dt* 10;
            }


            sun.setPosition(0, 0, 0);

            /**** Test sun rotation ****/
            //sun.rotate(0, dt * 100, 0);
            sun.rotate(0, dt * this.globalSunRotation, 0);
            //sun.rotateLocal(0, dt * 100, 0);
            shaderSun.rotateLocal(0, dt * this.globalSunRotation * -2, 0);
            //sun.setEulerAngles(0, 90 + this.time, 0);
            /****                   ****/
        }
    };

    return GlobalVariables;
});