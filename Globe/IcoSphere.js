function IcoSphere(device, radius, subdivisions) {
    'use strict;'
    subdivisions = (subdivisions || 1);

    // golden ratio, phi
    var x = 1;
    var y = 0.5 * (1 + Math.sqrt(5));

    var l = radius / Math.sqrt(x * x + y * y);

    x *= l;
    y *= l;

    var startingVerts = [-x,  y, 0,
						  x,  y, 0,
						 -x, -y, 0,
						  x, -y, 0,

						 0, -x,  y,
						 0,  x,  y,
						 0, -x, -y,
						 0,  x, -y,

						 y,  0, -x,
						 y,  0,  x,
						-y,  0, -x,
						-y,  0,  x];

    var colors = [];
	
	this.radius = radius;
	
    this.vertices = [];
	this.normals = [];
    this.indices = [];
	
	this.vertexGroups;
	this.vertexParents;
	this.vertexHeights;
    
    this.tiles = [];
	
    this.currentVerts = 0;
    this.currentFaces = 20;
	
    var numVerts = this._calculateNumVerts(12, 20, subdivisions);
	var numFaces = (numVerts - 2) * 2;
	
	console.log("numVerts & Faces:",numVerts, numFaces);
	
	// put startingVerts to vertices
	for (; this.currentVerts < startingVerts.length/3; ++this.currentVerts) {
		this.vertices[this.currentVerts * 3] = startingVerts[this.currentVerts * 3];
		this.vertices[this.currentVerts * 3 + 1] = startingVerts[this.currentVerts * 3 + 1];
		this.vertices[this.currentVerts * 3 + 2] = startingVerts[this.currentVerts * 3 + 2];
	}

    for (var i = 0; i < numVerts * 4; i += 4) {
		colors[i] = Math.random();
		colors[i + 1] = 1.0;
		colors[i + 2] = 0.0;
		colors[i + 3] = 1.0;
	}

	// 5 faces around point 0
	this.tiles[0] = new Tile(this, 0, 11, 5);
	this.tiles[1] = new Tile(this, 0, 5, 1);
	this.tiles[2] = new Tile(this, 0, 1, 7);
	this.tiles[3] = new Tile(this, 0, 7, 10);
	this.tiles[4] = new Tile(this, 0, 10, 11);
	// 5 adjacent faces
	this.tiles[5] = new Tile(this, 1, 5, 9);
	this.tiles[6] = new Tile(this, 5, 11, 4);
	this.tiles[7] = new Tile(this, 11, 10, 2);
	this.tiles[8] = new Tile(this, 10, 7, 6);
	this.tiles[9] = new Tile(this, 7, 1, 8);
    // 5 faces around point 3
	this.tiles[10] = new Tile(this, 3, 9, 4);
	this.tiles[11] = new Tile(this, 3, 4, 2);
	this.tiles[12] = new Tile(this, 3, 2, 6);
	this.tiles[13] = new Tile(this, 3, 6, 8);
	this.tiles[14] = new Tile(this, 3, 8, 9);
    // 5 adjacent faces
	this.tiles[15] = new Tile(this, 4, 9, 5);
	this.tiles[16] = new Tile(this, 2, 4, 11);
	this.tiles[17] = new Tile(this, 6, 2, 10);
	this.tiles[18] = new Tile(this, 8, 6, 7);
	this.tiles[19] = new Tile(this, 9, 8, 1);
	// Manually set neighbors for 20 faces
	this.tiles[0].setNeighbors(6, 1, 4);
	this.tiles[1].setNeighbors(5, 2, 0);
	this.tiles[2].setNeighbors(9, 3, 1);
	this.tiles[3].setNeighbors(8, 4, 2);
	this.tiles[4].setNeighbors(7, 0, 3);
	
	this.tiles[5].setNeighbors(15, 19, 1);
	this.tiles[6].setNeighbors(16, 15, 0);
	this.tiles[7].setNeighbors(17, 16, 4);
	this.tiles[8].setNeighbors(18, 17, 3);
	this.tiles[9].setNeighbors(19, 18, 2);
	
	this.tiles[10].setNeighbors(15, 11, 14);
	this.tiles[11].setNeighbors(16, 12, 10);
	this.tiles[12].setNeighbors(17, 13, 11);
	this.tiles[13].setNeighbors(18, 14, 12);
	this.tiles[14].setNeighbors(19, 10, 13);
	
	this.tiles[15].setNeighbors(5, 6, 10);
	this.tiles[16].setNeighbors(6, 7, 11);
	this.tiles[17].setNeighbors(7, 8, 12);
	this.tiles[18].setNeighbors(8, 9, 13);
	this.tiles[19].setNeighbors(9, 5, 14);
	
	//Set indices for initial tiles
	for (var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].index = i;
	}
	
	// Run subdivide
	for (var i = 1; i < subdivisions; ++i) {
    	var jMax = this.currentFaces;
    	
    	for (var j = 0; j < jMax; ++j) {
    		this._subdivideFace(j);
    	}
    		
    	for (j = 0; j < jMax; ++j) {
    		this.tiles[j].divided = false;
    	}
    }
	
	// Normalize to radius
    for (var i = 0; i < this.currentVerts; i++) {
		var vert = this._getUnbufferedVertex(i);
		vert.normalize();
		vert.scale(Math.max(1, Math.min(2, this.radius)));
		this.vertices[i*3] = vert.x;
		this.vertices[i*3 + 1] = vert.y;
		this.vertices[i*3 + 2] = vert.z;
    }
	
	
	//Create non-shared-vertex sphere
	unshareVertices(this);
	
	
	//Generate terrain
	/*
    // Test extrude, this should be where the repellers algorithm be replaced
    for (i = 0; i < this.currentFaces; ++i) {
       tiles[i].testExtrude();
    }
	*/
	this.vertexHeights = [];
	for (var size = this.vertexGroups.length-1; size >= 0; size--) this.vertexHeights[size] = 0;
	
	var continentBufferDistance = 1.4, repellerCountMultiplier = 0.04,
		repellerSizeMin = 1, repellerSizeMax = 3,
		repellerHeightMin = 0.03, repellerHeightMax = 0.07,
		continentCountMin = 3, continentCountMax = 6,
		continentSizeMin = 7, continentSizeMax = 12,
		mountainCountMin = 4, mountainCountMax = 6,
		mountainHeightMin = 0.13, mountainHeightMax = 0.2;
	
	generateTerrain(this, continentBufferDistance, repellerCountMultiplier, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, continentCountMin, continentCountMax, continentSizeMin, continentSizeMax, mountainCountMin, mountainCountMax, mountainHeightMin, mountainHeightMax);
	
	
    // Calculate the center and normal for each tile and build the vertex buffer
	this._recalculateMesh();
	
	
    // Set mesh data
    var options = {
        normals: this.normals,
        indices: this.indices
    };
    
    this.toReturn = {
        mesh: pc.createMesh(device, this.vertices, options),
        options: options,
        positions: this.vertices
    };
    
    return this;
    //this.renderer = new RenderGroup(ctx, new Geometry(ctx, vertices, normals), indices);
}

