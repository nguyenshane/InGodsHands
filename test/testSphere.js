pc.createmySphere = function (device, opts) {
    // Check the supplied options and provide defaults for unspecified ones
    var radius = opts && opts.radius !== undefined ? opts.radius : 0.5;
    var latitudeBands = opts && opts.latitudeBands !== undefined ? opts.latitudeBands : 4;
    var longitudeBands = opts && opts.longitudeBands !== undefined ? opts.longitudeBands :4;

    // Variable declarations
    var lon, lat;
    var theta, sinTheta, cosTheta, phi, sinPhi, cosPhi;
    var first, second;
    var x, y, z, u, v;
    var positions = [];
    var normals = [];
    var uvs = [];
    var indices = [];

    for (lat = 0; lat <= latitudeBands; lat++) {
        theta = lat * Math.PI / latitudeBands;
        sinTheta = Math.sin(theta);
        cosTheta = Math.cos(theta);

        for (lon = 0; lon <= longitudeBands; lon++) {
            // Sweep the sphere from the positive Z axis to match a 3DS Max sphere
            phi = lon * 2 * Math.PI / longitudeBands - Math.PI / 2.0;
            sinPhi = Math.sin(phi);
            cosPhi = Math.cos(phi);

            x = cosPhi * sinTheta;
            y = cosTheta;
            z = sinPhi * sinTheta;
            u = 1.0 - lon / longitudeBands;
            v = 1.0 - lat / latitudeBands;

            positions.push(x * radius, y * radius, z * radius);
            normals.push(x, y, z);
            uvs.push(u, v);
        }
    }
    
    for (lat = 0; lat < latitudeBands; ++lat) {
        for (lon = 0; lon < longitudeBands; ++lon) {
            first  = (lat * (longitudeBands+1)) + lon;
            second = first + longitudeBands + 1;

            indices.push(first + 1, second, first);
            indices.push(first + 1, second + 1, second);
        }
    }

    var options = {
        normals:   normals,
        uvs:       uvs,
        indices:   indices
    };

    if (pc.precalculatedTangents) {
        options.tangents = pc.calculateTangents(positions, normals, uvs, indices);
    }
    var mesh = pc.createMesh(device, positions, options);
    
    var toReturn = {
        mesh : mesh,
        options: options,
        positions: positions
    };

    return toReturn;
};


pc.script.create('testSphereShane', function (context) {
    // Creates a new TestSphere instance
    var TestSphere = function (entity) {
        this.entity = entity;
    };

    TestSphere.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var sphere = pc.createmySphere(context.graphicsDevice, {segments:"4"});
            
            var plane = sphere.mesh;
            console.log(sphere.options.normals);
            
            console.log(sphere.positions[100] = 1);
            plane = pc.createMesh(context.graphicsDevice, sphere.positions, sphere.options);
            var node = new pc.scene.GraphNode();
            var material = new pc.scene.PhongMaterial();
            var meshInstance = new pc.scene.MeshInstance(node, plane, material);
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