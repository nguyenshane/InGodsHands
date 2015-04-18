function Cluster(centerVertex, radius) {
	this.vertices = [];

	this.startingIndex = centerVertex;
	this.radius = radius;

	//this.extrude(centerVertex, radius);

	this.extrude = function() {
		var center = ico.vertexGraph[this.startingIndex];

		debug.obj(DEBUG.WORLDGEN, center);

		var visited = [];

		this.vertices.push(center);
		visited = center.getNeighbors();

		debug.obj(DEBUG.WORLDGEN, visited);

		for (var i = 0; i < visited.length; ++i) {
			//this.vertices.push(ico.vertexGraph[visited[i]]);
		}

		for (var i = 0; i < this.vertices.length; ++i) {
			this.vertices[i].setHeight(1.7);
			this.vertices[i].updateHeight();
		}
	}

	this.addVertex = function(){}

	this.lerpEast = function(percentMoved, distance) { 
		var vertexBuffer = [];
		//Lerp vertices
		for (var i = 0; i < tiles.length; ++i) {
			
		}
		// Jump people/stuff
	}

	this.finishEast = function(distance) {
		for (var i = 0; i < tiles.length; ++i) {
			for (var j = 0; j < distance; ++j) {
				tiles[i] = tile.getEastNeighbor();
			}

		}
	}

	this.moveWest = function() {

	}	

	this.move = function(direction) {
		var message = "Cluster move enter for ";
		for (var i = 0; i < this.vertices.length; ++i) {
			message = message + this.vertices[i].index + ", ";
		}
		debug.log(DEBUG.WORLDGEN, message);

		// For each vertex
		for (var i = 0; i < this.vertices.length; ++i) {

			// Change the height of neighbor to this previous height
			ico.vertexGraph[this.vertices[i].getNeighbor(direction)].setHeight(this.vertices[i].oldHeight);

		}

		// For each vertex
		for (var i = 0; i < this.vertices.length; ++i) {
			
			// Update previous height
			this.vertices[i].updateHeight();

			// Update to neighbor
			this.vertices[i] = ico.vertexGraph[this.vertices[i].getNeighbor(direction)];
		}

		message = "Cluster move exit for ";
		for (var i = 0; i < this.vertices.length; ++i) {
			message = message + this.vertices[i].index + ", ";
		}
		debug.log(DEBUG.WORLDGEN, message);
	}
}