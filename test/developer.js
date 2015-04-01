pc.script.create('ui', function (context) {
    var UI = function (entity) {
        this.entity = entity;

        //slider distances
        this.sliderTDistance = 0;
        this.sliderADistance = 0;
        this.sliderPDistance = 0;
        this.sliderEDistance = 0;
        this.sliderWDistance = 0;

        //slider positions
        this.positionT = 1;
        this.positionA = 1;
        this.positionP = 1;
        this.positionE = 1;
        this.positionW = 1;

        this.time = 0;

        this.context = pc.fw.Application.getApplication('application-canvas').context;
        this.context.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this);
        this.context.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this);
    };

    var hasMovedT  = false;
    var hasMovedA  = false;
    var hasMovedP  = false;
    var hasMovedE  = false;
    var hasMovedW  = false;

    var pullStartTimeT;
    var pullStartTimeA;
    var pullStartTimeP;
    var pullStartTimeE;
    var pullStartTimeW;

    var sliderTLastPos;
    var sliderALastPos;
    var sliderPLastPos;
    var sliderELastPos;
    var sliderWLastPos;

    var pullStartedT = false;
    var pullStartedA = false;
    var pullStartedP = false;
    var pullStartedE = false;
    var pullStartedW = false;

    var needToStartTimeT = true;
    var needToStartTimeA = true;
    var needToStartTimeP = true;
    var needToStartTimeE = true;
    var needToStartTimeW = true;

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


            // //create a Slider for the Global Temperature
            // var sliderT = document.createElement("INPUT");
            // sliderT.setAttribute("type", "range");

            // //fields for the slider
            // sliderT.max = 100.0;
            // sliderT.min = 0.0;
            // sliderT.step = 1.0;
            // sliderT.defaultValue = globalTemperature;


            //  //positions it
            // sliderT.style.position = 'absolute';
            // sliderT.style.top = '40%';
            // sliderT.style.left = '7%';


            //Touch stuff
            if (this.context.touch) {
                this.context.touch.on("touchstart", this.onTouchStart, this);
                this.context.touch.on("touchend", this.onTouchEnd, this);
            } else {
                console.log("No touch input available");
            }

             //create a Slider string pull
            var StringsliderT = document.createElement("INPUT");
            StringsliderT.setAttribute("type", "range");

            //fields for the slider
            StringsliderT.max = 100.0;
            StringsliderT.min = 0.0;
            StringsliderT.step = 1.0;
            StringsliderT.defaultValue = 50.0;
            sliderTLastPos = StringsliderT.defaultValue;

             //positions it
            StringsliderT.style.position = 'absolute';
            StringsliderT.style.top = '50%';
            StringsliderT.style.left = '7%';
            StringsliderT.mouseIsOver = false;

            //attaches a touch listener to it
            // StringsliderT.addEventListener("touchstart", this.onTouchStart, false);
            // StringsliderT.addEventListener("touchend", this.onTouchEnd, false);


            //create a Slider string pull
            var StringsliderA = document.createElement("INPUT");
            StringsliderA.setAttribute("type", "range");

            //fields for the slider
            StringsliderA.max = 100.0;
            StringsliderA.min = 0.0;
            StringsliderA.step = 1.0;
            StringsliderA.defaultValue = 50.0;
            sliderALastPos = StringsliderA.defaultValue;

             //positions it
            StringsliderA.style.position = 'absolute';
            StringsliderA.style.top = '60%';
            StringsliderA.style.left = '7%';
            StringsliderA.mouseIsOver = false;

            //attaches a touch listener to it
            // StringsliderA.addEventListener("touchstart", this.onTouchStart, false);
            // StringsliderA.addEventListener("touchend", this.onTouchEnd, false);

            //create a Slider string pull
            var StringsliderP = document.createElement("INPUT");
            StringsliderP.setAttribute("type", "range");

            //fields for the slider
            StringsliderP.max = 100.0;
            StringsliderP.min = 0.0;
            StringsliderP.step = 1.0;
            StringsliderP.defaultValue = 50.0;
            sliderPLastPos = StringsliderP.defaultValue;

             //positions it
            StringsliderP.style.position = 'absolute';
            StringsliderP.style.top = '70%';
            StringsliderP.style.left = '7%';
            StringsliderP.mouseIsOver = false;

            //attaches a touch listener to it
            // StringsliderP.addEventListener("touchstart", this.onTouchStart, false);
            // StringsliderP.addEventListener("touchend", this.onTouchEnd, false);

             //create a Slider string pull
            var StringsliderE = document.createElement("INPUT");
            StringsliderE.setAttribute("type", "range");

            //fields for the slider
            StringsliderE.max = 100.0;
            StringsliderE.min = 0.0;
            StringsliderE.step = 1.0;
            StringsliderE.defaultValue = 50.0;
            sliderELastPos = StringsliderE.defaultValue;

             //positions it
            StringsliderE.style.position = 'absolute';
            StringsliderE.style.top = '80%';
            StringsliderE.style.left = '7%';
            StringsliderE.mouseIsOver = false;


            // //attaches a touch listener to it
            // StringsliderE.addEventListener("touchstart", this.onTouchStart, false);
            // StringsliderE.addEventListener("touchend", this.onTouchEnd, false);

             //create a Slider string pull
            var StringsliderW = document.createElement("INPUT");
            StringsliderW.setAttribute("type", "range");

            //fields for the slider
            StringsliderW.max = 100.0;
            StringsliderW.min = 0.0;
            StringsliderW.step = 1.0;
            StringsliderW.defaultValue = 50.0;
            sliderWLastPos = StringsliderW.defaultValue;

             //positions it
            StringsliderW.style.position = 'absolute';
            StringsliderW.style.top = '90%';
            StringsliderW.style.left = '7%';
            StringsliderW.mouseIsOver = false;

            //attaches a touch listener to it
            // StringsliderW.addEventListener("touchstart", this.onTouchStart, false);
            // StringsliderW.addEventListener("touchend", this.onTouchEnd, false);

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

            //text for the Tribe Population read out
            var tribePop = document.createElement('div');
            tribePop.style.position = 'absolute';
            tribePop.style.width = '32x';
            tribePop.style.top = '5%';
            tribePop.style.left = '70%';
            tribePop.style.marginLeft = '0px';
            tribePop.style.textAlign = 'center';
            tribePop.style.color = 'white';
            tribePop.style.fontSize = '16';


            //text for the Tribe food read out
            var tribeFood = document.createElement('div');
            tribeFood.style.position = 'absolute';
            tribeFood.style.width = '32x';
            tribeFood.style.top = '12%';
            tribeFood.style.left = '70%';
            tribeFood.style.marginLeft = '0px';
            tribeFood.style.textAlign = 'center';
            tribeFood.style.color = 'white';
            tribeFood.style.fontSize = '16';

            //text for the Tribe food read out
            var tribeStockpile= document.createElement('div');
            tribeStockpile.style.position = 'absolute';
            tribeStockpile.style.width = '32x';
            tribeStockpile.style.top = '16%';
            tribeStockpile.style.left = '70%';
            tribeStockpile.style.marginLeft = '0px';
            tribeStockpile.style.textAlign = 'center';
            tribeStockpile.style.color = 'white';
            tribeStockpile.style.fontSize = '16';


            //text for the Tribe Prayer read out
            var tribeBelief = document.createElement('div');
            tribeBelief.style.position = 'absolute';
            tribeBelief.style.width = '32x';
            tribeBelief.style.top = '20%';
            tribeBelief.style.left = '70%';
            tribeBelief.style.marginLeft = '0px';
            tribeBelief.style.textAlign = 'center';
            tribeBelief.style.color = 'white';
            tribeBelief.style.fontSize = '16';


            //text for the Tribe Prayer read out
            var tribeFear = document.createElement('div');
            tribeFear.style.position = 'absolute';
            tribeFear.style.width = '32x';
            tribeFear.style.top = '24%';
            tribeFear.style.left = '70%';
            tribeFear.style.marginLeft = '0px';
            tribeFear.style.textAlign = 'center';
            tribeFear.style.color = 'white';
            tribeFear.style.fontSize = '16';


            //text for the Temperature slider
            var divTString = document.createElement('div');
            divTString.style.position = 'absolute';
            divTString.style.width = '20px';
            divTString.style.top = '50%';
            divTString.style.left = '5%';
            divTString.style.marginLeft = '0px';            
            divTString.style.textAlign = 'center';
            divTString.style.color = 'white';
            divTString.style.fontSize = '14';

             //text for the A slider
            var divAString = document.createElement('div');
            divAString.style.position = 'absolute';
            divAString.style.width = '20px';
            divAString.style.top = '60%';
            divAString.style.left = '5%';
            divAString.style.marginLeft = '0px';            
            divAString.style.textAlign = 'center';
            divAString.style.color = 'white';
            divAString.style.fontSize = '14';


             //text for the P slider
            var divPString = document.createElement('div');
            divPString.style.position = 'absolute';
            divPString.style.width = '20px';
            divPString.style.top = '70%';
            divPString.style.left = '5%';
            divPString.style.marginLeft = '0px';            
            divPString.style.textAlign = 'center';
            divPString.style.color = 'white';
            divPString.style.fontSize = '14';


             //text for the E slider
            var divEString = document.createElement('div');
            divEString.style.position = 'absolute';
            divEString.style.width = '20px';
            divEString.style.top = '80%';
            divEString.style.left = '5%';
            divEString.style.marginLeft = '0px';            
            divEString.style.textAlign = 'center';
            divEString.style.color = 'white';
            divEString.style.fontSize = '14';

             //text for the W slider
            var divWString = document.createElement('div');
            divWString.style.position = 'absolute';
            divWString.style.width = '20px';
            divWString.style.top = '90%';
            divWString.style.left = '5%';
            divWString.style.marginLeft = '0px';            
            divWString.style.textAlign = 'center';
            divWString.style.color = 'white';
            divWString.style.fontSize = '14';



            //var tribeInfo = pc.fw.Application.getApplication('application-canvas').context.root.findByName('BaseTribe');
            //var  belief = tribeInfo.script.tribe.Tribe.belief;
           // var population = tribeInfo.script.tribe.Tribe.population;

            // Grab the div that encloses PlayCanvas' canvas element
           // var container = document.getElementById('application-container');
            // container.appendChild(buttonSub);
            // container.appendChild(buttonPlus);

            document.body.appendChild(div);
            document.body.appendChild(divTString);
            document.body.appendChild(divAString);
            document.body.appendChild(divPString);
            document.body.appendChild(divEString);
            document.body.appendChild(divWString);

            document.body.appendChild(tribePop);
            document.body.appendChild(tribeFood);
            document.body.appendChild(tribeStockpile);
            document.body.appendChild(tribeBelief);
            document.body.appendChild(tribeFear);

            document.body.appendChild(buttonSub);
            document.body.appendChild(buttonPlus);
            //document.body.appendChild(sliderT);
            document.body.appendChild(StringsliderT);
            document.body.appendChild(StringsliderA);
            document.body.appendChild(StringsliderP);
            document.body.appendChild(StringsliderE);
            document.body.appendChild(StringsliderW);

            //this.sliderT = sliderT;
            this.div = div;
            this.divTString = divTString;
            this.divAString = divAString;
            this.divPString = divPString;
            this.divEString = divEString;
            this.divWString = divWString;


            this.tribePop = tribePop;
            this.tribeStockpile = tribeStockpile;
            this.tribeFood = tribeFood;
            this.tribeBelief = tribeBelief;
            this.tribeFear = tribeFear;

            this.buttonPlus = buttonPlus;
            this.buttonSub = buttonSub;
            this.StringsliderT = StringsliderT;
            this.StringsliderA = StringsliderA;
            this.StringsliderP = StringsliderP;
            this.StringsliderE = StringsliderE;
            this.StringsliderW = StringsliderW;

            //timer = 2.0;

            // Set some default state on the UI element
             this.setText(('Global temperature: ' + globalTemperature), ('T') , ('A'), ('P'), ('E'), ('W'));
             
             var tribeInfo = pc.fw.Application.getApplication('application-canvas').context.root.findByName('BaseTribe').script.tribe;

             this.setTribeText(('Tribe Pop: ' + tribeInfo.population), ('Tribe Food: ' + tribeInfo.incomingFood), ('Tribe Stockpile: ' + tribeInfo.stockpile),
               ('Tribe Belief: ' + tribeInfo.belief), ('Tribe Fear: ' + tribeInfo.fear) );
           
        },

         // Called every frame, dt is time in seconds since last update
        update: function (dt) {
             //updates the global temperature

             var tribeInfo = pc.fw.Application.getApplication('application-canvas').context.root.findByName('BaseTribe').script.tribe;

            this.setText(('Global temperature: ' + globalTemperature), ('T') , ('A'), ('P'), ('E'), ('W'));

            this.setTribeText(('Tribe Pop: ' + tribeInfo.population), ('Tribe Food: ' + tribeInfo.incomingFood), ('Tribe Stockpile: ' + tribeInfo.stockpile),
               ('Tribe Belief: ' + tribeInfo.belief), ('Tribe Fear: ' + tribeInfo.fear) );

             this.time += dt;

             // var cast = this.sliderT.value * 1.0;
             //  globalTemperature =  cast;    

              this.stringPull();
              this.setPosition();
              this.mouseCheck();
        },

        mouseCheck: function(){

             this.StringsliderT.onmouseover = function(){
                this.mouseIsOver = true;
                console.log("overT");
              }
              this.StringsliderT.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.StringsliderA.onmouseover = function(){
                this.mouseIsOver = true;
                console.log("overA");
              }
              this.StringsliderA.onmouseout = function(){
                this.mouseIsOver = false;
              }



              this.StringsliderP.onmouseover = function(){
                this.mouseIsOver = true;
                console.log("overP");
              }
              this.StringsliderP.onmouseout = function(){
                this.mouseIsOver = false;
              }



              this.StringsliderE.onmouseover = function(){
                this.mouseIsOver = true;
                console.log("overE");
              }
              this.StringsliderE.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.StringsliderW.onmouseover = function(){
                this.mouseIsOver = true;
                console.log("overW");
              }
              this.StringsliderW.onmouseout = function(){
                this.mouseIsOver = false;
              }
        },

        setPosition: function(){

            //temperature
             if(this.sliderTDistance < 0 ){
                this.positionT = -1;
              }
              else{
                this.positionT = 1;
              }

              //A
               if(this.sliderADistance < 0 ){
                this.positionA = -1;
              }
              else{
                this.positionA = 1;
              }

              //P
               if(this.sliderPDistance < 0 ){
                this.positionP = -1;
              }
              else{
                this.positionP = 1;
              }

             //E
               if(this.sliderEDistance < 0 ){
                this.positionE = -1;
              }
              else{
                this.positionE = 1;
              }
        },

        addTemperature: function(){
            globalTemperature = globalTemperature + 1;
            console.log("clicked");
        },

        stringPull: function(){

              if(this.StringsliderT.value != sliderTLastPos){
               this.sliderTDistance = this.StringsliderT.value - sliderTLastPos;
               hasMovedT = true;
                }
              else {
                hasMovedT = false;
                }  

               if(this.StringsliderA.value != sliderALastPos){
               this.sliderADistance = this.StringsliderA.value - sliderALastPos;
               hasMovedA = true;
                }
              else {
                hasMovedA = false;
                }  

             if(this.StringsliderP.value != sliderPLastPos){
               this.sliderPDistance = this.StringsliderP.value - sliderPLastPos;
               hasMovedP = true;
                }
              else {
                hasMovedP = false;
                }  

                if(this.StringsliderE.value != sliderELastPos){
               this.sliderEDistance = this.StringsliderE.value - sliderELastPos;
               hasMovedE = true;
                }
              else {
                hasMovedE = false;
                }  

                 if(this.StringsliderW.value != sliderWLastPos){
               this.sliderWDistance = this.StringsliderW.value - sliderWLastPos;
               hasMovedW = true;
                }
              else {
                hasMovedW = false;
                }  
        },

        onMouseDown: function(event){
        if (event.button === pc.MOUSEBUTTON_LEFT) {
            if(needToStartTimeT && this.StringsliderT.mouseIsOver){
                //console.log("inside pullStarted")
                pullStartTimeT = this.time;
                needToStartTimeT = false
                }

                if(needToStartTimeA && this.StringsliderA.mouseIsOver){
               // console.log("inside pullStarted")
                pullStartTimeA = this.time;
                needToStartTimeA = false
                }

                if(needToStartTimeP && this.StringsliderP.mouseIsOver){
                //console.log("inside pullStarted")
                pullStartTimeP = this.time;
                needToStartTimeP = false
                }

                if(needToStartTimeE && this.StringsliderE.mouseIsOver){
                //console.log("inside pullStarted")
                pullStartTimeE = this.time;
                needToStartTimeE = false
                }

                if(needToStartTimeW && this.StringsliderW.mouseIsOver){
                //console.log("inside pullStarted")
                pullStartTimeW = this.time;
                needToStartTimeW = false
                }
            }
        },

        onMouseUp: function (event) {
            // If the left mouse button is released, change the last postion of the slider
            if (event.button === pc.MOUSEBUTTON_LEFT) {
              this.sendToMove_T();
              this.sendToMove_A();
              this.sendToMove_P();
              this.sendToMove_E();
              this.sendToMove_W();
            }
        },


        onTouchStart: function (touches) {
         touches.changedTouches.forEach(function (touch) {
           if(needToStartTimeT && touch.target == this.StringsliderT){
                //console.log("inside pullStarted")
                pullStartTimeT = this.time;
                needToStartTimeT = false
                }

                if(needToStartTimeA && touch.target == this.StringsliderA){
               // console.log("inside pullStarted")
                pullStartTimeA = this.time;
                needToStartTimeA = false
                }

                if(needToStartTimeP && touch.target == this.StringsliderP){
                //console.log("inside pullStarted")
                pullStartTimeP = this.time;
                needToStartTimeP = false
                }

                if(needToStartTimeE && touch.target == this.StringsliderE){
                //console.log("inside pullStarted")
                pullStartTimeE = this.time;
                needToStartTimeE = false
                }

                if(needToStartTimeW && touch.target == this.StringsliderW){
                //console.log("inside pullStarted")
                pullStartTimeW = this.time;
                needToStartTimeW = false
                }

            }.bind(this));
        },

        
        onTouchEnd: function (touches) {
            // When the touches end, send to string pull functions
            touches.changedTouches.forEach(function (touch) {
              this.sendToMove_T();
              this.sendToMove_A();
              this.sendToMove_P();
              this.sendToMove_E();
              this.sendToMove_W();
          
            }.bind(this));
       }, 

        sendToMove_T: function(){
             if (hasMovedT){
                            var distance = this.sliderTDistance;
                            var timeSinceStartedPull =  this.time - pullStartTimeT;
                            var speed = Math.abs(distance)/timeSinceStartedPull;
                            var position = this.positionT;
                            var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                             stringPullLerp.script.send('HIDInterface', 'moved_T', position, distance, speed);

                            console.log("pullStartTime " + pullStartTimeT);
                            console.log("Time " + this.time);
                            console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                             sliderTLastPos = this.StringsliderT.value;
                             this.sliderTDistance = 0.0;
                             needToStartTimeT = true;
                        }
        },

        sendToMove_A: function(){
             if (hasMovedA){
                            var distance = this.sliderADistance;
                            var timeSinceStartedPull =  this.time - pullStartTimeA;
                            var speed = Math.abs(distance)/timeSinceStartedPull;
                            var position = this.positionA;
                            var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                             stringPullLerp.script.send('HIDInterface', 'moved_A', position, distance, speed);

                            console.log("pullStartTime " + pullStartTimeA);
                            console.log("Time " + this.time);
                            console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                             sliderALastPos = this.StringsliderA.value;
                             this.sliderADistance = 0.0;
                             needToStartTimeA = true;
                        }
        },

         sendToMove_P: function(){
             if (hasMovedP){
                            var distance = this.sliderPDistance;
                            var timeSinceStartedPull =  this.time - pullStartTimeP;
                            var speed = Math.abs(distance)/timeSinceStartedPull;
                            var position = this.positionP;
                            var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                             stringPullLerp.script.send('HIDInterface', 'moved_P', position, distance, speed);

                            console.log("pullStartTime " + pullStartTimeP);
                            console.log("Time " + this.time);
                            console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                             sliderPLastPos = this.StringsliderP.value;
                             this.sliderPDistance = 0.0;
                             needToStartTimeP = true;
                        }
        },

         sendToMove_E: function(){
             if (hasMovedE){
                            var distance = this.sliderEDistance;
                            var timeSinceStartedPull =  this.time - pullStartTimeE;
                            var speed = Math.abs(distance)/timeSinceStartedPull;
                            var position = this.positionE;
                            var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                             stringPullLerp.script.send('HIDInterface', 'moved_E', position, distance, speed);

                            console.log("pullStartTime " + pullStartTimeE);
                            console.log("Time " + this.time);
                            console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                             sliderELastPos = this.StringsliderE.value;
                             this.sliderEDistance = 0.0;
                             needToStartTimeE = true;
                        }
        },

         sendToMove_W: function(){
             if (hasMovedW){
                            var distance = this.sliderWDistance;
                            var timeSinceStartedPull =  this.time - pullStartTimeW;
                            var speed = Math.abs(distance)/timeSinceStartedPull;
                            var position = this.positionW;
                            var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                             stringPullLerp.script.send('HIDInterface', 'moved_W', position, distance, speed);

                            console.log("pullStartTime " + pullStartTimeW);
                            console.log("Time " + this.time);
                            console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                             sliderWLastPos = this.StringsliderW.value;
                             this.sliderWDistance = 0.0;
                             needToStartTimeW = true;
                        }
        },

        subTemperature: function(){
            globalTemperature = globalTemperature - 1;
             console.log("clicked");
        },

        setText: function (message, message2, message3, message4, message5, message6) {
            this.div.innerHTML = message;
            this.divTString.innerHTML = message2;
            this.divAString.innerHTML = message3;
            this.divPString.innerHTML = message4;
            this.divEString.innerHTML = message5;
            this.divWString.innerHTML = message6;
        },


        setTribeText: function (message, message2, message3, message4, message5) {
        this.tribePop.innerHTML = message;
        this.tribeFood.innerHTML = message2;
        this.tribeStockpile.innerHTML = message3;
        this.tribeBelief.innerHTML = message4;
        this.tribeFear.innerHTML = message5;
        },

    };

    return UI;
});