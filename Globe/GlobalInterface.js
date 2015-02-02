/* Global Interface
 * Stores all the global variables (e.g. temperature)
 * Serves as an interface between the hardware interface and the game world
 * 
*/

pc.script.create('globalInterface', function (context) {
    // Creates a new GlobalVariables instance
    var GlobalVariables = function (entity) {
        this.entity = entity;
        this.time = 0;
    };

    GlobalVariables.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            globalTemperature = 0;
            globalTemperatureMax = 100;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            // Test temperature
            this.time += dt;
            var t = (this.time % 10);
            globalTemperature = t*10;
            // End test temperature
            
            console.log(ico.tiles[0].getTemperature());
        }
    };

    return GlobalVariables;
});