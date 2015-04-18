// Direction Enum
DIRECTION = {
	NORTH     : 0,
	NORTHEAST : 1,
	EAST      : 2,
	SOUTHEAST : 3,
	SOUTH     : 4,
	SOUTHWEST : 5,
	WEST      : 6,
	NORTHWEST : 7
};

CLOCK = {
	CLOCKWISE        : 0,
	COUNTERCLOCKWISE : 1,
	CW               : 0,
	CCW              : 1
};

function edge(direction, fromNode, toNode, edgeIndex) {
	this.direction = direction;
	this.fromNode = fromNode
	this.toNode = toNode;
	this.edgeIndex = edgeIndex;
	this.divided = false;
	this.tiles = [];
	//debug.log(DEBUG.WORLDGEN, this);
	//this.tiles[CLOCK.CW] = tilecw;
	//this.tiles[CLOCK.CCW] = tileccw;
}

function VertexNode(index, indices) {

	this.index = index;
	
	this.group = indices;

	this.edges = [];

	// Can be below ico.radius, but the mesh won't display if it is
	// Used when terrain is underwater
	this.height;

	this.isOcean = true;

	this.isFault = false;

	this.addIndex = function(index) {
		this.group.push(index);
	}

	this.deleteFirst = function() {
		this.group.splice(0, 1);
	}

	this.getVertex = function() {
		return new pc.Vec3(ico.vertices[this.group[0] * 3], ico.vertices[this.group[0] * 3 + 1], ico.vertices[this.group[0] * 3 + 2]);
	}

	this.getHeight = function() {
		var vertex = this.getVertex();
		return vertex.length();
	}

	this.setHeight = function(height) {
		this.height = height;

		// Check if terrain is below water level
		if (height <= ico.radius) {
			height = ico.radius;
			this.isOcean = true;
		} else {
			this.isOcean = false;
		}
		var vertex = this.getVertex();
		vertex.normalize();
		vertex.scale(height);
		for (var i = 0; i < this.group.length; ++i) {
			ico.vertices[this.group[i] * 3] = vertex.x;
			ico.vertices[this.group[i] * 3 + 1] = vertex.y;
			ico.vertices[this.group[i] * 3 + 2] = vertex.z;
		}
		ico.updateFlag = true;
	}

	this.addEdge = function(direction, index) {
		this.edges.push(new edge(direction, this.index, index, this.edges.length));
	}

	this.getEdgePosition = function(index) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].toNode == index) {
				return i;
			}
		}
	}

	this.getNeighbors = function() {
		var neighbors = [];
		for (var i = 0; i < this.edges.length; ++i) {
			neighbors[i] = this.edges[i].toNode;
		}
		return neighbors;
	}

	this.getNeighbor = function(direction, backupDirection) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].direction == direction) {
				return this.edges[i].toNode;
			}
		}
		if (backupDirection != null) {
			for (var i = 0; i < this.edges.length; ++i) {
				if (this.edges[i].direction == backupDirection) {
					return this.edges[i].toNode;
				}
			}
		}
		// Returns -1 if neighbor not found
		return -1;
	}

	this.setNeighbor = function(oldIndex, newIndex) {
		//edge.toNode = index;
		// Assume that setting neighbor implies subdivision (May need to change)
		//edge.divided = true;
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].toNode == oldIndex) {
				this.edges[i].toNode = newIndex;
				// Assume that setting neighbor implies subdivision (May need to change)
				this.edges[i].divided = true;
			}
		}
	}

	this.getLowestNeighbor = function() {
		var lowest = this.index;
		var lowHeight = this.getHeight();
		for (var i = 0; i < this.edges.length; ++i) {
			if (ico.vertexGraph[this.edges[i].toNode].getHeight() <= lowHeight) {
				lowest = this.edges[i].toNode;
			}
		}
		return lowest;
	}

	this.getNeighborDirection = function(index) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].toNode == index) {
				return this.edges[i].direction;
			}
		}
		// Returns -1 if neighbor not found
		return -1;
	}

	this.getEdgeTo = function(index) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].toNode == index) {
				return this.edges[i];
			}
		}
		// Returns -1 if neighbor not found
		return -1;
	}

	this.getCommonNeighbor = function(otherNode) {
		for (var i = 0; i < this.edges.length; ++i) {
			for (var j = 0; j < otherNode.edges.length; ++j) {
				if (this.edges[i].toNode == otherNode.edges[j].toNode) {
					return this.edges[i].toNode;
				}
			}
		}
		// Returns -1 if neighbor not found
		return -1;
	}

	this.hasEdge = function(direction) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].direction == direction) {
				return true;
			}
		}
		return false;
	}

	this.edgeDivided = function(direction) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].direction == direction) {
				return this.edges[i].divided;
			}
		}
	}

	this.divideEdges = function() {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].divided == false) {

				// DEBUG
				//debug.log(DEBUG.WORLDGEN, "Dividing edge between " + this.edges[i].fromNode + " and " + this.edges[i].toNode);

				// Divide edge
				this.divideEdge(this.edges[i].toNode);

				// DEBUG
				//debug.log(DEBUG.WORLDGEN, "Vertex " + this.index + ": edge " + i + " divided, adding node " + this.edges[i].toNode);
			}
		}
	}

	this.divideEdge = function(otherIndex) {
		var midpoint = this.getVertex();
		var otherNode = ico.vertexGraph[otherIndex];
		var newIndex = ico.vertices.length / 3;
		
		// Calculate midpoint
		midpoint.add(otherNode.getVertex());
		midpoint.scale(0.5);

		// Create new vertex
		ico.vertices.push(midpoint.x);
		ico.vertices.push(midpoint.y);
		ico.vertices.push(midpoint.z);

		// Create new node and add edges to subdivided nodes
		ico.vertexGraph.push(new VertexNode(newIndex, [newIndex]));
		ico.vertexGraph[newIndex].addEdge(this.getNeighborDirection(otherNode.index), otherNode.index);
		ico.vertexGraph[newIndex].addEdge(otherNode.getNeighborDirection(this.index), this.index);

		// Update subdivided edges to new node
		this.setNeighbor(otherNode.index, newIndex);
		otherNode.setNeighbor(this.index, newIndex);
	}

	// Figures out the 4 other edges after edge is divided.
	// Call on newly created edges.
	this.calculateNeighbors = function() {

		// DEBUG count of added neighbors
		var count = 0;

		// For both edges created from subdivision
		for (var i = 0; i < 2; ++i) {

			// First edge (from already created edges)
			var edge1 = this.edges[i];

			// Node the first edge points to
			var otherNode = ico.vertexGraph[this.edges[i].toNode];

			// Direction to this node from other node
			var otherNodeEdge = otherNode.getEdgeTo(this.index);

			// Neighboring edge clockwise from direction of otherNodeDir
			var edge2cw = otherNode.getNeighboringEdge(otherNodeEdge, CLOCK.CLOCKWISE);

			// Neighboring edge counterclockwise from direction of otherNodeDir
			var edge2ccw = otherNode.getNeighboringEdge(otherNodeEdge, CLOCK.COUNTERCLOCKWISE);

			//debug.log(DEBUG.WORLDGEN, edge1);
			//debug.log(DEBUG.WORLDGEN, edge2cw);
			//debug.log(DEBUG.WORLDGEN, edge2ccw);

			// Test distance == 2 and distance == 3
			for (var distance = 2; distance < 5; ++distance) {

				// Find leftbound and rightbound for edge2cw
				// Add edge to otherNode's neighbor 
				if ((edge2cw.direction + distance) % 8 == edge1.direction) {
					++count;
					this.addEdge(this.calculateNeighborDirection(edge2cw.direction, edge1.direction, distance), edge2cw.toNode);
				} else if ((edge1.direction + distance) % 8 == edge2cw.direction) {
					++count;
					this.addEdge(this.calculateNeighborDirection(edge1.direction, edge2cw.direction, distance), edge2cw.toNode);
				}

				// Find leftbound and rightbound for edge2ccw (reverse checking order for top/bottom edge cases)
				// Add edge to otherNode's neighbor 
				if ((edge1.direction + distance) % 8 == edge2ccw.direction) {
					++count;
					this.addEdge(this.calculateNeighborDirection(edge1.direction, edge2ccw.direction, distance), edge2ccw.toNode);
				} else if ((edge2ccw.direction + distance) % 8 == edge1.direction) {
					++count;
					this.addEdge(this.calculateNeighborDirection(edge2ccw.direction, edge1.direction, distance), edge2ccw.toNode);
				}
			}
		}

		// DEBUG print count
		if (count != 4) {
			console.error(count);
		}
		//debug.log(DEBUG.WORLDGEN, count);

	}

	this.getNeighboringEdge = function(edge, clock) {
		//debug.log(DEBUG.WORLDGEN, this);
		// Edge case for top node
		if (this.index == ico.topIndex) {
			if (clock == CLOCK.CLOCKWISE) {

				// Assume edge indices move in clockwise order around top node. REALLY SKETCHY! Should change
				// Also assumes top and bottom nodes have 5 edges
				return this.edges[(edge.edgeIndex + 1) % 5];
			} else if (clock == CLOCK.COUNTERCLOCKWISE) {

				// Assume edge indices move in clockwise order around top node. REALLY SKETCHY! Should change
				// Also assumes top and bottom nodes have 5 edges
				return this.edges[(edge.edgeIndex - 1 + 10) % 5];
			}

		// Edge case for bottom node
		} else if (this.index == ico.bottomIndex) {
 			if (clock == CLOCK.CLOCKWISE) {

				// Assume edge indices move in counterclockwise order around bottom node. REALLY SKETCHY! Should change
				// Also assumes top and bottom nodes have 5 edges
				return this.edges[(edge.edgeIndex - 1 + 10) % 5];
			} else if (clock == CLOCK.COUNTERCLOCKWISE) {
				
				// Assume edge indices move in counterclockwise order around bottom node. REALLY SKETCHY! Should change
				// Also assumes top and bottom nodes have 5 edges
				return this.edges[(edge.edgeIndex + 1) % 5];
			}
		} else if (clock == CLOCK.CLOCKWISE) {

			// Go through other edges in clockwise order
			for (var i = 1; i < 8; ++i) {
				for (var j = 0; j < this.edges.length; ++j) {

					// Return first neighboring edge
					if (this.edges[j].direction == (edge.direction + i) % 8) {
						//debug.log(DEBUG.WORLDGEN, "Returning getNeighboringEdge: Vertex " + this.index + ", startDirection " + edge.direction + ", returnDirection " + this.edges[j].direction + ", clockwise");
						return this.edges[j];
					}
				}
			}
		} else if (clock == CLOCK.COUNTERCLOCKWISE) {

			// Go through other edges in counterclockwise order
			for (var i = -1; i > -8; --i) {
				for (var j = 0; j < this.edges.length; ++j) {

					// Return first neighboring edge
					if (this.edges[j].direction == (edge.direction + i + 16) % 8) {
						//debug.log(DEBUG.WORLDGEN, "Returning getNeighboringEdge: Vertex " + this.index + ", startDirection " + edge.direction + ", returnDirection " + this.edges[j].direction + ", counterclockwise");
						return this.edges[j];
					}
				}
			}
		}
	}

	this.calculateNeighborDirection = function(leftbound, rightbound, distance) {
		//debug.log(DEBUG.WORLDGEN, "Entering calculateNeighborDirection: Vertex " + this.index + ", left " + leftbound + ", right " + rightbound + ", distance " + distance);
		if (distance == 2) {
			return (leftbound + 1) % 8;
		} else if (distance == 3) {
			if (leftbound == DIRECTION.NORTH || leftbound == DIRECTION.SOUTH) {
				return (rightbound - 1) % 8;
			} else if (rightbound == DIRECTION.NORTH || rightbound == DIRECTION.SOUTH) {
				return (leftbound + 1) % 8;
			} else if ((leftbound % 2) == 0) {
				return (leftbound + 1) % 8;
			} else if ((rightbound % 2) == 0) {
				return (rightbound - 1) % 8;
			} else {
				console.error("Error: Vertex " + this.index + "");
			}
		} else if (distance == 4) {
			return (leftbound + 2) % 8;
		} else {
			console.error("Error at Vertex " + this.index + ": distance " + distance + ", not 1 or 2.");
		}
	}

	this.stagger = function(amount) {
		var vertex = this.getVertex();
		var newX = vertex.x + pc.math.random(-amount, amount);
		var newY = vertex.y + pc.math.random(-amount, amount);
		var newZ = vertex.z + pc.math.random(-amount, amount);
		for (var i = 0; i < this.group.length; ++i) {
			ico.vertices[this.group[i] * 3] = newX;
			ico.vertices[this.group[i] * 3 + 1] = newY;
			ico.vertices[this.group[i] * 3 + 2] = newZ;
		}
		ico.updateFlag = true;
	}
}