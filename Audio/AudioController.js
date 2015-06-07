///
// Description: This is the Audio Controller
///
pc.script.attribute('musicAsset', 'asset', []);

pc.script.create('AudioController', function (context) {
    // Creates a new instance
    var AudioController = function (entity) {
        this.entity = entity;
		pc.events.attach(this);
		this.musicBuffer = [];
		this.musicLayer = 0.5;
		this.prevMusicLayer = this.musicLayer;
		this.musicLayerStart = this.musicLayer;
		this.targetMusicLayer = 0.5;
		this.direction, this.distance, this.speed = 0;
		this.recentlyPaused = false;
    };

  		var lerpStartTime = 0.0;
  		var timer = 0.0;
  		var timerTwo = 0.0;
  		var changeMusic = false;
  		var backToNormal = false;

    AudioController.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = context.root.findByName("Rv1-stable").script.HIDInterface.stringT;
			this.stringA = context.root.findByName("Rv1-stable").script.HIDInterface.stringA;
			this.stringP = context.root.findByName("Rv1-stable").script.HIDInterface.stringP;
			this.stringE = context.root.findByName("Rv1-stable").script.HIDInterface.stringE;
			this.stringW = context.root.findByName("Rv1-stable").script.HIDInterface.stringW;
			
			this.stringT.on("moved", this.sound_T, this.direction, this.distance, this.speed);
			this.stringA.on("moved", this.sound_A, this.direction, this.distance, this.speed);
			this.stringP.on("moved", this.sound_P, this.direction, this.distance, this.speed);
			this.stringE.on("moved", this.sound_E, this.direction, this.distance, this.speed);
			this.stringW.on("moved", this.sound_W, this.direction, this.distance, this.speed);

			//console.log("this.musicAsset", this.musicAsset);

			for (var id=0; id<this.musicAsset.length; id++) {
				//console.log('id', id);
				//console.log("this.musicAsset[id]", this.musicAsset[id]);
				//console.log("getAssetById", context.assets.getAssetById(this.musicAsset[id]));
				this.musicBuffer.push(context.assets.getAssetById(this.musicAsset[id]).resource.buffer);
			}
			//console.log("this.musicBuffer", this.musicBuffer);

			this.backgroundmusic = new BackgroundIntensity(this.musicBuffer, new webkitAudioContext());

			//console.log("this.backgroundmusic", this.backgroundmusic);

			this.backgroundmusic.playPause.call(this.backgroundmusic);

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {

        if(!isPaused){
        		this.dynamicMusic();
            }


            else{

            	if(!this.recentlyPaused) this.prevMusicLayer = this.musicLayer;
               
                //console.log("prevMusicLayer: " + this.prevMusicLayer + " musicLayer: " + this.musicLayer);
                this.musicLayer = .5;
                this.backgroundmusic.setIntensity(this.musicLayer);
                this.recentlyPaused = true;
            }
        },
		

		dynamicMusic: function(){

        	if(this.recentlyPaused){
		            this.musicLayer = this.prevMusicLayer;
		            this.backgroundmusic.setIntensity(this.musicLayer);
		            this.recentlyPaused = false;
		        }

            // set the target music layer based on belief change.

           if(!changeMusic && backToNormal){
	            if (global[GLOBAL.BELIEF] > prevTotalBelief){
	            	changeMusic = true;   	
	            	timerTwo = new Date();
	            	this.musicLayerStart = this.musicLayer;
	            	lerpStartTime = timerTwo.getTime();
	                this.targetMusicLayer = 1;
	            } else if (global[GLOBAL.BELIEF] < prevTotalBelief){
	            	changeMusic = true;
	            	timerTwo = new Date();
	            	this.musicLayerStart = this.musicLayer;
	            	lerpStartTime = timerTwo.getTime();
	            	this.targetMusicLayer = 0;
	            } else if (this.targetMusicLayer === this.musicLayer){
	            	this.targetMusicLayer = .5;

	            }    
	        }

	        if(this.musicLayer == 0.5 && !changeMusic) backToNormal = true;

              if(this.musicLayer == this.targetMusicLayer){
            	changeMusic = false;

            }

			// start shifting towards correct music layer
            if ((this.targetMusicLayer < this.musicLayer) && (this.musicLayer > 0)){
            	 this.lerpMusic();
            	if (this.musicLayer < 0) this.musicLayer = 0;
            } else if ((this.targetMusicLayer > this.musicLayer) && (this.musicLayer < 1)){
           		 this.lerpMusic();
            	if (this.musicLayer > 1) this.musicLayer = 1;
            } 

            if(this.musicLayer == 1 || this.musicLayer == 0){
            	changeMusic = true;
	            timerTwo = new Date();
	            this.musicLayerStart = this.musicLayer;
	            lerpStartTime = timerTwo.getTime();
            	this.targetMusicLayer = .5;
            }

            //  console.log("totalBelief: ", totalBelief);
            // console.log("prevTotalBelief: ", prevTotalBelief);
            // // have music layer shift towards targetMusicLayer
            this.backgroundmusic.setIntensity(this.musicLayer);
		},

		backToNormal: function(){
			//timer = new Date();

		},

		lerpMusic: function(){
				timer = new Date();
				backToNormal = false;
            	var timeSinceStartedLerp = timer.getTime() - lerpStartTime;
            	//console.log("timeSinceStartedLerp " + timeSinceStartedLerp + " lerpStartTime " + lerpStartTime);
        		var percentLerped = timeSinceStartedLerp / 10000;
        		this.musicLayer = pc.math.lerp( this.musicLayerStart, this.targetMusicLayer, percentLerped );
        		//console.log("musicLayer: " + this.musicLayer + " targetMusicLayer: " + this.targetMusicLayer);
		},

		sound_T: function(position, distance, speed) {
			//console.log("Play sound string T");
			
			this.audio = context.root.findByName("Rv1-stable");
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_A: function(position, distance, speed) {
			//console.log("Play sound string A");

			this.audio = context.root.findByName("Rv1-stable");
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_P: function(position, distance, speed) {
			//console.log("Play sound string P");

			this.audio = context.root.findByName("Rv1-stable");
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_E: function(position, distance, speed) {
			//console.log("Play sound string E");

			this.audio = context.root.findByName("Rv1-stable");
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_W: function(position, distance, speed) {
			//console.log("Play sound string W");

			this.audio = context.root.findByName("Rv1-stable");
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},

		sound_TribeMov: function(){
			this.audio = context.root.findByName("Rv1-stable");
            this.playing = false;
            this.paused = false;
            //console.log("Tribe has moved");
            this.audio.audiosource.play("tribeMovement");
		},

		sound_TribePray: function(){
			//console.log("Play sound: Tribe Pray");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Prayer");
		},

		sound_TribePraise: function(){
			//console.log("Play sound: Tribe Praise");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Praise");
		},

		sound_TribeDenounce: function(){
			//console.log("Play sound: Tribe Denounce");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Angry Chant");
		},

		sound_TribeWorshipFalseIdol: function(){
			//console.log("Play sound: Tribe Denounce");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Statue Demon 2");
		},

		sound_TribeSacrifice: function(){
			//console.log("Play sound: Tribe Denounce");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Sacrifice 2");
		},

		sound_MakeThunder: function(){
			//console.log("Play sound: Thunder");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Thunder");
		},

		sound_MakeRain: function(){
			//console.log("Play sound: Rain");

			this.audio = context.root.findByName("Rv1-stable");
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Rain Loop");
		},


    };

    return AudioController;
});