IcoSphere.prototype.setVertexHeight = function(index, height) {
	this.vertexHeights[index] = height;
	this.setVertexMagnitude(index, height + this.radius);
};

IcoSphere.prototype.setVertexMagnitude = function(index, magnitude) {
	for (var i = 0; i < this.vertexGroups[index].length; i++) {
		var vertexIndex = this.vertexGroups[index][i];
		var vert = this._getUnbufferedVertex(vertexIndex);
		vert.normalize();
		vert.scale(Math.max(1, Math.min(2, magnitude)));
		this.vertices[vertexIndex*3] = vert.x;
		this.vertices[vertexIndex*3 + 1] = vert.y;
		this.vertices[vertexIndex*3 + 2] = vert.z;
	}
};

//Should only be called once per frame if the mesh has been altered
IcoSphere.prototype._recalculateMesh = function() {
	// Calculate the center and normal for each tile
	var unbufferedNormals = [];
	unbufferedNormals[this.currentFaces*3-1] = 0;
    for (var i = 0; i < this.currentFaces; ++i) {
		var tile = this.tiles[i];
		tile.calculateCenter2();
		tile.calculateNormal();
		tile.isOcean = true;
		
		var verts = tile.vertexIndices;
		for (var j = 0; j < verts.length; j++) {
			unbufferedNormals[i*3+j] = tile.normal;
			if (this.vertexHeights[verts[j]] != 0) tile.isOcean = false;
		}
    }
	
	// Buffer normals
	this.normals = [];
	this.normals[this.vertices.length-1] = 0;
    for (var i = 0; i < unbufferedNormals.length; i++) {
		this.normals[i*3] = unbufferedNormals[i].x;
		this.normals[i*3+1] = unbufferedNormals[i].y;
		this.normals[i*3+2] = unbufferedNormals[i].z;
    }
};

