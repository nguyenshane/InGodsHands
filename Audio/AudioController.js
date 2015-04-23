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
		this.musicLayer = 0.66;
		this.targetMusicLayer = 0.66;
		this.direction, this.distance, this.speed = 0;
    };

    AudioController.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.stringT = context.root._children[0].script.HIDInterface.stringT;
			this.stringA = context.root._children[0].script.HIDInterface.stringA;
			this.stringP = context.root._children[0].script.HIDInterface.stringP;
			this.stringE = context.root._children[0].script.HIDInterface.stringE;
			this.stringW = context.root._children[0].script.HIDInterface.stringW;
			
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

			this.backgroundmusic = new BackgroundIntensity(this.musicBuffer, new AudioContext());

			//console.log("this.backgroundmusic", this.backgroundmusic);

			this.backgroundmusic.playPause.call(this.backgroundmusic);

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        	if (context.keyboard.isPressed(56)) {
        		//console.log('this.musicLayer',this.musicLayer);
        		this.musicLayer+=0.02;
        		if (this.musicLayer>=1) this.musicLayer = 1;
                this.backgroundmusic.setIntensity(this.musicLayer);
            }
            if (context.keyboard.isPressed(57)) {
            	//console.log('this.musicLayer',this.musicLayer);
                this.musicLayer-=0.02;
                if (this.musicLayer<=0) this.musicLayer = 0;
                this.backgroundmusic.setIntensity(this.musicLayer);
            }

            // set the target music layer based on belief change.
            if (totalBelief > prevTotalBelief){
                this.targetMusicLayer = 1;
            } else if (totalBelief < prevTotalBelief){
            	this.targetMusicLayer = .33;
            } else if (this.targetMusicLayer === this.musicLayer){
            	this.targetMusicLayer = .66;
            }

			// start shifting towards correct music layer
            if ((this.targetMusicLayer < this.musicLayer) && (this.musicLayer > 0.33)){
            	this.musicLayer -= 0.005;
            	if (this.musicLayer < 0.33) this.musicLayer = 0.33;
            } else if ((this.targetMusicLayer > this.musicLayer) && (this.musicLayer < 1)){
            	this.musicLayer += 0.005;
            	if (this.musicLayer > 1) this.musicLayer = 1;
            }

            //console.log("totalBelief: ", totalBelief);
            //console.log("prevTotalBelief: ", totalBelief);
            // have music layer shift towards targetMusicLayer
            this.backgroundmusic.setIntensity(this.musicLayer);
        },
		
		sound_T: function(position, distance, speed) {
			//console.log("Play sound string T");
			
			this.audio = context.root._children[0];
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_A: function(position, distance, speed) {
			//console.log("Play sound string A");

			this.audio = context.root._children[0];
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_P: function(position, distance, speed) {
			//console.log("Play sound string P");

			this.audio = context.root._children[0];
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_E: function(position, distance, speed) {
			//console.log("Play sound string E");

			this.audio = context.root._children[0];
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},
		
		sound_W: function(position, distance, speed) {
			//console.log("Play sound string W");

			this.audio = context.root._children[0];
            this.playing = false;
            this.paused = false;
            
			this.audio.audiosource.play("string_pull");
		},

		sound_TribeMov: function(){
			this.audio = context.root._children[0];
            this.playing = false;
            this.paused = false;
            //console.log("Tribe has moved");
            this.audio.audiosource.play("tribeMovement");
		},

		sound_TribePray: function(){
			//console.log("Play sound: Tribe Pray");

			this.audio = context.root._children[0];
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Prayer");
		},

		sound_TribePraise: function(){
			//console.log("Play sound: Tribe Praise");

			this.audio = context.root._children[0];
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Praise");
		},

		sound_TribeDenounce: function(){
			//console.log("Play sound: Tribe Denounce");

			this.audio = context.root._children[0];
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Angry Chant");
		},

		sound_MakeThunder: function(){
			//console.log("Play sound: Thunder");

			this.audio = context.root._children[0];
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Thunder");
		},

		sound_MakeRain: function(){
			//console.log("Play sound: Rain");

			this.audio = context.root._children[0];
			this.playing = false;
			this.paused = false;
			
			this.audio.audiosource.play("IGH Rain Loop");
		},


    };

    return AudioController;
});