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
            var mesh = ico.toReturn.mesh;

            // test verts
            //ico.vertexGraph[0].setHeight(1.5);
            ico.updateReturnMesh();
            mesh = ico.toReturn.mesh;

            // create entity
            var entity = new pc.Entity();
            entity.name = "Globe";
            
            // create material
            // A shader definition used to create a new shader.
			var shaderDefinition = {
                attributes: {
                    aPosition: pc.SEMANTIC_POSITION,
					aNormal: pc.SEMANTIC_NORMAL,
                    aUv0: pc.SEMANTIC_TEXCOORD0
                },
                vshader: [
                    "attribute vec3 aPosition;",
					"attribute vec3 aNormal;",
                    "attribute vec2 aUv0;",
                    "",
                    "uniform mat4 matrix_model;",
                    "uniform mat4 matrix_viewProjection;",
                    "",
                    "varying vec3 fPosition;",
					"varying vec3 fNormal;",
                    "",
                    "uniform float radius;",
                    "uniform float time;",
                    "",
                    "void main(void)",
                    "{",
                    // Ocean sway
                    "    vec3 newPos = aPosition;",
                    "    float dist = length(newPos);",
                    "    if (dist <= radius) {",
                    "       newPos.x = newPos.x - (newPos.x/abs(newPos.x) * abs(sin(time+(radius-abs(newPos.y))+newPos.z)/100.0*(radius-abs(newPos.y))));",
                    "       newPos.z = newPos.z - (newPos.z/abs(newPos.z) * abs(sin(time+(radius-abs(newPos.y))+newPos.x)/100.0*(radius-abs(newPos.y))));",
                    "    }",
                    "    fPosition = newPos;",
                    "    fNormal = aNormal;",
                    "    gl_Position = matrix_viewProjection * matrix_model * vec4(newPos, 1.0);",
                    "}"
                ].join("\n"),
                fshader: [
                    "precision " + context.graphicsDevice.precision + " float;",
                    "",
                    "varying vec3 fPosition;",
					"varying vec3 fNormal;",
                    "",
                    "//uniform sampler2D uDiffuseMap;",
                    "//uniform sampler2D uHeightMap;",
                    "uniform float temperature;",
                    "uniform float maxTemp;",
                    "uniform float radius;",
                    "uniform vec3 sunDir;",
                    "uniform float ambient;",
                    "uniform float sunIntensity;",
                    "",
                    "void main(void)",
                    "{",
                    "    float intensity = max(dot(normalize(fNormal), normalize(sunDir)), ambient);",
                    "    float dist = length(fPosition);",
                    "    float r = abs(fPosition.y)*(maxTemp-temperature)/maxTemp + 0.5*(radius - abs(fPosition.y))*temperature/maxTemp; //(dist - 1.5)*7.0;",
                    "    float g = dist - radius*2.0/3.0;",
                    "    float b = abs(fPosition.y)*(maxTemp-temperature)/maxTemp; //+ (dist - 1.5)*5.0;",
                    "    vec4 color;",
                    // Mountain
                    "    if (dist > radius + 0.1) {",
                    "       color = intensity * sunIntensity * vec4(170.0/256.0, 80.0/256.0, 50.0/256.0, 1.0);",
                    // Land
                    "    } else if (dist > radius + 0.01) {",
                    "       color = intensity * sunIntensity * vec4(r, g, b, 1.0);",
                    // Beaches
                    "    } else if (dist > radius) {",
                    "       color = intensity * sunIntensity * vec4(245.0/256.0, 191.0/256.0, 125.0/256.0, 1.0);",
                    // Ocean
                    "    } else {",
                    "       color = intensity * sunIntensity * vec4(54.0/256.0, 152.0/256.0, 167.0/256.0, 1.0);",
                    "    }",
                    // Snow
                    //"    if ((temperature * abs(fPosition.y) / maxTemp) > 0.7) {",
                    //"       color = intensity * sunIntensity * vec4(230.0/256.0, 230.0/256.0, 230.0/256.0, 1.0);",
                    //"    }",
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
            
            this.material.setParameter('time', globalTime);

            this.material.setParameter('ambient', 0.2);
            this.material.setParameter('sunIntensity', 1.0);

            this.material.setParameter('sunDir', [shaderSun.localRotation.x, shaderSun.localRotation.y, shaderSun.localRotation.z]);
            
            
            var phong = new pc.scene.PhongMaterial(); 
			phong.shininess=0;
			phong.diffuse= new pc.Color(1.0,1.0,0.0,1.0);
			
			/// COMMENT THIS LINE TO USE THE SHADER, UNCOMMENT TO USE PHONG SHADER
			//this.material = phong;
            
            // create mesh instance, need node, mesh and material
            this.meshInstance = new pc.scene.MeshInstance(entity, mesh, this.material);
            //console.log(this.meshInstance);
            
            // create model with node and mesh instance
            var model = new pc.scene.Model();
            //model.graph = node;
            model.meshInstances = [ this.meshInstance ];
			
			//this.globe.model = model;
            this.entity.addChild(entity);
			context.scene.addModel(model);			
			
			// get the handles
			this.globe = context.root.findByName("Globe");
			//this.stringW = this.entity.script.HIDInterface.stringW;
			//this.stringW.on("moved", this.move, this.position, this.distance, this.speed);
			//this.stringW.on("moving", this.moving, this.position, this.distance, this.speed);

			// 
			// add rigid body
			context.systems.rigidbody.addComponent(this.globe, {
			    type: 'dynamic'
			  });
			this.globe.rigidbody.syncEntityToBody();
			this.globe.rigidbody.syncEntityToBody();
			this.globe.rigidbody.linearVelocity = new pc.Vec3((Math.random() - 0.5) * 10, 7, -30);
			this.globe.rigidbody.angularVelocity = pc.Vec3.ZERO;
        },

        moveContinents: function (direction, distance, speed) {

        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            if (ico.updateFlag == true) {
                this.updateMesh();
            }
            //ico.toReturn.mesh;

            if (ico.faultNumMove > 0) {
                ico.moveFaults(ico.faultIncrement);
            }

            // Set temperature variables in shader
        	this.material.setParameter('temperature', globalTemperature);
            this.material.setParameter('maxTemp', globalTemperatureMax);
            
            this.material.setParameter('time', globalTime);

            // Set lighting in shader
            this.material.setParameter('sunDir', [shaderSun.localRotation.x, shaderSun.localRotation.y, shaderSun.localRotation.z]);
            //this.material.setParameter('sunDir', [sun.rotation.x, sun.rotation.y, sun.rotation.z]);
            //this.material.setParameter('sunDir', [(sun.rotation.x + 1)/2, (sun.rotation.x + 1)/2, (sun.rotation.x + 1)/2]);
            //var angle = sun.rotation.getEulerAngles();

            //this.material.setParameter('sunDir', [angle.x/180, angle.y/180, angle.z/180]);
            //console.log(angle.x, angle.y, angle.z);
            //console.log(sun.rotation);
            //this.model.meshInstances[0].
        },

        updateMesh: function () {
            //ico._recalculateMesh();
            ico.updateReturnMesh();
            this.meshInstance.mesh = ico.toReturn.mesh;
            //console.log("Updating Globe Mesh");
        }
		/*
		move: function(position, distance, speed) {
			console.log("FIRED string W in Globe: ", position, distance, speed);
			this.globe = context.root.findByName("Globe");
			//this.globe.rotate(0, distance, 0);
		},
		moving: function(position, distance, speed) {
			console.log("FIRED string W in Globe instantly: ", position, distance, speed);
			this.globe = context.root.findByName("Globe");
			this.globe.rotate(0, position, 0);
		},
		*/
    };
    return Globe;
});