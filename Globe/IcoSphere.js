pc.alVec3.constructor = function(){
	this.data = [];

	if (arguments.length === 3) {
		this.data.push(arguments[0]);
		this.data.push(arguments[1]);
		this.data.push(arguments[2]);
	} else {
		this.data[0] = 0;
		this.data[1] = 0;
		this.data[2] = 0;
	}
};

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

    var normals = [];
    var colors = [];
    this.vertices = [];
    vertices = this.vertices;
    
    this.radius = radius;
    
    this.indices = [];
    indices = this.indices;
    
    this.tiles = [];
    tiles = this.tiles;
    this.currentVerts = 0;
    this.currentFaces = 20;
    var numVerts = this._calculateNumVerts(12, 20, subdivisions);
	var numFaces = (numVerts - 2) * 2;
	
	console.log("numVerts & Faces:",numVerts, numFaces);
	
	// put statingVerts to vertices
	for (; this.currentVerts < startingVerts.length/3; ++this.currentVerts) {
			vertices[this.currentVerts * 3] = startingVerts[this.currentVerts * 3];
			vertices[this.currentVerts * 3 + 1] = startingVerts[this.currentVerts * 3 + 1];
			vertices[this.currentVerts * 3 + 2] = startingVerts[this.currentVerts * 3 + 2];
		}
		
	//console.log("startingverts:", startingVerts);
    
    
    
    for (var i = 0; i < numVerts * 4; i += 4) {
			colors[i] = Math.random();
			colors[i + 1] = 1.0;
			colors[i + 2] = 0.0;
			colors[i + 3] = 1.0;
			
	}
	//console.log("colors:", colors);
	// 5 faces around point 0
	tiles[0] = new Tile(this, 0, 11, 5);
	tiles[1] = new Tile(this, 0, 5, 1);
	tiles[2] = new Tile(this, 0, 1, 7);
	tiles[3] = new Tile(this, 0, 7, 10);
	tiles[4] = new Tile(this, 0, 10, 11);
	// 5 adjacent faces
	tiles[5] = new Tile(this, 1, 5, 9);
	tiles[6] = new Tile(this, 5, 11, 4);
	tiles[7] = new Tile(this, 11, 10, 2);
	tiles[8] = new Tile(this, 10, 7, 6);
	tiles[9] = new Tile(this, 7, 1, 8);
    // 5 faces around point 3
	tiles[10] = new Tile(this, 3, 9, 4);
	tiles[11] = new Tile(this, 3, 4, 2);
	tiles[12] = new Tile(this, 3, 2, 6);
	tiles[13] = new Tile(this, 3, 6, 8);
	tiles[14] = new Tile(this, 3, 8, 9);
    // 5 adjacent faces
	tiles[15] = new Tile(this, 4, 9, 5);
	tiles[16] = new Tile(this, 2, 4, 11);
	tiles[17] = new Tile(this, 6, 2, 10);
	tiles[18] = new Tile(this, 8, 6, 7);
	tiles[19] = new Tile(this, 9, 8, 1);
	// Manually set neighbors for 20 faces
	tiles[0].setNeighbors(6, 1, 4);
	tiles[1].setNeighbors(5, 2, 0);
	tiles[2].setNeighbors(9, 3, 1);
	tiles[3].setNeighbors(8, 4, 2);
	tiles[4].setNeighbors(7, 0, 3);
	
	tiles[5].setNeighbors(15, 19, 1);
	tiles[6].setNeighbors(16, 15, 0);
	tiles[7].setNeighbors(17, 16, 4);
	tiles[8].setNeighbors(18, 17, 3);
	tiles[9].setNeighbors(19, 18, 2);
	
	tiles[10].setNeighbors(15, 11, 14);
	tiles[11].setNeighbors(16, 12, 10);
	tiles[12].setNeighbors(17, 13, 11);
	tiles[13].setNeighbors(18, 14, 12);
	tiles[14].setNeighbors(19, 10, 13);
	
	tiles[15].setNeighbors(5, 6, 10);
	tiles[16].setNeighbors(6, 7, 11);
	tiles[17].setNeighbors(7, 8, 12);
	tiles[18].setNeighbors(8, 9, 13);
	tiles[19].setNeighbors(9, 5, 14);
	
	
	
	var self = this; 
	// Run subdivide
	for (i = 1; i < subdivisions; ++i) {
    	var jMax = this.currentFaces;
    	
    	for (var j = 0; j < jMax; ++j) {
    		self._subdivideFace(j);
    	}
    		
    	for (j = 0; j < jMax; ++j) {
    		tiles[j].divided = false;
    	}
    }
    
    
    // Normalize
    for ( i = 0; i < this.currentVerts; i++) {
        //var vert = pc.alVec3(vertices[i*3], vertices[i*3+1], vertices[i*3+1]);
        this.setVertexMagnitude(i, this.radius);
    }
    
	///*
    // Test extrude, this should be where the repellers algorithm be replaced
    for ( i = 0; i < this.currentFaces; ++i) {
       tiles[i].testExtrude();
    }
	//*/
	this.vertexHeights = [];
	var vhSize = tiles.length;
	while(vhSize--) this.vertexHeights[vhSize] = 0;
	
	var repellerCountMultiplier = 0.1,
		repellerSizeMin = 3, repellerSizeMax = 10,
		continentCountMin = 1, continentCountMax = 6,
		continentSizeMin = 10, continentSizeMax = 24,
		mountainCountMin = 3, mountainCountMax = 15,
		mountainHeightMin = 0.15, mountainHeightMax = 0.45;
	
	generateTerrain(this, repellerCountMultiplier, repellerSizeMin, repellerSizeMax, continentCountMin, continentCountMax, continentSizeMin, continentSizeMax, mountainCountMin, mountainCountMax, mountainHeightMin, mountainHeightMax);
	
	// Calculate the normals for each vertex
    for (i = 0; i < vertices.length; i++) {
        normals.push(vertices[i] / radius);
    }

    // alculate the center and normal for each tile
    for ( i = 0; i < this.currentFaces; ++i) {
       tiles[i].calculateCenter();
       tiles[i].calculateNormal();
    }
    

    /*indices = [
         0, 11,  5,
         0,  5,  1,
         0,  1,  7,
         0,  7, 10,
         0, 10, 11,

         1,  5,  9,
         5, 11,  4,
        11, 10,  2,
        10,  7,  6,
         7,  1,  8,

         3,  9,  4,
         3,  4,  2,
         3,  2,  6,
         3,  6,  8,
         3,  8,  9,

         4,  9,  5,
         2,  4, 11,
         6,  2, 10,
         8,  6,  7,
         9,  8,  1
    ];

    
    for (var s = 1; s < subdivisions; s++) {
        var nindices = [];

        var split = {};

        // for each face
        for (i = 0; i < indices.length; i += 3) {
            var i0 = this._splitEdge(vertices, normals, indices[i], indices[i + 1], split, radius);
            var i1 = this._splitEdge(vertices, normals, indices[i + 1], indices[i + 2], split, radius);
            var i2 = this._splitEdge(vertices, normals, indices[i + 2], indices[i], split, radius);

            nindices.push(indices[i], i0, i2,
                          i0, indices[i + 1], i1,
                          i0, i1, i2,
                          i2, i1, indices[i + 2]);
        }

        indices = nindices;
    }*/
    
    var options = {
        normals: normals,
        indices:   indices
    };
    
    this.toReturn = {
        mesh : pc.createMesh(device, vertices, options),
        options: options,
        positions: vertices,
    };
    
    return this;
    //this.renderer = new RenderGroup(ctx, new Geometry(ctx, vertices, normals), indices);
}

