function Tile(icosphere, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.neighborIndices = [];
    this.colors = [];
    //this.neighbora, this.neighborb, this.neighborc;
    
    var normalIndex, hasHuman, divided;
    this.normal;
    this.neighbora;
    this.neighborb;
    this.neighborc;
    
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
    
    
    this.calculateNormal = function(){
        
        var vectora = handle._getUnbufferedVertex(this.vertexIndices[0]);
        var vectorb = handle._getUnbufferedVertex(this.vertexIndices[1]);
        var vectorc = handle._getUnbufferedVertex(this.vertexIndices[2]);
        
    
        vectorb.sub(vectora);
		vectorc.sub(vectora);

		this.normal = new pc.Vec3().cross(vectorb,vectorc);
		
		this.normal.normalize();
		
        
    };
    
    this.testExtrude = function() {
        
				//console.log("Not Ocean!");
        // Test Oceans
		if (!this.neighbora.isOcean || !this.neighborb.isOcean || !this.neighborc.isOcean) {
		    
			this.isOcean = false;
			
			console.log(handle.radius);
			
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
		} else if (neighbor == 1) {
			this.neighborb = handle.tiles[index];
		} else if (neighbor == 2) {
			this.neighborc = handle.tiles[index];
		}
    };
    
    this.getVertexIndex = function(vertex){
        //console.log(vertex, handle.vertices[this.vertexIndices[0] * 3]);
        //console.log(vertex.y, handle.vertices[this.vertexIndices[0] *3 +1 ]);
        //console.log(vertex.z, handle.vertices[this.vertexIndices[0] *3 +2 ]);
        
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
    
    
    this.getCenter = function(){
        center = this.getMidpoint(0,1);
        vert = new pc.Vec3(handle.vertices[this.vertexIndices[2] * 3], handle.vertices[this.vertexIndices[2] * 3 + 1], handle.vertices[this.vertexIndices[2] * 3 + 2]);
        center.add(vert);
        center.scale(0.5);
        return center;
    };
    
    this.toString = function(){
        console.log ("vertexIndices, neighborIndices:",this.vertexIndices, this.neighborIndices);
    };
}