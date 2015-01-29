function IcoSphere(device, radius, subdivisions) {

    // golden ratio, phi
    var x = 1;
    var y = 0.5 * (1 + Math.sqrt(5));

    var l = radius / Math.sqrt(x * x + y * y);

    x *= l;
    y *= l;

    var vertices = [-x,  y, 0,
                     x,  y, 0,
                    -x, -y, 0,
                     x, -y, 0,

                     0, -x,  y,
                     0,  x,  y,
                     0, -x, -y,
                     0,  x, -y,

                     y,  0, -x,
                     y,  0,  x,
                    -y,  0, -x,
                    -y,  0,  x];

    var normals = [];

    for (var i = 0; i < vertices.length; i++) {
        normals.push(vertices[i] / radius);
    }

    var indices = [
         0, 11,  5,
         0,  5,  1,
         0,  1,  7,
         0,  7, 10,
         0, 10, 11,

         1,  5,  9,
         5, 11,  4,
        11, 10,  2,
        10,  7,  6,
         7,  1,  8,

         3,  9,  4,
         3,  4,  2,
         3,  2,  6,
         3,  6,  8,
         3,  8,  9,

         4,  9,  5,
         2,  4, 11,
         6,  2, 10,
         8,  6,  7,
         9,  8,  1
    ];

    subdivisions = (subdivisions || 1);

    for (var s = 1; s < subdivisions; s++) {
        var nindices = [];

        var split = {};

        // for each face
        for (var i = 0; i < indices.length; i += 3) {
            var i0 = this._splitEdge(vertices, normals, indices[i], indices[i + 1], split, radius);
            var i1 = this._splitEdge(vertices, normals, indices[i + 1], indices[i + 2], split, radius);
            var i2 = this._splitEdge(vertices, normals, indices[i + 2], indices[i], split, radius);

            nindices.push(indices[i], i0, i2,
                          i0, indices[i + 1], i1,
                          i0, i1, i2,
                          i2, i1, indices[i + 2]);
        }

        indices = nindices;
    }
    
    var options = {
        normals:   normals,
        indices:   indices
    };


    var mesh = pc.createMesh(device, vertices, options);
    
    var toReturn = {
        mesh : mesh,
        options: options,
        positions: vertices
    };
    
    return toReturn;
    //this.renderer = new RenderGroup(ctx, new Geometry(ctx, vertices, normals), indices);
}

//IcoSphere.prototype.constructor = IcoSphere;

IcoSphere.prototype._splitEdge = function(vertices, normals, i1, i2, split, radius) {
    /// Helper functions
    this.addv3 = function(a, b) {
        var out = [0,0,0];
        
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        
        return out;
    };
    
    this.lengthv3 = function (a) {
        var x = a[0],
            y = a[1],
            z = a[2];
        return Math.sqrt(x*x + y*y + z*z);
    };
    
    this.normalizev3 = function(a) {
         var out = [0,0,0];
        
        //console.log(out,a)
        var x = a[0],
            y = a[1],
            z = a[2];
        var len = x*x + y*y + z*z;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
        }
        return out;
    };
    
    ///
    
    var splitKey;

    if (i1 < i2) {
        splitKey = i1 + '-' + i2;
    } else {
        splitKey = i2 + '-' + i1;
    }

    var pt = split[splitKey];

    if (pt) {
        return pt;
    }

    var i = vertices.length / 3;
    split[splitKey] = i;

    var i1s = i1 * 3;
    var i1e = i1s + 3;
    var i2s = i2 * 3;
    var i2e = i2s + 3;
    
    
    var m = this.addv3(vertices.slice(i1s, i1e), vertices.slice(i2s, i2e));
    
    var l = radius / this.lengthv3(m);

    vertices.push(m[0] * l, m[1] * l, m[2] * l);

    var n = this.normalizev3(this.addv3(normals.slice(i1s, i1e), normals.slice(i2s, i2e)));
    normals.push(n[0], n[1], n[2]);

    return i;
}

pc.script.create('testSphereShane', function (context) {
    // Creates a new TestSphere instance
    var TestSphere = function (entity) {
        this.entity = entity;
    };

    TestSphere.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // create mesh
            var ico = new IcoSphere(context.graphicsDevice, 1, 2)
            
            var plane = ico.mesh;
            console.log(ico);
            
            //console.log(sphere.positions);
            
            //console.log(sphere.positions[100] = 1);
            plane = pc.createMesh(context.graphicsDevice, ico.positions, ico.options);
            
            
            // create node
            var node = new pc.scene.GraphNode();
            
            // create material
            //var material = new pc.scene.PhongMaterial();
            
            // A shader definition used to create a new shader.
            var shaderDefinition = {
                attributes: {
                    aPosition: pc.SEMANTIC_POSITION,
                    aUv0: pc.SEMANTIC_TEXCOORD0
                },
                vshader: [
                    "attribute vec3 aPosition;",
                    "attribute vec2 aUv0;",
                    "",
                    "uniform mat4 matrix_model;",
                    "uniform mat4 matrix_viewProjection;",
                    "",
                    "varying vec2 vUv0;",
                    "",
                    "void main(void)",
                    "{",
                    "    vUv0 = aUv0;",
                    "    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);",
                    "}"
                ].join("\n"),
                fshader: [
                    "precision " + context.graphicsDevice.precision + " float;",
                    "",
                    "varying vec2 vUv0;",
                    "",
                    "//uniform sampler2D uDiffuseMap;",
                    "//uniform sampler2D uHeightMap;",
                    "//uniform float uTime;",
                    "",
                    "void main(void)",
                    "{",
                    "    vec4 color = vec4(0, 1, 1, 1.0);",
                    "    gl_FragColor = color;",
                    "}"
                ].join("\n")
            };

            
            // Create the shader from the definition
            this.shader = new pc.Shader(context.graphicsDevice, shaderDefinition);
        
            // Create a new material and set the shader
            this.material = new pc.Material();
            this.material.setShader(this.shader);
            
            /// COMMENT THIS LINE TO USE THE SHADER, UNCOMMENT TO USE PHONG SHADER
            this.material = new pc.scene.PhongMaterial(); 
            
            // create mesh instance, need node, mesh and material
            var meshInstance = new pc.scene.MeshInstance(node, plane, this.material);
            
            // create model with node and mesh instance
            var model = new pc.scene.Model();
            model.graph = node;
            model.meshInstances = [ meshInstance ];
            this.entity.addChild(node);
            context.scene.addModel(model);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return TestSphere;
});