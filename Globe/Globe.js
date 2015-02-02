pc.script.create('Globe', function (context) {
    // Creates a new TestSphere instance
    var Globe = function (entity) {
        this.entity = entity;
		this.globe;
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
            node.name = "Globe";
            
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
                    "uniform float temperature;",
                    "uniform float maxTemp;",
                    "uniform float radius;",
                    "",
                    "void main(void)",
                    "{",
                    "    float dist = length(fPosition);",
                    "    float r =  abs(fPosition.y)*(maxTemp-temperature)/maxTemp + 0.5*(radius - abs(fPosition.y))*temperature/maxTemp; //(dist - 1.5)*7.0;",
                    "    float g = dist - 1.0;",
                    "    float b = abs(fPosition.y)*(maxTemp-temperature)/maxTemp; //+ (dist - 1.5)*5.0;",
                    "    vec4 color;",
                    "    if (dist > 1.5) {",
                    "       color = vec4(r, g, b, 1.0);",
                    "    } else {",
                    "       color = vec4(0.0, 0.0, 1.0, 1.0);",
                    "    }",
                    "    gl_FragColor = color;",
                    "}"
				].join("\n")
			};

            
            // Create the shader from the definition
            this.shader = new pc.Shader(context.graphicsDevice, shaderDefinition);
        
            // Create a new material and set the shader
            this.material = new pc.Material();
            this.material.setShader(this.shader);
            
            this.material.setParameter('radius', ico.radius);
            
            
            var phong = new pc.scene.PhongMaterial(); 
			phong.shininess=0;
			phong.diffuse= new pc.Color(1.0,1.0,0.0,1.0);
			
			/// COMMENT THIS LINE TO USE THE SHADER, UNCOMMENT TO USE PHONG SHADER
			//this.material = phong;
			
            
            // create mesh instance, need node, mesh and material
            var meshInstance = new pc.scene.MeshInstance(node, plane, this.material);
            
            // create model with node and mesh instance
            var model = new pc.scene.Model();
            model.graph = node;
            model.meshInstances = [ meshInstance ];
            this.entity.addChild(node);
			context.scene.addModel(model);
			
			// get the handles
            this.globe = context.root.findByName("Globe");
			this.stringW = this.entity.script.HIDInterface.stringW;
			this.stringW.on("move", this.move, this.position, this.distance, this.speed, this.globe);
			
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
           	//this.globe.rotateLocal(0, dt * 10, 0);
            
            // Set temperature variables in shader
        	this.material.setParameter('temperature', globalTemperature);
            this.material.setParameter('maxTemp', globalTemperatureMax);
        },

		move: function(position, distance, speed, self) {
			console.log("FIRED string W in Globe: ", position, distance, speed, self);
			this.globe = context.root.findByName("Globe");
			this.globe.rotate(0, distance, 0);
		},

    };
    return Globe;
});