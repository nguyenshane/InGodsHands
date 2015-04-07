function Eroder(startingIndex, numSteps) {
	this.index = startingIndex;

	this.steps = numSteps;

	this.update = function() {
		if (this.steps > 0) {
			var height = ico.vertexGraph[this.index].getHeight();
			//console.log("Eroder at " + this.index + " with height " + height);
			var lowestNeighbor = ico.vertexGraph[this.index].getLowestNeighbor();
			ico.vertexGraph[this.index].setHeight(Math.max(height - 0.1, ico.radius));
			//console.log("Eroder at " + this.index + " changing height to " + ico.vertexGraph[this.index].getHeight());
			if (height - 0.1 > ico.radius) {
				this.index = lowestNeighbor;
			} else {
				--this.steps;
				this.index = Math.floor(pc.math.random(0, ico.vertexGraph.length));
				//console.log("Eroder moving to " + this.index + " with height " + height);
			}
		} else if (this.steps == 0) {
			//console.error("RecalcMesh!");
			ico._recalculateMesh();
			--this.steps;
		}

	}
}