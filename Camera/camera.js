pc.script.create('camera', function (context) {
    // Creates a new Camera instance
    var Camera = function (entity) {
        this.entity = entity;

        this.distance = 10;
        this.height = 0;
        this.orbitAngle = 0
        
    };

    Camera.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringW = context.root.findByName("test").script.HIDInterface.stringW;

            console.log(this.stringW);
            this.stringW.on("moving", this.move_W, this.direction, this.distance, this.speed, this.orbitAngle);
        },
        
        move_W: function(position, distance, speed, orbitAngle) {
			if(position>0) {
			    context.root.findByName("Camera").script.camera.orbitAngle++;
			}
			else context.root.findByName("Camera").script.camera.orbitAngle--;
		},

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (context.keyboard.isPressed(pc.input.KEY_LEFT)) {
                this.orbitAngle++;
            }
            if (context.keyboard.isPressed(pc.input.KEY_RIGHT)) {
                this.orbitAngle--;
            }

            var cameraEntity = this.entity;
            var sphereEntity = context.root.findByName('Sphere');

            // Step 1: Place the camera where the sphere is
            cameraEntity.setPosition(sphereEntity.getPosition());

            // Step 2: Rotate the ball around the world Y (up) axis by some stored angle
            cameraEntity.setEulerAngles(0, this.orbitAngle, 0);

            // Step 3: Move the camera backwards by some 'distance' and up by some 'height'
            // Note that a camera looks down its negative Z local axis. So if this.distance
            // is a positive number, it will move backwards.
            cameraEntity.translateLocal(0, this.height, this.distance);

            // Step 4: Look at the ball from the camera's new position
            cameraEntity.lookAt(sphereEntity.getPosition());}
    };

    return Camera;
});