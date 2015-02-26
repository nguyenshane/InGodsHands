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

            // //positions it
            buttonSub.style.position = 'absolute';
            buttonSub.style.top = '30%';
            buttonSub.style.left = '10%';

            //onCLick sends to function
            buttonSub.onClick = this.subTemperature();

            // // Create a button to add
            var buttonPlus = document.createElement('BUTTON');
            var t = document.createTextNode("+");
            buttonPlus.appendChild(t);

            //positions it
            buttonPlus.style.position = 'absolute';
            buttonPlus.style.top = '30%';
            buttonPlus.style.left = '12%';

            //onCLick sends to function
            buttonPlus.onClick = this.addTemperature();


            //create a Slider for the Global Temperature
            var sliderT = document.createElement("INPUT");
            sliderT.setAttribute("type", "range");

            //fields for the slider
            sliderT.max = 100.0;
            sliderT.min = 0.0;
            sliderT.step = 1.0;
            sliderT.defaultValue = globalTemperature;

             //positions it
            sliderT.style.position = 'absolute';
            sliderT.style.top = '23%';
            sliderT.style.left = '7%';


            //text for the global temperature
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = '64px';
            div.style.top = '5%';
            div.style.left = '10%';
            div.style.marginLeft = '0px';            
            div.style.textAlign = 'center';
            div.style.color = 'white';
            div.style.fontSize = 'xx-large';

            // Grab the div that encloses PlayCanvas' canvas element
           // var container = document.getElementById('application-container');
            // container.appendChild(buttonSub);
            // container.appendChild(buttonPlus);

            document.body.appendChild(div);
            document.body.appendChild(buttonSub);
            document.body.appendChild(buttonPlus);
            document.body.appendChild(sliderT);

            this.sliderT = sliderT;
            this.div = div;
            this.buttonPlus = buttonPlus;
            this.buttonSub = buttonSub;

            // Set some default state on the UI element
             this.setText('Global temperature: ' + globalTemperature);
            // this.setVisibility(true);
        },

         // Called every frame, dt is time in seconds since last update
        update: function (dt) {
             //updates the global temperature
             this.setText('Global temperature: ' + globalTemperature);
             var cast = this.sliderT.value * 1.0;
              globalTemperature =  cast;
        },

        // // Some utility functions that can be called from other game scripts
        // setVisibility: function (visible) {
        //     this.div.style.visibility = visible ? 'visible' : 'hidden';
        // },

        addTemperature: function(){
            globalTemperature = globalTemperature + 1;
            console.log("clicked");
        },

        subTemperature: function(){
            globalTemperature = globalTemperature - 1;
             console.log("clicked");
        },

        setText: function (message) {
            this.div.innerHTML = message;
        }
    };

    return UI;
});