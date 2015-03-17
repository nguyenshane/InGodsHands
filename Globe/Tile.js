function Tile(index, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.colors = [];
    this.neighbora, this.neighborb, this.neighborc;
    this.neighbors = [];
	
    var normalIndex, hasHuman, divided;
	this.index = index;
    this.normal;
    this.center;
	this.localRotNormal;
	this.localRotCenter;
    this.neighbora;
    this.neighborb;
    this.neighborc;
    
    this.temperature;
    this.food = Math.floor(Math.random() * (5 - 1)) + 1;
	
	this.rain, this.fog;

    this.isOcean = true;
	this.hasTree = false;
	this.isRaining = false;
	this.isFoggy = false;
	
	this.atmoHeight = 0.4;
	this.rainDuration = 4;
	this.fogDuration = 5;
	this.rainTimer = 0, this.fogTimer = 0;
	
    //ico = icosphere;
	//ico = ico;
    this.divided = false;
    this.hasHuman = false;
    
    this.vertexIndices[0] = vertexa;
    this.vertexIndices[1] = vertexb;
    this.vertexIndices[2] = vertexc;
    
    ico.indices.push(vertexa);
    ico.indices.push(vertexb);
    ico.indices.push(vertexc);

    this.getNorthNeighbor = function() {
        if (this.neighbora.center.y > this.neighborb.center.y && this.neighbora.center.y > this.neighborc.center.y) {
            return this.neighbora;
        }
        if (this.neighborb.center.y > this.neighbora.center.y && this.neighborb.center.y > this.neighborc.center.y) {
            return this.neighborb;
        }
        if (this.neighborc.center.y > this.neighborb.center.y && this.neighborc.center.y > this.neighbora.center.y) {
            return this.neighborc;
        }
    };

    this.getSouthNeighbor = function() {
        if (this.neighbora.center.y < this.neighborb.center.y && this.neighbora.center.y < this.neighborc.center.y) {
            return this.neighbora;
        }
        if (this.neighborb.center.y < this.neighbora.center.y && this.neighborb.center.y < this.neighborc.center.y) {
            return this.neighborb;
        }
        if (this.neighborc.center.y < this.neighborb.center.y && this.neighborc.center.y < this.neighbora.center.y) {
            return this.neighborc;
        }
    };

    this.getWestNeighbor = function() {
        if (Math.acos(this.neighbora.center.x/ico.radius) < Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighbora.center.x/ico.radius) < Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighbora;
        }
        if (Math.acos(this.neighborb.center.x/ico.radius) < Math.acos(this.neighbora.center.x/ico.radius) 
            && Math.acos(this.neighborb.center.x/ico.radius) < Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighborb;
        }
        if (Math.acos(this.neighborc.center.x/ico.radius) < Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighborc.center.x/ico.radius) < Math.acos(this.neighbora.center.x/ico.radius)) {
            return this.neighborc;
        }
    };

    this.getEastNeighbor = function() {
        if (Math.acos(this.neighbora.center.x/ico.radius) > Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighbora.center.x/ico.radius) > Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighbora;
        }
        if (Math.acos(this.neighborb.center.x/ico.radius) > Math.acos(this.neighbora.center.x/ico.radius) 
            && Math.acos(this.neighborb.center.x/ico.radius) > Math.acos(this.neighborc.center.x/ico.radius)) {
            return this.neighborb;
        }
        if (Math.acos(this.neighborc.center.x/ico.radius) > Math.acos(this.neighborb.center.x/ico.radius) 
            && Math.acos(this.neighborc.center.x/ico.radius) > Math.acos(this.neighbora.center.x/ico.radius)) {
            return this.neighborc;
        }
    };

    this.getLatitude = function() {
		return pc.math.RAD_TO_DEG * (Math.atan2(this.center.y, this.center.z));
        //return this.center.y/ico.radius;
    };

    this.getLongitude = function() {
        return pc.math.RAD_TO_DEG * (Math.acos(this.center.x/ico.radius));
    };

    this.getAltitude = function() {
        return this.center.length;
    };

    this.getAltitudeOffset = function() {
        return this.center.length - ico.radius;
    };

    this.determineCost = function() {
        if (!this.isOcean) return -1;
        return this.center.length;
    };
	
	//Called in _recalculateMesh, use the variables instead of the below functions when accessing
	this.calculateRotationVectors = function() {
		this.localRotNormal = this.getRotationAlignedWithNormal();
		this.localRotCenter = this.getRotationAlignedWithSphere();
	};

    this.getRotationAlignedWithNormal = function() {
        //var x = Math.acos(this.center.z/ico.radius) * 180/Math.PI;
        //var y = Math.acos(this.center.x/ico.radius) * 180/Math.PI;
        //var z = Math.acos(this.center.y/ico.radius) * 180/Math.PI;

        //var x = Math.atan2(this.normal.y, this.normal.x) * -180/Math.PI;
        //var y = Math.atan2(this.normal.z, this.normal.x) * -180/Math.PI;
        //var z = Math.atan2(this.normal.x, this.normal.y) * -180/Math.PI;

        var position = new pc.Vec3(0, 0, 0);
        var target = new pc.Vec3(this.normal.x, this.normal.y, this.normal.z);
        var up = new pc.Vec3(0, 1, 0);
        var m = new pc.Mat4().setLookAt(position, target, up);

        //var x = Math.sin(Math.atan(this.normal.y/this.normal.x)) * Math.cos(Math.acos(this.normal.z)) * 180/Math.PI;
        //var y = Math.sin(Math.atan(this.normal.y/this.normal.x)) * Math.sin(Math.acos(this.normal.z)) * 180/Math.PI;
        //var z = Math.cos(Math.atan(this.normal.y/this.normal.x)) * 180/Math.PI;
        return m.getEulerAngles();//new pc.Vec3(x, y, z);
    };
	
	this.getRotationAlignedWithSphere = function() {
		var position = new pc.Vec3(0, 0, 0);
        var target = new pc.Vec3(this.center.x, this.center.y, this.center.z);
        var up = new pc.Vec3(0, 1, 0);
        var m = new pc.Mat4().setLookAt(position, target, up);
		return m.getEulerAngles();
	};

    this.getFood = function(){
        return this.food;
    };

    this.getTemperature = function(){
        this.temperature = (1.0 - Math.abs(this.center.y/ico.radius))*globalTemperatureMax/2 + globalTemperature/2;
        return this.temperature;
    };
	
	this.startRain = function() {
		if (this.rain !== undefined) {
			this.rain.enabled = true;
		} else {
			var atmo = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script.Atmosphere;
			this.rain = atmo.makeRain(extendVector(this.center, this.atmoHeight), this.localRotCenter);
		}
		
		this.isRaining = true;
		this.rainTimer = this.rainDuration;
	};
	
	this.stopRain = function() {
		if (this.rain !== undefined) {
			this.rain.destroy = true;
			this.rain = undefined;
		}
		
		this.isRaining = false;
	};
	
	this.startFog = function() {
		if (this.fog !== undefined) {
			this.fog.enabled = true;
		} else {
			var atmo = pc.fw.Application.getApplication('application-canvas').context.root._children[0].script.Atmosphere;
			this.fog = atmo.makeFog(extendVector(this.center, this.atmoHeight), this.localRotCenter);
		}
		
		this.isFoggy = true;
		this.fogTimer = this.fogDuration;
	};
	
	this.stopFog = function() {
		if (this.fog !== undefined) {
			this.fog.destroy = true;
			this.fog = undefined;
		}
		
		this.isFoggy = false;
	};
    
    this.calculateNormal = function(){
        var vectora = this.getVertex(0);
        var vectorb = this.getVertex(1);
        var vectorc = this.getVertex(2);
        
        vectorb.sub(vectora);
		vectorc.sub(vectora);

		this.normal = new pc.Vec3().cross(vectorb,vectorc);
		this.normal.normalize();
    };
    
	// TODO: this should be replaced by a repeller distribution
    this.testExtrude = function() {
        // Test Oceans
		if (!this.neighbora.isOcean || !this.neighborb.isOcean || !this.neighborc.isOcean) {
		    
			this.isOcean = false;
			
			console.log("Extruding");
			
			if (!this.neighborb.isOcean && !this.neighborc.isOcean) {
				ico.setVertexMagnitude(this.vertexIndices[0], parseFloat(Math.random()/10 + ico.radius));
			}
			if (!this.neighbora.isOcean && !this.neighborc.isOcean)
				ico.setVertexMagnitude(this.vertexIndices[1], parseFloat(Math.random()/10 + ico.radius));
			if (!this.neighbora.isOcean && !this.neighborb.isOcean)
				ico.setVertexMagnitude(this.vertexIndices[2], parseFloat(Math.random()/10 + ico.radius));

		this.neighbora.isOcean = false;
		this.neighborb.isOcean = false;
		this.neighborc.isOcean = false;
		}
    };
    
    this.setNeighbors = function(a,b,c){
        this.neighbora = ico.tiles[a];
        this.neighborb = ico.tiles[b];
        this.neighborc = ico.tiles[c];
        this.neighbors[0] = ico.tiles[a];
        this.neighbors[1] = ico.tiles[b];
        this.neighbors[2] = ico.tiles[c];
    };
    
    this.setNeighbor = function(neighbor, index){
        this.neighbors[neighbor] = ico.tiles[index];
        if (neighbor === 0) {
			this.neighbora = ico.tiles[index];
		} else if (neighbor === 1) {
			this.neighborb = ico.tiles[index];
		} else if (neighbor === 2) {
			this.neighborc = ico.tiles[index];
		}
    };
	
	this.getNeighbors = function() {
		return [this.neighbora, this.neighborb, this.neighborc];
	};
	
	this.getNeighborIndices = function() {
		return [this.neighbora.index, this.neighborb.index, this.neighborc.index];
	};
	
	this.getVertex = function(vertexIndex) {
		return ico.vertexGraph[this.vertexIndices[vertexIndex]].getVertex();
	}
    
    this.getVertexIndex = function(vertex){        
        if (vertex.x == ico.vertices[this.vertexIndices[0] * 3] 
            && vertex.y == ico.vertices[this.vertexIndices[0] * 3 + 1]	
            && vertex.z == ico.vertices[this.vertexIndices[0] * 3 + 2]) {
			return parseInt(this.vertexIndices[0]);
		} else if (vertex.x == ico.vertices[this.vertexIndices[1] * 3]
				&& vertex.y == ico.vertices[this.vertexIndices[1] * 3 + 1]
				&& vertex.z == ico.vertices[this.vertexIndices[1] * 3 + 2]) {
			return parseInt(this.vertexIndices[1]);
		} else if (vertex.x == ico.vertices[this.vertexIndices[2] * 3]
				&& vertex.y == ico.vertices[this.vertexIndices[2] * 3 + 1]
				&& vertex.z == ico.vertices[this.vertexIndices[2] * 3 + 2]) {
			return parseInt(this.vertexIndices[2]);
		}
		return -1;
    };
    
    this.getMidpoint = function(verta, vertb){
        midpoint = new pc.Vec3(ico.vertices[this.vertexIndices[verta] * 3], ico.vertices[this.vertexIndices[verta] * 3 + 1], ico.vertices[this.vertexIndices[verta] * 3 + 2]);
		vert2 = new pc.Vec3(ico.vertices[this.vertexIndices[vertb] * 3], ico.vertices[this.vertexIndices[vertb] * 3 + 1], ico.vertices[this.vertexIndices[vertb] * 3 + 2]);
		midpoint.add(vert2);
		midpoint.scale(0.5);
		return midpoint;
    };
	
	this.getMidpoint2 = function(verta, vertb){
        midpoint = this.getVertex(verta);
		vert2 = this.getVertex(vertb);
		midpoint.add(vert2);
		midpoint.scale(0.5);
		return midpoint;
    };
    
    this.calculateCenter = function(){
        var center = this.getMidpoint(0, 1);
        vert = new pc.Vec3(ico.vertices[this.vertexIndices[2] * 3], ico.vertices[this.vertexIndices[2] * 3 + 1], ico.vertices[this.vertexIndices[2] * 3 + 2]);
        center.add(vert);
        center.scale(0.5);
        this.center = center;
        return center;
    };
	
	this.calculateCenter2 = function(){
        var center = this.getMidpoint2(0, 1);
        vert = this.getVertex(2);
        center.add(vert);
        center.scale(0.5);
        this.center = center;
        return center;
    };

    this.equals = function(other){
		/*
        return (this.center.x === (other.center.x) &&
                this.center.y === (other.center.y) &&
                this.center.z === (other.center.z));
		*/
		return this.index === other.index;
    }

    this.subdivide = function() {
        console.log("Entering subdivide for face " + this.index);

        // Get the three new midpoint vertices
        var new0 = ico.vertexGraph[this.vertexIndices[1]].getCommonNeighbor(ico.vertexGraph[this.vertexIndices[2]]);
        var new1 = ico.vertexGraph[this.vertexIndices[2]].getCommonNeighbor(ico.vertexGraph[this.vertexIndices[0]]);
        var new2 = ico.vertexGraph[this.vertexIndices[0]].getCommonNeighbor(ico.vertexGraph[this.vertexIndices[1]]);

        console.log(new0 + " " + new1 + " " + new2);

        this.createSubface(0, this.vertexIndices[0], new2, new1);

        this.createSubface(1, new2, this.vertexIndices[1], new0);

        this.createSubface(2, new1, new0, this.vertexIndices[2]);

        /*// Create tile based at vertex 0
        ico.tiles[ico.tiles.length] = new Tile(ico.tiles.length, this.vertexIndices[0], new2.index, new1.index);

        // Set its c neighbor if its c neighbor is divided
        if (this.neighborc.divided == true) {
            if (this.neighborc.neighbora.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborc.neighbora subdiv");

                // Set neighbor to neighbora
                ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc.neighbora;

                // Update other's neighbor to new tile
                if (this.neighborc.neighbora.neighbora == this) {
                    this.neighborc.neighbora.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighbora.neighborb == this) {
                    this.neighborc.neighbora.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighbora.neighborc == this) {
                    this.neighborc.neighbora.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborc.neighborb.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborc.neighborb subdiv");

                // Set neighbor to neighborb
                ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc.neighborb;

                // Update other's neighbor to new tile
                if (this.neighborc.neighborb.neighbora == this) {
                    this.neighborc.neighborb.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborb.neighborb == this) {
                    this.neighborc.neighborb.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborb.neighborc == this) {
                    this.neighborc.neighborb.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborc.neighborc.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborc.neighborc subdiv here!");

                // Set neighbor to neighborc
                ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc.neighborc;


                //console.log("Neighbora: " + this.neighborc.neighborc.neighbora.index);
                console.log(ico.tiles[ico.tiles.length - 1].index);
                console.log(this.index);
                console.log("Neighbora: " + this.neighborc.neighborc.neighbora.index);
                console.log("Neighborb: " + this.neighborc.neighborc.neighborb.index);
                console.log("Neighborc: " + this.neighborc.neighborc.neighborc.index);

                // Update other's neighbor to new tile
                if (this.neighborc.neighborc.neighbora == this) {
                    this.neighborc.neighborc.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborc.neighborb == this) {
                    this.neighborc.neighborc.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborc.neighborc == this) {
                    this.neighborc.neighborc.neighborc = ico.tiles[ico.tiles.length - 1];
                }


                console.log(ico.tiles[ico.tiles.length - 1].index);
                console.log(this.index);
                console.log("Neighbora: " + this.neighborc.neighborc.neighbora.index);
            }
        } else {
            ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc;
        }
        if (this.neighborb.divided == true) {
            if (this.neighborb.neighbora.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborb.neighbora subdiv");

                // Set neighbor to neighbora
                ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb.neighbora;

                // Update other's neighbor to new tile
                if (this.neighborb.neighbora.neighbora == this) {
                    this.neighborb.neighbora.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighbora.neighborb == this) {
                    this.neighborb.neighbora.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighbora.neighborc == this) {
                    this.neighborb.neighbora.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborb.neighborb.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborb.neighborb subdiv");

                // Set neighbor to neighborb
                ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb.neighborb;

                // Update other's neighbor to new tile
                if (this.neighborb.neighborb.neighbora == this) {
                    this.neighborb.neighborb.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborb.neighborb == this) {
                    this.neighborb.neighborb.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborb.neighborc == this) {
                    this.neighborb.neighborb.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborb.neighborc.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborb.neighborc subdiv");

                // Set neighbor to neighborc
                ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb.neighborc;

                // Update other's neighbor to new tile
                if (this.neighborb.neighborc.neighbora == this) {
                    this.neighborb.neighborc.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborc.neighborb == this) {
                    this.neighborb.neighborc.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborc.neighborc == this) {
                    this.neighborb.neighborc.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            }
        } else {
            ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb;
        }

        // Create tile based at vertex 1
        ico.tiles[ico.tiles.length] = new Tile(ico.tiles.length, new2.index, this.vertexIndices[1], new0.index);

        // Set its c neighbor if its c neighbor is divided
        if (this.neighborc.divided == true) {
            if (this.neighborc.neighbora.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighborc.neighbora subdiv");

                // Set neighbor to neighbora
                ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc.neighbora;

                // Update other's neighbor to new tile
                if (this.neighborc.neighbora.neighbora == this) {
                    this.neighborc.neighbora.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighbora.neighborb == this) {
                    this.neighborc.neighbora.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighbora.neighborc == this) {
                    this.neighborc.neighbora.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborc.neighborb.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighborc.neighborb subdiv");

                // Set neighbor to neighborb
                ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc.neighborb;

                // Update other's neighbor to new tile
                if (this.neighborc.neighborb.neighbora == this) {
                    this.neighborc.neighborb.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborb.neighborb == this) {
                    this.neighborc.neighborb.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborb.neighborc == this) {
                    this.neighborc.neighborb.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborc.neighborc.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighborc.neighborc subdiv");

                // Set neighbor to neighborc
                ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc.neighborc;

                // Update other's neighbor to new tile
                if (this.neighborc.neighborc.neighbora == this) {
                    this.neighborc.neighborc.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborc.neighborb == this) {
                    this.neighborc.neighborc.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborc.neighborc.neighborc == this) {
                    this.neighborc.neighborc.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            }
        } else {
            ico.tiles[ico.tiles.length - 1].neighborc = this.neighborc;
        }
        if (this.neighbora.divided == true) {
            if (this.neighbora.neighbora.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighbora.neighbora subdiv");

                // Set neighbor to neighbora
                ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora.neighbora;

                // Update other's neighbor to new tile
                if (this.neighbora.neighbora.neighbora == this) {
                    this.neighbora.neighbora.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighbora.neighborb == this) {
                    this.neighbora.neighbora.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighbora.neighborc == this) {
                    this.neighbora.neighbora.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighbora.neighborb.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighbora.neighborb subdiv");

                // Set neighbor to neighborb
                ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora.neighborb;

                // Update other's neighbor to new tile
                if (this.neighbora.neighborb.neighbora == this) {
                    this.neighbora.neighborb.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborb.neighborb == this) {
                    this.neighbora.neighborb.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborb.neighborc == this) {
                    this.neighbora.neighborb.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighbora.neighborc.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighbora.neighborc subdiv");

                // Set neighbor to neighborc
                ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora.neighborc;

                // Update other's neighbor to new tile
                if (this.neighbora.neighborc.neighbora == this) {
                    this.neighbora.neighborc.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborc.neighborb == this) {
                    this.neighbora.neighborc.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborc.neighborc == this) {
                    this.neighbora.neighborc.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            }
        } else {
            ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora;
        }

        // Create tile based at vertex 2
        ico.tiles[ico.tiles.length] = new Tile(ico.tiles.length, new1.index, new0.index, this.vertexIndices[2]);

        // Set its b neighbor if its b neighbor is divided
        if (this.neighborb.divided == true) {
            if (this.neighborb.neighbora.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborb.neighbora subdiv");

                // Set neighbor to neighbora
                ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb.neighbora;

                // Update other's neighbor to new tile
                if (this.neighborb.neighbora.neighbora == this) {
                    this.neighborb.neighbora.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighbora.neighborb == this) {
                    this.neighborb.neighbora.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighbora.neighborc == this) {
                    this.neighborb.neighbora.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborb.neighborb.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborb.neighborb subdiv");

                // Set neighbor to neighborb
                ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb.neighborb;

                // Update other's neighbor to new tile
                if (this.neighborb.neighborb.neighbora == this) {
                    this.neighborb.neighborb.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborb.neighborb == this) {
                    this.neighborb.neighborb.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborb.neighborc == this) {
                    this.neighborb.neighborb.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighborb.neighborc.containsVertex(this.vertexIndices[0])) {
                console.log("Tile " + this.index + ": in neighborb.neighborc subdiv");

                // Set neighbor to neighborc
                ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb.neighborc;

                // Update other's neighbor to new tile
                if (this.neighborb.neighborc.neighbora == this) {
                    this.neighborb.neighborc.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborc.neighborb == this) {
                    this.neighborb.neighborc.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighborb.neighborc.neighborc == this) {
                    this.neighborb.neighborc.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            }
        } else {
            ico.tiles[ico.tiles.length - 1].neighborb = this.neighborb;
        }
        if (this.neighbora.divided == true) {
            if (this.neighbora.neighbora.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighbora.neighbora subdiv");

                // Set neighbor to neighbora
                ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora.neighbora;

                // Update other's neighbor to new tile
                if (this.neighbora.neighbora.neighbora == this) {
                    this.neighbora.neighbora.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighbora.neighborb == this) {
                    this.neighbora.neighbora.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighbora.neighborc == this) {
                    this.neighbora.neighbora.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighbora.neighborb.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighbora.neighborb subdiv");

                // Set neighbor to neighborb
                ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora.neighborb;

                // Update other's neighbor to new tile
                if (this.neighbora.neighborb.neighbora == this) {
                    this.neighbora.neighborb.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborb.neighborb == this) {
                    this.neighbora.neighborb.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborb.neighborc == this) {
                    this.neighbora.neighborb.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            } else if (this.neighbora.neighborc.containsVertex(this.vertexIndices[1])) {
                console.log("Tile " + this.index + ": in neighbora.neighborc subdiv");

                // Set neighbor to neighborc
                ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora.neighborc;

                // Update other's neighbor to new tile
                if (this.neighbora.neighborc.neighbora == this) {
                    this.neighbora.neighborc.neighbora = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborc.neighborb == this) {
                    this.neighbora.neighborc.neighborb = ico.tiles[ico.tiles.length - 1];
                } else if (this.neighbora.neighborc.neighborc == this) {
                    this.neighbora.neighborc.neighborc = ico.tiles[ico.tiles.length - 1];
                }
            }
        } else {
            ico.tiles[ico.tiles.length - 1].neighbora = this.neighbora;
        }*/

        
        
        this.neighbors[0] = ico.tiles[ico.tiles.length - 3];
        ico.tiles[ico.tiles.length - 3].neighbors[0] = this;

        this.neighbors[1] = ico.tiles[ico.tiles.length - 2];
        ico.tiles[ico.tiles.length - 2].neighbors[1] = this;

        this.neighbors[2] = ico.tiles[ico.tiles.length - 1];
        ico.tiles[ico.tiles.length - 1].neighbors[2] = this;


        this.vertexIndices[0] = new0;
        this.vertexIndices[1] = new1;
        this.vertexIndices[2] = new2;

        this.divided = true;
        //ico.tiles[ico.tiles.length] = new Tile(ico, vertexIndices[0], new2.index, new1.index);
    };

    this.getNeighborContainingVertex = function(index) {
        for (var i = 0; i < 3; ++i) {
            if (this.neighbors[i].containsVertex(index)) {
                return this.neighbors[i];
            }
        }
        console.error("Tile " + this.index + " has no neighbors containing vertex " + index);
        console.log(this);
        console.log(this.neighbors[0]);
        console.log(this.neighbors[1]);
        console.log(this.neighbors[2]);
    }

    this.getNeighborIndexToTile = function(otherIndex) {
        for (var i = 0; i < 3; ++i) {
            if (this.neighbors[i].index == otherIndex) {
                return i;
            }
        }
        console.error("Tile " + this.index + " has no neighbors to tile " + index);
        console.log(this);
        console.log(this.neighbors[0]);
        console.log(this.neighbors[1]);
        console.log(this.neighbors[2]);
    }

    this.containsVertex = function(index) {
        return (this.vertexIndices[0] == index || this.vertexIndices[1] == index || this.vertexIndices[2] == index);
    };

    this.createSubface = function(vertex, a, b, c) {
        console.log("Creating subface " + ico.tiles.length + " for face " + this.index);

        // Create tile
        ico.tiles[ico.tiles.length] = new Tile(ico.tiles.length, a, b, c);
        var newFace = ico.tiles[ico.tiles.length - 1];

        console.log(newFace);

        this.calculateSubfaceNeighbor(vertex, (vertex + 1) % 3);
        this.calculateSubfaceNeighbor(vertex, (vertex + 2) % 3);

        //this.neighbors[vertex] = newFace;
        //newFace.neighbors[vertex] = this;

        //newFace.updateNeighbors();
    };

    this.calculateSubfaceNeighbor = function(vertex, neighbor) {

        var newNeighbor = this.neighbors[neighbor];

        // Set the vertex's neighbor if neighbor is divided
        if (this.neighbors[neighbor].divided == true) {
            console.log("Neighbor " + neighbor + " divided for face " + this.index);

            newNeighbor = this.neighbors[neighbor].getNeighborContainingVertex(this.vertexIndices[vertex]);

            if (newNeighbor == null) {
                console.log(this);
                console.log(this.neighbors[neighbor]);
            }

            console.log(newNeighbor);

            ico.tiles[ico.tiles.length - 1].neighbors[neighbor] = newNeighbor;

            var backNeighbor = newNeighbor.getNeighborIndexToTile(this.index);

            newNeighbor.neighbors[backNeighbor] = ico.tiles[ico.tiles.length - 1];

        } else {

            ico.tiles[ico.tiles.length - 1].neighbors[neighbor] = this.neighbors[neighbor];
        }
    };
}