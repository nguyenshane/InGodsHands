pc.script.create('developer', function (context) {
    var developer = function (entity) {
        this.entity = entity;

        //slider distances
        this.sliderTDistance = 0;
        this.sliderADistance = 0;
        this.sliderPDistance = 0;
        this.sliderEDistance = 0;
        this.sliderWDistance = 0;

        this.addTribeDiv = false;

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
    var audio;
    //var prevMusicLayer;

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

    var switchUIOn = false;
    var maxDiv = 0;

    developer.prototype = {
        initialize: function () {

            // Create a button to pause
            var buttonPause = document.createElement('BUTTON');
            var p = document.createTextNode("Pause");
            buttonPause.appendChild(p);

            //positions it
            buttonPause.style.position = 'absolute';
            buttonPause.style.top = '3%';
            buttonPause.style.left = '93%';
            //buttonPause.style.visibility = 'hidden';

            buttonPause.addEventListener('click', this.context.root._children[0].script.globalInterface.pauseGame);


            // Create a button to toggle UI
            var buttonUI = document.createElement('BUTTON');
            var toggle = document.createTextNode("UI");
            buttonUI.appendChild(toggle);

            //positions it
            buttonUI.style.position = 'absolute';
            buttonUI.style.top = '3%';
            buttonUI.style.left = '90%';
            //buttonUI.style.visibility = 'hidden';

            //buttonUI.addEventListener('click', this.UIButtonClicked());

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
            StringsliderT.style.visibility = 'hidden';
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
            StringsliderA.style.visibility = 'hidden';
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
            StringsliderP.style.visibility = 'hidden';
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
            StringsliderE.style.visibility = 'hidden';
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
            StringsliderW.style.visibility = 'hidden';
            StringsliderW.mouseIsOver = false;

            //create a Slider string pull
            var musicSlider = document.createElement("INPUT");
            musicSlider.setAttribute("type", "range");

            //fields for the slider
             musicSlider.max = 1.0;
             musicSlider.min = 0.0;
             musicSlider.step = 0.05;
             musicSlider.defaultValue = 0.0;
             musicSlider.value = musicSlider.min;

             //positions it
             musicSlider.style.position = 'absolute';
             musicSlider.style.top = '40%';
             musicSlider.style.left = '74%';
             musicSlider.style.visibility = 'hidden';
             musicSlider.mouseIsOver = false;

             //text for the global temperature
            var musicText = document.createElement('div');
            musicText.style.position = 'absolute';
            musicText.style.width = '32px';
            musicText.style.top = '40%';
            musicText.style.left = '70%';
            musicText.style.marginLeft = '0px';            
            musicText.style.textAlign = 'center';
            musicText.style.color = 'white';
            musicText.style.fontSize = '16';
            musicText.style.visibility = 'hidden';



            //attaches a touch listener to it
            // StringsliderW.addEventListener("touchstart", this.onTouchStart, false);
            // StringsliderW.addEventListener("touchend", this.onTouchEnd, false);

            //text for the global temperature
            var div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.width = '64px';
            div.style.top = '5%';
            div.style.left = '7%';
            div.style.marginLeft = '0px';            
            div.style.textAlign = 'center';
            div.style.color = 'white';
            div.style.fontSize = 'xx-large';
            div.style.visibility = 'hidden';

            //text for the Tribe Population read out
            var tribePop = [];
            var tribeBelief = [];
            var tribeFear = [];
            var tribeMessage = [];

                    tribePopDiv = document.body.appendChild(document.createElement('div'));
                    tribePopDiv.style.position = 'absolute';
                    tribePopDiv.style.width = '32x';
                    tribePopDiv.style.top = '16%'
                    tribePopDiv.style.left = '75%';
                    tribePopDiv.style.marginLeft = '0px';
                    tribePopDiv.style.textAlign = 'center';
                    tribePopDiv.style.color = 'white';
                    tribePopDiv.style.fontSize = '10';
                    tribePopDiv.style.visibility = 'hidden';

                    //text for the Tribe Prayer read out
                    tribeBeliefDiv = document.body.appendChild(document.createElement('div'));
                    tribeBeliefDiv.style.position = 'absolute';
                    tribeBeliefDiv.style.width = '32x';
                    tribeBeliefDiv.style.top = '20%'
                    tribeBeliefDiv.style.left = '75%';
                    tribeBeliefDiv.style.marginLeft = '0px';
                    tribeBeliefDiv.style.textAlign = 'center';
                    tribeBeliefDiv.style.color = 'white';
                    tribeBeliefDiv.style.fontSize = '10';
                    tribeBeliefDiv.style.visibility = 'hidden';


                    //text for the Tribe Prayer read out
                    tribeFearDiv = document.body.appendChild(document.createElement('div'));
                    tribeFearDiv.style.position = 'absolute';
                    tribeFearDiv.style.width = '32x';
                    tribeFearDiv.style.top = '24%'
                    tribeFearDiv.style.left = '75%';
                    tribeFearDiv.style.marginLeft = '0px';
                    tribeFearDiv.style.textAlign = 'center';
                    tribeFearDiv.style.color = 'white';
                    tribeFearDiv.style.fontSize = '10';
                    tribeFearDiv.style.visibility = 'hidden';

                    //text for the Tribe Prayer read out
                    tribeMessageDiv = document.body.appendChild(document.createElement('div'));
                    tribeMessageDiv.style.position = 'absolute';
                    tribeMessageDiv.style.width = '32x';
                    tribeMessageDiv.style.top = '28%'
                    tribeMessageDiv.style.left = '75%';
                    tribeMessageDiv.style.marginLeft = '0px';
                    tribeMessageDiv.style.textAlign = 'center';
                    tribeMessageDiv.style.color = 'white';
                    tribeMessageDiv.style.fontSize = '10';
                    tribeMessageDiv.style.visibility = 'hidden';

                tribePop.push(tribePopDiv);
                tribeBelief.push(tribeBeliefDiv);
                tribeFear.push(tribeFearDiv);
                tribeMessage.push(tribeMessageDiv);
            
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
            divTString.style.visibility = 'hidden';

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
            divAString.style.visibility = 'hidden';


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
            divPString.style.visibility = 'hidden';


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
            divEString.style.visibility = 'hidden';

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
            divWString.style.visibility = 'hidden';

            document.body.appendChild(div);
            document.body.appendChild(divTString);
            document.body.appendChild(divAString);
            document.body.appendChild(divPString);
            document.body.appendChild(divEString);
            document.body.appendChild(divWString);
            //document.body.appendChild(musicText);

            document.body.appendChild(buttonPause);
            document.body.appendChild(buttonUI);
            document.body.appendChild(StringsliderT);
            document.body.appendChild(StringsliderA);
            document.body.appendChild(StringsliderP);
            document.body.appendChild(StringsliderE);
            document.body.appendChild(StringsliderW);
            //document.body.appendChild(musicSlider);


            //this.sliderT = sliderT;
            this.div = div;
            this.divTString = divTString;
            this.divAString = divAString;
            this.divPString = divPString;
            this.divEString = divEString;
            this.divWString = divWString;

            this.tribePop = tribePop;
            this.tribeBelief = tribeBelief;
            this.tribeFear = tribeFear;
            this.tribeMessage = tribeMessage;


            this.buttonUI = buttonUI;
            this.buttonPause = buttonPause;

            this.StringsliderT = StringsliderT;
            this.StringsliderA = StringsliderA;
            this.StringsliderP = StringsliderP;
            this.StringsliderE = StringsliderE;
            this.StringsliderW = StringsliderW;

            this.musicSlider = musicSlider;
            this.musicText = musicText;


            audio = this.context.root._children[0].script.AudioController;
            //prevMusicLayer = audio.musicLayer;

            //timer = 2.0;

            // Set some default state on the UI element
            this.setText(('Global temperature: ' + global[GLOBAL.TEMPERATURE]), ('T') , ('A'), ('P'), ('E'), ('W') , ("music"));
            
            var tribeInfo = [];
            
            tribeInfo[0] = pc.fw.Application.getApplication('application-canvas').context.root.findByName('TribeParent')._children[0].script.tribe;

            this.setTribeText(
				('Tribe #' +1+ " Pop: " + tribeInfo[0].population),
				('Tribe #' +1+ " Belief: " + tribeInfo[0].belief), 
                ('Tribe #' +1+ " Fear: "+ tribeInfo[0].fear),
				('Tribe #' +1+ " Message: "+ tribeInfo[0].tribeMessage), 0);
        },

         // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            //updates the global temperature
            var app = pc.fw.Application.getApplication('application-canvas').context;
            
            this.setText(('Global temperature: ' + global[GLOBAL.TEMPERATURE]), ('T') , ('A'), ('P'), ('E'), ('W'), ("music"));
  
            var tribeInfo = [];

            for (var i = 0; i < this.tribePop.length; i++) {
                var tribes = pc.fw.Application.getApplication('application-canvas').context.root.findByName('TribeParent')._children;
                if (i < tribes.length) tribeInfo[i] = tribes[i].script.tribe;
                else break;
                
				this.setTribeText(
					('Tribe #' +(i+1)+ " Pop: " + tribeInfo[i].population),
					('Tribe #' +(i+1)+ " Belief: " + tribeInfo[i].belief), 
					('Tribe #' +(i+1)+ " Fear: "+ tribeInfo[i].fear),
					('Tribe #' +(i+1)+ " Message: "+ tribeInfo[i].tribeMessage), i);
            }
            
			if (this.addTribeDiv) {
				maxDiv++;
                debug.log(DEBUG.AI, "tribe Added: " + maxDiv);
				this.checkNewTribeDiv(maxDiv);
				this.addTribeDiv = false;
			}

            this.time += dt;

			// var cast = this.sliderT.value * 1.0;
			//  global[GLOBAL.TEMPERATURE] =  cast;    
			this.stringPull();
			this.setPosition();
			this.mouseCheck();

			//this.checkMusic();
			this.setVisibilty();

			this.buttonUI.onclick = function UIButtonClicked(){
				switchUIOn++;
				if(switchUIOn > 2) switchUIOn = 0;
			}
        },

        checkNewTribeDiv(i){
                    var tribePopDiv = document.body.appendChild(document.createElement('div'));
                    tribePopDiv.style.position = 'absolute';
                    tribePopDiv.style.width = '32x';
                    var popString = (16 + i*16).toString();
                    tribePopDiv.style.top = popString.concat('%');
                    tribePopDiv.style.left = '75%';
                    tribePopDiv.style.marginLeft = '0px';
                    tribePopDiv.style.textAlign = 'center';
                    tribePopDiv.style.color = 'white';
                    tribePopDiv.style.fontSize = '10';
                    tribePopDiv.style.visibility = 'hidden';

                    //text for the Tribe Prayer read out
                    var tribeBeliefDiv = document.body.appendChild(document.createElement('div'));
                    tribeBeliefDiv.style.position = 'absolute';
                    tribeBeliefDiv.style.width = '32x';
                    var beliefString = (20 + i*16).toString();
                    tribeBeliefDiv.style.top = beliefString.concat('%');
                    tribeBeliefDiv.style.left = '75%';
                    tribeBeliefDiv.style.marginLeft = '0px';
                    tribeBeliefDiv.style.textAlign = 'center';
                    tribeBeliefDiv.style.color = 'white';
                    tribeBeliefDiv.style.fontSize = '10';
                    tribeBeliefDiv.style.visibility = 'hidden';


                    //text for the Tribe Prayer read out
                    var tribeFearDiv = document.body.appendChild(document.createElement('div'));
                    tribeFearDiv.style.position = 'absolute';
                    tribeFearDiv.style.width = '32x';
                    var fearString = (24 + i*16).toString();
                    tribeFearDiv.style.top = fearString.concat('%');
                    tribeFearDiv.style.left = '75%';
                    tribeFearDiv.style.marginLeft = '0px';
                    tribeFearDiv.style.textAlign = 'center';
                    tribeFearDiv.style.color = 'white';
                    tribeFearDiv.style.fontSize = '10';
                    tribeFearDiv.style.visibility = 'hidden';

                    //text for the Tribe Prayer read out
                    var tribeMessageDiv = document.body.appendChild(document.createElement('div'));
                    tribeMessageDiv.style.position = 'absolute';
                    tribeMessageDiv.style.width = '32x';
                    var messageString = (28 + i*16).toString();
                    tribeMessageDiv.style.top = messageString.concat('%');
                    tribeMessageDiv.style.left = '75%';
                    tribeMessageDiv.style.marginLeft = '0px';
                    tribeMessageDiv.style.textAlign = 'center';
                    tribeMessageDiv.style.color = 'white';
                    tribeMessageDiv.style.fontSize = '10';
                    tribeMessageDiv.style.visibility = 'hidden';   


                this.tribePop.push(tribePopDiv);
                this.tribeBelief.push(tribeBeliefDiv);
                this.tribeFear.push(tribeFearDiv);
                this.tribeMessage.push(tribeMessageDiv);

        },

        mouseCheck: function(){

             this.StringsliderT.onmouseover = function(){
                this.mouseIsOver = true;
                //console.log("overT");
              }
              this.StringsliderT.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.StringsliderA.onmouseover = function(){
                this.mouseIsOver = true;
                //console.log("overA");
              }
              this.StringsliderA.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.StringsliderP.onmouseover = function(){
                this.mouseIsOver = true;
                //console.log("overP");
              }
              this.StringsliderP.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.StringsliderE.onmouseover = function(){
                this.mouseIsOver = true;
                //console.log("overE");
              }
              this.StringsliderE.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.StringsliderW.onmouseover = function(){
                this.mouseIsOver = true;
                //console.log("overW");
              }
              this.StringsliderW.onmouseout = function(){
                this.mouseIsOver = false;
              }


              this.musicSlider.onmouseover = function(){
                this.mouseIsOver = true;
                //console.log("overW");
              }
              this.musicSlider.onmouseout = function(){
                this.mouseIsOver = false;
              }
        },

        checkMusic: function(){
            //just adding a comment


           // console.log(audio.musicLayer);
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


             //W
               if(this.sliderWDistance < 0 ){
                this.positionW = -1;
              }
              else{
                this.positionW = 1;
              }
        },

        addTemperature: function(){
            global[GLOBAL.TEMPERATURE] = global[GLOBAL.TEMPERATURE] + 1;
            //console.log("clicked");
        },

        stringPull: function(){

              if(this.StringsliderT.value != sliderTLastPos){
               this.sliderTDistance = this.StringsliderT.value - sliderTLastPos;
               var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moving_T', this.sliderTDistance/5, 0, 0);
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
                /*
                this.sendToMove_T();
                this.sendToMove_A();
                this.sendToMove_P();
                this.sendToMove_E();
                */
                
                this.sendToMoving_T();
                this.sendToMoving_A();
                this.sendToMoving_P();
                this.sendToMoving_E();
                this.sendToMoving_W();
            }
        },

        sendToMove_T: function() {
            if (hasMovedT) {
                var distance = this.sliderTDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeT;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionT;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moved_T', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeT);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderTLastPos = this.StringsliderT.value;
                this.sliderTDistance = 0.0;
                needToStartTimeT = true;
            }
        },

        sendToMove_A: function() {
            if (hasMovedA) {
                var distance = this.sliderADistance;
                var timeSinceStartedPull =  this.time - pullStartTimeA;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionA;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moved_A', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeA);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderALastPos = this.StringsliderA.value;
                this.sliderADistance = 0.0;
                needToStartTimeA = true;
            }
        },

        sendToMove_P: function() {
            if (hasMovedP) {
                var distance = this.sliderPDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeP;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionP;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moved_P', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeP);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderPLastPos = this.StringsliderP.value;
                this.sliderPDistance = 0.0;
                needToStartTimeP = true;
            }
        },

        sendToMove_E: function() {
            if (hasMovedE) {
                var distance = this.sliderEDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeE;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionE;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moved_E', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeE);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderELastPos = this.StringsliderE.value;
                this.sliderEDistance = 0.0;
                needToStartTimeE = true;
            }
        },
        
        sendToMoving_T: function(){
            if (hasMovedT) {
                var distance = this.sliderTDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeT;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionT;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moving_T', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeT);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderTLastPos = this.StringsliderT.value;
                this.sliderTDistance = 0.0;
                needToStartTimeT = true;
            }
        },
        
        sendToMoving_A: function(){
            if (hasMovedA) {
                var distance = this.sliderADistance;
                var timeSinceStartedPull =  this.time - pullStartTimeA;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionA;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moving_A', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeA);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderALastPos = this.StringsliderA.value;
                this.sliderADistance = 0.0;
                needToStartTimeA = true;
            }
        },
        
        sendToMoving_P: function(){
            if (hasMovedP) {
                var distance = this.sliderPDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeP;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionP;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moving_P', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeP);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderPLastPos = this.StringsliderP.value;
                this.sliderPDistance = 0.0;
                needToStartTimeP = true;
            }
        },
        
        sendToMoving_E: function(){
            if (hasMovedE) {
                var distance = this.sliderEDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeE;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionE;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moving_E', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeE);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderELastPos = this.StringsliderE.value;
                this.sliderEDistance = 0.0;
                needToStartTimeE = true;
            }
        },
        
        sendToMoving_W: function(){
            if (hasMovedW) {
                var distance = this.sliderWDistance;
                var timeSinceStartedPull =  this.time - pullStartTimeW;
                var speed = Math.abs(distance)/timeSinceStartedPull;
                var position = this.positionW;
                var stringPullLerp = pc.fw.Application.getApplication('application-canvas').context.root._children[0];
                stringPullLerp.script.send('HIDInterface', 'moving_W', position, distance, speed);

                //console.log("pullStartTime " + pullStartTimeW);
                //console.log("Time " + this.time);
                //console.log("position: " + position + " distance: "+ distance + " speed: " + speed);
                
                sliderWLastPos = this.StringsliderW.value;
                this.sliderWDistance = 0.0;
                needToStartTimeW = true;
            }
        },

        subTemperature: function() {
            global[GLOBAL.TEMPERATURE] = global[GLOBAL.TEMPERATURE] - 1;
        },

        setText: function (message, message2, message3, message4, message5, message6, message7) {
            this.div.innerHTML = message;
            this.divTString.innerHTML = message2;
            this.divAString.innerHTML = message3;
            this.divPString.innerHTML = message4;
            this.divEString.innerHTML = message5;
            this.divWString.innerHTML = message6;
            this.musicText.innerHTML = message7;
        },

        setVisibilty: function() {
            switch (switchUIOn) {
                case 0:
                    this.div.style.visibility = 'hidden';
                    this.divTString.style.visibility = 'hidden'; 
                    this.divAString.style.visibility = 'hidden';
                    this.divPString.style.visibility = 'hidden';
                    this.divEString.style.visibility = 'hidden';
                    this.divWString.style.visibility = 'hidden';

                    for (var i = 0; i < this.tribePop.length; i++) {
                        this.tribePop[i].style.visibility = 'hidden';
                        this.tribeBelief[i].style.visibility = 'hidden';
                        this.tribeFear[i].style.visibility = 'hidden';
                        this.tribeMessage[i].style.visibility = 'hidden';
                    }

                    this.StringsliderT.style.visibility = 'hidden';
                    this.StringsliderA.style.visibility = 'hidden';
                    this.StringsliderP.style.visibility = 'hidden';
                    this.StringsliderE.style.visibility = 'hidden';
                    this.StringsliderW.style.visibility = 'hidden';

                    this.musicSlider.style.visibility = 'hidden';
                    this.musicText.style.visibility = 'hidden';
                    break;

                case 1:
                    this.div.style.visibility = 'hidden';
                    this.divTString.style.visibility = 'visible'; 
                    this.divAString.style.visibility = 'visible';
                    this.divPString.style.visibility = 'visible';
                    this.divEString.style.visibility = 'visible';
                    this.divWString.style.visibility = 'visible';

                    for (var i = 0; i < this.tribePop.length; i++) {
                        this.tribePop[i].style.visibility = 'hidden';
                        this.tribeBelief[i].style.visibility = 'hidden';
                        this.tribeFear[i].style.visibility = 'hidden';
                        this.tribeMessage[i].style.visibility = 'hidden';
                    }

                    this.StringsliderT.style.visibility = 'visible';
                    this.StringsliderA.style.visibility = 'visible';
                    this.StringsliderP.style.visibility = 'visible';
                    this.StringsliderE.style.visibility = 'visible';
                    this.StringsliderW.style.visibility = 'visible';

                    this.musicSlider.style.visibility = 'hidden';
                    this.musicText.style.visibility = 'hidden';
                    break;

                case 2:
                    this.div.style.visibility = 'visible';
                    this.divTString.style.visibility = 'visible'; 
                    this.divAString.style.visibility = 'visible';
                    this.divPString.style.visibility = 'visible';
                    this.divEString.style.visibility = 'visible';
                    this.divWString.style.visibility = 'visible';

                    for (var i = 0; i < this.tribePop.length; i++) {
                        this.tribePop[i].style.visibility = 'visible';
                        this.tribeBelief[i].style.visibility = 'visible';
                        this.tribeFear[i].style.visibility = 'visible';
                        this.tribeMessage[i].style.visibility = 'visible';
                    }

                    this.StringsliderT.style.visibility = 'visible';
                    this.StringsliderA.style.visibility = 'visible';
                    this.StringsliderP.style.visibility = 'visible';
                    this.StringsliderE.style.visibility = 'visible';
                    this.StringsliderW.style.visibility = 'visible';

                    this.musicSlider.style.visibility = 'visible';
                    this.musicText.style.visibility = 'visible';
                    break;
            }
        },


        setTribeText: function (message, message2, message3, message4, i) {
            this.tribePop[i].innerHTML = message;
            this.tribeBelief[i].innerHTML = message2;
            this.tribeFear[i].innerHTML = message3;
            this.tribeMessage[i].innerHTML = message4;
        },

    };

    return developer;
});
