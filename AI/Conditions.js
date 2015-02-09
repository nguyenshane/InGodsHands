pc.script.create('Conditions', function (context) {
    // Creates a new Conditions instance
    var Conditions = function (entity) {
        this.entity = entity;
        this.tribe;
    };


    Conditions.prototype = {
        // List of condition functions to add to a rule's condition list
        
        initialize: function (){
            this.tribe = context.root.findByName("BaseTribe").script.tribe;
        },

        testIf5: function(checkInt) {
            if(checkInt === 5){
                return true;
            }
            return false;
        },
        
        testIf2: function(checkInt) {
            if(checkInt === 2){
                return true;
            }
            return false;
        },

        isTileWarmer: function(){
            if (this.tribe.idealTemperature < this.tribe.currTileTemperature){
                return true;
            }
            return false;
        },

        isTileColder: function(){
            if (this.tribe.idealTemperature > this.tribe.currTileTemperature){
                return true;
            }
            return false; 
        },

        isTileTemperatureIdeal: function(){
            if (this.tribe.idealTemperature === this.tribe.currTileTemperature){
                return true;
            }
            return false;
        }

    };

    return Conditions;
});