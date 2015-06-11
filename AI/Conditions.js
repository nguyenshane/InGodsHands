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
            if ((tribe.idealTemperature + 8 < tribe.currTileTemperature) ||
                (tribe.idealTemperature - 8 > tribe.currTileTemperature)) {
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
            if(inactiveTimer >= 90){ 
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
       
        isEventCooldownUp: function(tribe){
            if(tribe.eventTimer <= 0){ 
                return true;
            }
            return false;
        },

        hasNoAnimals: function(tribe){
            for(var i = 0; i < tribe.influencedTiles.length; i++){
                if (tribe.influencedTiles[i].hasAnimal) {
                    return false;
                }
            }
            return true;
        },

        isWaterNotIdeal: function(tribe){
            tribe.currWater = 0;
            for(var i = 0; i < tribe.influencedTiles.length; i++){
                if (tribe.influencedTiles[i].hasWater()) {
                    ++tribe.currWater;
                }
            }
            console.log(tribe.idealWater + " " + tribe.currWater);
            if ((tribe.idealWater + 8 < tribe.currWater) ||
                (tribe.idealWater - 8 > tribe.currWater)) {
                return true;
            }
            return false;
        },

    };

    return Conditions;
});