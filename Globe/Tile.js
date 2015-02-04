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

aVec = new pc.alVec3(1,1,1);

function Tile(icosphere, vertexa, vertexb, vertexc){
    'use strict;'
    this.vertexIndices = [];
    this.neighborIndices = [];
    this.colors = [];
    
    var normalIndex, hasHuman, divided;
    this.normal;
    this.center;
    this.neighbora;
    this.neighborb;
    this.neighborc;
    
    this.temperature;

    this.isOcean = (Math.random()>0.01) ? true : false;
    handle = icosphere;
    this.divided = false;
    this.hasHuman = false;
    
    this.vertexIndices[0] = vertexa;
    this.vertexIndices[1] = vertexb;
    this.vertexIndices[2] = vertexc;
    
    handle.indices.push(vertexa);
    handle.indices.push(vertexb);
    handle.indices.push(vertexc);

    this.getTemperature = function(){
        return (1.0 - Math.abs(this.center.y/ico.radius))*globalTemperature;
    };
    
   
    this.calculateNormal = function(){
        var vectora = handle._getUnbufferedVertex(this.vertexIndices[0]);
        var vectorb = handle._getUnbufferedVertex(this.vertexIndices[1]);
        var vectorc = handle._getUnbufferedVertex(this.vertexIndices[2]);
        
        vectorb.sub(vectora);
		vectorc.sub(vectora);
        console.log("here");
		this.normal = new pc.alVec3().cross(vectorb,vectorc);
		
		this.normal.normalize();
    };
    
	// TODO: this should be replaced by a repeller distribution
    this.testExtrude = function() {
        // Test Oceans
		if (!this.neighbora.isOcean || !this.neighborb.isOcean || !this.neighborc.isOcean) {
		    
			this.isOcean = false;
			
			console.log("Extruding");
			
			if (!this.neighborb.isOcean && !this.neighborc.isOcean) {
				handle.setVertexMagnitude(this.vertexIndices[0], parseFloat(Math.random()/10 + handle.radius));
			}
			if (!this.neighbora.isOcean && !this.neighborc.isOcean)
				handle.setVertexMagnitude(this.vertexIndices[1], parseFloat(Math.random()/10 + handle.radius));
			if (!this.neighbora.isOcean && !this.neighborb.isOcean)
				handle.setVertexMagnitude(this.vertexIndices[2], parseFloat(Math.random()/10 + handle.radius));

		this.neighbora.isOcean = false;
		this.neighborb.isOcean = false;
		this.neighborc.isOcean = false;
		}
    };
    
    this.setNeighbors = function(a,b,c){
        this.neighbora = handle.tiles[a];
        this.neighborb = handle.tiles[b];
        this.neighborc = handle.tiles[c];
        this.neighborIndices[0] = a;
		this.neighborIndices[1] = b;
		this.neighborIndices[2] = c;
    };
    
    this.setNeighbor = function(neighbor, index){
        if (neighbor === 0) {
			this.neighbora = handle.tiles[index];
		} else if (neighbor == 1) {
			this.neighborb = handle.tiles[index];
		} else if (neighbor == 2) {
			this.neighborc = handle.tiles[index];
		}
    };
    
    this.getVertexIndex = function(vertex){        
        if (vertex.x == handle.vertices[this.vertexIndices[0] * 3] 
            && vertex.y == handle.vertices[this.vertexIndices[0] * 3 + 1]	
            && vertex.z == handle.vertices[this.vertexIndices[0] * 3 + 2]) {
			return parseInt(this.vertexIndices[0]);
		} else if (vertex.x == handle.vertices[this.vertexIndices[1] * 3]
				&& vertex.y == handle.vertices[this.vertexIndices[1] * 3 + 1]
				&& vertex.z == handle.vertices[this.vertexIndices[1] * 3 + 2]) {
			return parseInt(this.vertexIndices[1]);
		} else if (vertex.x == handle.vertices[this.vertexIndices[2] * 3]
				&& vertex.y == handle.vertices[this.vertexIndices[2] * 3 + 1]
				&& vertex.z == handle.vertices[this.vertexIndices[2] * 3 + 2]) {
			return parseInt(this.vertexIndices[2]);
		}
		return -1;
        
    };
    
    this.getMidpoint = function(verta, vertb){
        midpoint = new pc.alVec3(handle.vertices[this.vertexIndices[verta] * 3], handle.vertices[this.vertexIndices[verta] * 3 + 1], handle.vertices[this.vertexIndices[verta] * 3 + 2]);
		vert2 = new pc.alVec3(handle.vertices[this.vertexIndices[vertb] * 3], handle.vertices[this.vertexIndices[vertb] * 3 + 1], handle.vertices[this.vertexIndices[vertb] * 3 + 2]);
		midpoint.add(vert2);
		midpoint.scale(0.5);
		return midpoint;
    };
    
    
    this.calculateCenter = function(){
        var center = this.getMidpoint(0,1);
        vert = new pc.Vec3(handle.vertices[this.vertexIndices[2] * 3], handle.vertices[this.vertexIndices[2] * 3 + 1], handle.vertices[this.vertexIndices[2] * 3 + 2]);
        center.add(vert);
        center.scale(0.5);
        this.center = center;
        return center;
    };
    
    this.toString = function(){
        console.log ("vertexIndices, neighborIndices:",this.vertexIndices, this.neighborIndices);
    };
}