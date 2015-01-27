///
// Description: This is the control input for each string, don't need to look into
///
pc.extend(pc, function(){
    
    var StringTAPEW = function(stringName) {
        pc.events.attach(this);
        this.context = pc.fw.Application.getApplication('application-canvas').context;
        this.keyboard = this.context.keyboard;

        
        this.stringName = stringName;
        this.leftKey = _pairKeys[stringName.toString()][0];
        this.rightKey = _pairKeys[stringName.toString()][1];
        
        this.rotating = false;
        this.position = 0;
        this.distance = 0;
		this.speed = 0;
        this.counter = 0; //ms
        this.count, this.countfn; //count interval reference for time
        this.pressing = false;
        this.countClear, this.countClearfn; //count interval reference for clearInterval
        this.context.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
        this.context.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
    };
    
    
    var _pairKeys = {
        'T': [pc.KEY_A,pc.KEY_D],
        'A': [pc.KEY_W,pc.KEY_S],
        'P': [pc.KEY_J,pc.KEY_L],
        'E': [pc.KEY_I,pc.KEY_K],
        'W': [pc.KEY_V,pc.KEY_N]
    };
    
    StringTAPEW.prototype = {
        initialize: function () {

        },
        
        /*update: function (dt) {
            console.log(this.position);
            if (this.context.keyboard.isPressed(this.leftKey)) {
                this.position--;
                console.log(this.position);
            }
            if (this.context.keyboard.isPressed(this.rightKey)) {
                this.position++;
                console.log(this.position);
            }
        },*/
        
        onKeyDown: function (event) {
            if (event.key === this.leftKey) {
                //this.rotating = true;
                this.pressing = true;
                this.position--;
                this.doCount();
                
            }
            if (event.key === this.rightKey) {
                //this.rotating = true;
                this.pressing = true;
                this.position++;
                this.doCount();
                //console.log(this.position);
            }
            
            // When the space bar is pressed this scrolls the window.
            // Calling preventDefault() on the original browser event stops this.
            event.event.preventDefault();
        },
        
        doCount: function() {
            if(!this.rotating){
                this.rotating = true;
                
                clearInterval(this.count);
                this.countfn = function(o) {o.counter += 1; /*console.log("inside doCount", o.counter);*/};
                this.count = setInterval(this.countfn, 1, this);
            }
        
        },
        
        doClearInterval: function() {
            this.countClearfn = function(o) {o.pressing = false; o.reset(); };
            if (this.pressing) {
                clearTimeout(this.countClear);
                this.countClear = setTimeout(this.countClearfn, 500, this);
            }
            
            
        },

		fireEvent: function() {
			this.fire("move", this.position, this.distance, this.speed);
			//console.log("FIRED in stringTAPEW, time: ", this.speed);
		},
        
        reset: function() {
			this.fireEvent();
			
            this.pressing = false;

            this.position = 0;
            this.distance = 0;
            this.counter = 0;
			this.speed = 0;
			
            clearInterval(this.count);
            console.log("RESET");
        },
    
        
        onKeyUp: function (event) {
            this.rotating = false;
            this.distance += this.position;
            if(this.counter !== 0) {
				this.speed = Math.abs(this.distance)/this.counter*100;
            	//console.log("UP position:", this.position, " distance:", this.distance, " time:", this.counter, " speed:", this.speed);
			}
            this.doClearInterval();
            

            // When the space bar is pressed this scrolls the window.
            // Calling preventDefault() on the original browser event stops this.
            event.event.preventDefault();
        },
    };
    

    return {
        StringTAPEW: StringTAPEW
    };
}());
