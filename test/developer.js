pc.script.create('ui', function (context) {
    var UI = function (entity) {
        this.entity = entity;
    };

    UI.prototype = {
        initialize: function () {
            // Create a button to subtract
            var buttonSub = document.createElement('BUTTON');
            buttonSub.align = "left"
            var t = document.createTextNode("-");
            buttonSub.appendChild(t);

            //positions it
            buttonSub.style.position = 'absolute';
            buttonSub.style.top = '10%';
            buttonSub.style.left = '10%';
        

            // Create a button to add
            var buttonPlus = document.createElement('BUTTON');
            var t = document.createTextNode("+");
            buttonPlus.appendChild(t);

            //positions it
            buttonPlus.style.position = 'absolute';
            buttonPlus.style.top = '12%';
            buttonPlus.style.left = '12%';

            //text for the global temperature
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = '32px';
            div.style.top = '5%';
            div.style.left = '10%';
            div.style.marginLeft = '-250px';            
            div.style.textAlign = 'center';
            div.style.color = 'white';
            div.style.fontSize = 'xx-large';
            div.style.visibility = 'hidden';

            // Grab the div that encloses PlayCanvas' canvas element
            var container = document.getElementById('application-container');
            container.appendChild(buttonSub);
            container.appendChild(buttonPlus);
            container.appendChild(div);


            this.div = div;

            // Set some default state on the UI element
             this.setText('Global temperature: ' + GlobalTemperature);
            // this.setVisibility(true);
        },

         // Called every frame, dt is time in seconds since last update
        update: function (dt) {
             //updates the global temperature
             this.setText('Global temperature: ' + GlobalTemperature);
        },

        // // Some utility functions that can be called from other game scripts
        // setVisibility: function (visible) {
        //     this.div.style.visibility = visible ? 'visible' : 'hidden';
        // },

        setText: function (message) {
            this.div.innerHTML = message;
        }
    };

    return UI;
});