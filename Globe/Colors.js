pc.script.attribute("newMaterial", "asset", [], {type: "material"});

pc.script.create('change_material', function (context) {
    var ChangeMaterial = function (entity) {
        this.entity = entity;
    };

    ChangeMaterial.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            this.humanOneMat = context.assets.find("Human1").resource;
            this.humanTwoMat = context.assets.find("Human2").resource;
            this.humanThreeMat = context.assets.find("Human3").resource;
            this.humanFourMat = context.assets.find("Human4").resource;
            this.humanFiveMat = context.assets.find("Human5").resource;

            //console.log(this.entity.getParent().name);
            
            var model = this.entity.model.model;
            if (this.entity.getParent().name == "Humans0"){
            	model.meshInstances[0].material = this.humanOneMat;
            }
            if (this.entity.getParent().name == "Humans1"){
            	model.meshInstances[0].material = this.humanTwoMat;
            }
            if (this.entity.getParent().name == "Humans2"){
            	model.meshInstances[0].material = this.humanThreeMat;
            }
            if (this.entity.getParent().name == "Humans3"){
            	model.meshInstances[0].material = this.humanFourMat;
            }
            if (this.entity.getParent().name == "Humans4"){
            	model.meshInstances[0].material = this.humanFiveMat;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
            // if (context.keyboard.wasPressed(pc.input.KEY_SPACE)) {
            //     var model = this.entity.model.model;

            //     if (model.meshInstances[0].material === this.redMaterial) {
            //         model.meshInstances[0].material = this.blueMaterial;
            //     } else {
            //         model.meshInstances[0].material = this.redMaterial;
            //     }

            // }
        }
    };

    return ChangeMaterial;
});