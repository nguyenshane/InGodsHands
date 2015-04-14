///
// Description: This is the Audio Controller
///
pc.script.attribute('musicAsset', 'asset', []);

pc.script.create('AudioController', function (context) {
    // Creates a new instance
    var AudioController = function (entity) {
        this.entity = entity;
		pc.events.attach(this);
		
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

			this.music = context.assets.getAssetById(this.musicAsset).resources;
			console.log("this.music", this.music);


        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
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