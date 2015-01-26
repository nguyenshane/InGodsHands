pc.script.create('HIDInterface', function (context) {
    // Creates a new TestString instance
    var HIDInterface = function (entity) {
        this.entity = entity;
        
    };

    HIDInterface.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = new pc.StringTAPEW('T');
			this.stringA = new pc.StringTAPEW('A');
			this.stringP = new pc.StringTAPEW('P');
			this.stringE = new pc.StringTAPEW('E');
			this.stringW = new pc.StringTAPEW('W');

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return HIDInterface;
});