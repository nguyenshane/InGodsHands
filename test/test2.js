///
// Description: This test2 demonstrate how to communicate to script in test
// NOTE: 2 scripts have to be in the same entity for the this.entity.script.SCRIPTNAME to work
// Otherwise, you will need to trace the script by context.root.findByName('ENTITYNAME).script.SCRIPTNAME
// More info at http://developer.playcanvas.com/user-manual/scripting/anatomy/
///


pc.script.create('test2', function (context) {
    // Creates a new Test2 instance
    var Test2 = function (entity) {
        this.entity = entity;
    };
    
    Test2.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.entity.script.test.aFunction();
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Test2;
});