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
            this.atm = context.root.findByName("Atmosphere");
			
			this.fogstack = [];
			this.rainstack = [];

			this.audio = context.root._children[0].script.AudioController;
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
            console.log('rainStack new length:', this.rainstack.length);
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
            console.log('fogStack new length:', this.fogstack.length);
			var e = this.atm.clone(); // Clone Atmosphere
			this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
			e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
			
			//var fog = e.findByName("FogPS");
            var fog = e._children[1];
			
			fog.particlesystem.enabled = true;
			//fog.particlesystem.play();
			
			return e;
        },
        
        makeStorm: function() {
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