IcoSphere.prototype._getUnbufferedVertex = function(i) {
    return new pc.alVec3(this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2]);
};

IcoSphere.prototype._calculateNumVerts = function(currentVertices, currentFaces, subdivisions) {
    if (subdivisions === 0) return 0;
    return currentVertices + this._calculateNumVerts(parseInt(currentFaces * 1.5), currentFaces * 4, subdivisions - 1);
};

IcoSphere.prototype._subdivideFace = function(index) {
    var midpointc = this.tiles[index].getMidpoint(0,1);
    var vertexc;
	
    if (this.tiles[index].neighborc.divided === true) {
		vertexc = this.tiles[index].neighborc.getVertexIndex(midpointc);
		if (vertexc == -1) {
			console.log("Vertex c at tile " + index + ": " + midpointc + "not found.");
		}
	} else {
		vertexc = this.currentVerts;
		this.vertices[this.currentVerts * 3] = midpointc.x;
		this.vertices[this.currentVerts * 3 + 1] = midpointc.y;
		this.vertices[this.currentVerts * 3 + 2] = midpointc.z;
		++this.currentVerts;
	}
	
	var midpointb = this.tiles[index].getMidpoint(0, 2);
	var vertexb;
	if (this.tiles[index].neighborb.divided === true) {
		vertexb = this.tiles[index].neighborb.getVertexIndex(midpointb);
		if (vertexb == -1) {
			console.log("Vertex b at tile " + index + ": " + midpointb + "not found.");
		}
	} else {
		vertexb = this.currentVerts;
		this.vertices[this.currentVerts * 3] = midpointb.x;
		this.vertices[this.currentVerts * 3 + 1] = midpointb.y;
		this.vertices[this.currentVerts * 3 + 2] = midpointb.z;
		++this.currentVerts;
	}
	
	
	var midpointa = this.tiles[index].getMidpoint(1, 2);
    var vertexa;
	if (this.tiles[index].neighbora.divided === true) {
		vertexa = this.tiles[index].neighbora.getVertexIndex(midpointa);
		if (vertexa == -1) {
			console.log("Vertex a at tile " + index + ": " + midpointa + "not found.");
		}
	} else {
		vertexa = this.currentVerts;
		this.vertices[this.currentVerts * 3] = midpointa.x;
		this.vertices[this.currentVerts * 3 + 1] = midpointa.y;
		this.vertices[this.currentVerts * 3 + 2] = midpointa.z;
		++this.currentVerts;
	}
	

	var tilea = this.tiles[this.currentFaces++] = new Tile(this, this.tiles[index].vertexIndices[0], vertexc, vertexb);
	tilea.index = this.currentFaces-1;
	var tileb = this.tiles[this.currentFaces++] = new Tile(this, this.tiles[index].vertexIndices[1], vertexa, vertexc);
	tileb.index = this.currentFaces-1;
	var tilec = this.tiles[this.currentFaces++] = new Tile(this, this.tiles[index].vertexIndices[2], vertexb, vertexa);
	tilec.index = this.currentFaces-1;
	
	var neighbors = this.tiles[index].getNeighborIndices();
	tilea.setNeighbors(neighbors[0], neighbors[1], neighbors[2]);
	tileb.setNeighbors(neighbors[0], neighbors[1], neighbors[2]);
	tilec.setNeighbors(neighbors[0], neighbors[1], neighbors[2]);
	
	if (this.tiles[index].neighborc.divided === true) {
			var ac = null, bb = null;			
			if (this.tiles[index].neighborc.neighbora.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[0])) != -1) {
				ac = this.tiles[index].neighborc.neighbora;
			} if (this.tiles[index].neighborc.neighborb.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[0])) != -1) {
				ac = this.tiles[index].neighborc.neighborb;
			} if (this.tiles[index].neighborc.neighborc.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[0])) != -1) {
				ac = this.tiles[index].neighborc.neighborc;
			}
			if (ac === null) {
				console.log("Tile " + index + " has poor neighbor structure at ac.");
			}
			tilea.neighborc = ac;
			
			ac.neighborb = tilea;
			
			if (this.tiles[index].neighborc.neighbora.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[1])) == this.tiles[index].vertexIndices[1]) {
				bb = this.tiles[index].neighborc.neighbora;
			} else if (this.tiles[index].neighborc.neighborb.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[1])) == this.tiles[index].vertexIndices[1]) {
				bb = this.tiles[index].neighborc.neighborb;
			} else if (this.tiles[index].neighborc.neighborc.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[1])) == this.tiles[index].vertexIndices[1]) {
				bb = this.tiles[index].neighborc.neighborc;
			}
			if (bb === null) {
    			console.log("Tile " + index + " has poor neighbor structure at bb.");
			}
			tileb.neighborb = bb;
			bb.neighborc = tileb;
	}
	
	if (this.tiles[index].neighborb.divided === true) {
			var ab = null, cc = null;
			
			if (this.tiles[index].neighborb.neighbora.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[0])) == this.tiles[index].vertexIndices[0]) {
				ab = this.tiles[index].neighborb.neighbora;
			} else if (this.tiles[index].neighborb.neighborb.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[0])) == this.tiles[index].vertexIndices[0]) {
				ab = this.tiles[index].neighborb.neighborb;
			} else if (this.tiles[index].neighborb.neighborc.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[0])) == this.tiles[index].vertexIndices[0]) {
				ab = this.tiles[index].neighborb.neighborc;
			}
			if (ab === null) {
				console.log("Tile " + index + " has poor neighbor structure at ab.");
			}
			tilea.neighborb = ab;
			ab.neighborc = tilea;
			
			if (this.tiles[index].neighborb.neighbora.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[2])) == this.tiles[index].vertexIndices[2]) {
				cc = this.tiles[index].neighborb.neighbora;
			} else if (this.tiles[index].neighborb.neighborb.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[2])) == this.tiles[index].vertexIndices[2]) {
				cc = this.tiles[index].neighborb.neighborb;
			} else if (this.tiles[index].neighborb.neighborc.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[2])) == this.tiles[index].vertexIndices[2]) {
				cc = this.tiles[index].neighborb.neighborc;
			}
			if (cc === null) {
				console.log("Tile " + index + " has poor neighbor structure at cc.");
			}
			tilec.neighborc = cc;
			cc.neighborb = tilec;
	}
	
	if (this.tiles[index].neighbora.divided === true) {
			var bc = null, cb = null;
			
			if (this.tiles[index].neighbora.neighbora.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[1])) == this.tiles[index].vertexIndices[1]) {
				bc = this.tiles[index].neighbora.neighbora;
			} else if (this.tiles[index].neighbora.neighborb.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[1])) == this.tiles[index].vertexIndices[1]) {
				bc = this.tiles[index].neighbora.neighborb;
			} else if (this.tiles[index].neighbora.neighborc.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[1])) == this.tiles[index].vertexIndices[1]) {
				bc = this.tiles[index].neighbora.neighborc;
			}
			if (bc === null) {
				console.log("Tile " + index + " has poor neighbor structure at bc.");
			}
			tileb.neighborc = bc;
			bc.neighborb = tileb;
			
			if (this.tiles[index].neighbora.neighbora.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[2])) == this.tiles[index].vertexIndices[2]) {
				cb = this.tiles[index].neighbora.neighbora;
			} else if (this.tiles[index].neighbora.neighborb.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[2])) == this.tiles[index].vertexIndices[2]) {
				cb = this.tiles[index].neighbora.neighborb;
			} else if (this.tiles[index].neighbora.neighborc.getVertexIndex(this._getUnbufferedVertex(this.tiles[index].vertexIndices[2])) == this.tiles[index].vertexIndices[2]) {
				cb = this.tiles[index].neighbora.neighborc;
			}
			if (cb === null) {
				console.log("Tile " + index + " has poor neighbor structure at cb.");
			}
			tilec.neighborb = cb;
			cb.neighborc = tilec;
	}
	
	this.tiles[index].vertexIndices[0] = vertexa;
    this.tiles[index].vertexIndices[1] = vertexb;
    this.tiles[index].vertexIndices[2] = vertexc;
    this.indices[index*3] = vertexa;
    this.indices[index*3 + 1] = vertexb;
    this.indices[index*3 + 2] = vertexc;


    tilea.neighbora = this.tiles[index];
    tileb.neighbora = this.tiles[index];
    tilec.neighbora = this.tiles[index];
	
	this.tiles[index].neighbora = tilea;
	this.tiles[index].neighborb = tileb;
	this.tiles[index].neighborc = tilec;
	
	this.tiles[index].divided = true;
};

