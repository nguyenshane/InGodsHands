function seed(seed) {
	this.seed = seed;
	this.increment = 1;
	this.multiplier = 1431655765;
	this.increment = 1;
	this.mod =  32768;
	this.num = seed;
	this.count = 0;

	this.step = function(precision, min, max) {
 		this.num = ((this.multiplier * this.num) + this.increment) % this.mod;
 		var value = ((this.num % precision) * (max - min) / (precision - 1) + min);
 		debug.log(DEBUG.WORLDGEN, "Seed count " + ++this.count + ": " + value);
 		return value;
	}
}