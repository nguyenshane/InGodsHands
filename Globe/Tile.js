//colors
var colorBrown = new pc.Color(183, 112, 59);
var colorYellow = new pc.Color(200, 194, 81);
var colorGreen = new pc.Color(55, 138, 63);
var colorBlue = new pc.Color(54, 152, 167);
var colorWhite = new pc.Color(234, 232, 227);
var colorGray = new pc.Color(127, 124, 115);

//Types of tile determine food
TILETYPES = {
    /*TUNDRA: { //should only be on northern and southern extremes
        name: "tundra",
        foodVal: 0 //always
        //color: gray
    },*/
    DESERT: {
        name: "desert",
        minTemp: 100,
        maxTemp: 1000,
        foodVal: 0,
		movementCost: 1.5,
        color: colorBrown
    },
    
    DRYPLANE: {
        name: "dry plane",
        minTemp: 70,
        maxTemp: 100,
        foodVal: 1,
		movementCost: 1.2,
        color: colorYellow
    },

    GRASSPLANE: {
        name: "grass plane",
        minTemp: 40,
        maxTemp: 70,
        foodVal: 2,
		movementCost: 1.0,
        color: colorGreen
    },

    MOUNTAIN: {
        name: "mountain",
        minTemp: -1000,
        maxTemp: 1000,
        foodVal: 1,
		movementCost: -1,
        color: colorGray
    },

    WATER: {
        name: "water",
        minTemp: -1000,
        maxTemp: 1000,
        foodVal: 0,
		movementCost: -1,
        color: colorBlue
    },
    
    mountainHeight: 0.15
};

Tile.treeStats = {
    tree1: {
        type: "tree1",
        minTemp: 30,
        maxTemp: 100,
        idealTemp: 60,
        minWater: 50,
        maxWater: 100,
        idealWater: 80,
        waterUsage: 1.0,
        growRate: 0.75,
        foodContribution: 2.0
    },
    
    tree2: {
        type: "tree2",
        minTemp: 60,
        maxTemp: 140,
        idealTemp: 100,
        minWater: 30,
        maxWater: 100,
        idealWater: 50,
        waterUsage: 0.6,
        growRate: 1.0,
        foodContribution: 1.2
    },
    
    tree3: {
        type: "tree3",
        minTemp: 60,
        maxTemp: 140,
        idealTemp: 100,
        minWater: 30,
        maxWater: 100,
        idealWater: 70,
        waterUsage: 0.8,
        growRate: 1.0,
        foodContribution: 1.2
    },
    
    tree4: {
        type: "tree4",
        minTemp: 60,
        maxTemp: 150,
        idealTemp: 100,
        minWater: 20,
        maxWater: 100,
        idealWater: 40,
        waterUsage: 0.65,
        growRate: 1.0,
        foodContribution: 1.4
    }
};

Tile.animalStats = {
    fox: {
        type: "fox",
        minTemp: 30,
        maxTemp: 100,
        idealTemp: 60,
        minWater: 20,
        maxWater: 100,
        idealWater: 40,
        waterUsage: 1.0,
        growRate: 0.75,
        foodContribution: 0.4,
        aggressiveness: 0.4
    },
    
    pig: {
        type: "pig",
        minTemp: 60,
        maxTemp: 140,
        idealTemp: 100,
        minWater: 30,
        maxWater: 100,
        idealWater: 50,
        waterUsage: 0.6,
        growRate: 0.6,
        foodContribution: 1.6,
        aggressiveness: 0.0
    },
    
    cow: {
        type: "cow",
        minTemp: 60,
        maxTemp: 140,
        idealTemp: 100,
        minWater: 40,
        maxWater: 100,
        idealWater: 55,
        waterUsage: 0.7,
        growRate: 0.3,
        foodContribution: 1.5,
        aggressiveness: 0.0
    }
};

