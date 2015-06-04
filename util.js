// pc.alVec3 class
pc.extend(pc, (function () {
    'use strict';

    /**
    * @name pc.alVec3
    * @class A 3-dimensional vector.
    * @constructor Creates a new alVec3 object
    * @param {Number} [x] The x value
    * @param {Number} [y] The y value
    * @param {Number} [z] The z value
    */
    var alVec3 = function () {
        this.data = [];

        if (arguments.length === 3) {
            this.data.push(arguments[0]);
			this.data.push(arguments[1]);
			this.data.push(arguments[2]);
        } else {
            this.data[0] = 0;
            this.data[1] = 0;
            this.data[2] = 0;
        }
    };

    alVec3.prototype = {
        /**
         * @function
         * @name pc.alVec3#add
         * @description Adds a 3-dimensional vector to another in place.
         * @param {pc.alVec3} rhs The vector to add to the specified vector.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(10, 10, 10);
         * var b = new pc.alVec3(20, 20, 20);
         *
         * a.add(b);
         *
         * // Should output [30, 30, 30]
         * console.log("The result of the addition is: " + a.toString());
         */
        add: function (rhs) {
            var a = this.data,
                b = rhs.data;

            a[0] += b[0];
            a[1] += b[1];
            a[2] += b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#add2
         * @description Adds two 3-dimensional vectors together and returns the result.
         * @param {pc.alVec3} lhs The first vector operand for the addition.
         * @param {pc.alVec3} rhs The second vector operand for the addition.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(10, 10, 10);
         * var b = new pc.alVec3(20, 20, 20);
         * var r = new pc.alVec3();
         *
         * r.add2(a, b);
         * // Should output [30, 30, 30]
         *
         * console.log("The result of the addition is: " + r.toString());
         */
        add2: function (lhs, rhs) {
            var a = lhs.data,
                b = rhs.data,
                r = this.data;

            r[0] = a[0] + b[0];
            r[1] = a[1] + b[1];
            r[2] = a[2] + b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#clone
         * @description Returns an identical copy of the specified 3-dimensional vector.
         * @returns {pc.alVec3} A 3-dimensional vector containing the result of the cloning.
         * @example
         * var v = new pc.alVec3(10, 20, 30);
         * var vclone = v.clone();
         * console.log("The result of the cloning is: " + vclone.toString());
         */
        clone: function () {
            return new alVec3().copy(this);
        },

        /**
         * @function
         * @name pc.alVec3#copy
         * @description Copied the contents of a source 3-dimensional vector to a destination 3-dimensional vector.
         * @param {pc.alVec3} rhs A vector to copy to the specified vector.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var src = new pc.alVec3(10, 20, 30);
         * var dst = new pc.alVec3();
         *
         * dst.copy(src);
         *
         * console.log("The two vectors are " + (dst.equals(src) ? "equal" : "different"));
         */
        copy: function (rhs) {
            var a = this.data,
                b = rhs.data;

            a[0] = b[0];
            a[1] = b[1];
            a[2] = b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#cross
         * @description Returns the result of a cross product operation performed on the two specified 3-dimensional vectors.
         * @param {pc.alVec3} lhs The first 3-dimensional vector operand of the cross product.
         * @param {pc.alVec3} rhs The second 3-dimensional vector operand of the cross product.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var back = new pc.alVec3().cross(pc.alVec3.RIGHT, pc.alVec3.UP);
         *
         * // Should print the Z axis (i.e. [0, 0, 1])
         * console.log("The result of the cross product is: " + back.toString());
         */
        cross: function (lhs, rhs) {
            var a, b, r, ax, ay, az, bx, by, bz;

            a = lhs.data;
            b = rhs.data;
            r = this.data;

            ax = a[0];
            ay = a[1];
            az = a[2];
            bx = b[0];
            by = b[1];
            bz = b[2];

            r[0] = ay * bz - by * az;
            r[1] = az * bx - bz * ax;
            r[2] = ax * by - bx * ay;

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#dot
         * @description Returns the result of a dot product operation performed on the two specified 3-dimensional vectors.
         * @param {pc.alVec3} rhs The second 3-dimensional vector operand of the dot product.
         * @returns {Number} The result of the dot product operation.
         * @example
         * var v1 = new pc.alVec3(5, 10, 20);
         * var v2 = new pc.alVec3(10, 20, 40);
         * var v1dotv2 = v1.dot(v2);
         * console.log("The result of the dot product is: " + v1dotv2);
         */
        dot: function (rhs) {
            var a = this.data,
                b = rhs.data;

            return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        },

        /**
         * @function
         * @name pc.alVec3#equals
         * @description Reports whether two vectors are equal.
         * @param {pc.alVec3} rhs The vector to compare to the specified vector.
         * @returns {Booean} true if the vectors are equal and false otherwise.
         * var a = new pc.alVec3(1, 2, 3);
         * var b = new pc.alVec3(4, 5, 6);
         * console.log("The two vectors are " + (a.equals(b) ? "equal" : "different"));
         */
        equals: function (rhs) {
            var a = this.data,
                b = rhs.data;

            return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
        },

        /**
         * @function
         * @name pc.alVec3#length
         * @description Returns the magnitude of the specified 3-dimensional vector.
         * @returns {Number} The magnitude of the specified 3-dimensional vector.
         * @example
         * var vec = new pc.alVec3(3, 4, 0);
         * var len = vec.length();
         * // Should output 5
         * console.log("The length of the vector is: " + len);
         */
        length: function () {
            var v = this.data;

            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        },

        /**
         * @function
         * @name pc.alVec3#lengthSq
         * @description Returns the magnitude squared of the specified 3-dimensional vector.
         * @returns {Number} The magnitude of the specified 3-dimensional vector.
         * @example
         * var vec = new pc.alVec3(3, 4, 0);
         * var len = vec.lengthSq();
         * // Should output 25
         * console.log("The length squared of the vector is: " + len);
         */
        lengthSq: function () {
            var v = this.data;

            return v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
        },

        /**
         * @function
         * @name pc.alVec3#lerp
         * @description Returns the result of a linear interpolation between two specified 3-dimensional vectors.
         * @param {pc.alVec3} lhs The 3-dimensional to interpolate from.
         * @param {pc.alVec3} rhs The 3-dimensional to interpolate to.
         * @param {Number} alpha The value controlling the point of interpolation. Between 0 and 1, the linear interpolant
         * will occur on a straight line between lhs and rhs. Outside of this range, the linear interpolant will occur on
         * a ray extrapolated from this line.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(0, 0, 0);
         * var b = new pc.alVec3(10, 10, 10);
         * var r = new pc.alVec3();
         *
         * r.lerp(a, b, 0);   // r is equal to a
         * r.lerp(a, b, 0.5); // r is 5, 5, 5
         * r.lerp(a, b, 1);   // r is equal to b
         */
        lerp: function (lhs, rhs, alpha) {
            var a = lhs.data,
                b = rhs.data,
                r = this.data;

            r[0] = a[0] + alpha * (b[0] - a[0]);
            r[1] = a[1] + alpha * (b[1] - a[1]);
            r[2] = a[2] + alpha * (b[2] - a[2]);

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#mul
         * @description Returns the result of multiplying the specified 3-dimensional vectors together.
         * @param {pc.alVec3} rhs The 3-dimensional vector used as the second multiplicand of the operation.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(2, 3, 4);
         * var b = new pc.alVec3(4, 5, 6);
         *
         * a.mul(b);
         *
         * // Should output 8, 15, 24
         * console.log("The result of the multiplication is: " + a.toString());
         */
        mul: function (rhs) {
            var a = this.data,
                b = rhs.data;

            a[0] *= b[0];
            a[1] *= b[1];
            a[2] *= b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#mul2
         * @description Returns the result of multiplying the specified 3-dimensional vectors together.
         * @param {pc.alVec3} lhs The 3-dimensional vector used as the first multiplicand of the operation.
         * @param {pc.alVec3} rhs The 3-dimensional vector used as the second multiplicand of the operation.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(2, 3, 4);
         * var b = new pc.alVec3(4, 5, 6);
         * var r = new pc.alVec3();
         *
         * r.mul2(a, b);
         *
         * // Should output 8, 15, 24
         * console.log("The result of the multiplication is: " + r.toString());
         */
        mul2: function (lhs, rhs) {
            var a = lhs.data,
                b = rhs.data,
                r = this.data;

            r[0] = a[0] * b[0];
            r[1] = a[1] * b[1];
            r[2] = a[2] * b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#normalize
         * @description Returns the specified 3-dimensional vector copied and converted to a unit vector.
         * @returns {pc.alVec3} The result of the normalization.
         * @example
         * var v = new pc.alVec3(25, 0, 0);
         *
         * v.normalize();
         *
         * // Should output 1, 0, 0, 0
         * console.log("The result of the vector normalization is: " + v.toString());
         */
        normalize: function () {
            return this.scale(1 / this.length());
        },

        /**
         * @function
         * @name  pc.alVec3#project
         * @description Projects this 3-dimensional vector onto the specified vector.
         * @param {pc.alVec3} rhs The vector onto which the original vector will be projected on.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var v = new pc.alVec3(5, 5, 5);
         * var normal = new pc.alVec3(1, 0, 0);
         *
         * v.project(normal);
         *
         * // Should output 5, 0, 0
         * console.log("The result of the vector projection is: " + v.toString());
         */
        project: function (rhs) {
            var a = this.data;
            var b = rhs.data;
            var a_dot_b = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
            var b_dot_b = b[0] * b[0] + b[1] * b[1] + b[2] * b[2];
            var s = a_dot_b / b_dot_b;
            a[0] = b[0] * s;
            a[1] = b[1] * s;
            a[2] = b[2] * s;
            return this;
        },

        /**
         * @function
         * @name pc.alVec3#scale
         * @description Scales each dimension of the specified 3-dimensional vector by the supplied
         * scalar value.
         * @param {Number} scalar The value by which each vector dimension is multiplied.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var v = new pc.alVec3(2, 4, 8);
         *
         * // Multiply by 2
         * v.scale(2);
         *
         * // Negate
         * v.scale(-1);
         *
         * // Divide by 2
         * v.scale(0.5);
         */
        scale: function (scalar) {
            var v = this.data;

            v[0] *= scalar;
            v[1] *= scalar;
            v[2] *= scalar;

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#set
         * @description Sets the specified 3-dimensional vector to the supplied numerical values.
         * @param {Number} x The value to set on the first dimension of the vector.
         * @param {Number} y The value to set on the second dimension of the vector.
         * @param {Number} z The value to set on the third dimension of the vector.
         * @example
         * var v = new pc.alVec3();
         * v.set(5, 10, 20);
         *
         * // Should output 5, 10, 20
         * console.log("The result of the vector set is: " + v.toString());
         */
        set: function (x, y, z) {
            var v = this.data;

            v[0] = x;
            v[1] = y;
            v[2] = z;

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#sub
         * @description Subtracts a 3-dimensional vector from another in place.
         * @param {pc.alVec3} rhs The vector to add to the specified vector.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(10, 10, 10);
         * var b = new pc.alVec3(20, 20, 20);
         *
         * a.sub(b);
         *
         * // Should output [-10, -10, -10]
         * console.log("The result of the addition is: " + a.toString());
         */
        sub: function (rhs) {
            var a = this.data,
                b = rhs.data;

            a[0] -= b[0];
            a[1] -= b[1];
            a[2] -= b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#sub2
         * @description Subtracts two 3-dimensional vectors from one another and returns the result.
         * @param {pc.alVec3} lhs The first vector operand for the addition.
         * @param {pc.alVec3} rhs The second vector operand for the addition.
         * @returns {pc.alVec3} Self for chaining.
         * @example
         * var a = new pc.alVec3(10, 10, 10);
         * var b = new pc.alVec3(20, 20, 20);
         * var r = new pc.alVec3();
         *
         * r.sub2(a, b);
         *
         * // Should output [-10, -10, -10]
         * console.log("The result of the addition is: " + r.toString());
         */
        sub2: function (lhs, rhs) {
            var a = lhs.data,
                b = rhs.data,
                r = this.data;

            r[0] = a[0] - b[0];
            r[1] = a[1] - b[1];
            r[2] = a[2] - b[2];

            return this;
        },

        /**
         * @function
         * @name pc.alVec3#toString
         * @description Converts the vector to string form.
         * @returns {String} The vector in string form.
         * @example
         * var v = new pc.alVec3(20, 10, 5);
         * // Should output '[20, 10, 5]'
         * console.log(v.toString());
         */
        toString: function () {
            return "[" + this.data[0] + ", " + this.data[1] + ", " + this.data[2] + "]";
        }
    };

    /**
     * @field
     * @type Number
     * @name pc.alVec3#x
     * @description The first element of the vector.
     * @example
     * var vec = new pc.alVec3(10, 20, 30);
     *
     * // Get x
     * var x = vec.x;
     *
     * // Set x
     * vec.x = 0;
     */
    Object.defineProperty(alVec3.prototype, 'x', {
        get: function () {
            return this.data[0];
        },
        set: function (value) {
            this.data[0] = value;
        }
    });

    /**
     * @field
     * @type Number
     * @name pc.alVec3#y
     * @description The second element of the vector.
     * @example
     * var vec = new pc.alVec3(10, 20, 30);
     *
     * // Get y
     * var y = vec.y;
     *
     * // Set y
     * vec.y = 0;
     */
    Object.defineProperty(alVec3.prototype, 'y', {
        get: function () {
            return this.data[1];
        },
        set: function (value) {
            this.data[1] = value;
        }
    });

    /**
     * @field
     * @type Number
     * @name pc.alVec3#z
     * @description The third element of the vector.
     * @example
     * var vec = new pc.alVec3(10, 20, 30);
     *
     * // Get z
     * var z = vec.z;
     *
     * // Set z
     * vec.z = 0;
     */
    Object.defineProperty(alVec3.prototype, 'z', {
        get: function () {
            return this.data[2];
        },
        set: function (value) {
            this.data[2] = value;
        }
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.BACK
     * @description A constant vector set to [0, 0, 1].
     */
    Object.defineProperty(alVec3, 'BACK', {
        get: (function () {
            var back = new alVec3(0, 0, 1);
            return function () {
                return back;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.DOWN
     * @description A constant vector set to [0, -1, 0].
     */
    Object.defineProperty(alVec3, 'DOWN', {
        get: (function () {
            var down = new alVec3(0, -1, 0);
            return function () {
                return down;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.FORWARD
     * @description A constant vector set to [0, 0, -1].
     */
    Object.defineProperty(alVec3, 'FORWARD', {
        get: (function () {
            var forward = new alVec3(0, 0, -1);
            return function () {
                return forward;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.LEFT
     * @description A constant vector set to [-1, 0, 0].
     */
    Object.defineProperty(alVec3, 'LEFT', {
        get: (function () {
            var left = new alVec3(-1, 0, 0);
            return function () {
                return left;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.ONE
     * @description A constant vector set to [1, 1, 1].
     */
    Object.defineProperty(alVec3, 'ONE', {
        get: (function () {
            var one = new alVec3(1, 1, 1);
            return function () {
                return one;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.RIGHT
     * @description A constant vector set to [1, 0, 0].
     */
    Object.defineProperty(alVec3, 'RIGHT', {
        get: (function () {
            var right = new alVec3(1, 0, 0);
            return function () {
                return right;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.UP
     * @description A constant vector set to [0, 1, 0].
     */
    Object.defineProperty(alVec3, 'UP', {
        get: (function () {
            var down = new alVec3(0, 1, 0);
            return function () {
                return down;
            };
        }())
    });

    /**
     * @field
     * @static
     * @readonly
     * @type pc.alVec3
     * @name pc.alVec3.ZERO
     * @description A constant vector set to [0, 0, 0].
     */
    Object.defineProperty(alVec3, 'ZERO', {
        get: (function () {
            var zero = new alVec3(0, 0, 0);
            return function () {
                return zero;
            };
        }())
    });

    return {
        alVec3: alVec3
    };
}()));


// pc.tween class
pc.tween = (function () {
    var tweens = [];
    
    var Tween = function (v) {
        //this._entity = entity;
        this._startTime = null;
        this._start = new pc.Vec3();
        this._end = new pc.Vec3();
        this._current = new pc.Vec3();
        this._duration = 1000;

        this._start.copy(v);

        pc.extend(this, pc.events);
    };
    
    Tween.prototype = {
        reset: function (v) {
            this._start.copy(v);

            // clear events
            this.off('update');
            this.off('finish');
            
            return this;
        },
        
        to: function (v, duration) {
            this._end.copy(v);
            this._duration = duration ? duration * 1000 : this._duration;

            return this;
        },

        by: function (v, duration) {
            this._end.add2(this._start, v);
            this._duration = duration ? duration * 1000 : this._duration;

            return this;
        },

        update: function (time) {
            var alpha = (time - this._startTime) / this._duration;
            alpha = alpha > 1 ? 1 : alpha;

            this._current.lerp(this._start, this._end, alpha);
            //this._entity.setPosition(this._current);

            this.fire('update', this._current);
            
            if (alpha === 1) {
                this.fire('finish');
                return false;
            }

            return true;
        },

        start: function () {
            pc.tween.add(this);

            this._startTime = Date.now();

            return this;
        },

        stop: function () {
            pc.tween.remove(this);

            return this;
        }
    };

    return {
        add: function (tween) {
            tweens.push(tween);
        },

        remove: function (tween) {
            var i = tweens.indexOf(tween);
            if (i >= 0) {
                tweens.splice(i, 1);
            }    
        },

        update: function (time) {
            tweens.forEach(function (t) {
                if (!t.update(time)) {
                    this.remove(t);
                }
            }, this);
        },

        Tween: Tween
    };
}());


// stats.js - http://github.com/mrdoob/stats.js
//From FELLADRIN : https://playcanvas.com/felladrin


var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:12,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};"object"===typeof module&&(module.exports=Stats);


pc.script.create('FrameRate', function (context) {
    var stats = new Stats();
    
    // Creates a new Display_framerate instance
    var Display_framerate = function (entity) {
        this.entity = entity;
        
        stats.setMode(0); // 0: fps, 1: ms
        
        // align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        
        document.body.appendChild( stats.domElement );
    };

    Display_framerate.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            stats.begin();
            stats.end();
        }
    };

    return Display_framerate;
});


//Randomizes array contents, shamelessly stolen from the internet
function shuffleArray(array) {
	for(var j, x, i = array.length; i; j = Math.floor(seed.step(8191, 0, 1) * i), x = array[--i], array[i] = array[j], array[j] = x);
};

function getRandom(array) {
    return array[Math.floor(seed.step(8191, 0, 1) * array.length)];
};

//Also stolen from the internet
function Queue() {
	var a=[],b=0;
	this.getLength=function(){return a.length-b};
	this.isEmpty=function(){return 0==a.length};
	this.enqueue=function(b){a.push(b)};
	this.dequeue=function(){if(0!=a.length){var c=a[b];2*++b>=a.length&&(a=a.slice(b),b=0);return c}};
	this.peek=function(){return 0<a.length?a[b]:void 0};
};

//And again
function BinaryHeap(scoreFunction, idFunction, valueProp) {
    this.content = [];
    this.scoreFunction = scoreFunction;
    this.idFunction = idFunction;
    this.valueProp = valueProp;
    this.map = {};
}

BinaryHeap.prototype = {
    size: function() {
        return this.content.length;
    },

    push: function(elt) {
        if (this.map[this.idFunction(elt)] !== undefined) {
            //throw 'Error: id "' + this.idFunction(elt) + '" already present in heap';
            this.decreaseKey(this.idFunction(elt), this.scoreFunction(elt));
            return;
        }

        this.content.push(elt);
        var index = this.bubbleUp(this.content.length - 1);
        //this.map[this.idFunction(elt)] = index;
        //console.log(this.map);
    },

    pop: function() {
        var result = this.content[0];
        var end = this.content.pop();

        delete this.map[this.idFunction(result)];

        if (this.content.length > 0) {
            this.content[0] = end;
            this.map[this.idFunction(end)] = 0;
            var index = this.sinkDown(0);
            //this.map[this.idFunction(end)] = index;
            //console.log(this.map);
        }

        return result;
    },

    bubbleUp: function(n) {
        var element = this.content[n];
        var score = this.scoreFunction(element);

        while (n > 0) {
            var parentN = Math.floor((n-1)/2);
            var parent = this.content[parentN];
            //console.log('Element index: ' + n);
            //console.log('Parent index: ' + parentN + ', Parent element: ' + parent);

            if (this.scoreFunction(parent) < score)
                break;

            //console.log('Element score ', score, ' < Parent score ', this.scoreFunction(parent), ' => swap');
            this.map[this.idFunction(element)] = parentN;
            this.map[this.idFunction(parent)] = n;

            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }

        this.map[this.idFunction(element)] = n;

        return n;
    },

    sinkDown: function(n) {
        var element = this.content[n];
        var score = this.scoreFunction(element);

        while (true) {
            var child2N = (n + 1) * 2;
            var child1N = child2N - 1;
            var swap = null;
/*
            console.log('element: ' + element, ', score: ' + score, ', position: ', n);
            console.log('child1: ' + child1N, ',', this.content[child1N]);
            console.log('child2: ' + child2N, ',', this.content[child2N]);
*/
            if (child1N < this.content.length) {
                var child1 = this.content[child1N];
                child1score = this.scoreFunction(child1);
                if( score > child1score ) {
                    //console.log('child1 score < elemscore');
                    swap = child1N;
                }
            }

            if (child2N < this.content.length) {
                var child2 = this.content[child2N];
                var child2score = this.scoreFunction(child2);
                //console.log((swap == null ? score : child1score), ' >= ', child2score, ' => ', (swap == null ? score : child1score) >= child2score);
                if( (swap == null ? score : child1score) > child2score) {
                    //console.log('child2 score < elemscore');
                    swap = child2N;
                }
            }

            if (swap == null) break;


            //console.log('swap ', n, ' with ', swap);
            this.map[this.idFunction(this.content[swap])] = n;
            this.map[this.idFunction(element)] = swap;
            
            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }

        this.map[this.idFunction(element)] = n;

        return n;
    },

    decreaseKey: function(id, value) {
        var n = this.map[id];
        //console.log('Decreasing key for element ' + id + ' from value ' + this.content[n][this.valueProp] + ' to ' + value);
        this.content[n][this.valueProp] = value;
        this.bubbleUp(n);
    }
};

//Distance between two vectors squared (cuz performance)
function distSq(v1, v2) {
    var x = v1.x - v2.x;
    var y = v1.y - v2.y;
    var z = v1.z - v2.z;
    return x*x + y*y + z*z;
};

function llDistSq(lat1, lon1, lat2, lon2) {
    var latDist = lat2 - lat1;
    var lonDist = lon2 - lon1;
    return latDist*latDist + lonDist*lonDist;
};

//Unit vector for axis, angle in radians (I think)
function rotateAboutAxis(vector, axis, angle) {
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    
    var v = vector.clone();
    multScalar(v, cos);
    v.add(multScalar(new pc.Vec3().cross(axis, vector), sin));
    v.add(multScalar(axis, new pc.Vec3().dot(axis, vector) * (1 - cos)));
    
    return v;
};

function extendVector(vector, dist) {
	var v = new pc.Vec3(vector.x, vector.y, vector.z);
	v.normalize();
	v.scale(dist);
	v.add(vector);
    
	return v;
};

function multScalar(vector, scalar) {
	vector.x *= scalar;
	vector.y *= scalar;
	vector.z *= scalar;
    
    return vector;
};

//Additive object model scaling
function scaleA(obj, scale) {
	var s = obj.getLocalScale().x + (scale * obj.baseScale);
	obj.setLocalScale(s, s, s);
    obj.size += scale;
};

//Multiplicative scaling
function scaleM(obj, scale) {
	var s = obj.getLocalScale().x * scale;
	obj.setLocalScale(s, s, s);
    obj.size *= scale;
};

function actualLerp(v1, v2, alpha) {
    return new pc.Vec3(v1.x * alpha + v2.x * (1-alpha), v1.y * alpha + v2.y * (1-alpha), v1.z * alpha + v2.z * (1-alpha));
};

//Not actually a lerp, this one is just more useful to me
//Returns the distance between low and high that value is as [0, 1]
function lerp(low, high, value) {
	var h = high - low;
	var v = value - low;
	
	return (pc.math.clamp(v, 0, h) / h);
};

//Returns index of minimum value in the array (key being a function that finds the desired comparison value from whatever's stored in the array, and a is any additional data that might be used by key)
function min(array, key, a) {
    var min = 0;
    var value = key(array[0], a);
    
    for (var i = 0; i < array.length; i++) {
        var v = key(array[i], a);
        if (v < value) {
            min = i;
            value = v;
        }
    }
    
    return min;
};

function max(array, key, a) {
    var max = 0;
    var value = key(array[0], a);
    
    for (var i = 0; i < array.length; i++) {
        var v = key(array[i], a);
        if (v > value) {
            max = i;
            value = v;
        }
    }
    
    return max;
};

// BufferLoader for Music
/*
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}


BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}
*/

// BackgroundIntensify

function BackgroundIntensity(buffers, context) {
  var ctx = this;
  this.context = context;
  this.buffers = buffers;
  this.sources = new Array(buffers.length);
  this.gains = new Array(buffers.length);
}

BackgroundIntensity.prototype.playPause = function() {
    //console.log("this.context", this.context);
  if (this.playing) {
    // Stop all sources.
    for (var i = 0, length = this.sources.length; i < length; i++) {
      var src = this.sources[i];
      src.stop(0);
    }
  } else {
    var targetStart = this.context.currentTime + 0.1;
    // Start all sources simultaneously.
    for (var i = 0, length = this.buffers.length; i < length; i++) {
      this.playSound(i, targetStart);
    }
    this.setIntensity(0);
  }
  this.playing = !this.playing;
}

BackgroundIntensity.prototype.playSound = function(index, targetTime) {

  var buffer = this.buffers[index];
  var source = this.context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  var gainNode = this.context.createGain();
  // Make a gain node.
  source.connect(gainNode);
  gainNode.connect(this.context.destination);
  // Save the source and gain node.
  this.sources[index] = source;
  this.gains[index] = gainNode;
  source.start(targetTime);
}

BackgroundIntensity.prototype.setIntensity = function(normVal) {
  var value = normVal * (this.gains.length - 1);
  // First reset gains on all nodes.
  for (var i = 0; i < this.gains.length; i++) {
    this.gains[i].gain.value = 0;
  }
  // Decide which two nodes we are currently between, and do an equal
  // power crossfade between them.
  var leftNode = Math.floor(value);
  // Normalize the value between 0 and 1.
  var x = value - leftNode;
  var gain1 = Math.cos(x * 0.5*Math.PI);
  var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
  // Set the two gains accordingly.
  this.gains[leftNode].gain.value = gain1;
  // Check to make sure that there's a right node.
  if (leftNode < this.gains.length - 1) {
    // If there is, adjust its gain.
    this.gains[leftNode + 1].gain.value = gain2;
  }
}

dijkstras = function(startTile, destTile) {
    var dist = [];
    var prev = [];
	for (var i = ico.tiles.length-1; i >= 0; i--) {
		dist[i] = -1;
		prev[i] = -1;
	}
	
	var queue = new BinaryHeap(
		function(element) { return element.dist; },
		function(element) { return element.tile.index; },
		'dist'
	);
	
	queue.push({tile: startTile, dist: 0});
    dist[startTile.index] = 0;
    prev[startTile.index] = -2;
	
	var tile;
	var p = 0;
    while (p < 500 && queue.size() > 0) {
		p++;
        tile = queue.pop().tile;
		
		if (tile === null) break; //path not found
        if (tile.equals(destTile)) break; //path found

        var neighbors = tile.getNeighbors();
        for (var n = 0; n < neighbors.length; n++) {
			var next = neighbors[n];
			if (next.type.movementCost >= 0 && tile.canWalkTo(next)) { //ignore impassable terrain (negative cost)
				var nextDist = (next.type.movementCost + tile.type.movementCost) / 2; //might be a good idea to precompute this and update it whenever tile type is changed
				var newCost = dist[tile.index] + nextDist;

				if (prev[next.index] === -1 || newCost < dist[next.index]) {
					prev[next.index] = tile;
					dist[next.index] = newCost;
					queue.push({tile: next, dist: dist[next.index]});
				}
			}
		}
	}
    
    if (tile !== null && tile.equals(destTile)) {
        path = [];
        while (prev[tile.index] !== -2) {
            path.push(tile);
            tile = prev[tile.index];
		}
		path.push(tile);
        //path.reverse(); //just read the array backwards instead
        return path;
    } else {
        return null; //no path found
	}
};

dijkstrasAPSP = function(startTile) {
    var dist = [];
    var prev = [];
	for (var i = ico.tiles.length-1; i >= 0; i--) {
		dist[i] = -1;
		prev[i] = -1;
	}
	
	var queue = new BinaryHeap(
		function(element) { return element.dist; },
		function(element) { return element.tile.index; },
		'dist'
	);
	
	queue.push({tile: startTile, dist: 0});
    dist[startTile.index] = 0;
    prev[startTile.index] = -2;
	
	var tile;
	var p = 0;
    while (p < 500 && queue.size() > 0) {
		p++;
        tile = queue.pop().tile;
		
		if (tile === null) break; //searched all available tiles

        var neighbors = tile.getNeighbors();
        for (var n = 0; n < neighbors.length; n++) {
			var next = neighbors[n];
			if (next.type.movementCost >= 0 && tile.canWalkTo(next)) { //ignore impassable terrain (negative cost)
				var nextDist = (next.type.movementCost + tile.type.movementCost) / 2; //might be a good idea to precompute this and update it whenever tile type is changed
				var newCost = dist[tile.index] + nextDist;

				if (prev[next.index] === -1 || newCost < dist[next.index]) {
					prev[next.index] = tile;
					dist[next.index] = newCost;
					queue.push({tile: next, dist: dist[next.index]});
				}
			}
		}
	}
    
    return {dist: dist, prev: prev};
}

startTween = function (from, to, duration, currentPos, reverseAfter) {
    var self = this;
    var easing = TWEEN.Easing.Elastic.InOut;

    var tween = new TWEEN.Tween({
        L: from,
        R: -from

    })
    .to({
        L: to,
        R: -to
    }, duration * 1000)
    .easing(easing)
    .onUpdate(function () {
        currentPos.L = this.L;
        currentPos.R = this.R;
        //console.log("currentPos", currentPos);
    })
    .onComplete(function () {
        tween = null;
        if (reverseAfter > 0) {
            startTween(to, from, duration, currentPos, reverseAfter)
        } 
    }).start();
};

function seed(seed) {
    this.seed = seed;
    this.increment = 1;
    this.multiplier = 1431655765;
    this.increment = 1;
    this.mod =  32768;
    this.num = seed;
    this.count = 0;

    this.step = function(precision, min, max) {
        this.num = ((this.multiplier * this.num) + this.increment) % this.mod;
        var value = ((this.num % precision) * (max - min) / (precision - 1) + min);
        debug.log(DEBUG.WORLDGEN, "Seed count " + ++this.count + ": " + value);
        return value;
    }
};