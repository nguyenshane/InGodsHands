function Eroder(startingIndex, numSteps) {
	this.index = startingIndex;

	this.steps = numSteps;

	this.update = function() {
		if (this.steps > 0) {
			var height = ico.vertexGraph[this.index].getHeight();
			console.log("Eroder at " + this.index + " with height " + height);
			var lowestNeighbor = ico.vertexGraph[this.index].getLowestNeighbor();
			ico.vertexGraph[this.index].setHeight(Math.max(height - 0.1, ico.radius));
			console.log("Eroder at " + this.index + " changing height to " + ico.vertexGraph[this.index].getHeight());
			if (height - 0.1 > ico.radius) {
				this.index = lowestNeighbor;
			} else {
				--this.steps;
				this.index = Math.floor(pc.math.random(0, ico.vertexGraph.length));
				console.log("Eroder moving to " + this.index + " with height " + height);
			}
		} else if (this.steps == 0) {
			//console.error("RecalcMesh!");
			ico._recalculateMesh();
			--this.steps;
		}

	}
}





/*function VertexGraph() {

	this.vertexNodes = [];

	this.rows = [];
	this.edgeCaseRows = [];

	this.subdivisions = 0;

	this.setStartingNodes = function(radius) {
		// Random math for creating the icosphere upright, taken from http://www.vb-helper.com/tutorial_platonic_solids.html
		var S  = radius * 2 * Math.sqrt(50 - 10 * Math.sqrt(5)) / 5;
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

    	startingVerts = [  0,  Z1,   0,

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

		// Create node for top vertex
    	vertexNodes[0] = new VertexNode([0]);
    	vertexNodes[0].addEgde(DIRECTION.SOUTH, 1);
    	vertexNodes[0].addEgde(DIRECTION.SOUTH, 2);
    	vertexNodes[0].addEgde(DIRECTION.SOUTH, 3);
    	vertexNodes[0].addEgde(DIRECTION.SOUTH, 4);
    	vertexNodes[0].addEgde(DIRECTION.SOUTH, 5);

    	// Create nodes for for second row in clockwise order (looking down)
    	vertexNodes[1] = new VertexNode([1]);
    	vertexNodes[1].addEgde(DIRECTION.NORTH, 0);
    	vertexNodes[1].addEgde(DIRECTION.EAST, 5);
    	vertexNodes[1].addEgde(DIRECTION.WEST, 2);
    	vertexNodes[1].addEgde(DIRECTION.SOUTHEAST, 10);
    	vertexNodes[1].addEgde(DIRECTION.SOUTHWEST, 6);

    	vertexNodes[2] = new VertexNode([2]);
    	vertexNodes[2].addEgde(DIRECTION.NORTH, 0);
    	vertexNodes[2].addEgde(DIRECTION.EAST, 1);
    	vertexNodes[2].addEgde(DIRECTION.WEST, 3);
    	vertexNodes[2].addEgde(DIRECTION.SOUTHEAST, 6);
    	vertexNodes[2].addEgde(DIRECTION.SOUTHWEST, 7);

    	vertexNodes[3] = new VertexNode([3]);
    	vertexNodes[3].addEgde(DIRECTION.NORTH, 0);
    	vertexNodes[3].addEgde(DIRECTION.EAST, 2);
    	vertexNodes[3].addEgde(DIRECTION.WEST, 4);
    	vertexNodes[3].addEgde(DIRECTION.SOUTHEAST, 7);
    	vertexNodes[3].addEgde(DIRECTION.SOUTHWEST, 8);

    	vertexNodes[4] = new VertexNode([4]);
    	vertexNodes[4].addEgde(DIRECTION.NORTH, 0);
    	vertexNodes[4].addEgde(DIRECTION.EAST, 3);
    	vertexNodes[4].addEgde(DIRECTION.WEST, 5);
    	vertexNodes[4].addEgde(DIRECTION.SOUTHEAST, 8);
    	vertexNodes[4].addEgde(DIRECTION.SOUTHWEST, 9);

    	vertexNodes[5] = new VertexNode([5]);
    	vertexNodes[5].addEgde(DIRECTION.NORTH, 0);
    	vertexNodes[5].addEgde(DIRECTION.EAST, 4);
    	vertexNodes[5].addEgde(DIRECTION.WEST, 1);
    	vertexNodes[5].addEgde(DIRECTION.SOUTHEAST, 9);
    	vertexNodes[5].addEgde(DIRECTION.SOUTHWEST, 10);

    	// Create nodes for for third row in clockwise order offset by +0.5 from second row
    	vertexNodes[6] = new VertexNode([6]);
    	vertexNodes[6].addEgde(DIRECTION.NORTHEAST, 1);
    	vertexNodes[6].addEgde(DIRECTION.NORTHWEST, 2);
    	vertexNodes[6].addEgde(DIRECTION.EAST, 10);
    	vertexNodes[6].addEgde(DIRECTION.WEST, 7);
    	vertexNodes[6].addEgde(DIRECTION.SOUTH, 11);

    	vertexNodes[7] = new VertexNode([7]);
    	vertexNodes[7].addEgde(DIRECTION.NORTHEAST, 2);
    	vertexNodes[7].addEgde(DIRECTION.NORTHWEST, 3);
    	vertexNodes[7].addEgde(DIRECTION.EAST, 6);
    	vertexNodes[7].addEgde(DIRECTION.WEST, 8);
    	vertexNodes[7].addEgde(DIRECTION.SOUTH, 11);

    	vertexNodes[8] = new VertexNode([8]);
    	vertexNodes[8].addEgde(DIRECTION.NORTHEAST, 3);
    	vertexNodes[8].addEgde(DIRECTION.NORTHWEST, 4);
    	vertexNodes[8].addEgde(DIRECTION.EAST, 7);
    	vertexNodes[8].addEgde(DIRECTION.WEST, 9);
    	vertexNodes[8].addEgde(DIRECTION.SOUTH, 11);

    	vertexNodes[9] = new VertexNode([9]);
    	vertexNodes[9].addEgde(DIRECTION.NORTHEAST, 4);
    	vertexNodes[9].addEgde(DIRECTION.NORTHWEST, 5);
    	vertexNodes[9].addEgde(DIRECTION.EAST, 8);
    	vertexNodes[9].addEgde(DIRECTION.WEST, 10);
    	vertexNodes[9].addEgde(DIRECTION.SOUTH, 11);

    	vertexNodes[10] = new VertexNode([10]);
    	vertexNodes[10].addEgde(DIRECTION.NORTHEAST, 5);
    	vertexNodes[10].addEgde(DIRECTION.NORTHWEST, 1);
    	vertexNodes[10].addEgde(DIRECTION.EAST, 9);
    	vertexNodes[10].addEgde(DIRECTION.WEST, 6);
    	vertexNodes[10].addEgde(DIRECTION.SOUTH, 11);

    	// Create node for bottom vertex
    	vertexNodes[11] = new VertexNode([11]);
    	vertexNodes[11].addEgde(DIRECTION.NORTH, 6);
    	vertexNodes[11].addEgde(DIRECTION.NORTH, 7);
    	vertexNodes[11].addEgde(DIRECTION.NORTH, 8);
    	vertexNodes[11].addEgde(DIRECTION.NORTH, 9);
    	vertexNodes[11].addEgde(DIRECTION.NORTH, 10);

    	// Set how many vertices are initially in each row
    	this.rows[0] = 1;
    	this.rows[1] = 5;
    	this.rows[2] = 5;
    	this.rows[3] = 1;

    	// Add indices of rows that are edge cases
    	// Edge Case 0: between top third of icosphere and middle third
    	this.edgeCaseRows[0] = 1;
    	// Edge Case 1: between middle third of icosphere and bottom third
    	this.edgeCaseRows[1] = 2;

	}

	this.subdivide = function() {
		var newVertexNodes = [];
		var newRows = [];

		for (var i = 0; i < this.rows.length; ++i) {

		}
	}

	// Only call on two vertices that are neighbors
	this.addMidpoint = function(vertex1, vertex2) {
		var index = this.vertexNodes.length;

		var v1Direction = this.vertexNodes[vertex1].getNeighborDirection(vertex2);
		var v2Direction = this.vertexNodes[vertex2].getNeighborDirection(vertex1);

		// Create new node
		this.vertexNodes[index] = new VertexNode({ CREATE A NEW VERTEX AND ADD ITS INDEX });

		// Set edge of new node to vertex1 and vertex2
		this.vertexNodes[index].addEdge(v1Direction, vertex2);
		this.vertexNodes[index].addEdge(v2Direction, vertex1);

		// 
		var offset = 1;
		var cwNeighbor = this.vertexNodes[vertex1].getNeighbor((v1Direction + offset) % 8);
		while(cwNeighbor == -1) {
			cwNeighbor = this.vertexNodes[vertex1].getNeighbor((v1Direction + ++offset) % 8);
			if (offset > 8) {
				console.log("Vertex " + vertex1 + " has no neighbors. Breaking addMidpoint for vertex " + index + " between vertices " + vertex1 + " and " + vertex2 + ".");
				break;
			}
		}
		if (this.vertexNodes[vertex1].edgeDivided(v1Direction + offset)) {
			if (offset == 1) {
				this.vertexNodes[index].addEdge(v2Direction - 2, cwNeighbor);
			} else if (offset == 2) {
				this.vertexNodes[index].addEdge(v2Direction - 1, cwNeighbor);
			} else {
				console.log("Offset for vertex " + index + " not 1 or 2. Check edge cases.");
			}
			this.vertexNodes[cwNeighbor].addEdge(v1Direction + offset + offset, index);
		}


		// Set vertex1 and vertex2 neighbors to the new node
		this.vertexNodes[vertex1].setNeighbor(this.vertexNodes[vertex1].getNeighborDirection(vertex2), index);
		this.vertexNodes[vertex2].setNeighbor(this.vertexNodes[vertex2].getNeighborDirection(vertex1), index);

	}

	this.getVertices = function() {

	}

	this.getNormals = function() {

	}

	this.getIndices = function() {

	}

	this.getTiles = function() {

	}

	this.getMidpoint = function(vertex1, vertex2) {

	}

	this.getNorthwest = function(index) {

	}
}*/