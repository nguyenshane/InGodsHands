// Contains the Rule base class and the actual rules that inherit those base elements
// The conditions list is checked through continuously; when a rule's conditions are fulfilled,
// the rule's consequence is fired. The weight of a rule determines its importance relative to
// the rest of the rules. Two rules may have their conditions fulfilled simultaneously, a 
// higher weighted rule will fire first.

/////////////////////////////////////////
//   Rules         //////////////////////
/////////////////////////////////////////

/* 
 *  wantToMigrate determines whether the tribe wants to move south
 *  above equator. This is a spiteful rule
 *    
 */

var wantToMigrate = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 3;
    this.conditions = [allConditions.isTileTemperatureNotIdeal,
                       allConditions.isSpiteful];
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
        tribe.ruleCooldownTimer = 4;
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
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribe)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribe){
        debug.log(DEBUG.AI, "We shall just adapt to the temperature!");
        this.weight--;

        tribe.ruleCooldownTimer = 4;
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
    
    this.weight = 6;
    this.conditions = [ allConditions.isTileTemperatureNotIdeal,
                        allConditions.isNotSpiteful];

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
        tribe.ruleCooldownTimer = 4;
        tribe.startPrayForTemperature();
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
        tribe.ruleCooldownTimer = 4;
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
        tribe.ruleCooldownTimer = 4;
        tribe.resetInactionTimer();
        tribe.startDenouncing();
    }    
};