pc.script.create('Globe', function (context) {
    // Creates a new TestSphere instance
    var Globe = function (entity) {
        this.entity = entity;
    };

    Globe.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            // create mesh
            ico = new IcoSphere(context.graphicsDevice, 1.5, 4);
            
            
           
            //ico.setVertexMagnitude(1,1.5);
            //ico.setVertexMagnitude(3,1.5);
            //ico.setVertexMagnitude(5,1.5);
            console.log(ico);
            
            var plane = ico.toReturn.mesh;
            /* console.log(ico.positions[1]=1);
             console.log(ico.positions[3]=1);
             console.log(ico.positions[16]=1);
             console.log(ico.positions[10]=1);*/
            
            //console.log(sphere.positions[100] = 1);
            //var plane = pc.createMesh(context.graphicsDevice, ico.vertices, ico.options);
            
            
            // create node
            var node = new pc.scene.GraphNode();
            node.name = "myWorld";
            
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
                    "varying vec3 fPosition;",
                    "",
                    "void main(void)",
                    "{",
                    "    fPosition = aPosition;",
                    "    gl_Position = matrix_viewProjection * matrix_model * vec4(aPosition, 1.0);",
                    "}"
                ].join("\n"),
                fshader: [
                    "precision " + context.graphicsDevice.precision + " float;",
                    "",
                    "varying vec3 fPosition;",
                    "",
                    "//uniform sampler2D uDiffuseMap;",
                    "//uniform sampler2D uHeightMap;",
                    "//uniform float uTime;",
                    "",
                    "void main(void)",
                    "{",
                    "    float dist = length(fPosition);",
                    "    float r = dist - 2.0;",
                    "    float g = dist - 1.5;",
                    "    vec4 color = vec4(r, g, 1.0, 1.0);",
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
            //this.material = new pc.scene.PhongMaterial(); 
            
            // create mesh instance, need node, mesh and material
            var meshInstance = new pc.scene.MeshInstance(node, plane, this.material);
            
            // create model with node and mesh instance
            var model = new pc.scene.Model();
            model.graph = node;
            model.meshInstances = [ meshInstance ];
            this.entity.addChild(node);
            var myModel = context.root.findByName("myWorld");
            console.log(myModel);
            context.scene.addModel(model);
            //myModel.addModel(model);
            this.model = model;
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
           context.root.findByName("myWorld").rotateLocal(0, dt * 10, 0);
            
        }
    };

    return Globe;
});