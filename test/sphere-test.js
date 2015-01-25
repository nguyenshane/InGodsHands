///
// Description: This is a test to create a sphere
// More info at http://developer.playcanvas.com/user-manual/scripting/anatomy/
///
pc.script.create('sphere-test', function (context) {
    // Creates a new instance
    var SphereTest = function (entity) {
        this.entity = entity;
    };

    SphereTest.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var sphere = this.entity.model.model.meshInstances[0].mesh;

            //var testVertex = sphere.vertexBuffer[0] = 30;

            sphere.vertexBuffer.usage = pc.gfx.BUFFER_DYNAMIC;

            console.log(sphere);
            console.log(sphere.vertexBuffer.getUsage());
            console.log(pc.gfx.BUFFER_DYNAMIC);
            console.log(sphere.vertexBuffer.getFormat());
        
            var indexBuffer = sphere.indexBuffer[0].storage;
        
            var vertexBuffer = sphere.vertexBuffer.storage;
        
            var indexBufferView = new Uint16Array(indexBuffer);
        
            var vertexBufferView = new Float32Array(vertexBuffer);

            var vertexIndexHolder = [];

            var newVertexBuffer;

            var newVertexBufferView;

            for (var i = 0; i < vertexBufferView.length; i += 3) {
                var j;
                for (j = 0; j < vertexIndexHolder.length; ++j) {
                    if (vertexIndexHolder[j][0] == vertexBufferView[i] && vertexIndexHolder[j][1] == vertexBufferView[i+1] && vertexIndexHolder[j][2] == vertexBufferView[i+2]) {
                        vertexIndexHolder[j][vertexIndexHolder.length] = i;
                        indexBufferView[i * 3] = j;
                        break;
                    }
                }
                if (j >= vertexIndexHolder.length) {
                    vertexIndexHolder[j] = [vertexBufferView[i], vertexBufferView[i+1], vertexBufferView[i+2], i];
                    indexBufferView[i * 3] = j;
                }
            }

            newVertexBuffer = new ArrayBuffer(vertexIndexHolder.length * 3 * 4);

            newVertexBufferView = new Float32Array(newVertexBuffer);

            for (var i = 0; i < vertexIndexHolder.length; ++i) {
                newVertexBufferView[i * 3] = vertexIndexHolder[i][0];
                newVertexBufferView[i * 3 + 1] = vertexIndexHolder[i][1];
                newVertexBufferView[i * 3 + 2] = vertexIndexHolder[i][2];
            }

            vertexBuffer = newVertexBuffer;

            vertexBufferView = new Float32Array(vertexBuffer);



            for (var i = 0; i < vertexBufferView.length/3; ++i) {
                console.log(i + ": (" + vertexBufferView[i * 3] + ", " + vertexBufferView[i * 3 + 1] + ", " + vertexBufferView[i * 3 + 2] + ")");
            }

                
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return SphereTest;
});