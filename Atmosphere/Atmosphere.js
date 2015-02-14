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
            this.atmstack = [];
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            var x = Math.floor((Math.random() * 360) + 0);
            var z = Math.floor((Math.random() * 360) + 0);
            
            if (this.atmstack.length < this.stackBuffer ){
                this.makeFog(x,0,z);
                this.makeRain(x,0,z);
            }
            
            
            if (this.atmstack.length >= this.stackBuffer){
                var e = this.atmstack.shift();
                var destroyable = this.checkDestroyable(e);
                
                if (destroyable) e.destroy();
                else this.atmstack.unshift(e)
            }
            
            console.log(this.atmstack.length);
        },
        
        makeRain: function(x,y,z) {
            var e = this.atm.clone(); // Clone Atmosphere
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            
            e.rotateLocal(x, y, z);
            e.findByName("RainPS").particlesystem.enabled = true;
            e.findByName("RainPS").particlesystem.play();
            
            this.atmstack.push(e);
        },
        
        makeFog: function(x,y,z) {
            var e = this.atm.clone(); // Clone Atmosphere
            
            this.entity.getParent().addChild(e); // Add it as a sibling to the original
            
            e.rotateLocal(x, y, z);
            e.findByName("FogPS").particlesystem.enabled = true;
            e.findByName("FogPS").particlesystem.play();
            
            this.atmstack.push(e);
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