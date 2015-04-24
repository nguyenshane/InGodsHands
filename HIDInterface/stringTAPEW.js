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
        this.middleKey = _pairKeys[stringName.toString()][2];
        
        this.rotating = false;
        this.direction = 0;
        this.distance = 0;
		this.speed = 0;
        this.counter = 0; //ms
        this.count, this.countfn; //count interval reference for time
        this.pressing = false;
        this.countClear, this.countClearfn; //count interval reference for clearInterval
        this.isMiddle = false;
        this.middlecountdown, this.middlecountdownfn;

        this.context.keyboard.on(pc.EVENT_KEYDOWN, this.onKeyDown, this);
        this.context.keyboard.on(pc.EVENT_KEYUP, this.onKeyUp, this);
    };
    
    
    var _pairKeys = {
        'T': [pc.KEY_A,pc.KEY_D,pc.KEY_1],
        'A': [pc.KEY_W,pc.KEY_S,pc.KEY_2],
        'P': [pc.KEY_J,pc.KEY_L,pc.KEY_3],
        'E': [pc.KEY_I,pc.KEY_K,pc.KEY_4],
        'W': [pc.KEY_V,pc.KEY_N,pc.KEY_5]
    };
    
    StringTAPEW.prototype = {
        initialize: function () {

        },
        
        onKeyDown: function (event) {
            if (event.key === this.middleKey) {
                //this.rotating = true;
                this.isMiddle = true;
                this.checkMiddle();
            }
            if (event.key === this.leftKey) {
                //this.rotating = true;
                this.pressing = true;
                this.direction--;
                this.doCount();                
            }
            if (event.key === this.rightKey) {
                //this.rotating = true;
                this.pressing = true;
                this.direction++;
                this.doCount();
                //console.log(this.direction);
            }
            
            // Calling preventDefault() on the original browser event stops this.
            event.event.preventDefault();
        },

        checkMiddle: function(){
            this.middleResetfn = function(o) {
                if(o.isMiddle){o.isMiddle = false;}
                //console.log("isMiddle reset to false");
            }
            clearTimeout(this.middlecountdownClear);
            this.middlecountdownClear = setTimeout(this.middleResetfn, 2000, this);
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
			this.fire("moved", this.direction, this.distance, this.speed);
			//console.log("FIRED in stringTAPEW, time: ", this.speed);
		},
        
        reset: function() {
			this.fireEvent();
			
            this.pressing = false;

            this.direction = 0;
            this.distance = 0;
            this.counter = 0;
			this.speed = 0;
			
            clearInterval(this.count);
            console.log("RESET");
        },
    
        
        onKeyUp: function (event) {
            this.rotating = false;
            this.distance += this.direction;
			if(this.direction>0) this.direction = 1;
			else if (this.direction<=0) this.direction = -1;
            if(this.counter !== 0) {
				this.speed = Math.abs(this.distance)/this.counter*100;
				this.fire("moving", this.direction, this.distance, this.speed);
            	//console.log("UP position:", this.direction, " distance:", this.distance, " time:", this.counter, " speed:", this.speed);
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
