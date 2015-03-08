function Tile(icosphere, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.colors = [];
    this.neighbora, this.neighborb, this.neighborc;
	
    var normalIndex, hasHuman, divided;
	this.index;
    this.normal;
    this.center;
	this.localRotNormal;
	this.localRotCenter;
    this.neighbora;
    this.neighborb;
    this.neighborc;
    
    this.temperature;
    this.food = Math.floor(Math.random() * (5 - 1)) + 1;
	
	this.rain, this.fog;

    this.isOcean = true;
	this.hasTree = false;
	this.isRaining = false;
	this.isFoggy = false;
	
	this.atmoHeight = 0.4;
	this.rainDuration = 4;
	this.fogDuration = 5;
	this.rainTimer = 0, this.fogTimer = 0;
	
    handle = icosphere;
	ico = handle;
    this.divided = false;
    this.hasHuman = false;
    
    this.vertexIndices[0] = vertexa;
    this.vertexIndices[1] = vertexb;
    this.vertexIndices[2] = vertexc;
    
    handle.indices.push(vertexa);
    handle.indices.push(vertexb);
    handle.indices.push(vertexc);

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
	
	this.startRain = function() {
		if (this.rain !== undefined) {
			this.rain.enabled = true;
		} else {
			var atmo = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script.Atmosphere;
			this.rain = atmo.makeRain(extendVector(this.center, this.atmoHeight), this.localRotCenter);
		}
		
		this.isRaining = true;
		this.rainTimer = this.rainDuration;
	};
	
	this.stopRain = function() {
		if (this.rain !== undefined) {
			this.rain.destroy = true;
			this.rain = undefined;
		}
		
		this.isRaining = false;
	};
	
	this.startFog = function() {
		if (this.fog !== undefined) {
			this.fog.enabled = true;
		} else {
			var atmo = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script.Atmosphere;
			this.fog = atmo.makeFog(extendVector(this.center, this.atmoHeight), this.localRotCenter);
		}
		
		this.isFoggy = true;
		this.fogTimer = this.fogDuration;
	};
	
	this.stopFog = function() {
		if (this.fog !== undefined) {
			this.fog.destroy = true;
			this.fog = undefined;
		}
		
		this.isFoggy = false;
	};
    
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
		return ico.vertexGraph[this.vertexIndices[vertexIndex]].getVertex();
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