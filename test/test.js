///
// Description: This is the template to create a class
// More info at http://developer.playcanvas.com/user-manual/scripting/anatomy/
///
pc.script.create('test', function (context) {
    // Creates a new Test instance
    var Test = function (entity) {
        this.entity = entity;
    };

    Test.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }

		aFunction: function () {
			console.log('Function in Test class');
		}
    };

    return Test;
});

// This will return root node. Remember that all entities are not accessable if this is called before
// everything is loaded. Use initialize function inside pc.script instead
var appContextRoot = pc.fw.Application.getApplication('application-canvas').context.root;




//// Basic class in Javascript ////

// Class definition & variables
Class = function () {
    var variable;
    console.log('Class instantiated');
};
// Create class functions by inject new functions to prototype
Class.prototype = {
    getCamera: function(){
        console.log("inside Class");
    }
};
// Use the class
var rule1 = new Class();
rule1.getCamera();





//// Playcanvas way to inherit a class ////

// Base class with function fn
Rule = function () {};
Rule.prototype.fn = function () {
  console.log('base Rule');
};

// Another class to inherit the base class
Rule1 = function () {};
Rule1 = pc.inherits(Rule1, Rule);

// Override the function fn in base class
Rule1.prototype.fn = function () {
  // Call overridden method
  Rule1._super.fn();
  console.log('Rule1 class');
};

// Use the inherited class
var c = new Rule1();
c.fn(); // prints 'base' then 'class'



//// Playcanvas way to extends a class ////
// Class A extends Class B
ClassA = {a: function() {console.log(this.a)}};
ClassB = {b: function() {console.log(this.b)}};

// pc.extend(from, to);
pc.extend(ClassA, ClassB);
ClassA.a();
// logs "a"
ClassA.b();
// logs "b"





//// Debug functions ////
// Use these to print out to PC Debug
// Shortcuts to logging functions
logINFO("This is an info log");
logDEBUG("This is a debug log");
logWARNING("This is a warning log");
logERROR("This is an error log");
//logALERT();
//logASSERT();