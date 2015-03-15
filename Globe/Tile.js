function Tile(icosphere, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.colors = [];
	
    var normalIndex, hasTribe, divided;
	this.index;
    this.normal, this.center;
	this.localRotNormal, this.localRotCenter;
    this.neighbora, this.neighborb, this.neighborc;
    
    this.temperature;
    this.food = Math.floor(Math.random() * (5 - 1)) + 1;
	
	this.tree, this.rain, this.fog;

    this.isOcean = true;
	this.hasTree = false;
	this.isRaining = false;
	this.isFoggy = false;
	
	this.humidity = 50.0 * pc.math.random(0.75, 1.25); //Current absolute humidity rating
	Tile.humidityBaseMax = 100;
	this.maxHumidity = Tile.humidityBaseMax;
	Tile.humiditySpreadRate = 5.0; //Spreading of humidity to nearby tiles with less relative humidity
	Tile.humidityRegenerationRate = 2.0; //Constant regeneration (for an ocean tile)
	Tile.landHumidityRegenerationMultiplier = 0.25; //Multiplier of above for land tiles
	Tile.humidityDegenerationRate = 0.5; //Loss while raining on tile
	
	this.groundwater = 50.0 * pc.math.random(0.7, 1.3); //Current groundwater rating
	Tile.groundwaterMax = 100;
	Tile.groundwaterSpreadRate = 1.0; //Spreading of water to nearby tiles with less over time
	Tile.groundwaterRegenerationRate = 0.5; //Regeneration when raining on tile
	Tile.groundwaterDegenerationRate = 1.0; //Groundwater loss from trees etc on tile
	
	Tile.atmoHeight = 0.4;
	Tile.rainDuration = 3;
	Tile.fogDuration = 5;
	this.rainTimer = 0, this.fogTimer = 0;
	
	Tile.treeStats = {
		tree1: {
			minTemp: 30,
			maxTemp: 100,
			idealTemp: 60,
			minWater: 50,
			maxWater: 100,
			idealWater: 80,
			waterUsage: 1.0,
			growRate: 0.75
		},
		
		tree2: {
			minTemp: 60,
			maxTemp: 140,
			idealTemp: 100,
			minWater: 30,
			maxWater: 100,
			idealWater: 50,
			waterUsage: 0.6,
			growRate: 1.0
		}
	};
	
    handle = icosphere;
	ico = handle;
    this.divided = false;
    this.hasTribe = false;
    
    this.vertexIndices[0] = vertexa;
    this.vertexIndices[1] = vertexb;
    this.vertexIndices[2] = vertexc;
    
    handle.indices.push(vertexa);
    handle.indices.push(vertexb);
    handle.indices.push(vertexc);
	
	this.update = function(dt) {
		var tempHumidityMultiplier = this.getTemperature() / 200 + 0.5;
		if (tempHumidityMultiplier < 0.2) tempHumidityMultiplier = 0.2;
		
		this.maxHumidity = Tile.humidityBaseMax * tempHumidityMultiplier;
		
		if (!this.isOcean) this.humidity += Tile.humidityRegenerationRate * tempHumidityMultiplier * dt;
		else this.humidity += Tile.landHumidityRegenerationMultiplier * Tile.humidityRegenerationRate * tempHumidityMultiplier * dt;
		
		this.checkResourceLimits();
		
		if (this.isRaining) {
			if (!this.isOcean) {
				this.humidity -= Tile.humidityDegenerationRate * dt;
				this.groundwater += Tile.groundwaterRegenerationRate * dt;
			} else {
				this.humidity -= Tile.humidityDegenerationRate * dt;
			}
			
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
		} else if (this.rain.enabled && this.checkAtmoAnimCompleted(this.rain)) {
			this.rain.enabled = false;
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
					neighbor.humidity += rate;
					this.humidity -= rate;
				}
			}
			
			if (!this.isOcean && this.groundwater > 0) {
				if (!neighbor.isOcean && neighbor.groundwater < this.groundwater) {
					var diff = (this.groundwater - neighbor.groundwater) / this.groundwater;
					var rate = Tile.groundwaterSpreadRate * dt * diff;
					neighbor.groundwater += rate;
					this.groundwater -= rate;
				}
			}
		}
		
		this.checkResourceLimits();
		
		//Grow tree
		if (this.hasTree) {
			///handle tree growing, killing etc here
			this.groundwater -= Tile.groundwaterDegenerationRate * this.tree.stats.waterUsage * this.tree.getLocalScale().x * dt;
		}
		
		this.checkResourceLimits();
		
		if (this.isFoggy) {
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
		} else if (this.fog.enabled && this.checkAtmoAnimCompleted(this.fog)) {
			this.fog.enabled = false;
		}
	};
	
	//Could also be incorporated into the normal update using dt*chance instead of the respawn timer, but this is slightly more 'efficient' (but potentially lagspike inducing)
	this.intermittentUpdate = function() {
		var temp = this.getTemperature();
		
		this.spawnTree(temp, 0);
		
		var rh = (this.humidity / 100) / ((temp * 2 / 100) + 0.5);
		if (this.humidity < 10.0) rh = this.humidity / 100;
		
		if (Math.random() < rainChance + (rh * rainHumidityChance)) {
			this.startRain();
			this.startFog();
		} else if (Math.random() < fogChance + (rh * fogHumidityChance)) {
			this.startFog();
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
		if (this.humidity < 0) this.humidity = 0;
		if (this.humidity > this.maxHumidity) this.humidity = this.maxHumidity;
		
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

    this.getLatitude = function() {
		return pc.math.RAD_TO_DEG * (Math.atan2(this.center.y, this.center.z));
        //return this.center.y/ico.radius;
    };

    this.getLongitude = function() {
        return pc.math.RAD_TO_DEG * (Math.acos(this.center.x/ico.radius));
    };

    this.getAltitude = function() {
        return this.center.length;
    };

    this.getAltitudeOffset = function() {
        return this.center.length - ico.radius;
    };

    this.determineCost = function() {
        if (!this.isOcean) return -1;
        return this.center.length;
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

    this.getFood = function(){
        return this.food;
    };

    this.getTemperature = function(){
        this.temperature = (1.0 - Math.abs(this.center.y/ico.radius))*globalTemperatureMax/2 + globalTemperature/2;
        return this.temperature;
    };
	
	//Creates a new tree on this tile if the tree density in the area is too low
	this.spawnTree = function(temperature, size) {
		if (this.hasTree || this.isOcean) return;
		
		var maxDist = 3;
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
		var normal = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
		normal.normalize();
		var center = new pc.Vec3(this.center.x, this.center.y, this.center.z);
		center.normalize();
		multScalar(center, 2);
		normal.add(center);
		var m = new pc.Mat4().setLookAt(new pc.Vec3(0, 0, 0), normal, new pc.Vec3(0, 1, 0));
		var angle = m.getEulerAngles();
		
		//Determine ideal tree type given this tile's current properties
		var t1dist = this.determineDistanceFromIdeal(Tile.treeStats.tree1, temperature, this.groundwater);
		var t2dist = this.determineDistanceFromIdeal(Tile.treeStats.tree2, temperature, this.groundwater);
		
		t2dist *= pc.math.random(0.8, 1.2); //Randomize slightly to provide some variability
		
		var type = 0;
		if (t2dist < t1dist) type = 1;
		
		this.tree = scripts.Trees.makeTree(this.center, angle, type, size);
		this.hasTree = true;
	};
	
	this.removeTree = function() {
		if (this.tree !== undefined) this.tree.destroyFlag = true;
		this.hasTree = false;
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
	
	this.startRain = function() {
		this.isRaining = true;
		this.rainTimer = Tile.rainDuration;
	};
	
	this.stopRain = function() {
		this.isRaining = false;
	};
	
	this.startFog = function() {
		this.isFoggy = true;
		this.fogTimer = Tile.fogDuration;
	};
	
	this.stopFog = function() {
		this.isFoggy = false;
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
        var vectora = handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[0]][0]);
        var vectorb = handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[1]][0]);
        var vectorc = handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[2]][0]);
        
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
			
			console.log("Extruding");
			
			if (!this.neighborb.isOcean && !this.neighborc.isOcean) {
				handle.setVertexMagnitude(this.vertexIndices[0], parseFloat(Math.random()/10 + handle.radius));
			}
			if (!this.neighbora.isOcean && !this.neighborc.isOcean)
				handle.setVertexMagnitude(this.vertexIndices[1], parseFloat(Math.random()/10 + handle.radius));
			if (!this.neighbora.isOcean && !this.neighborb.isOcean)
				handle.setVertexMagnitude(this.vertexIndices[2], parseFloat(Math.random()/10 + handle.radius));

		this.neighbora.isOcean = false;
		this.neighborb.isOcean = false;
		this.neighborc.isOcean = false;
		}
    };
    
    this.setNeighbors = function(a,b,c){
        this.neighbora = handle.tiles[a];
        this.neighborb = handle.tiles[b];
        this.neighborc = handle.tiles[c];
    };
    
    this.setNeighbor = function(neighbor, index){
        if (neighbor === 0) {
			this.neighbora = handle.tiles[index];
		} else if (neighbor === 1) {
			this.neighborb = handle.tiles[index];
		} else if (neighbor === 2) {
			this.neighborc = handle.tiles[index];
		}
    };
	
	this.getNeighbors = function() {
		return [this.neighbora, this.neighborb, this.neighborc];
	};
	
	this.getNeighborIndices = function() {
		return [this.neighbora.index, this.neighborb.index, this.neighborc.index];
	};
	
	this.getVertex = function(vertexIndex) {
		return handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[vertexIndex]][0]);
	}
    
    this.getVertexIndex = function(vertex){        
        if (vertex.x == handle.vertices[this.vertexIndices[0] * 3] 
            && vertex.y == handle.vertices[this.vertexIndices[0] * 3 + 1]	
            && vertex.z == handle.vertices[this.vertexIndices[0] * 3 + 2]) {
			return parseInt(this.vertexIndices[0]);
		} else if (vertex.x == handle.vertices[this.vertexIndices[1] * 3]
				&& vertex.y == handle.vertices[this.vertexIndices[1] * 3 + 1]
				&& vertex.z == handle.vertices[this.vertexIndices[1] * 3 + 2]) {
			return parseInt(this.vertexIndices[1]);
		} else if (vertex.x == handle.vertices[this.vertexIndices[2] * 3]
				&& vertex.y == handle.vertices[this.vertexIndices[2] * 3 + 1]
				&& vertex.z == handle.vertices[this.vertexIndices[2] * 3 + 2]) {
			return parseInt(this.vertexIndices[2]);
		}
		return -1;
    };
    
    this.getMidpoint = function(verta, vertb){
        midpoint = new pc.Vec3(handle.vertices[this.vertexIndices[verta] * 3], handle.vertices[this.vertexIndices[verta] * 3 + 1], handle.vertices[this.vertexIndices[verta] * 3 + 2]);
		vert2 = new pc.Vec3(handle.vertices[this.vertexIndices[vertb] * 3], handle.vertices[this.vertexIndices[vertb] * 3 + 1], handle.vertices[this.vertexIndices[vertb] * 3 + 2]);
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
        vert = new pc.Vec3(handle.vertices[this.vertexIndices[2] * 3], handle.vertices[this.vertexIndices[2] * 3 + 1], handle.vertices[this.vertexIndices[2] * 3 + 2]);
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
}