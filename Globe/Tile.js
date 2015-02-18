function Tile(icosphere, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.neighborIndices = [];
    this.colors = [];
    this.neighbora, this.neighborb, this.neighborc;
	
    var normalIndex, hasHuman, divided;
    this.normal;
    this.center;
    this.neighbora;
    this.neighborb;
    this.neighborc;
    
    this.temperature;
    this.food = Math.floor(Math.random() * (5 - 1)) + 1;

    this.isOcean = (Math.random()>0.01) ? true : false;
    handle = icosphere;
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
        return this.center.y/ico.radius;
    };

    this.getLongitude = function() {
        return Math.acos(this.center.x/ico.radius);
    };

    this.getAltitude = function() {
        return this.center.length/ico.radius;
    };

    this.determineCost = function() {
        if (!this.isOcean) return -1;
        return this.center.length;
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

    this.getFood = function(){
        return this.food;
    };

    this.getTemperature = function(){
        this.temperature = (1.0 - Math.abs(this.center.y/ico.radius))*globalTemperature
        return this.temperature;
    };
    
   
    this.calculateNormal = function(){
        var vectora = handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[0]][0]);
        var vectorb = handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[1]][0]);
        var vectorc = handle._getUnbufferedVertex(handle.vertexGroups[this.vertexIndices[2]][0]);
        
        vectorb.sub(vectora);
		vectorc.sub(vectora);

		this.normal = new pc.Vec3().cross(vectorb,vectorc);
		
		/*
		if (this.normal.dot(this.center) < 0) {
			this.normal.x *= -1;
			this.normal.y *= -1;
			this.normal.z *= -1;
		}
		*/
		
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
        this.neighborIndices[0] = a;
		this.neighborIndices[1] = b;
		this.neighborIndices[2] = c;
    };
    
    this.setNeighbor = function(neighbor, index){
        if (neighbor === 0) {
			this.neighbora = handle.tiles[index];
		} else if (neighbor === 1) {
			this.neighborb = handle.tiles[index];
		} else if (neighbor === 2) {
			this.neighborc = handle.tiles[index];
		}
		
		this.neighborIndices[neighbor] = index;
    };
    
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
    
    
    this.calculateCenter = function(){
        var center = this.getMidpoint(0,1);
        vert = new pc.Vec3(handle.vertices[this.vertexIndices[2] * 3], handle.vertices[this.vertexIndices[2] * 3 + 1], handle.vertices[this.vertexIndices[2] * 3 + 2]);
        center.add(vert);
        center.scale(0.5);
        this.center = center;
        return center;
    };
    
    //this.toString = function(){
    //    console.log ("vertexIndices, neighborIndices:",this.vertexIndices, this.neighborIndices);
    //};

    this.equals = function(other){
        return (this.center.x === (other.center.x) &&
                this.center.y === (other.center.y) &&
                this.center.z === (other.center.z));
    }
}