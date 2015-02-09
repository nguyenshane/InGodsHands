pc.script.create('Conditions', function (context) {
    // Creates a new Conditions instance
    var Conditions = function (entity) {
        this.entity = entity;
        //this.tribe;
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

        isTileWarmer: function(tribeEntity){
            if (tribeEntity.script.tribe.idealTemperature < 
                tribeEntity.script.tribe.currTileTemperature){
                return true;
            }
            return false;
        },

        isTileColder: function(tribeEntity){
            if (tribeEntity.script.tribe.idealTemperature > 
                tribeEntity.script.tribe.currTileTemperature){
                return true;
            }
            return false; 
        },

        isTileTemperatureIdeal: function(tribeEntity){
            if (tribeEntity.script.tribe.idealTemperature === 
                tribeEntity.script.tribe.currTileTemperature){
                return true;
            }
            return false;
        },

        /////////////////////////////////
        // Position based ///////////////
        /////////////////////////////////

        isAboveEquator: function(tribeEntity){
            if (tribeEntity.script.tribe.tile.getLatitude() > 0){
                return true;
            }
            return false;
        },

        isBelowEquator: function(tribeEntity){
            if (tribeEntity.script.tribe.tile.getLatitude() < 0){
                return true;
            }
            return false;
        }
    };

    return Conditions;
});