//Rebuilds the sphere with distinct vertices for each triangle to allow flat shading
function unshareVertices(icosphere) {
	var vertexGroups = [];
	var vertexParents = []; //The group that each vertex belongs to
	var vertices = [];
	var bufferedVertices = [];
    var tiles = icosphere.tiles;

	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		for (var j = 0; j < tile.vertexIndices.length; j++) {
			//Add each tile's vertex to vertices
			vertices.push(icosphere._getUnbufferedVertex(tile.vertexIndices[j]));

			//Group vertices in the same position
			var newV = vertices[vertices.length-1];
			vertexParents[vertices.length-1] = vertexGroups.length;
			for (var k = 0, done = false; k < vertices.length-1 && !done; k++) {
				var v = vertices[k];
				
				//Try to find an existing group for this vertex
				if (v.x === newV.x && v.y === newV.y && v.z === newV.z) {
					vertexParents[vertices.length-1] = vertexParents[k];
					vertexGroups[vertexParents[k]].push(vertices.length-1);
					done = true;
				}
			}
			
			if (vertexParents[vertices.length-1] === vertexGroups.length) {
				vertexGroups.push([vertices.length-1]); //No existing shared vertices found, create a new group with the new vertex
			}
			
			tile.vertexIndices[j] = vertexParents[vertices.length-1]; //Set the tile 'reference' to the vertex group
		}
	}
	
	//Buffer vertices
	for (var i = 0; i < vertices.length; i++) {
		bufferedVertices.push(vertices[i].x);
		bufferedVertices.push(vertices[i].y);
		bufferedVertices.push(vertices[i].z);
	}
	
	//Set data in icosphere
	icosphere.vertexGroups = vertexGroups;
	icosphere.vertexParents = vertexParents;
	icosphere.vertices = bufferedVertices;

	icosphere.indices = [];
	for (var size = vertices.length-1; size >= 0; size--) icosphere.indices[size] = size;
	
	icosphere.tiles = tiles;
};

