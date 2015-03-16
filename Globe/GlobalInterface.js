/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

//pc.script.attribute('fogChance', 'number', 0.002);
//pc.script.attribute('rainChance', 'number', 0.0003);

pc.script.attribute('globalSunRotation', 'number', 30);

pc.script.create('globalInterface', function (context) {
    // Creates a new GlobalVariables instance
    var GlobalVariables = function (entity) {
        this.entity = entity;
    };

    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        	globalTime = 0;

			this.fogChance = 0.002;
			this.rainChance = 0.0004;
			
			this.envRespawnTime = 0.5;
			this.envRespawnTimer = 0;
			
            globalTemperature = 90;
            globalTemperatureMax = 100;

            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");
            //globalSunRotation = 50;

            maxTotalBelief = 100;
            totalBelief = maxTotalBelief;
            prevTotalBelief = totalBelief;

            // test vertex neighbors init
            this.testvertex1 = 1;
            //ico.vertexGraph[this.testvertex1].setHeight(1.5);
            this.testvertex2 = 6;
            this.vertexstep = 0;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	// Update globalTime, do not update anywhere else
        	globalTime += dt;

			//'Update' tiles (should probably be in the tile class instead but they aren't a proper pc object...)
			for (var i = 0; i < ico.tiles.length; i++) {
				var tile = ico.tiles[i];
				
				if (tile.isRaining) {
					tile.rainTimer -= dt;
					if (tile.rainTimer <= 0) tile.stopRain();
				}
				
				if (tile.isFoggy) {
					tile.fogTimer -= dt;
					if (tile.fogTimer <= 0) tile.stopFog();
				}
			}
			
			//Start rain/fog randomly (temporary)
			this.envRespawnTimer -= dt;
			if (this.envRespawnTimer <= 0) {
				this.envRespawnTimer += this.envRespawnTime;
				
				for (var i = 0; i < ico.tiles.length; i++) {
					var tile = ico.tiles[i];
					var temp = tile.getTemperature();
					if (temp < 0) temp = 0;
					else if (temp > 100) temp = 100;
					
					if (Math.random() < this.fogChance) {
						//tile.startFog();
					}
					
					if (Math.random() < this.rainChance * (300 / (temp * 4 + 100))) {
						//tile.startRain();
						//tile.startFog();
					}
				}
			}
			
			
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

            // Test vertex neighbors update
            if (Math.floor(globalTime) % 10 == 0) {
            	//console.log(this.testvertex1);
            	//console.log(ico.vertexGraph[this.testvertex1]);
            	var height = ico.vertexGraph[this.testvertex1].getHeight() * 1.1;
            	ico.vertexGraph[this.testvertex1].setHeight(1);
            	this.testvertex1 = ico.vertexGraph[this.testvertex1].getNeighbor(DIRECTION.EAST);
            	ico.vertexGraph[this.testvertex1].setHeight(1.5);

            	height = ico.vertexGraph[this.testvertex2].getHeight() * 1.1;
            	ico.vertexGraph[this.testvertex2].setHeight(1);
            	this.testvertex2 = ico.vertexGraph[this.testvertex2].getNeighbor(DIRECTION.WEST);
            	ico.vertexGraph[this.testvertex2].setHeight(1.5);
        	}

            sun.setPosition(0, 0, 0);

            /**** Test sun rotation ****/
            //sun.rotate(0, dt * 100, 0);
            sun.rotate(0, dt * this.globalSunRotation, 0);
            //sun.rotateLocal(0, dt * 100, 0);
            shaderSun.rotateLocal(0, dt * this.globalSunRotation * -2, 0);
            //sun.setEulerAngles(0, 90 + this.time, 0);
            /****                   ****/
        },

        unitTests: function() {
        	
        }
    };

    return GlobalVariables;
});