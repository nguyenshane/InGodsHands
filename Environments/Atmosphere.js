///
// Description: This is the Atmosphere Particle Effects
///

pc.script.attribute('stackBuffer', 'number', 5); // change this number to optimal the buffer

pc.script.create('Atmosphere', function (context) {
    // Creates a new Atmosphere instance
    var Atmosphere = function (entity) {
        this.entity = entity;
    };

    Atmosphere.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
			var t1 = new Date();

            this.atm = context.root.findByName("Atmosphere");
			this.cam = pc.fw.Application.getApplication('application-canvas').context.root._children[0].findByName("Camera");
			
			this.fogstack = [];
			this.rainstack = [];

			this.audio = context.root._children[0].script.AudioController;

			var t2 = new Date();
			debug.log(DEBUG.INIT, "atmosphere initialization: " + (t2-t1));
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			//console.log(this.rainstack.length + " " + this.fogstack.length);
        },
        
		makeRain: function(rotation) {
			for (var i = 0; i < this.rainstack.length; i++) {
				var r = this.rainstack[i];
				if (!r.enabled) {
					//Found an unused one
					r.enabled = true;
					r.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
					return this.rainstack[i];
				}
			}
			
			//Create a new one
			var r = this.createRain(rotation);
			this.rainstack.push(r);
			return r;
		},
		
        createRain: function(rotation) {
            //console.log('rainStack new length:', this.rainstack.length);
			var e = this.atm.clone(); // Clone Atmosphere
			this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
			e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
			
			//var rain = e.findByName("RainPS");
            var rain = e._children[2];
			
			rain.particlesystem.enabled = true;
			//rain.particlesystem.play();

			this.audio.sound_MakeRain();
			
			return e;
        },
        
		makeFog: function(rotation) {
			for (var i = 0; i < this.fogstack.length; i++) {
				var r = this.fogstack[i];
				if (!r.enabled) {
					//Found an unused one
					r.enabled = true;
					r.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
					return this.fogstack[i];
				}
			}
			
			//Create a new one
			var r = this.createFog(rotation);
			this.fogstack.push(r);
			return r;
		},
		
        createFog: function(rotation) {
            //console.log('fogStack new length:', this.fogstack.length);
			var e = this.atm.clone(); // Clone Atmosphere
			this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
			e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
			
			//var fog = e.findByName("FogPS");
            var fog = e._children[1];
			
			fog.particlesystem.enabled = true;
			//fog.particlesystem.play();
			
			return e;
        },
        
        makeStorm: function(latitude, size) {
			/*
            var storm = this.entity.findByName("ThunderStormPS");
            // var position = new pc.Vec3(0, 0, 0);
            // var target = new pc.Vec3(this.center.x, this.center.y, this.center.z);
            // var up = new pc.Vec3(0, 1, 0);
            // var m = new pc.Mat4().setLookAt(position, target, up);
            // m.getEulerAngles();
            // var cameraPos = this.entity.getParent().findByName("Camera").getPosition();
            // console.log("Camera's Position: " + cameraPos + " End position: " + cameraPos.add2(pc.Vec3.FORWARD.scale(100000)));
            // context.systems.rigidbody.raycastFirst(cameraPos, cameraPos.add2(pc.Vec3.FORWARD.scale(100000)), function(result){
            //     console.log("Result of ray: " + result.entity.getName());
            // });
            storm.setEulerAngles(90, 0, 0);
            storm.particlesystem.enabled = true;
            storm.particlesystem.play();
			*/
			
			var s = size / 20;
			s = pc.math.clamp(s, 3, 6);
			var cameraDir = this.cam.script.Camera.entity.getPosition().normalize();
			var v = new pc.Vec3(cameraDir.x, cameraDir.y + latitude/50, cameraDir.z);
			v = v.normalize();
			var centerTile = ico.tiles[0];
            var c = new pc.Vec3(centerTile.center.x, centerTile.center.y, centerTile.center.z);
            c = c.normalize();
			var centerDot = v.dot(c);
			
			for (var i = 1; i < ico.tiles.length; i++) {
				var tile = ico.tiles[i];
                c = new pc.Vec3(tile.center.x, tile.center.y, tile.center.z);
                c = c.normalize();
				var tileDot = v.dot(c);
				
				if (tileDot > centerDot) {
					centerTile = tile;
					centerDot = tileDot;
				}
			}
			
			var tiles = getTilesInArea(ico, centerTile.index, s);
			
			for (var i = 0; i < tiles.length; i++) {
				ico.tiles[tiles[i]].startStorm(s);
			}
            
        },

        checkDestroyable: function(e) {
            if (e.findByName("RainPS").particlesystem.enabled && !e.findByName("RainPS").particlesystem.isPlaying())
                return true;
			
            if (e.findByName("FogPS").particlesystem.enabled && !e.findByName("FogPS").particlesystem.isPlaying())
                return true;
            
            return false;
        },
    };

    return Atmosphere;
});