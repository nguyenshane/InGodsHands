pc.script.attribute("temperature", "number", 50, {
    min: 0,
    max: 100
}); // (name, type, value, min/max)
pc.script.attribute("latitude", "number", 9);

pc.script.create('TemperatureAlteration', function (context) {
    // Creates a new TemperatureAlteration instance
    var TemperatureAlteration = function (entity) {
        this.entity = entity;
        
        var temperatureVal;
        temperatureVal = 50;
        
        this.temperature = temperatureVal;
    };

    TemperatureAlteration.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (context.keyboard.isPressed(pc.input.KEY_A)){
                if (this.temperature >= 0){
                    this.temperature -= this.latitude/2;
                } else {
                    this.temperature = 0;
                }
            }
            
            if (context.keyboard.isPressed(pc.input.KEY_S)){
                if (this.temperature <= 100){
                    this.temperature += this.latitude/2;
                } else {
                    this.temperature = 100;
                }
            }
            
            if (context.keyboard.isPressed(pc.input.KEY_Z))
            console.log(context.root.findByName("Tile1").script.TemperatureAlteration.temperature); //reference a certain tile's temp.
        }
    };

    return TemperatureAlteration;
});