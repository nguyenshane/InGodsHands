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
			pc.createSphere(canvas)
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return SphereTest;
});