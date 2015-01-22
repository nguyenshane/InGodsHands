///
// Description: This is a test to create a sphere
// More info at http://developer.playcanvas.com/user-manual/scripting/anatomy/
///
pc.script.create('sphere-test', function (context) {
    // Creates a new instance
    var SphereTest = function (entity) {
        this.entity = entity;
    };

    SphereTest.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
                 var sphere = this.entity.model.model.meshInstances[0].mesh;
                 
                 //var testVertex = sphere.vertexBuffer[0] = 30;
                 
                 sphere.vertexBuffer.usage = pc.gfx.BUFFER_DYNAMIC;
                 
                 console.log(sphere);
                 console.log(sphere.vertexBuffer.getUsage());
                 console.log(pc.gfx.BUFFER_DYNAMIC);
                 console.log(sphere.vertexBuffer.getFormat());
                 
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return SphereTest;
});