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

function edge(direction, index) {
	this.direction = direction;
	this.index = index;
	this.divided = false;
}

function VertexNode(indices) {
	
	this.group = indices;

	this.edges = [];

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
		var vertex = this.getVertex();
		vertex.normalize();
		vertex.scale(ico.radius * height)
		for (var i = 0; i < this.group.length; ++i) {
			ico.vertices[this.group[i] * 3] = vertex.x;
			ico.vertices[this.group[i] * 3 + 1] = vertex.y;
			ico.vertices[this.group[i] * 3 + 2] = vertex.z;
		}
		ico.updateFlag = true;
	}

	this.addEdge = function(direction, index) {
		this.edges.push(new edge(direction, index));
	}

	this.getNeighbor = function(direction, backupDirection) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].direction == direction) {
				return this.edges[i].index;
			}
		}
		if (backupDirection != null) {
			for (var i = 0; i < this.edges.length; ++i) {
				if (this.edges[i].direction == backupDirection) {
					return this.edges[i].index;
				}
			}
		}
		// Returns -1 if neighbor not found
		return -1;
	}

	this.setNeighbor = function(direction, index) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].direction == direction) {
				this.edges[i].index = index;
				// Assume that setting neighbor implies subdivision (May need to change)
				this.edges[i].divided = true;
			}
		}
	}

	this.getNeighborDirection = function(index) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].index == index) {
				return this.edges[i].direction;
			}
		}
		// Returns -1 if neighbor not found
		return -1;
	}

	this.edgeDivided = function(direction) {
		for (var i = 0; i < this.edges.length; ++i) {
			if (this.edges[i].direction == direction) {
				return this.edges[i].divided;
			}
		}
	}

	this.divideEdge = function(index) {

	}

}