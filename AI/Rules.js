// Contains the Rule base class and the actual rules that inherit those base elements
// The conditions list is checked through continuously; when a rule's conditions are fulfilled,
// the rule's consequence is fired. The weight of a rule determines its importance relative to
// the rest of the rules. Two rules may have their conditions fulfilled simultaneously, a 
// higher weighted rule will fire first.

/////////////////////////////////////////
//   Rules         //////////////////////
/////////////////////////////////////////

var testRule = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
  
    this.weight = 0;
    this.conditions = [allConditions.testIf5];
};

testRule.prototype = {
    testConditions: function(){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i]()){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(){
        console.log("testRule consequence has fired");
    }    
};

//////////////////////////////////////

var anotherRule = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
  
    this.weight = 0;
    this.conditions = [allConditions.testIf5];
};

anotherRule.prototype = {
    testConditions: function(){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i]()){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(){
        console.log("anotherRule consequence has fired");
    }        
};

/* 
 *    wantToMoveNorth() determines whether the tribe wants to move north
 *    to a colder temperature tile.
 */

var wantToMoveNorth = function() {
    // All conditions to choose from for making rules
    var allConditions = pc.fw.Application.getApplication('application-canvas').context.root.findByName('AI').script.Conditions;
    
    this.weight = 0;
    this.conditions = [allConditions.isTileWarmer];
};

wantToMoveNorth.prototype = {
    testConditions: function(tribeEntity){
        for(var i = 0; i < this.conditions.length; i++){
            if(!this.conditions[i](tribeEntity)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(tribeEntity){
        --tribeEntity.script.tribe.currTileTemperature;
        console.log("wantToMoveNorth() has fired: " + tribeEntity.script.tribe.currTileTemperature);
    }    
};