//Generates a heightmap and applies it to the icosphere's vertices
//Higher repeller count multipliers will result in more landmass,
// lower repeller size will result in more hilly terrain (and less landmass)
function generateTerrain(icosphere, continentBufferDistance, repellerCountMultiplier, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, continentCountMin, continentCountMax, continentSizeMin, continentSizeMax, mountainCountMin, mountainCountMax, mountainHeightMin, mountainHeightMax) {
	var contCount = Math.floor(pc.math.random(continentCountMin, continentCountMax + 0.999));
	var mountainCount = Math.floor(pc.math.random(mountainCountMin, mountainCountMax + 0.999));
	
	console.log("cc: " + contCount);
	
	//Create first continent at the equator facing the camera: 607, 698, 908, 923, 1151, 1166
	var contSize = pc.math.random(continentSizeMin, continentSizeMax);
	var mountains = mountainCount / contCount;
	if (contCount > 0) mountains *= pc.math.random(0.6, 1.4); //Randomize remaining mountain distribution slightly if not on the last continent
	mountains = Math.floor(mountains);
	cluster(icosphere, 698, contSize, Math.floor(contSize * contSize * repellerCountMultiplier) + 1, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, mountains, mountainHeightMin, mountainHeightMax); //Actually create the continent
	mountainCount -= mountains;
	contCount--;
	
	//Create remaining continents
	for (; contCount > 0; contCount--) {
		contSize = pc.math.random(continentSizeMin, continentSizeMax);
		
		//Search for an open area of ocean randomly
		var randomTiles = [];
		for (var size = icosphere.tiles.length-1; size >= 0; size--) randomTiles[size] = size;
		shuffleArray(randomTiles);
		for (var i = 0, done = false; i < icosphere.tiles.length && !done; i++) {
			var center = randomTiles[i]; //Iterates through every tile in random order
			if (checkSurroundingArea(icosphere, center, contSize * continentBufferDistance) === -1) {
				//Create a new continent
				mountains = mountainCount / contCount;
				if (contCount > 0) mountains *= pc.math.random(0.6, 1.4); //Randomize remaining mountain distribution slightly if not on the last continent
				mountains = Math.floor(mountains);
				cluster(icosphere, center, contSize, Math.floor(contSize * contSize * repellerCountMultiplier) + 1, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, mountains, mountainHeightMin, mountainHeightMax); //Actually create the continent
				mountainCount -= mountains;
				done = true;
			}
		}
	}
};

