pc.script.create('Conditions', function (context) {
    // Creates a new Conditions instance
    var Conditions = function (entity) {
        this.entity = entity;
    };


    Conditions.prototype = {
        // List of condition functions to add to a rule's condition list
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

        //////////////////////////////////
        // Temperature based /////////////
        //////////////////////////////////

        isTileWarmer: function(tribe){
            if (tribe.idealTemperature < 
                (Math.round(tribe.currTileTemperature) + 5)) {
                return true;
            }
            return false;
        },

        isTileColder: function(tribe){
            if (tribe.idealTemperature > 
                (Math.round(tribe.currTileTemperature) - 5)){
                return true;
            }
            return false; 
        },

        isTileTemperatureIdeal: function(tribe){
            if (!isTileWarmer() || !isTileColder()){
                return true;
            }
            return false;
        },

        /////////////////////////////////
        // Position based ///////////////
        /////////////////////////////////

        isAboveEquator: function(tribe){
            if (tribe.tile.getLatitude() > 0){
                return true;
            }
            return false;
        },

        isBelowEquator: function(tribe){
            if (tribe.tile.getLatitude() < 0){
                return true;
            }
            return false;
        }
    };

    return Conditions;
});