pc.script.attribute('maps', 'asset', [], {
    displayName: 'Height Map',
    type: 'texture'
});

pc.script.create('customShader', function (context) {
    // Creates a new CustomShader instance
    var CustomShader = function (entity) {
        this.entity = entity;

        this.time = 0;
        this.heightMap = null;
        this.shader = null;
    };


    CustomShader.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var model = this.entity.model.model;
            var gd = context.graphicsDevice;
            var time = 0;
            var shade = true;

            // Save the diffuse map from the original material before we replace it.
           // this.diffuseTexture = model.meshInstances[0].material.diffuseMap;

            // A shader definition used to create a new shader.
            var shaderDefinition = {
                attributes: {
                    aPosition: pc.SEMANTIC_POSITION
                    //aUv0: pc.SEMANTIC_TEXCOORD0
                },
                vshader: [
                    'attribute vec4 aPosition;\n' +
                    // 'attribute vec4 a_Normal;\n' +
                    //"attribute vec2 aUv0;",
                    "",
                    
                    'uniform mat4 matrix_model;\n' +
                    'uniform mat4 modelView;\n' +
                    'uniform mat4 matrix_viewProjection;\n' +
                    'uniform mat4 u_ModelViewMatrix;\n'   // Model View matrix
                    //'uniform mat4 u_NormalMatrix;\n'     // Transformation matrix of the normal
                    ,
                    "",
                    //"varying vec2 vUv0;",
                    'varying vec4 vtxWorldPosition;\n' +
                    'varying vec4 vtxEyePosition;\n' +
                    'varying vec4 vertC;\n',
                    'varying vec4 Normal;\n', 
                    "",
                    "void main(void)",
                    "{",
                    //"    vUv0 = aUv0;",
                      '  vtxWorldPosition = matrix_model * aPosition;\n' +
                        //'this.entity.rotate(0, 100, 0);\n'+
                      '  vtxEyePosition = u_ModelViewMatrix * aPosition;\n' +
                      //'  Normal = normalize(u_NormalMatrix * a_Normal);\n' +
                      
                    'if (aPosition.y > 0.3){\n' +
                         'vertC = vec4(0.0, 0.75, 0.90, 1.0);\n'+ //vec4(0, 0.5, 1, 1.0)\n' +,
                          '}\n' +
                      'else{\n'+
                         'vertC = vec4(0.0,1.0,0.5, 1.0);\n'+
                      '}\n'+
                      
                      '  gl_Position = matrix_viewProjection * aPosition;\n',
                    "}"
                ].join("\n"),
                fshader: [
                 
                    "precision " + gd.precision + " float;",
                    
                    'varying vec4 vertC;\n', //bullshit
                      
                    "void main(void)",
                    "{",
                  
                     'gl_FragColor = vertC;\n' +
                    
                    "}"
                ].join("\n")
            };

            // Create the shader from the definition
            this.shader = new pc.Shader(gd, shaderDefinition);

            // Create a new material and set the shader
            this.material = new pc.Material();
            this.material.setShader(this.shader);

            // // Set the initial parameters
            // this.material.setParameter('uTime', 0);
            // this.material.setParameter('uDiffuseMap', this.diffuseTexture);

            // Replace the material on the model with our new material
            model.meshInstances[0].material = this.material;

            // Get the "clouds" height map from the assets and set the material to use it
            // this.heightMap = context.assets.getAssetByResourceId(this.maps[0]).resource;
            // this.material.setParameter('uHeightMap', this.heightMap);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        //   time += .16;
        //     // // Update the time value in the material
        //     // this.material.setParameter('uTime', t);
        //     var model = rotate(time*10, pc.vec3(0, 1, 0));
        //     var view
        //     var modelView =  mult(view, model);

        //     gl.uniformMatrix4fv( gl.getUniformLocation( program, "modelView" ), false, flatten(modelView));
              
              //rotates the globe
            // this.entity.rotate(0, 100, 0);
            //  this.entity.translate(100,0,0);
            // console.log("rotating?");
        }
        
   

    };

    return CustomShader;
});