//Helper function of generateTerrain, creates a continent in the heightmap using repeller
function cluster(icosphere, centerTile, radius, repellerCount, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, mountainCount, mountainHeightMin, mountainHeightMax) {
	console.log("--c - " + repellerCount);
	
	var initialRepellerCount = repellerCount;
	
	//Make first repeller at the center
	var repellerSize = Math.floor(pc.math.random(repellerSizeMin, repellerSizeMax + 0.999));
	var repellerHeight;
	if ((mountainCount / repellerCount) * 1.5 > pc.math.random(0, 1)) {
		repellerHeight = pc.math.random(mountainHeightMin, mountainHeightMax);
		mountainCount--;
	} else repellerHeight = pc.math.random(repellerHeightMin, repellerHeightMax);
	repeller(icosphere, centerTile, repellerSize, repellerHeight);
	repellerCount--;
	
	//Add remaining repellers
	while (repellerCount > 0) {
		repellerSize = Math.floor(pc.math.random(repellerSizeMin, repellerSizeMax + 0.999));
		var availTiles = getTilesInArea(icosphere, centerTile, radius - repellerSize); //Get all possible repeller center locations
		shuffleArray(availTiles);
		for (var i = 0, done = false; i < availTiles.length && !done; i++) {
			var center = availTiles[i];
			var dist = checkSurroundingArea(icosphere, center, repellerSize);
			
			if (dist != -1 && dist <= Math.floor(repellerSize * 0.8) + 1 && dist >= Math.floor(repellerSize * 0.4)) { //Make sure the location is within range of existing land but not too close
				//Add a new repeller
				if ((mountainCount / repellerCount) * (repellerCount / initialRepellerCount + 0.5) > pc.math.random(0, 1)) { //More likely to create mountains early on
					repellerHeight = pc.math.random(mountainHeightMin, mountainHeightMax);
					repellerSize = Math.floor(pc.math.random(repellerSizeMin + 1, repellerSizeMax + 0.999));
					mountainCount--;
				} else repellerHeight = pc.math.random(repellerHeightMin, repellerHeightMax);
				repeller(icosphere, center, repellerSize, repellerHeight);
				repellerCount--;
				done = true;
			}
		}
		
		if (!done) {
			console.log(repellerCount);
			repellerCount = 0;
			console.log("n");
		}
	}
};

//Helper function of cluster, raises a portion of land around the center tile
function repeller(icosphere, centerTile, radius, centerHeight) {
	console.log("r - " + radius);
	
	var queue = new Queue();
	var visitedIndices = [];
	for (var size = icosphere.vertexGroups.length-1; size >= 0; size--) visitedIndices[size] = false;
	var visited = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) visited[size] = false;
	var distances = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) distances[size] = -2;
	
	var dropoffRate = centerHeight / radius;
	var tileIndex = centerTile;
	var tile = icosphere.tiles[tileIndex];
	var neighbors = tile.getNeighborIndices();
	
	//Raise center tile
	visited[centerTile] = true;
	distances[centerTile] = 0;
	for (var i = 0; i < tile.vertexIndices.length; i++) {
		icosphere.setVertexHeight(tile.vertexIndices[i], centerHeight + pc.math.random(-0.5, 0.5) * dropoffRate);
		visitedIndices[tile.vertexIndices[i]] = true;
	}
	for (var i = 0; i < neighbors.length; i++) {
		visited[neighbors[i]] = true;
		distances[neighbors[i]] = distances[tileIndex] + 1;
		queue.enqueue(neighbors[i]);
	}

	//Raise surrounding tiles
	while (!queue.isEmpty()) {
		tileIndex = queue.dequeue();
		tile = icosphere.tiles[tileIndex];
		neighbors = tile.getNeighborIndices();
		
		//Find height of the two existing land vertices that have already been repelled
		var prevHeights = [];
		for (var i = 0; i < tile.vertexIndices.length; i++) {
			if (visitedIndices[tile.vertexIndices[i]]) {
				prevHeights.push(icosphere.vertexHeights[tile.vertexIndices[i]]);
			}
		}
		var totalPrevHeight = 0;
		for (var i = 0; i < prevHeights.length; i++) totalPrevHeight += prevHeights[i];
		var avgPrevHeight = totalPrevHeight / prevHeights.length;
		
		//Calculate new vertex's height
		var newHeight = avgPrevHeight - (dropoffRate * pc.math.random(-0.3, 1.2));
		var linearHeight = centerHeight - (dropoffRate * distances[tileIndex]);
		if (newHeight < linearHeight - dropoffRate) newHeight += dropoffRate; //Prevent heights from varying too much to keep repeller radius in check
		else if (newHeight > linearHeight + dropoffRate) newHeight -= dropoffRate;
		if (newHeight < 0) newHeight = 0;
		
		//Repel remaining vertex
		for (var i = 0; i < tile.vertexIndices.length; i++) {
			if (!visitedIndices[tile.vertexIndices[i]]) {
				visitedIndices[tile.vertexIndices[i]] = true;
				
				if (icosphere.vertexHeights[tile.vertexIndices[i]] != 0) {
					//Vertex has already been repelled by another repeller, move it again if new height is higher to keep terrain smooth
					if (newHeight > icosphere.vertexHeights[tile.vertexIndices[i]]) {
						icosphere.setVertexHeight(tile.vertexIndices[i], newHeight);
					}
				} else {
					icosphere.setVertexHeight(tile.vertexIndices[i], newHeight);
				}
			}
		}

		//Repel adjacent tiles if new vertex is above sea level
		if (newHeight > 0) {
			for (var i = 0; i < neighbors.length; i++) {
				var neighbor = neighbors[i];
				if (!visited[neighbor]) {
					if (distances[tileIndex] < radius) {
						visited[neighbor] = true;
						queue.enqueue(neighbor);
						distances[neighbor] = distances[tileIndex] + 1;
					}
				} else if (distances[tileIndex] + 1 < distances[neighbor]) {
					distances[neighbor] = distances[tileIndex] + 1;
				}
			}
		}
	}
};

