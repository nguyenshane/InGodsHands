// Contains the Rule base class and the actual rules that inherit those base elements
// The conditions list is checked through continuously; when a rule's conditions are fulfilled,
// the rule's consequence is fired. The weight of a rule determines its importance relative to
// the rest of the rules. Two rules may have their conditions fulfilled simultaneously, a 
// higher weighted rule will fire first.

/////////////////////////////////////////
//   Rules         //////////////////////
/////////////////////////////////////////

/* 
 *  wantToMoveNorthColder determines whether the tribe wants to move north
 *  above the equator  
 *
 */

var wantToMoveNorthColder = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 1;
    this.conditions = [allConditions.isTileWarmer,
                       allConditions.isAboveEquator];
};

wantToMoveNorthColder.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        tribe.setDestination(tribe.tile.getNorthNeighbor());
        //console.log("wantToMoveNorthColder has fired: " + tribe.currTileTemperature);
    }    
};

/* 
 *  wantToMoveSouthWarmer determines whether the tribe wants to move south
 *  above equator
 *    
 */

var wantToMoveSouthWarmer = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 1;
    this.conditions = [allConditions.isTileColder,
                       allConditions.isAboveEquator];
};

wantToMoveSouthWarmer.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        tribe.setDestination(tribe.tile.getSouthNeighbor());
        //console.log("wantToMoveSouthWarmer() has fired: " + tribe.currTileTemperature);
    }    
};

/* 
 *  wantToMoveNorthWarmer determines whether the tribe wants to move south
 *  above equator
 *    
 */

var wantToMoveNorthWarmer = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 1;
    this.conditions = [allConditions.isTileColder,
                       allConditions.isBelowEquator];
};

wantToMoveNorthWarmer.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        tribe.setDestination(tribe.tile.getSouthNeighbor());
        //console.log("wantToMoveNorthWarmer() has fired: " + tribe.currTileTemperature);
    }    
};

/* 
 *  wantToMoveSouthColder determines whether the tribe wants to move south
 *  above equator
 *    
 */

var wantToMoveSouthColder = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 1;
    this.conditions = [allConditions.isTileWarmer,
                       allConditions.isBelowEquator];
};

wantToMoveSouthColder.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        tribe.setDestination(tribe.tile.getSouthNeighbor());
        //console.log("wantToMoveSouthColder() has fired: " + tribe.currTileTemperature);
    }    
};

/* 
 *  wantToMigrate determines whether the tribe wants to move south
 *  above equator. This is a spiteful rule
 *    
 */

var wantToMigrate = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 2;
    this.conditions = [allConditions.isTileTemperatureNotIdeal,
                       allConditions.isSpiteful];//,
                       //allConditions.isStockpileDecreasing];
};

wantToMigrate.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        //console.log("Tribe's tile: " + tribe.destinationTile);


        tribe.migrate();

        var moveS = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
            moveS.script.AudioController.sound_TribeMov();
            //moveS.script.send('AudioController', 'sound_TribeMov', 'initialized');
    }    
};
/* 
 *  needToAdapt determines whether the tribe wants to move south
 *  above equator. This is a spiteful rule
 *    
 */

var needToAdapt = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 5;
    this.conditions = [allConditions.isTileTemperatureNotIdeal,
                       allConditions.isSpiteful];
};

needToAdapt.prototype = {
    testConditions: function(tribe){
        console.log("WE're in needToAdapt");
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        //console.log("Tribe's tile: " + tribe.destinationTile);

        this.weight--;
        tribe.startAdapting();

        var moveS = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
            moveS.script.AudioController.sound_TribeMov();
            //moveS.script.send('AudioController', 'sound_TribeMov', 'initialized');
    }    
};

/* 
 *  needTemperatureChange means the tribe will pray to the player for rain or sun
 *  If not fulfilled, they will migrate instead
 *    
 */

var needTemperatureChange = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 3;
    this.conditions = [ allConditions.isTileTemperatureNotIdeal
                        ,allConditions.isNotSpiteful];
                        //,allConditions.isStockpileDecreasing];
};

needTemperatureChange.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        debug.log(DEBUG.AI, "Need temperature change fired");
        tribe.startPrayForTemperature(10);
    }    
};

/* 
 *  wantToDenounceInactive means the tribe will denounce God the player's existence 
 *  If not punished, they will lose belief
 *    
 */

var wantToDenounceInactive = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 5;
    this.conditions = [allConditions.isGodInactive];
};

wantToDenounceInactive.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        debug.log(DEBUG.AI, "Does God truly exist?!");
        tribe.resetInactionTimer();
        tribe.startDenouncing();
    }    
};

/* 
 *  wantToDenounceNoSun means the tribe will denounce God the player's existence 
 *  If not punished, they will lose belief
 *    
 */

var wantToDenounceNoSun = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 5;
    this.conditions = [allConditions.isNoSun];
};

wantToDenounceNoSun.prototype = {
    testConditions: function(tribe){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        debug.log(DEBUG.AI, "Where is the god damned sun?!?!");
        tribe.resetInactionTimer();
        tribe.startDenouncing();
    }    
};