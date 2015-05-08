// pc.script.attribute("newMaterial", "asset", [], {type: "material"});

// pc.script.create('change_material', function (context) {
//     var ChangeMaterial = function (entity) {
//         this.entity = entity;
//     };

//     ChangeMaterial.prototype = {
//         // Called once after all resources are loaded and before the first update
//         initialize: function () {
//             this.redMaterial = this.entity.model.model.meshInstances[0].material;
//             this.blueMaterial = context.assets.getAssetByResourceId(1837124).resource;
//         },

//         // Called every frame, dt is time in seconds since last update
//         update: function (dt) {
//             if (context.keyboard.wasPressed(pc.input.KEY_SPACE)) {
//                 var model = this.entity.model.model;

//                 if (model.meshInstances[0].material === this.redMaterial) {
//                     model.meshInstances[0].material = this.blueMaterial;
//                 } else {
//                     model.meshInstances[0].material = this.redMaterial;
//                 }

//             }
//         }
//     };

//     return ChangeMaterial;
// });