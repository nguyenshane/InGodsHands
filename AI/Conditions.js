pc.script.create('Conditions', function (context) {
    // Creates a new Conditions instance
    var Conditions = function (entity) {
        this.entity = entity;
    };

    Conditions.prototype = {
        // List of condition functions to add to a rule's condition list

        //////////////////////////////////
        // Temperature based /////////////
        //////////////////////////////////

        isTileWarmer: function(tribe){
            if (tribe.currTileTemperature > tribe.idealTemperature + 5) {
                return true;
            }
            return false;
        },

        isTileColder: function(tribe){
            if (tribe.currTileTemperature < tribe.idealTemperature - 5){
                return true;
            }
            return false; 
        },

        isTileTemperatureIdeal: function(tribe){
            if (!this.isTileWarmer(tribe) || !this.isTileColder(tribe)){
                return true;
            }
            return false;
        },

        isTileTemperatureNotIdeal: function(tribe){
            if ((tribe.idealTemperature + 5 < tribe.currTileTemperature) ||
                (tribe.idealTemperature - 5 > tribe.currTileTemperature)) {
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
        },

        /////////////////////////////////
        // States of being //////////////
        /////////////////////////////////

        isSpiteful: function(tribe){
            return tribe.isSpiteful;
        },

        isNotSpiteful: function(tribe){
            return !tribe.isSpiteful;
        },

        isGodInactive: function(tribe){
            if(inactiveTimer >= 40){ 
                return true;
            }
            return false;
        },

        isNoSun: function(tribe){
            if(tribe.noSunTimer >= 50){
                return true;
            }
            return false;
        },

        isStockpileIncreasing: function(tribe){
            if(tribe.stockpileChange > 0){
                return true;
            }
            return false;    
        },

        isStockpileDecreasing: function(tribe){
            if(tribe.stockpileChange < 0){
                return true;
            }
            return false;    
        },
    };

    return Conditions;
});