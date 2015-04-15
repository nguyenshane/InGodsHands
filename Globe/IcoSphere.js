function IcoSphere(device, radius, subdivisions) {
    'use strict;'

    this.device = device;

    ico = this;

    subdivisions = (subdivisions || 1);

    this.updateFlag = false;

	this.radius = radius;
	
    this.vertices = [];
	this.normals = [];
    this.indices = [];
	
	this.vertexGraph = [];
	this.vertexParents; //?
	this.vertexHeights; //?
	this.graphRows = [];
    
    this.tiles = [];

    this.clusters = [];
	
    this.currentVerts = 12;
    this.currentFaces = 20;

    this.topIndex = 0;
    this.bottomIndex = 11;

	//*** Start setting initial vertices ***

	// Random math for creating the icosphere upright, taken from http://www.vb-helper.com/tutorial_platonic_solids.html
	var S  = this.radius * 2 * Math.sqrt(50 - 10 * Math.sqrt(5)) / 5;
    var t1 = 2 * Math.PI / 5;
    var t2 = Math.PI / 10;
    var t4 = Math.PI / 5;
    var t3 = -3 * Math.PI / 10;
    var R  = (S/2) / Math.sin(t4);
    var H  = Math.cos(t4) * R;
    var Cx = R * Math.cos(t2);
    var Cy = R * Math.sin(t2);
    var H1 = Math.sqrt(S * S - R * R);
    var H2 = Math.sqrt((H + R) * (H + R) - H * H);
    var Z2 = (H2 - H1) / 2;
    var Z1 = Z2 + H1;

    // Hardcode an icosahedron's vertices using the above math
    this.vertices = [  0,  Z1,   0,

					   R,  Z2,   0,
					  Cy,  Z2,  Cx,
					  -H,  Z2,  S/2,
					  -H,  Z2, -S/2,
					  Cy,  Z2,  -Cx,

					   H, -Z2,  S/2,
					 -Cy, -Z2,   Cx,
					  -R, -Z2,    0,
					 -Cy, -Z2,  -Cx,
					   H, -Z2, -S/2,

					   0, -Z1,    0];

	// Hardcode the initial vertex nodes and their neighbors
	// Create node for top vertex
	this.vertexGraph[0] = new VertexNode(0, [0]);
	this.vertexGraph[0].addEdge(DIRECTION.SOUTH, 1);
	this.vertexGraph[0].addEdge(DIRECTION.SOUTH, 2);
	this.vertexGraph[0].addEdge(DIRECTION.SOUTH, 3);
	this.vertexGraph[0].addEdge(DIRECTION.SOUTH, 4);
	this.vertexGraph[0].addEdge(DIRECTION.SOUTH, 5);


	// Create nodes for for second row in clockwise order (looking down)
	this.vertexGraph[1] = new VertexNode(1, [1]);
	this.vertexGraph[1].addEdge(DIRECTION.NORTH, 0);
	this.vertexGraph[1].addEdge(DIRECTION.EAST, 5);
	this.vertexGraph[1].addEdge(DIRECTION.WEST, 2);
	this.vertexGraph[1].addEdge(DIRECTION.SOUTHEAST, 10);
	this.vertexGraph[1].addEdge(DIRECTION.SOUTHWEST, 6);

	this.vertexGraph[2] = new VertexNode(2, [2]);
	this.vertexGraph[2].addEdge(DIRECTION.NORTH, 0);
	this.vertexGraph[2].addEdge(DIRECTION.EAST, 1);
	this.vertexGraph[2].addEdge(DIRECTION.WEST, 3);
	this.vertexGraph[2].addEdge(DIRECTION.SOUTHEAST, 6);
	this.vertexGraph[2].addEdge(DIRECTION.SOUTHWEST, 7);

	this.vertexGraph[3] = new VertexNode(3, [3]);
	this.vertexGraph[3].addEdge(DIRECTION.NORTH, 0);
	this.vertexGraph[3].addEdge(DIRECTION.EAST, 2);
	this.vertexGraph[3].addEdge(DIRECTION.WEST, 4);
	this.vertexGraph[3].addEdge(DIRECTION.SOUTHEAST, 7);
	this.vertexGraph[3].addEdge(DIRECTION.SOUTHWEST, 8);

	this.vertexGraph[4] = new VertexNode(4, [4]);
	this.vertexGraph[4].addEdge(DIRECTION.NORTH, 0);
	this.vertexGraph[4].addEdge(DIRECTION.EAST, 3);
	this.vertexGraph[4].addEdge(DIRECTION.WEST, 5);
	this.vertexGraph[4].addEdge(DIRECTION.SOUTHEAST, 8);
	this.vertexGraph[4].addEdge(DIRECTION.SOUTHWEST, 9);

	this.vertexGraph[5] = new VertexNode(5, [5]);
	this.vertexGraph[5].addEdge(DIRECTION.NORTH, 0);
	this.vertexGraph[5].addEdge(DIRECTION.EAST, 4);
	this.vertexGraph[5].addEdge(DIRECTION.WEST, 1);
	this.vertexGraph[5].addEdge(DIRECTION.SOUTHEAST, 9);
	this.vertexGraph[5].addEdge(DIRECTION.SOUTHWEST, 10);

	// Create nodes for for third row in clockwise order offset by +0.5 from second row
	this.vertexGraph[6] = new VertexNode(6, [6]);
	this.vertexGraph[6].addEdge(DIRECTION.NORTHEAST, 1);
	this.vertexGraph[6].addEdge(DIRECTION.NORTHWEST, 2);
	this.vertexGraph[6].addEdge(DIRECTION.EAST, 10);
	this.vertexGraph[6].addEdge(DIRECTION.WEST, 7);
	this.vertexGraph[6].addEdge(DIRECTION.SOUTH, 11);

	this.vertexGraph[7] = new VertexNode(7, [7]);
	this.vertexGraph[7].addEdge(DIRECTION.NORTHEAST, 2);
	this.vertexGraph[7].addEdge(DIRECTION.NORTHWEST, 3);
	this.vertexGraph[7].addEdge(DIRECTION.EAST, 6);
	this.vertexGraph[7].addEdge(DIRECTION.WEST, 8);
	this.vertexGraph[7].addEdge(DIRECTION.SOUTH, 11);

	this.vertexGraph[8] = new VertexNode(8, [8]);
	this.vertexGraph[8].addEdge(DIRECTION.NORTHEAST, 3);
	this.vertexGraph[8].addEdge(DIRECTION.NORTHWEST, 4);
	this.vertexGraph[8].addEdge(DIRECTION.EAST, 7);
	this.vertexGraph[8].addEdge(DIRECTION.WEST, 9);
	this.vertexGraph[8].addEdge(DIRECTION.SOUTH, 11);

	this.vertexGraph[9] = new VertexNode(9, [9]);
	this.vertexGraph[9].addEdge(DIRECTION.NORTHEAST, 4);
	this.vertexGraph[9].addEdge(DIRECTION.NORTHWEST, 5);
	this.vertexGraph[9].addEdge(DIRECTION.EAST, 8);
	this.vertexGraph[9].addEdge(DIRECTION.WEST, 10);
	this.vertexGraph[9].addEdge(DIRECTION.SOUTH, 11);

	this.vertexGraph[10] = new VertexNode(10, [10]);
	this.vertexGraph[10].addEdge(DIRECTION.NORTHEAST, 5);
	this.vertexGraph[10].addEdge(DIRECTION.NORTHWEST, 1);
	this.vertexGraph[10].addEdge(DIRECTION.EAST, 9);
	this.vertexGraph[10].addEdge(DIRECTION.WEST, 6);
	this.vertexGraph[10].addEdge(DIRECTION.SOUTH, 11);

	// Create node for bottom vertex
	this.vertexGraph[11] = new VertexNode(11, [11]);
	this.vertexGraph[11].addEdge(DIRECTION.NORTH, 6);
	this.vertexGraph[11].addEdge(DIRECTION.NORTH, 7);
	this.vertexGraph[11].addEdge(DIRECTION.NORTH, 8);
	this.vertexGraph[11].addEdge(DIRECTION.NORTH, 9);
	this.vertexGraph[11].addEdge(DIRECTION.NORTH, 10);

	// Set how many vertices are initially in each row
	this.graphRows[0] = 1;
	this.graphRows[1] = 5;
	this.graphRows[2] = 5;
	this.graphRows[3] = 1;

	// Add indices of rows that are edge cases
	// Edge Case 0: between top third of icosphere and middle third
	this.edgeCaseRow1 = 1;
	// Edge Case 1: between middle third of icosphere and bottom third
	this.edgeCaseRow2 = 2;

	//*** End setting initial vertices ***


	
	//*** Start setting initial faces ***

	// Hardcode initial faces
	// 5 faces around point 0
	this.tiles[0] = new Tile(0, 1, 0, 2);
	this.tiles[1] = new Tile(1, 2, 0, 3);
	this.tiles[2] = new Tile(2, 3, 0, 4);
	this.tiles[3] = new Tile(3, 4, 0, 5);
	this.tiles[4] = new Tile(4, 5, 0, 1);
	// 5 adjacent faces
	this.tiles[5] = new Tile(5, 2, 6, 1);
	this.tiles[6] = new Tile(6, 3, 7, 2);
	this.tiles[7] = new Tile(7, 4, 8, 3);
	this.tiles[8] = new Tile(8, 5, 9, 4);
	this.tiles[9] = new Tile(9, 1, 10, 5);
    // 5 faces around point 3
	this.tiles[10] = new Tile(10, 6, 2, 7);
	this.tiles[11] = new Tile(11, 7, 3, 8);
	this.tiles[12] = new Tile(12, 8, 4, 9);
	this.tiles[13] = new Tile(13, 9, 5, 10);
	this.tiles[14] = new Tile(14, 10, 1, 6);
    // 5 faces around point 11
	this.tiles[15] = new Tile(15, 7, 11, 6);
	this.tiles[16] = new Tile(16, 8, 11, 7);
	this.tiles[17] = new Tile(17, 9, 11, 8);
	this.tiles[18] = new Tile(18, 10, 11, 9);
	this.tiles[19] = new Tile(19, 6, 11, 10);

	// Manually set neighbors for 20 faces
	this.tiles[0].setNeighbors(1, 5, 4);
	this.tiles[1].setNeighbors(2, 6, 0);
	this.tiles[2].setNeighbors(3, 7, 1);
	this.tiles[3].setNeighbors(4, 8, 2);
	this.tiles[4].setNeighbors(0, 9, 3);
	
	this.tiles[5].setNeighbors(14, 0, 10);
	this.tiles[6].setNeighbors(10, 1, 11);
	this.tiles[7].setNeighbors(11, 2, 12);
	this.tiles[8].setNeighbors(12, 3, 13);
	this.tiles[9].setNeighbors(13, 4, 14);
	
	this.tiles[10].setNeighbors(6, 15, 5);
	this.tiles[11].setNeighbors(7, 16, 6);
	this.tiles[12].setNeighbors(8, 17, 7);
	this.tiles[13].setNeighbors(9, 18, 8);
	this.tiles[14].setNeighbors(5, 19, 9);
	
	this.tiles[15].setNeighbors(19, 10, 16);
	this.tiles[16].setNeighbors(15, 11, 17);
	this.tiles[17].setNeighbors(16, 12, 18);
	this.tiles[18].setNeighbors(17, 13, 19);
	this.tiles[19].setNeighbors(18, 14, 15);
	

	//Set indices for initial tiles
	for (var i = 0; i < this.tiles.length; i++) {
		this.tiles[i].index = i;
		this.tiles[i].calculateCenter2();
		this.tiles[i].calculateNormal();
	}
    for (var i = 1; i < subdivisions; ++i) {
    	this.subdivideGraph();
    }
    

    for (var i = 0; i < this.vertexGraph.length; i++) {
    	this.vertexGraph[i].stagger(0.075);
    	this.vertexGraph[i].setHeight(ico.radius);
    }
	
	
	//Create non-shared-vertex sphere
	this.unshareVertices();
	
	
	var t2 = new Date();
	console.log("icosphere initialization: " + (t2-t1));
	
	//Generate terrain
	this.vertexHeights = [];
	for (var size = this.vertexGraph.length-1; size >= 0; size--) this.vertexHeights[size] = 0;
	
	var continentBufferDistance = 1.4, repellerCountMultiplier = 0.05,
		repellerSizeMin = 1, repellerSizeMax = 4,
		repellerHeightMin = 0.05, repellerHeightMax = 0.15,
		continentCountMin = 3, continentCountMax = 6,
		continentSizeMin = 10, continentSizeMax = 16,
		mountainCountMin = 5, mountainCountMax = 8,
		mountainHeightMin = 0.13, mountainHeightMax = 0.25;
	
	var initialLocationTiles = [];
	for (var i = 0; i < this.tiles.length; i++) {
		var t = this.tiles[i];
		if (this.vertexGraph[t.vertexIndices[0]].getVertex().z > 1.45) {
			initialLocationTiles.push(t);
			//console.log(i);
			//icosphere.setVertexHeight(t.vertexIndices[0], 1);
		}
	}
	
	//var initialContinentLocation = 650;
	initialContinentLocation = initialLocationTiles[Math.floor(pc.math.random(0, initialLocationTiles.length))].index;
	
	generateTerrain(this, initialContinentLocation, continentBufferDistance, repellerCountMultiplier, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, continentCountMin, continentCountMax, continentSizeMin, continentSizeMax, mountainCountMin, mountainCountMax, mountainHeightMin, mountainHeightMax);
	
	var t3 = new Date();
	console.log("terrain generation: " + (t3-t2));
	
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

IcoSphere.prototype.updateReturnMesh = function() {
	var options = {
        normals: this.normals,
        indices: this.indices
    };

	this.toReturn = {
        mesh: pc.createMesh(this.device, this.vertices, options),
        options: options,
        positions: this.vertices
    };

    this.updateFlag = false;
}

IcoSphere.prototype.setVertexHeight = function(index, height) {
	this.vertexHeights[index] = height;
	this.setVertexMagnitude(index, height + this.radius);
};

IcoSphere.prototype.setVertexMagnitude = function(index, magnitude) {
	this.vertexGraph[index].setHeight(magnitude);
};

//Should only be called once per frame if the mesh has been altered
IcoSphere.prototype._recalculateMesh = function() {
	// Calculate the center and normal for each tile
	var unbufferedNormals = [];
	unbufferedNormals[this.tiles.length*3-1] = 0;
    for (var i = 0; i < this.tiles.length; ++i) {
		var tile = this.tiles[i];
		tile.calculateCenter2();
		tile.calculateNormal();
		tile.calculateRotationVectors();
		tile.isOcean = false;

		//console.log(tile);
		
		var verts = tile.vertexIndices;
		for (var j = 0; j < verts.length; j++) {
			unbufferedNormals[i*3+j] = tile.normal;
			// Uncomment
			if (this.vertexHeights[verts[j]] == 0) tile.isOcean = true;
		}
    }

	
	// Buffer normals
	this.normals = [];
	this.normals[this.vertices.length-1] = 0;
    for (var i = 0; i < unbufferedNormals.length; i++) {
		this.normals[i*3] = unbufferedNormals[i].x;
		this.normals[i*3+1] = unbufferedNormals[i].y;
		this.normals[i*3+2] = unbufferedNormals[i].z;
		//console.log("Normal " + i + ": (" + this.normals[i*3] + ", " + this.normals[i*3+1] + ", " + this.normals[i*3+2] + ")");
    }
};

IcoSphere.prototype._getUnbufferedVertex = function(i) {
	return this.vertexGraph[i].getVertex();
    return new pc.alVec3(this.vertices[i * 3], this.vertices[i * 3 + 1], this.vertices[i * 3 + 2]);
};

IcoSphere.prototype._calculateNumVerts = function(currentVertices, currentFaces, subdivisions) {
    if (subdivisions === 0) return 0;
    return currentVertices + this._calculateNumVerts(parseInt(currentFaces * 1.5), currentFaces * 4, subdivisions - 1);
};

IcoSphere.prototype.subdivideGraph = function() {
	var startingVertNum = this.vertexGraph.length;
	var startingTileNum = this.tiles.length;
	var i = 0;
	
	//console.log("Starting Subdivision...");
	for (; i < startingVertNum; ++i) {
		this.vertexGraph[i].divideEdges();
	}
	//console.log("Divided Edges.");
	
	for (; i < this.vertexGraph.length; ++i) {
		this.vertexGraph[i].calculateNeighbors();
	}
	//console.log("Calculated neighbors.");
	
	for (i = 0; i < this.vertexGraph.length; ++i) {
		this.vertexGraph[i].divided = false;
		//this.vertexGraph[i].setHeight(this.radius);
	}

	for (i = 0; i < startingTileNum; ++i) {
		this.tiles[i].subdivide();
	}

	for (i = 0; i < this.tiles.length; ++i) {
		this.tiles[i].divided = false;
		this.tiles[i].updateNeighbors();
	}
}

//Rebuilds the sphere with distinct vertices for each triangle to allow flat shading
IcoSphere.prototype.unshareVertices = function() {
	var vertexGroups = [];
	var vertexParents = []; //The group that each vertex belongs to
	var vertices = [];
	var bufferedVertices = [];
    var tiles = this.tiles;

	for (var i = 0; i < tiles.length; i++) {
		var tile = tiles[i];
		for (var j = 0; j < tile.vertexIndices.length; j++) {
			//Add each tile's vertex to vertices
			vertices.push(this._getUnbufferedVertex(tile.vertexIndices[j]));

			this.vertexGraph[tile.vertexIndices[j]].addIndex(vertices.length-1);
		}
	}

	for (var i = 0; i < this.vertexGraph.length; ++i) {
		this.vertexGraph[i].deleteFirst();
	}
	
	//Buffer vertices
	for (var i = 0; i < vertices.length; i++) {
		bufferedVertices.push(vertices[i].x);
		bufferedVertices.push(vertices[i].y);
		bufferedVertices.push(vertices[i].z);
	}
	
	//Set data in icosphere
	this.vertexParents = vertexParents;
	this.vertices = bufferedVertices;

	this.indices = [];
	for (var size = vertices.length-1; size >= 0; size--) this.indices[size] = size;
	
	this.tiles = tiles;
};

//Generates a heightmap and applies it to the icosphere's vertices
//Higher repeller count multipliers will result in more landmass,
// lower repeller size will result in more hilly terrain (and less landmass)
function generateTerrain(icosphere, initialContinentLocation, continentBufferDistance, repellerCountMultiplier, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, continentCountMin, continentCountMax, continentSizeMin, continentSizeMax, mountainCountMin, mountainCountMax, mountainHeightMin, mountainHeightMax) {
	var contCount = Math.floor(pc.math.random(continentCountMin, continentCountMax + 0.999));
	var mountainCount = Math.floor(pc.math.random(mountainCountMin, mountainCountMax + 0.999));
	
	console.log("cc: " + contCount);
	
	//Create first continent at the equator facing the camera: 607, 698, 908, 923, 1151, 1166
	var contSize = pc.math.random(continentSizeMin, continentSizeMax);
	var mountains = mountainCount / contCount;
	if (contCount > 0) mountains *= pc.math.random(0.6, 1.4); //Randomize remaining mountain distribution slightly if not on the last continent
	mountains = Math.floor(mountains);
	cluster(icosphere, initialContinentLocation, contSize, Math.floor(contSize * contSize * repellerCountMultiplier) + 1, repellerSizeMin, repellerSizeMax, repellerHeightMin, repellerHeightMax, mountains, mountainHeightMin, mountainHeightMax); //Actually create the continent
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
	for (var size = icosphere.vertexGraph.length-1; size >= 0; size--) visitedIndices[size] = false;
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

//Returns an array of land tile indices within a radius of a tile
function getConnectedTilesInArea(icosphere, centerTile, radius) {
	var tiles = [];
	var queue = new Queue();
	var visited = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) visited[size] = false;
	var distances = [];
	for (var size = icosphere.tiles.length-1; size >= 0; size--) distances[size] = -2;
	
	if (!centerTile.isOcean) {
		queue.enqueue(centerTile);
		visited[centerTile] = true;
		distances[centerTile] = 0;
	}
	
	while (!queue.isEmpty()) {
		var tileIndex = queue.dequeue();
		var tile = icosphere.tiles[tileIndex];
		var neighbors = tile.getNeighborIndices();
		
		for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (!visited[neighbor] && !neighbor.isOcean) {
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