function Tile(index, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.colors = [];

    this.neighbora, this.neighborb, this.neighborc;
    this.neighbors = [];
	
    var normalIndex, hasHuman, divided;
	
    this.index = index;
    
    this.normal;
    this.center;
	this.localRotNormal;
	this.localRotCenter;
    
    this.isOcean = true;
    this.isPathable = true;
    
    this.type = TILETYPES.GRASSPLANE;
    this.temperature;
    this.baseFood = Math.floor(Math.random() * (5 - 1)) + 1;
	this.food = this.baseFood;
	
    this.entities = [];
	this.tree, this.animal, this.rain, this.fog;
    
    this.hasTribe = false;
	this.hasTree = false;
	this.hasAnimal = false;
	this.isRaining = false;
	this.isFoggy = false;
	this.isStormy = false;
	
	Tile.tempInfluenceMultiplier = 2.0;
	
	this.humidity = 75.0 * pc.math.random(0.75, 1.3); //Current absolute humidity rating
	Tile.humidityBaseMax = 100;
	this.maxHumidity = Tile.humidityBaseMax;
	Tile.humiditySpreadRate = 3.0; //Spreading of humidity to nearby tiles with less relative humidity
	Tile.humidityRegenerationRate = 0.5; //Base constant regeneration (for an ocean tile), modified by tile temperature
	Tile.landHumidityRegenerationMultiplier = 0.25; //Multiplier of above for land tiles
	Tile.humidityDegenerationRate = 30.0; //Loss while raining on tile
	
	this.groundwater = 50.0 * pc.math.random(0.7, 1.3); //Current groundwater rating
	Tile.groundwaterMax = 100;
	Tile.groundwaterSpreadRate = 1.0; //Spreading of water to nearby tiles with less over time
	Tile.groundwaterRegenerationRate = 30.0; //Regeneration when raining on tile
	Tile.groundwaterDegenerationRate = 1.0; //Groundwater loss from trees etc on tile
	
	Tile.atmoHeight = 0.4;
	Tile.rainDuration = 3.0;
	Tile.fogDuration = 4.0;
	Tile.stormDuration = 4.0;
    Tile.stormDelay = 2.5;
    this.stormSize;
	this.rainTimer = 0, this.fogTimer = 0, this.stormTimer = 0;
    this.stormDelayTimer = 0;
	
    this.divided = false;
    
    this.vertexIndices[0] = vertexa;
    this.vertexIndices[1] = vertexb;
    this.vertexIndices[2] = vertexc;
    
    handle = ico;
    ico.indices.push(vertexa);
    ico.indices.push(vertexb);
    ico.indices.push(vertexc);
    
	
	this.update = function(dt) {
		var tempHumidityMultiplier = this.getTemperature() / 100 * 2.0 + 0.25;
		tempHumidityMultiplier = pc.math.clamp(tempHumidityMultiplier, 0.3, 2.0);
        
		this.maxHumidity = Tile.humidityBaseMax * tempHumidityMultiplier;
		
		//Regenerate humidity
        if (this.humidity < this.maxHumidity) {
            if (!this.isOcean) this.humidity += Tile.humidityRegenerationRate * tempHumidityMultiplier * dt;
            else this.humidity += Tile.landHumidityRegenerationMultiplier * Tile.humidityRegenerationRate * tempHumidityMultiplier * dt;
        }
		
		this.checkResourceLimits();
		
		//Handle rain
		if (this.isRaining) {
			if (!this.isOcean) {
				this.humidity -= Tile.humidityDegenerationRate * dt;
				this.groundwater += Tile.groundwaterRegenerationRate * dt;
			} else {
				this.humidity -= Tile.humidityDegenerationRate * dt;
			}
            
			if (this.rain === undefined) this.rain = scripts.Atmosphere.makeRain(this.localRotCenter);
			
			this.rainTimer -= dt;
			if (this.rainTimer <= 0) this.stopRain();
			else if (this.checkAtmoAnimCompleted(this.rain)) {
				//(Re)start rain animation
				if (!this.rain.enabled) this.rain.enabled = true;
				var r = this.rain.findByName("RainPS").particlesystem;
				r.stop();
				r.reset();
				r.play();
			}
		} else if (this.rain !== undefined && this.rain.enabled && this.checkAtmoAnimCompleted(this.rain)) {
			this.rain.enabled = false;
			this.rain = undefined;
		}
		
		this.checkResourceLimits();
		
		//Handle fog(clouds) and storm
        if (this.stormDelayTimer > 0) {
            this.stormDelayTimer -= dt;
			if (this.stormTimer <= 0) this.beginStorm();
        }
        
		if (this.isFoggy) {
			if (this.fog === undefined) this.fog = scripts.Atmosphere.makeFog(this.localRotCenter);
			
			this.stormTimer -= dt;
			if (this.stormTimer <= 0) this.stopStorm();
			
			this.fogTimer -= dt;
			if (this.fogTimer <= 0) this.stopFog();
			else if (this.checkAtmoAnimCompleted(this.fog)) {
				//(Re)start fog animation
				if (!this.fog.enabled) this.fog.enabled = true;
				var f = this.fog.findByName("FogPS").particlesystem;
				f.stop();
				f.reset();
				f.play();
			}
		} else if (this.fog !== undefined && this.fog.enabled && this.checkAtmoAnimCompleted(this.fog)) {
			this.fog.enabled = false;
			this.fog = undefined;
		}
		
		this.checkResourceLimits();
		
		//Spread humidity and groundwater to neighbors
		var neighbors = this.getNeighbors();
		shuffleArray(neighbors); //Choose order randomly each frame to keep the first one from always receiving more than others
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			
			if (this.humidity > 0) {
				if (neighbor.humidity < this.humidity) {
					var diff = (this.humidity - neighbor.humidity) / this.humidity;
					var rate = Tile.humiditySpreadRate * dt * diff;
					if (rate > this.humidity) rate = this.humidity;
					neighbor.humidity += rate;
					this.humidity -= rate;
				}
			}
			
			if (!this.isOcean && this.groundwater > 0) {
				if (!neighbor.isOcean && neighbor.groundwater < this.groundwater) {
					var diff = (this.groundwater - neighbor.groundwater) / this.groundwater;
					var rate = Tile.groundwaterSpreadRate * dt * diff;
					if (rate > this.groundwater) rate = this.groundwater;
					neighbor.groundwater += rate;
					this.groundwater -= rate;
				}
			}
		}
		
		this.checkResourceLimits();
		
		//Grow tree
		if (this.hasTree) {
			///handle tree growing, killing etc here
			this.groundwater -= Tile.groundwaterDegenerationRate * this.tree.stats.waterUsage * this.tree.size * dt;
		}
		
		this.checkResourceLimits();
	};
    
	//Could also be incorporated into the normal update using dt*chance instead of the respawn timer, but this is slightly more 'efficient' (but potentially lagspike inducing)
	this.intermittentUpdate = function() {
		console.log("In intermittentUpdate");
        var temp = this.getTemperature();
		
		this.spawnTree(temp, 0);
		this.spawnAnimal(temp, 2.0);
		
		var rh = (this.humidity / this.maxHumidity) / (lerp(0, 150, temp) * Tile.tempInfluenceMultiplier + 1.0);
		if (this.humidity < 10.0) rh = this.humidity / this.maxHumidity;
        
        if (this.humidity > 0.0) {
            if (Math.random() < rainChance + (rh * rainHumidityChance)) {
                this.startRain();
                this.startFog();
            } else if (Math.random() < fogChance + (rh * fogHumidityChance)) {
                this.startFog();
            }
        }
		
		/*
		if (temp < 0) temp = 0;
		else if (temp > 100) temp = 100;
		
		if (Math.random() < rainChance * (300 / (temp * 4 + 100))) {
			this.startRain();
			this.startFog();
		} else if (Math.random() < fogChance) {
			this.startFog();
		}
		*/
	};
	
	this.checkResourceLimits = function() {
		//if (this.humidity < 0) this.humidity = 0;
		//if (this.humidity > this.maxHumidity) this.humidity = this.maxHumidity;
		
		if (this.groundwater < 0) this.groundwater = 0;
		if (this.groundwater > Tile.groundwaterMax) this.groundwater = Tile.groundwaterMax;
	};

    this.getNorthNeighbor = function() {
        if (this.neighbora.center.y > this.neighborb.center.y && this.neighbora.center.y > this.neighborc.center.y) {
            return this.neighbora;
        }
        if (this.neighborb.center.y > this.neighbora.center.y && this.neighborb.center.y > this.neighborc.center.y) {
            return this.neighborb;
        }
        if (this.neighborc.center.y > this.neighborb.center.y && this.neighborc.center.y > this.neighbora.center.y) {
            return this.neighborc;
        }
    };

    this.getSouthNeighbor = function() {
        if (this.neighbora.center.y < this.neighborb.center.y && this.neighbora.center.y < this.neighborc.center.y) {
            return this.neighbora;
        }
        if (this.neighborb.center.y < this.neighbora.center.y && this.neighborb.center.y < this.neighborc.center.y) {
            return this.neighborb;
        }
        if (this.neighborc.center.y < this.neighborb.center.y && this.neighborc.center.y < this.neighbora.center.y) {
            return this.neighborc;
        }
    };

    this.getWestNeighbor = function() {
        if (Math.acos(this.neighbora.center.x/ico.radius) < Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighbora.center.x/ico.radius) < Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighbora;
        }
        if (Math.acos(this.neighborb.center.x/ico.radius) < Math.acos(this.neighbora.center.x/ico.radius) 
            && Math.acos(this.neighborb.center.x/ico.radius) < Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighborb;
        }
        if (Math.acos(this.neighborc.center.x/ico.radius) < Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighborc.center.x/ico.radius) < Math.acos(this.neighbora.center.x/ico.radius)) {
            return this.neighborc;
        }
    };

    this.getEastNeighbor = function() {
        if (Math.acos(this.neighbora.center.x/ico.radius) > Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighbora.center.x/ico.radius) > Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighbora;
        }
        if (Math.acos(this.neighborb.center.x/ico.radius) > Math.acos(this.neighbora.center.x/ico.radius) 
            && Math.acos(this.neighborb.center.x/ico.radius) > Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighborb;
        }
        if (Math.acos(this.neighborc.center.x/ico.radius) > Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighborc.center.x/ico.radius) > Math.acos(this.neighbora.center.x/ico.radius)) {
            return this.neighborc;
        }
    };

    this.canWalkTo = function(neighbor) {
        var oceanVertCount = 0;

        for (var i = 0; i < this.vertexIndices.length; ++i) {
            for (var j = 0; j < neighbor.vertexIndices.length; ++j) {
                if (this.vertexIndices[i] == neighbor.vertexIndices[j] && ico.vertexGraph[this.vertexIndices[i]].isOcean) {
                    ++oceanVertCount;
                }
            }
        }

        if (oceanVertCount < 2) {
            return true;
        }
        return false;
    }

    this.pathable = function() {
        var volitileCount = 0;

        for (var i = 0; i < this.vertexIndices.length; ++i) {
            if (ico.vertexGraph[this.vertexIndices[i]].isOcean || ico.vertexGraph[this.vertexIndices[i]].isFault) {
                ++volitileCount;
            }
        }

        if (volitileCount < this.vertexIndices.length) {
            this.isPathable = true;
        } else {
            this.isPathable = false;
        }

        return this.isPathable;
    }

    this.getLatitude = function() {
		return pc.math.RAD_TO_DEG * (Math.atan2(this.center.y, this.center.z));
        //return this.center.y/ico.radius;
    };

    this.getLongitude = function() {
        return pc.math.RAD_TO_DEG * (Math.acos(this.center.x/ico.radius));
    };

    this.getAltitude = function() {
    	this.assignType();
        return this.center.length();
    };

    this.getAltitudeOffset = function() {
        return this.center.length() - ico.radius;
    };

    this.determineCost = function() {
        if (!this.isOcean) return -1;
        return this.center.length();
    };
	
	//Called in _recalculateMesh, use the variables instead of the below functions when accessing
	this.calculateRotationVectors = function() {
		this.localRotNormal = this.getRotationAlignedWithNormal();
		this.localRotCenter = this.getRotationAlignedWithSphere();
	};

    this.getRotationAlignedWithNormal = function() {
        //var x = Math.acos(this.center.z/ico.radius) * 180/Math.PI;
        //var y = Math.acos(this.center.x/ico.radius) * 180/Math.PI;
        //var z = Math.acos(this.center.y/ico.radius) * 180/Math.PI;

        //var x = Math.atan2(this.normal.y, this.normal.x) * -180/Math.PI;
        //var y = Math.atan2(this.normal.z, this.normal.x) * -180/Math.PI;
        //var z = Math.atan2(this.normal.x, this.normal.y) * -180/Math.PI;

        var position = new pc.Vec3(0, 0, 0);
        var target = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
        var up = new pc.Vec3(0, 1, 0);
        var m = new pc.Mat4().setLookAt(position, target, up);

        //var x = Math.sin(Math.atan(this.normal.y/this.normal.x)) * Math.cos(Math.acos(this.normal.z)) * 180/Math.PI;
        //var y = Math.sin(Math.atan(this.normal.y/this.normal.x)) * Math.sin(Math.acos(this.normal.z)) * 180/Math.PI;
        //var z = Math.cos(Math.atan(this.normal.y/this.normal.x)) * 180/Math.PI;
        return m.getEulerAngles();//new pc.Vec3(x, y, z);
    };
	
	this.getRotationAlignedWithSphere = function() {
		var position = new pc.Vec3(0, 0, 0);
        var target = new pc.Vec3(this.center.x, this.center.y, this.center.z);
        var up = new pc.Vec3(0, 1, 0);
        var m = new pc.Mat4().setLookAt(position, target, up);
		return m.getEulerAngles();
	};
	
	this.calculateFood = function() {
		//this.food = this.baseFood;
        this.food = this.type.foodVal;
		if (this.hasAnimal) this.food += this.animal.stats.foodContribution * this.animal.size * 12.0;
		if (this.hasTree) this.food += this.tree.stats.foodContribution * this.tree.size * 1.5;
	}
	
	this.setBaseFood = function(newFood) {
		this.baseFood = newFood;
		this.calculateFood();
	}

    this.getFood = function(){
        return this.food;
    };

    this.getTemperature = function(){
        this.temperature = (1.0 - Math.abs(this.center.y/ico.radius))*globalTemperatureMax/2 + globalTemperature/2;
        this.assignType(); // update type of tile when it's temperature changes
        return this.temperature;
    };
	
	//Creates a new tree on this tile if the tree density in the area is too low
	this.spawnTree = function(temperature, size) {
        if (this.hasTree || this.isOcean) return;
		
		var maxDist = 8;
		var localTreeCount = 0.0;
		visitedTileCount = 0.0;
		
		var queue = new Queue();
		var visited = [];
		for (var s = ico.tiles.length-1; s >= 0; s--) visited[s] = false;
		var distances = [];
		for (var s = ico.tiles.length-1; s >= 0; s--) distances[s] = -2;
		
		queue.enqueue(this.index);
		visited[this.index] = true;
		distances[this.index] = 0;
		visitedTileCount++;
		
		while (!queue.isEmpty()) {
			var tileIndex = queue.dequeue();
			var tile = ico.tiles[tileIndex];
			var neighbors = tile.getNeighborIndices();
			
			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];
				if (!visited[neighbor]) {
					if (distances[tileIndex] < maxDist && !ico.tiles[neighbor].isOcean) {
						if (ico.tiles[neighbor].hasTree) localTreeCount++;
						visitedTileCount++;
						
						visited[neighbor] = true;
						queue.enqueue(neighbor);
						distances[neighbor] = distances[tileIndex] + 1;
					}
				} else if (distances[tileIndex] + 1 < distances[neighbor]) {
					distances[neighbor] = distances[tileIndex] + 1;
				}
			}
		}
		
		var localTreeDensity = localTreeCount / visitedTileCount;
		
		if (localTreeDensity < treeDensity) this.createTree(temperature, size);
	};
	
	//Adds a tree to this tile
	this.createTree = function(temperature, size) {
        //position/angle now overridden in the reposition() function below
		var normal = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
		normal.normalize();
		var center = new pc.Vec3(this.center.x, this.center.y, this.center.z);
		center.normalize();
		multScalar(center, 2);
		normal.add(center);
		var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
		var angle = m.getEulerAngles();
		
		//Determine ideal tree type given this tile's current properties
        var dists = [
            this.determineDistanceFromIdeal(Tile.treeStats.tree1, temperature, this.groundwater),
            this.determineDistanceFromIdeal(Tile.treeStats.tree2, temperature, this.groundwater),
            this.determineDistanceFromIdeal(Tile.treeStats.tree4, temperature, this.groundwater)
            //this.determineDistanceFromIdeal(Tile.treeStats.tree3, temperature, this.groundwater)
        ];
		
		//Randomize slightly to provide some variability
        for (var i = 0; i < dists.length; i++) {
            dists[i] *= pc.math.random(0.75, 1.3);
        }
        
        //Sort by dist to find the ideal type
        var type = min(dists, function(v, a) {return v}, null);
        
		this.tree = scripts.Trees.makeTree(this.center, angle, 0, size);
		this.hasTree = true;
		this.calculateFood();
	};
	
	this.removeTree = function() {
		if (this.tree !== undefined) this.tree.destroyFlag = true;
		this.hasTree = false;
		this.calculateFood();
	};
	
	this.determineDistanceFromIdeal = function(tree, temperature, water) {
		var d = 0;
		
		if (temperature < tree.idealTemp) {
			var t = (tree.idealTemp - temperature) / (tree.idealTemp - tree.minTemp);
			d += t;
		} else {
			var t = (temperature - tree.idealTemp) / (tree.maxTemp - tree.idealTemp);
			d += t;
		}
		
		if (water < tree.idealWater) {
			var t = (tree.idealWater - water) / (tree.idealWater - tree.minWater);
			d += t;
		} else {
			var t = (water - tree.idealWater) / (tree.maxWater - tree.idealWater);
			d += t;
		}
		
		return d;
	};
	
	//Creates a new animal on this tile if the animal density in the area is too low
	this.spawnAnimal = function(temperature, size) {
		if (this.hasAnimal || this.isOcean) return;
		
		var maxDist = 12;
		var localAnimalCount = 0.0;
		visitedTileCount = 0.0;
		
		var queue = new Queue();
		var visited = [];
		for (var s = ico.tiles.length-1; s >= 0; s--) visited[s] = false;
		var distances = [];
		for (var s = ico.tiles.length-1; s >= 0; s--) distances[s] = -2;
		
		queue.enqueue(this.index);
		visited[this.index] = true;
		distances[this.index] = 0;
		visitedTileCount++;
		
		while (!queue.isEmpty()) {
			var tileIndex = queue.dequeue();
			var tile = ico.tiles[tileIndex];
			var neighbors = tile.getNeighborIndices();
			
			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];
				if (!visited[neighbor]) {
					if (distances[tileIndex] < maxDist && !ico.tiles[neighbor].isOcean) {
						if (ico.tiles[neighbor].hasAnimal) localAnimalCount++;
						visitedTileCount++;
						
						visited[neighbor] = true;
						queue.enqueue(neighbor);
						distances[neighbor] = distances[tileIndex] + 1;
					}
				} else if (distances[tileIndex] + 1 < distances[neighbor]) {
					distances[neighbor] = distances[tileIndex] + 1;
				}
			}
		}
		
		var localAnimalDensity = localAnimalCount / visitedTileCount;
		
		if (localAnimalDensity < animalDensity) this.createAnimal(temperature, size);
	};
	
	//Adds an animal to this tile
	this.createAnimal = function(temperature, size) {
        //position/angle now overridden in the reposition() function below
		var normal = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
		var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
		var angle = m.getEulerAngles();
		
        //Determine ideal tree type given this tile's current properties
        var dists = [
            this.determineDistanceFromIdeal(Tile.animalStats.fox, temperature, this.groundwater),
            this.determineDistanceFromIdeal(Tile.animalStats.pig, temperature, this.groundwater),
            this.determineDistanceFromIdeal(Tile.animalStats.cow, temperature, this.groundwater)
        ];
		
		//Randomize slightly to provide some variability
        for (var i = 0; i < dists.length; i++) {
            dists[i].dist *= pc.math.random(0.75, 1.3);
        }
        
        //Sort by dist to find the ideal type
        var type = min(dists, function(v, a) {return v}, null);
        
		this.animal = scripts.Animals.makeAnimal(this.center, angle, type, size);
        this.animal.tile = this;
		this.hasAnimal = true;
        this.animal.script.Animal.start();
		this.calculateFood();
	};
	
	this.removeAnimal = function() {
		if (this.animal !== undefined) this.animal.destroyFlag = true;
		this.hasAnimal = false;
		this.calculateFood();
	};
	
	this.startRain = function() {
		this.isRaining = true;
		this.rainTimer = Tile.rainDuration * (this.humidity / this.maxHumidity + 1.0) * pc.math.random(0.8, 1.25);
	};
	
	this.stopRain = function() {
		this.isRaining = false;
	};
	
	this.startFog = function() {
		this.isFoggy = true;
		this.fogTimer = Tile.fogDuration * (this.humidity / this.maxHumidity + 1.0) * pc.math.random(0.8, 1.25);
	};
	
	this.stopFog = function() {
		this.isFoggy = false;
	};
	
    this.startStorm = function(s) {
        this.stormDelayTimer = Tile.stormDelay * (s / 3) * Math.random();
        this.stormSize = s;
    };
    
	this.beginStorm = function() { //really nailing the unique and descriptive identifiers...
        this.isStormy = true;
		this.stormTimer = Tile.stormDuration * (this.stormSize / 3) * pc.math.random(0.5, 1.0);
        
		this.isFoggy = true;
		this.fogTimer = this.stormTimer;
	};
	
	this.stopStorm = function() {
		this.isStormy = false;
	};
	
	this.checkAtmoAnimCompleted = function(e) {
		var rps = e.findByName("RainPS").particlesystem;
		if (rps.enabled) {
			if (!rps.isPlaying()) return true;
			else return false;
		}
		
        var fps = e.findByName("FogPS").particlesystem;
		if (fps.enabled) {
			if (!fps.isPlaying()) return true;
			else return false;
		}
		
		return true;
	}
    
    this.calculateNormal = function(){
        var vectora = this.getVertex(0);
        var vectorb = this.getVertex(1);
        var vectorc = this.getVertex(2);
        
        vectorb.sub(vectora);
		vectorc.sub(vectora);

		this.normal = new pc.Vec3().cross(vectorb,vectorc);
		this.normal.normalize();
    };
    
	// TODO: this should be replaced by a repeller distribution
    this.testExtrude = function() {
        // Test Oceans
		if (!this.neighbora.isOcean || !this.neighborb.isOcean || !this.neighborc.isOcean) {
		    
			this.isOcean = false;
			
			debug.log(DEBUG.WORDGEN, "Extruding");
			
			if (!this.neighborb.isOcean && !this.neighborc.isOcean) {
				ico.setVertexMagnitude(this.vertexIndices[0], parseFloat(Math.random()/10 + ico.radius));
			}
			if (!this.neighbora.isOcean && !this.neighborc.isOcean)
				ico.setVertexMagnitude(this.vertexIndices[1], parseFloat(Math.random()/10 + ico.radius));
			if (!this.neighbora.isOcean && !this.neighborb.isOcean)
				ico.setVertexMagnitude(this.vertexIndices[2], parseFloat(Math.random()/10 + ico.radius));

		this.neighbora.isOcean = false;
		this.neighborb.isOcean = false;
		this.neighborc.isOcean = false;
		}
    };
    
    this.setNeighbors = function(a,b,c){
        this.neighbora = ico.tiles[a];
        this.neighborb = ico.tiles[b];
        this.neighborc = ico.tiles[c];
        this.neighbors[0] = ico.tiles[a];
        this.neighbors[1] = ico.tiles[b];
        this.neighbors[2] = ico.tiles[c];
    };
    
    this.setNeighbor = function(neighbor, index){
        this.neighbors[neighbor] = ico.tiles[index];
        if (neighbor === 0) {
			this.neighbora = ico.tiles[index];
		} else if (neighbor === 1) {
			this.neighborb = ico.tiles[index];
		} else if (neighbor === 2) {
			this.neighborc = ico.tiles[index];
		}
    };

    this.updateNeighbors = function() {
        this.neighbora = this.neighbors[0];
        this.neighborb = this.neighbors[1];
        this.neighborc = this.neighbors[2];
    }
	
	this.getNeighbors = function() {
		return [this.neighbora, this.neighborb, this.neighborc];
	};
	
	this.getNeighborIndices = function() {
		return [this.neighbora.index, this.neighborb.index, this.neighborc.index];
	};
    
    //Returns the land neighbor whose center is closest to the vector, or this if all neighbors are water
    this.getClosestNeighbor = function(vector) {
        var neighbors = this.getNeighbors();
        var neighbor = this;
        var i;
        for (i = 0; i < neighbors.length; i++) {
            if (!neighbors[i].isOcean) {
                neighbor = neighbors[i];
                break;
            }
        }
        if (neighbor === this) return neighbor;
        
        var ndist = distSq(neighbor.center, vector);
        var closestNeighbor = neighbor;
        var closestDistance = ndist;
        
        for (var j = i+1; j < neighbors.length; j++) {
            neighbor = neighbors[j];
            if (!neighbor.isOcean) {
                ndist = distSq(neighbor.center, vector);
                if (ndist < closestDistance) {
                    closestNeighbor = neighbor;
                    closestDistance = ndist;
                }
            }
        }
        
        return closestNeighbor;
    };
    
    //Returns a random land neighbor, or this if no neighbors are land
    this.getRandomNeighbor = function() {
        var r = Math.random();
        if (r < 0.333333 && !this.neighbora.isOcean) return this.neighbora;
        if (r < 0.666666 && !this.neighborb.isOcean) return this.neighborb;
        if (!this.neighborc.isOcean) return this.neighborc;
        return this;
    };
	
	this.getVertex = function(vertexIndex) {
		return ico.vertexGraph[this.vertexIndices[vertexIndex]].getVertex();
	};
    
    this.getVertexIndex = function(vertex){        
        if (vertex.x == ico.vertices[this.vertexIndices[0] * 3] 
            && vertex.y == ico.vertices[this.vertexIndices[0] * 3 + 1]	
            && vertex.z == ico.vertices[this.vertexIndices[0] * 3 + 2]) {
			return parseInt(this.vertexIndices[0]);
		} else if (vertex.x == ico.vertices[this.vertexIndices[1] * 3]
				&& vertex.y == ico.vertices[this.vertexIndices[1] * 3 + 1]
				&& vertex.z == ico.vertices[this.vertexIndices[1] * 3 + 2]) {
			return parseInt(this.vertexIndices[1]);
		} else if (vertex.x == ico.vertices[this.vertexIndices[2] * 3]
				&& vertex.y == ico.vertices[this.vertexIndices[2] * 3 + 1]
				&& vertex.z == ico.vertices[this.vertexIndices[2] * 3 + 2]) {
			return parseInt(this.vertexIndices[2]);
		}
		return -1;
    };
    
    this.getMidpoint = function(verta, vertb){
        midpoint = new pc.Vec3(ico.vertices[this.vertexIndices[verta] * 3], ico.vertices[this.vertexIndices[verta] * 3 + 1], ico.vertices[this.vertexIndices[verta] * 3 + 2]);
		vert2 = new pc.Vec3(ico.vertices[this.vertexIndices[vertb] * 3], ico.vertices[this.vertexIndices[vertb] * 3 + 1], ico.vertices[this.vertexIndices[vertb] * 3 + 2]);
		midpoint.add(vert2);
		midpoint.scale(0.5);
		return midpoint;
    };
	
	this.getMidpoint2 = function(verta, vertb){
        midpoint = this.getVertex(verta);
		vert2 = this.getVertex(vertb);
		midpoint.add(vert2);
		midpoint.scale(0.5);
		return midpoint;
    };
    
    this.calculateCenter = function(){
        var center = this.getMidpoint(0, 1);
        vert = new pc.Vec3(ico.vertices[this.vertexIndices[2] * 3], ico.vertices[this.vertexIndices[2] * 3 + 1], ico.vertices[this.vertexIndices[2] * 3 + 2]);
        center.add(vert);
        center.scale(0.5);
        this.center = center;
        return center;
    };
	
	this.calculateCenter2 = function(){
        var center = this.getMidpoint2(0, 1);
        vert = this.getVertex(2);
        center.add(vert);
        center.scale(0.5);
        this.center = center;
        return center;
    };
    
    this.equals = function(other){
		/*
        return (this.center.x === (other.center.x) &&
                this.center.y === (other.center.y) &&
                this.center.z === (other.center.z));
		*/
		return this.index === other.index;
    }

    this.subdivide = function() {
        //debug.log(DEBUG.AI, "Entering subdivide for face " + this.index);

        // Get the three new midpoint vertices
        var new0 = ico.vertexGraph[this.vertexIndices[1]].getCommonNeighbor(ico.vertexGraph[this.vertexIndices[2]]);
        var new1 = ico.vertexGraph[this.vertexIndices[2]].getCommonNeighbor(ico.vertexGraph[this.vertexIndices[0]]);
        var new2 = ico.vertexGraph[this.vertexIndices[0]].getCommonNeighbor(ico.vertexGraph[this.vertexIndices[1]]);

        //console.log(new0 + " " + new1 + " " + new2);

        this.createSubface(0, this.vertexIndices[0], new2, new1);

        this.createSubface(1, new2, this.vertexIndices[1], new0);

        this.createSubface(2, new1, new0, this.vertexIndices[2]);
        
        this.neighbors[0] = ico.tiles[ico.tiles.length - 3];
        ico.tiles[ico.tiles.length - 3].neighbors[0] = this;

        this.neighbors[1] = ico.tiles[ico.tiles.length - 2];
        ico.tiles[ico.tiles.length - 2].neighbors[1] = this;

        this.neighbors[2] = ico.tiles[ico.tiles.length - 1];
        ico.tiles[ico.tiles.length - 1].neighbors[2] = this;


        this.vertexIndices[0] = new0;
        this.vertexIndices[1] = new1;
        this.vertexIndices[2] = new2;

        this.divided = true;
    };

    this.getNeighborContainingVertex = function(index) {
        for (var i = 0; i < 3; ++i) {
            if (this.neighbors[i].containsVertex(index)) {
                return this.neighbors[i];
            }
        }
        //console.error("Tile " + this.index + " has no neighbors containing vertex " + index);
        //console.log(this);
        //console.log(this.neighbors[0]);
        //console.log(this.neighbors[1]);
        //console.log(this.neighbors[2]);
    }

    this.getNeighborIndexToTile = function(otherIndex) {
        for (var i = 0; i < 3; ++i) {
            if (this.neighbors[i].index == otherIndex) {
                return i;
            }
        }
        //console.error("Tile " + this.index + " has no neighbors to tile " + index);
        //console.log(this);
        //console.log(this.neighbors[0]);
        //console.log(this.neighbors[1]);
        //console.log(this.neighbors[2]);
    }

    this.containsVertex = function(index) {
        return (this.vertexIndices[0] == index || this.vertexIndices[1] == index || this.vertexIndices[2] == index);
    };

    this.createSubface = function(vertex, a, b, c) {
        //console.log("Creating subface " + ico.tiles.length + " for face " + this.index);

        // Create tile
        ico.tiles[ico.tiles.length] = new Tile(ico.tiles.length, a, b, c);
        var newFace = ico.tiles[ico.tiles.length - 1];

        //console.log(newFace);

        this.calculateSubfaceNeighbor(vertex, (vertex + 1) % 3);
        this.calculateSubfaceNeighbor(vertex, (vertex + 2) % 3);

    };

    this.calculateSubfaceNeighbor = function(vertex, neighbor) {

        var newNeighbor = this.neighbors[neighbor];

        // Set the vertex's neighbor if neighbor is divided
        if (this.neighbors[neighbor].divided == true) {
            //console.log("Neighbor " + neighbor + " divided for face " + this.index);

            newNeighbor = this.neighbors[neighbor].getNeighborContainingVertex(this.vertexIndices[vertex]);

            if (newNeighbor == null) {
                //console.log(this);
                //console.log(this.neighbors[neighbor]);
            }

            //console.log(newNeighbor);

            ico.tiles[ico.tiles.length - 1].neighbors[neighbor] = newNeighbor;

            var backNeighbor = newNeighbor.getNeighborIndexToTile(this.index);

            newNeighbor.neighbors[backNeighbor] = ico.tiles[ico.tiles.length - 1];

        } else {

            ico.tiles[ico.tiles.length - 1].neighbors[neighbor] = this.neighbors[neighbor];
        }
    };

    this.hasEntity = function(object) {
        for (var i = 0; i < this.entities.length; ++i) {
            if (this.entities[i] === object) {
                return true;
            }
        }
        return false;
    }

    this.enter = function(object) {
        var index = this.entities.indexOf(object);

        if (index == -1) {
            this.entities.push(object);

            object.tile = this;

            object.altitude = this.center.length();

            object.longitude;

            object.lattitude;

            

        }
    }

    this.leave = function(object) {
        var index = this.entities.indexOf(object);

        if (index != -1) {
            array.splice(index, 1);
        }
    }
    
    this.reposition = function() {
        this.calculateCenter2();
        this.calculateNormal();
        
        //should use the entity array now I guess?
        if (this.hasTree) {
            var normal = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
            normal.normalize();
            var center = new pc.Vec3(this.center.x, this.center.y, this.center.z);
            center.normalize();
            multScalar(center, 2);
            normal.add(center);
            var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
            var angle = m.getEulerAngles();
            this.tree.setPosition(this.center); //should have the tree/animal object handle this itself instead so we can do more fancy positioning than just placing everything on the center
            this.tree.setEulerAngles(angle.x - 90, angle.y, angle.z);
        }
        
        if (this.hasAnimal) {
            var normal = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
            var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
            var angle = m.getEulerAngles();
            this.animal.setPosition(this.center);
            this.animal.setEulerAngles(angle.x - 90, angle.y, angle.z);
        }
    }

    this.linkNodes = function() {
        for (var i = 0; i < this.vertexIndices.length; ++i) {
            ico.vertexGraph[this.vertexIndices[i]].addTile(this);
        }
    }

    this.recalculateGeometry = function() {
        this.calculateCenter2();
        this.calculateNormal();
        this.calculateRotationVectors();

		this.isOcean = false;
        for (var i = 0; i < this.vertexIndices.length; ++i) {
            ico.normals[(this.index * 9) + (i * 3) + 0] = this.normal.x;
            ico.normals[(this.index * 9) + (i * 3) + 1] = this.normal.y;
            ico.normals[(this.index * 9) + (i * 3) + 2] = this.normal.z;
			
			if (ico.vertexGraph[this.vertexIndices[i]].isOcean) this.isOcean = true;
        }

		this.assignType();
    }

    // This should be called after temperatures and altitudes are ever recalculated
    this.assignType = function() {
    	// if tile has temp 30-70 && altitude not mountain height, grassplane
    	if (this.temperature <= TILETYPES.GRASSPLANE.maxTemp && 
    		this.temperature > TILETYPES.GRASSPLANE.minTemp &&
    		this.getAltitudeOffset() < TILETYPES.mountainHeight
    		) {
                this.type = TILETYPES.GRASSPLANE;
            }
    	// if tile has temp 71-100 && altitude not mountain height, dryplane
    	else if (this.temperature <= TILETYPES.DRYPLANE.maxTemp && 
                 this.temperature > TILETYPES.DRYPLANE.minTemp &&
                 this.getAltitudeOffset() < TILETYPES.mountainHeight
    		) {
                this.type = TILETYPES.DRYPLANE;
            }
    	// if tile is land and temp 101+, desert
    	else if (this.temperature > TILETYPES.DESERT.minTemp &&
                 this.getAltitudeOffset() < TILETYPES.mountainHeight
    		) {
                this.type = TILETYPES.DESERT;
            }
    	// if tile has altitude mountain height, mountain
        else if (this.getAltitudeOffset() >= TILETYPES.mountainHeight) {
            this.type = TILETYPES.MOUNTAIN;
        }
    	// if isOcean, water
        if (this.isOcean) {
            this.type = TILETYPES.WATER;
        }
        
        ico.updateFlag = true;
    };
}