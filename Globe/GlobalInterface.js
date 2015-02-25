/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

pc.script.create('globalInterface', function (context) {
    // Creates a new GlobalVariables instance
    var GlobalVariables = function (entity) {
        this.entity = entity;
        time = 0;
    };

    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            globalTemperature = 90;
            globalTemperatureMax = 100;

            sun = context.root.findByName("Sun");
            shaderSun = context.root.findByName("ShaderSun");
            globalSunRotation = 50;

            maxTotalBelief = 100;
            totalBelief = maxTotalBelief;
            prevTotalBelief = totalBelief;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            // Test temperature
            // time += dt;
            // var t = (time % 10);
            // globalTemperature = t*10;
            // End test temperature

            // Test belief
            if ((prevTotalBelief > totalBelief && totalBelief > 0) || totalBelief > maxTotalBelief) {
                prevTotalBelief = totalBelief;
                totalBelief -= dt* 10;
            } else {
                prevTotalBelief = totalBelief;
                totalBelief += dt* 10;
            }


            sun.setPosition(0, 0, 0);

            /**** Test sun rotation ****/
            //sun.rotate(0, dt * 100, 0);
            sun.rotate(0, dt * globalSunRotation, 0);
            //sun.rotateLocal(0, dt * 100, 0);
            shaderSun.rotateLocal(0, dt * globalSunRotation * -2, 0);
            //sun.setEulerAngles(0, 90 + this.time, 0);
            /****                   ****/
        }
    };

    return GlobalVariables;
});