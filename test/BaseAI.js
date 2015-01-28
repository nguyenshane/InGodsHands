pc.script.create('BaseAI', function (context) {
    // Creates a new BaseAI instance
    var BaseAI = function (entity) {
        this.entity = entity;
        this.rules;
    };

    BaseAI.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.rules = context.root.findByName('AI').script.Rules.tribeRules;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            for(var i = 0; i < this.rules.length; i++){
                if(this.rules[i].testConditions(5)){
                    this.rules[i].consequence();
                }
            }
        }
    };

    return BaseAI;
});