IcoSphere.prototype.setVertexHeight = function(index, height) {
	vertexHeights[index] = height;
	setVertexMagnitude(index, height);
};

IcoSphere.prototype.setVertexMagnitude = function(index, magnitude) {
    var vert = this._getUnbufferedVertex(index);
	vert.normalize();
	vert.scale(Math.max(1, Math.min(2, magnitude)));
	this.vertices[index*3] = vert.x;
	this.vertices[index*3 + 1] = vert.y;
	this.vertices[index*3 + 2] = vert.z;
};

IcoSphere.prototype._getUnbufferedVertex = function(i) {
    return new pc.alVec3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]);
};


IcoSphere.prototype._calculateNumVerts = function(currentVertices, currentFaces, subdivisions) {
    if (subdivisions === 0) return 0;
    return currentVertices + this._calculateNumVerts(parseInt(currentFaces * 1.5), currentFaces * 4, subdivisions - 1);
};

IcoSphere.prototype._subdivideFace = function(index) {
    var midpointc = tiles[index].getMidpoint(0,1);
    var vertexc;
    
    if (tiles[index].neighborc.divided === true) {
			vertexc = tiles[index].neighborc.getVertexIndex(midpointc);
			if (vertexc == -1) {
				console.log("Vertex c at tile " + index + ": " + midpointc + "not found.");
			}
	} else {
			vertexc = this.currentVerts;
			vertices[this.currentVerts * 3] = midpointc.x;
			vertices[this.currentVerts * 3 + 1] = midpointc.y;
			vertices[this.currentVerts * 3 + 2] = midpointc.z;
			++this.currentVerts;
	}
	
	var midpointb = tiles[index].getMidpoint(0, 2);
	var vertexb;
	if (tiles[index].neighborb.divided === true) {
		vertexb = tiles[index].neighborb.getVertexIndex(midpointb);
		if (vertexb == -1) {
			console.log("Vertex b at tile " + index + ": " + midpointb + "not found.");
		}
	} else {
		vertexb = this.currentVerts;
		vertices[this.currentVerts * 3] = midpointb.x;
		vertices[this.currentVerts * 3 + 1] = midpointb.y;
		vertices[this.currentVerts * 3 + 2] = midpointb.z;
		++this.currentVerts;
	}
	
	
	var midpointa = tiles[index].getMidpoint(1, 2);
    var vertexa;
	if (tiles[index].neighbora.divided === true) {
		vertexa = tiles[index].neighbora.getVertexIndex(midpointa);
		if (vertexa == -1) {
			console.log("Vertex a at tile " + index + ": " + midpointa + "not found.");
		}
	} else {
		vertexa = this.currentVerts;
		vertices[this.currentVerts * 3] = midpointa.x;
		vertices[this.currentVerts * 3 + 1] = midpointa.y;
		vertices[this.currentVerts * 3 + 2] = midpointa.z;
		++this.currentVerts;
	}
	
	var tilea = tiles[this.currentFaces++] = new Tile(this, tiles[index].vertexIndices[0], vertexc, vertexb);
	var tileb = tiles[this.currentFaces++] = new Tile(this, tiles[index].vertexIndices[1], vertexa, vertexc);
	var tilec = tiles[this.currentFaces++] = new Tile(this, tiles[index].vertexIndices[2], vertexb, vertexa);
	
	
	tilea.setNeighbors(tiles[index].neighborIndices[0], tiles[index].neighborIndices[1], tiles[index].neighborIndices[2]);
	tileb.setNeighbors(tiles[index].neighborIndices[0], tiles[index].neighborIndices[1], tiles[index].neighborIndices[2]);
	tilec.setNeighbors(tiles[index].neighborIndices[0], tiles[index].neighborIndices[1], tiles[index].neighborIndices[2]);
	
	
	if (tiles[index].neighborc.divided === true) {
			var ac = null, bb = null;			
			if (tiles[index].neighborc.neighbora.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[0])) != -1) {
				ac = tiles[index].neighborc.neighbora;
			} if (tiles[index].neighborc.neighborb.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[0])) != -1) {
				ac = tiles[index].neighborc.neighborb;
			} if (tiles[index].neighborc.neighborc.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[0])) != -1) {
				ac = tiles[index].neighborc.neighborc;
			}
			if (ac === null) {
				console.log("Tile " + index + " has poor neighbor structure at ac.");
			}
			tilea.neighborc = ac;
			
			ac.neighborb = tilea;
			
			if (tiles[index].neighborc.neighbora.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bb = tiles[index].neighborc.neighbora;
			} else if (tiles[index].neighborc.neighborb.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bb = tiles[index].neighborc.neighborb;
			} else if (tiles[index].neighborc.neighborc.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bb = tiles[index].neighborc.neighborc;
			}
			if (bb === null) {
    			console.log("Tile " + index + " has poor neighbor structure at bb.");
			}
			tileb.neighborb = bb;
			bb.neighborc = tileb;
	}
	
	if (tiles[index].neighborb.divided === true) {
			var ab = null, cc = null;
			
			if (tiles[index].neighborb.neighbora.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[0])) == tiles[index].vertexIndices[0]) {
				ab = tiles[index].neighborb.neighbora;
			} else if (tiles[index].neighborb.neighborb.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[0])) == tiles[index].vertexIndices[0]) {
				ab = tiles[index].neighborb.neighborb;
			} else if (tiles[index].neighborb.neighborc.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[0])) == tiles[index].vertexIndices[0]) {
				ab = tiles[index].neighborb.neighborc;
			}
			if (ab === null) {
				console.log("Tile " + index + " has poor neighbor structure at ab.");
			}
			tilea.neighborb = ab;
			ab.neighborc = tilea;
			
			if (tiles[index].neighborb.neighbora.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cc = tiles[index].neighborb.neighbora;
			} else if (tiles[index].neighborb.neighborb.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cc = tiles[index].neighborb.neighborb;
			} else if (tiles[index].neighborb.neighborc.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cc = tiles[index].neighborb.neighborc;
			}
			if (cc === null) {
				console.log("Tile " + index + " has poor neighbor structure at cc.");
			}
			tilec.neighborc = cc;
			cc.neighborb = tilec;
	}
	
	if (tiles[index].neighbora.divided === true) {
			var bc = null, cb = null;
			
			if (tiles[index].neighbora.neighbora.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bc = tiles[index].neighbora.neighbora;
			} else if (tiles[index].neighbora.neighborb.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bc = tiles[index].neighbora.neighborb;
			} else if (tiles[index].neighbora.neighborc.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[1])) == tiles[index].vertexIndices[1]) {
				bc = tiles[index].neighbora.neighborc;
			}
			if (bc === null) {
				console.log("Tile " + index + " has poor neighbor structure at bc.");
			}
			tileb.neighborc = bc;
			bc.neighborb = tileb;
			
			if (tiles[index].neighbora.neighbora.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cb = tiles[index].neighbora.neighbora;
			} else if (tiles[index].neighbora.neighborb.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cb = tiles[index].neighbora.neighborb;
			} else if (tiles[index].neighbora.neighborc.getVertexIndex(this._getUnbufferedVertex(tiles[index].vertexIndices[2])) == tiles[index].vertexIndices[2]) {
				cb = tiles[index].neighbora.neighborc;
			}
			if (cb === null) {
				console.log("Tile " + index + " has poor neighbor structure at cb.");
			}
			tilec.neighborb = cb;
			cb.neighborc = tilec;
	}
	
	tiles[index].vertexIndices[0] = vertexa;
    tiles[index].vertexIndices[1] = vertexb;
    tiles[index].vertexIndices[2] = vertexc;
    this.indices[index*3] = vertexa;
    this.indices[index*3 + 1] = vertexb;
    this.indices[index*3 + 2] = vertexc;
    
    tilea.neighbora = tiles[index];
    tileb.neighbora = tiles[index];
    tilec.neighbora = tiles[index];
		
	tiles[index].neighbora = tilea;
	tiles[index].neighborb = tileb;
	tiles[index].neighborc = tilec;
	
	tiles[index].divided = true;
};
/*
IcoSphere.prototype._splitEdge = function(vertices, normals, i1, i2, split, radius) {
    /// Helper functions
    this.addv3 = function(a, b) {
        var out = [0,0,0];
        
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        
        return out;
    };
    
    this.lengthv3 = function (a) {
        var x = a[0],
            y = a[1],
            z = a[2];
        return Math.sqrt(x*x + y*y + z*z);
    };
    
    this.normalizev3 = function(a) {
         var out = [0,0,0];
        
        //console.log(out,a)
        var x = a[0],
            y = a[1],
            z = a[2];
        var len = x*x + y*y + z*z;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
        }
        return out;
    };
    
    ///
    
    var splitKey;

    if (i1 < i2) {
        splitKey = i1 + '-' + i2;
    } else {
        splitKey = i2 + '-' + i1;
    }

    var pt = split[splitKey];

    if (pt) {
        return pt;
    }

    var i = vertices.length / 3;
    split[splitKey] = i;

    var i1s = i1 * 3;
    var i1e = i1s + 3;
    var i2s = i2 * 3;
    var i2e = i2s + 3;
    
    
    var m = this.addv3(vertices.slice(i1s, i1e), vertices.slice(i2s, i2e));
    
    var l = radius / this.lengthv3(m);

    vertices.push(m[0] * l, m[1] * l, m[2] * l);

    var n = this.normalizev3(this.addv3(normals.slice(i1s, i1e), normals.slice(i2s, i2e)));
    normals.push(n[0], n[1], n[2]);

    return i;
}
*/

