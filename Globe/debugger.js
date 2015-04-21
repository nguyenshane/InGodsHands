DEBUG = {
	WORLDGEN : 0,
	AI : 1,
	UI : 2,
	WEATHER : 3,
	ANIMALS : 4,
	HARDWARE : 5,
	AUDIO : 6,
	ART : 7,
	TESTING : 8
};

debugstyles = [];

debugstyles[DEBUG.WORLDGEN] = {
	name : "[WORLD GENERATION] ",
	on : false,
	color : "#000099", //Blue
};

debugstyles[DEBUG.AI] = {
	name : "[AI] ",
	on : true,
	color : "#990000", //Red
};

debugstyles[DEBUG.UI] = {
	name : "[USER INTERFACE] ",
	on : true,
	color : "#999900", //Yellow
};

debugstyles[DEBUG.WEATHER] = {
	name : "[WEATHER] ",
	on : true,
	color : "#CC6600", //Orange
};

debugstyles[DEBUG.ANIMALS] = {
	name : "[ANIMALS] ",
	on : true,
	color : "#009900", //Green
};

debugstyles[DEBUG.HARDWARE] = {
	name : "[HARDWARE INTERFACE] ",
	on : true,
	color : "#009999", //Cyan
};

debugstyles[DEBUG.AUDIO] = {
	name : "[AUDIO] ",
	on : true,
	color : "#990099", //Purple
};

debugstyles[DEBUG.ART] = {
	name : "[ART] ",
	on : true,
	color : "#00CC66", //Teal
};

debugstyles[DEBUG.TESTING] = {
	name : "[TESTING] ",
	on : true,
	color : "#333333", //Gray
};

debug = new debug();

function debug() {

	this.on = function(type) {
		this.debugstyles[type].on = true;
	}

	this.off = function(type) {
		this.debugstyles[type].on = false;
	}

	this.log = function(type, text) {
		if (debugstyles[type].on) {
			console.log("%c" + debugstyles[type].name + text, "color: " + debugstyles[type].color);
		}
	}

	this.obj = function(type, object, text) {
		if (debugstyles[type].on) {
			if (text !== undefined) {
				console.log("%c" + debugstyles[type].name + text, "color: " + debugstyles[type].color, object);
			} else {
				console.log("%c" + debugstyles[type].name, "color: " + debugstyles[type].color, object);
			}
		}
	}
	
}