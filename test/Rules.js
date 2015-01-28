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
            if(!this.conditions[i](5)){
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
            if(!this.conditions[i](5)){
                return false;
            }
        }
        return true;
    },
    
    consequence: function(){
        console.log("anotherRule consequence has fired");
    }        
};

////////////////////////////////////////

pc.script.create('Rules', function (context) {
    var Rules = function (entity) {
        this.entity = entity;
        this.tribeRules = [];
    };
    
    Rules.prototype = {
        initialize: function(){
            this.tribeRules.push(new testRule());
            this.tribeRules.push(new anotherRule());
        }
    };
    return Rules;
});