//Generates a heightmap and applies it to the icosphere's vertices
//Higher repeller count multipliers will result in more landmass,
// lower repeller size will result in more hilly terrain (and less landmass)
//Repeller height is based off of mountain min height
function generateTerrain(icosphere, repellerCountMultiplier, repellerSizeMin, repellerSizeMax, continentCountMin, continentCountMax, continentSizeMin, continentSizeMax, mountainCountMin, mountainCountMax, mountainHeightMin, mountainHeightMax) {
	var contCount = pc.math.random(continentCountMin, continentCountMax);
	var mountainCount = pc.math.random(mountainCountMin, mountainCountMax);
	
	//Create each continent
	for (; contCount > 0; contCount--) {
		var contSize = pc.math.random(continentSizeMin, continentSizeMax);
		
		//Search for an open area of ocean
		for (var i = 0, done = 0; i < 200 && done == 0; i++) {
			var center = Math.floor(pc.math.random(0, icosphere.tiles.length));
			if (checkSurroundingArea(icosphere, center, contSize * 1.3)) {
				//Create a new continent
				var mountains = mountainCount / contCount;
				if (contCount > 0) mountains *= pc.math.random(0.6, 1.4); //Randomize remaining mountain distribution slightly if not on the last continent
				cluster(icosphere, center, contSize, contSize * contSize * repellerCountMultiplier, repellerSizeMin, repellerSizeMax, mountains);
				mountainCount -= mountains;
				done = 1;
			}
		}
	}
};