//Helper function of generateTerrain, returns distance to nearest land tile or -1 if no land tiles found in radius
function checkSurroundingArea(icosphere, centerTile, radius) {
	var queue = new Queue();
	var visited = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) visited[size] = false;
	var land = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) land[size] = false;
	var distances = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) distances[size] = -2;
	var shortestDistance = -1;
	
	queue.enqueue(centerTile);
	visited[centerTile] = true;
	distances[centerTile] = 0;
	while (!queue.isEmpty()) {
		var tileIndex = queue.dequeue();
		var tile = icosphere.tiles[tileIndex];
		var neighbors = tile.getNeighborIndices();
		
		if (icosphere.vertexHeights[tile.vertexIndices[0]] != 0 ||
			icosphere.vertexHeights[tile.vertexIndices[1]] != 0 ||
			icosphere.vertexHeights[tile.vertexIndices[2]] != 0) {
				//Found a land tile
				land[tileIndex] = true;
				if (shortestDistance === -1 || distances[tileIndex] < shortestDistance) {
					shortestDistance = distances[tileIndex];
				}
		}
		
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (!visited[neighbor]) {
				if (distances[tileIndex] < radius) {
					visited[neighbor] = true;
					queue.enqueue(neighbor);
					distances[neighbor] = distances[tileIndex] + 1;
				}
			} else if (distances[tileIndex] + 1 < distances[neighbor]) {
				distances[neighbor] = distances[tileIndex] + 1;
				if (land[neighbor]) {
					if (shortestDistance === -1 || distances[neighbor] < shortestDistance) {
						shortestDistance = distances[neighbor];
					}
				}
			}
		}
	}
	
	return shortestDistance;
};

//Returns an array of tile indices within a radius of a tile
function getTilesInArea(icosphere, centerTile, radius) {
	var tiles = [];
	var queue = new Queue();
	var visited = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) visited[size] = false;
	var distances = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) distances[size] = -2;
	
	queue.enqueue(centerTile);
	visited[centerTile] = true;
	distances[centerTile] = 0;
	while (!queue.isEmpty()) {
		var tileIndex = queue.dequeue();
		var tile = icosphere.tiles[tileIndex];
		var neighbors = tile.getNeighborIndices();
		
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (!visited[neighbor]) {
				if (distances[tileIndex] < radius) {
					visited[neighbor] = true;
					queue.enqueue(neighbor);
					distances[neighbor] = distances[tileIndex] + 1;
					tiles.push(neighbor);
				}
			} else if (distances[tileIndex] + 1 < distances[neighbor]) {
				distances[neighbor] = distances[tileIndex] + 1;
			}
		}
	}

	return tiles;
};