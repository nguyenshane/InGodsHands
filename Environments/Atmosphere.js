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
            
			//this.rainstack = [];
			//this.fogstack = [];
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
			/*
            if (this.rainstack.length >= this.stackBuffer) {
                var e = this.rainstack.shift();
                var destroyable = this.checkDestroyable(e);
                
                if (destroyable) e.destroy();
                else this.rainstack.unshift(e)
            }
			*/
			/*
			for (var i = 0; i < this.rainstack.length; i++) {
				var e = this.rainstack.shift();
				if (this.checkDestroyable(e)) {
					//e.destroy();
				} else {
					this.rainstack.push(e);
				}
			}
			
			for (var i = 0; i < this.fogstack.length; i++) {
				var e = this.fogstack.shift();
				if (this.checkDestroyable(e)) {
					//e.destroy();
				} else {
					this.fogstack.push(e);
				}
			}*/
        },
        
        makeRain: function(position, rotation) {
			var e = this.atm.clone(); // Clone Atmosphere
			this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
			e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
			
			var rain = e.findByName("RainPS");
			//rain.rotate(rotation.x - 90, rotation.y, rotation.z);
			//rain.setPosition(position);
			
			rain.particlesystem.enabled = true;
			//rain.particlesystem.play();
			
			return e;
			
			/*
            if (this.rainstack.length < this.stackBuffer){
                var e = this.atm.clone(); // Clone Atmosphere
                //e.rotate(rotation.x - 90, rotation.y, rotation.z);
				e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
                //e.setPosition(position);

                this.entity.getParent().addChild(e); // Add it as a sibling to the original
    			
    			//e.destroyable = false;
    			
    			var rain = e.findByName("RainPS");
                //rain.rotate(rotation.x - 90, rotation.y, rotation.z);
    			//rain.setPosition(position);
    			
                rain.particlesystem.enabled = true;
                rain.particlesystem.play();
                
                this.rainstack.push(e);
    			return e;
            } else {
                for (var i = 0; i < this.rainstack.length; i++) {
                    var e = this.rainstack.shift();
                    if (this.checkDestroyable(e)) {
                        // if this is reusable
                        //e.rotate(rotation.x - 90, rotation.y, rotation.z);
						e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
                        //e.setPosition(position);
                        var rain = e.findByName("RainPS");
                        

                        rain.particlesystem.reset();
                        rain.particlesystem.play();
                        return e;
                    } else {
                        this.rainstack.push(e);
						return e;
                    }
                }
            }
			*/
        },
        
        makeFog: function(position, rotation) {
			var e = this.atm.clone(); // Clone Atmosphere
			this.entity.getParent().addChild(e); // Add it as a sibling to the original
			
			e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
			
			var fog = e.findByName("FogPS");
			//fog.rotate(rotation.x - 90, rotation.y, rotation.z);
			//fog.setPosition(position);
			
			fog.particlesystem.enabled = true;
			//fog.particlesystem.play();
			
			return e;
			
			/*
            if (this.fogstack.length < this.stackBuffer) {
                var e = this.atm.clone(); // Clone Atmosphere
                //e.rotate(rotation.x - 90, rotation.y, rotation.z);
				e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
                this.entity.getParent().addChild(e); // Add it as a sibling to the original
    			
    			//e.destroyable = false;
                
    			var fog = e.findByName("FogPS");

    			//fog.setPosition(position);
    			
                fog.particlesystem.enabled = true;
                fog.particlesystem.play();
    			
                this.fogstack.push(e);
    			return e;
            } else {
                for (var i = 0; i < this.fogstack.length; i++) {
                    var e = this.fogstack.shift();
                    if (this.checkDestroyable(e)) {
                        //e.rotate(rotation.x - 90, rotation.y, rotation.z);
						e.setEulerAngles(rotation.x - 90, rotation.y, rotation.z);
                        // if this is reusable
                        var fog = e.findByName("FogPS");
                        
                        //fog.setPosition(position);

                        fog.particlesystem.reset();
                        fog.particlesystem.play();
                        return e;
                    } else {
                        this.fogstack.push(e);
						return e;
                    }
                }
            }
			*/
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
			//if (!e.destroyable) return false;
			
            if (e.findByName("RainPS").particlesystem.enabled && !e.findByName("RainPS").particlesystem.isPlaying())
                return true;
            
            
            if (e.findByName("FogPS").particlesystem.enabled && !e.findByName("FogPS").particlesystem.isPlaying())
                return true;
            
            return false;
        },
    };

    return Atmosphere;
});