//Helper function of generateTerrain, returns true if no land tiles are found within the radius
function checkSurroundingArea(icosphere, centerTile, radius) {
	var visited = [];
	var size = icosphere.tiles.length;
	while(size--) visited[size] = false;
	return checkSurroundingAreaR(icosphere, centerTile, radius, visited, 0);
};

//Recursive part of checkSurroundingArea, essentially a modified breadth first search
function checkSurroundingAreaR(icosphere, currentTile, radius, visited, iteration) {
	if (icosphere.vertexHeights[currentTile] != 0) return false; //Found a land tile
	if (iteration > radius) return true; //Outside the designated area
	if (!visited[currentTile]) {
		visited[currentTile] = true;
		//Check each neighbor and return true only if all of them find ocean tiles
		return checkSurroundingAreaR(icosphere, icosphere.tiles[currentTile].neighborIndices[0], radius, visited, iteration + 1) &&
			   checkSurroundingAreaR(icosphere, icosphere.tiles[currentTile].neighborIndices[1], radius, visited, iteration + 1) &&
			   checkSurroundingAreaR(icosphere, icosphere.tiles[currentTile].neighborIndices[2], radius, visited, iteration + 1);
   } else return true; //Already visited this tile, and it isn't a land tile
};

//Helper function of generateTerrain, creates a continent in the heightmap using repeller
function cluster(icosphere, centerTile, radius, repellerCount, repellerSizeMin, repellerSizeMax, mountainCount) {
};

//Helper function of cluster, raises a portion of land around the center tile
function repeller(icosphere, centerTile, radius, centerHeight) {
};