pc.script.create( "designer_camera", function (context) {
// shared vectors
var x = new pc.Vec3();
var y = new pc.Vec3();
var z = new pc.Vec3();
var offset = new pc.Vec3();

// touch constants 
var PAN_TRIGGER_DISTANCE = 6;
var SCALE_TRIGGER_DISTANCE = 80;
var ROTATION_TRIGGER_DISTANCE = 1;
var TOUCH_ZOOM_FACTOR = 0.1;
var TOUCH_ROTATION_FACTOR = 0.1;

var DesignerCamera = function (entity) {
    this.entity = entity;

    this.mouse = new pc.input.Mouse();

    this.mouse.attach(context.graphicsDevice.canvas);

    this.mouse.bind(pc.input.EVENT_MOUSEMOVE, this.onMouseMove.bind(this));
    this.mouse.bind(pc.input.EVENT_MOUSEWHEEL, this.onMouseWheel.bind(this));

    // init touch controls if they are available
    this.touch = context.touch;
    if (this.touch) {
        this.touch.bind('touchstart', this.onTouchStart.bind(this));
        this.touch.bind('touchmove', this.onTouch.bind(this));
        this.touch.bind('touchend', this.onTouchEnd.bind(this));

        this.initialCenter = [0,0]; // the center of all the touches when a two-finger touch starts
        this.previousCenter = [0,0]; // the center of all the touches in the previous frame
        this.previousTouch = null; // the one-finger touch in the previous frame
    }

    this.initFocus();

    this.transition = {
        eyeStart: new pc.Vec3(),
        eyeEnd: new pc.Vec3(),
        focusStart: new pc.Vec3(),
        focusEnd: new pc.Vec3(),
        startTime: 0,
        duration: 0.5,
        active: false
    };

    this.frameScale = 10; // This is used to scale dollying to prevent zooming past the object that is framed        
};

DesignerCamera.prototype.initFocus = function () {
    // Global var context.designer.cameraFocus is used to store camera focus between script instances
    // A new script instance is created whenever we switch between cameras.
    if (!context.designer.cameraFocus) {
        context.designer.cameraFocus = new pc.Vec3();
    }

    this.focus = context.designer.cameraFocus;
};

DesignerCamera.prototype.destroy = function () {
    this.mouse.detach();
};

DesignerCamera.prototype.frameSelection = function () {
    var selection = context.designer.selection[0];
    if (!selection) {
        return;
    }

    var model;
    if (selection.model) {
        model = selection.model.model;
    }

    var aabb = new pc.shape.Aabb();
    if (model) {
        var meshInstances = model.meshInstances;
        if (meshInstances.length > 0) {
            meshInstances[0].syncAabb()
            aabb.copy(meshInstances[0].aabb);
            for (var i = 1; i < meshInstances.length; i++) {
                meshInstances[i].syncAabb()
                aabb.add(meshInstances[i].aabb);
            }
        }
    } else {
        aabb = new pc.shape.Aabb(selection.getPosition(), new pc.Vec3(5, 5, 5));
    }

    var transition = this.transition;
    transition.focusStart = this.focus.clone();
    transition.focusEnd = aabb.center;
    transition.eyeStart = this.entity.getPosition();

    var vec = new pc.Vec3();
    vec.sub2(transition.focusEnd, transition.focusStart);
    transition.eyeEnd.add2(transition.eyeStart, vec);

    var averageExtent = (aabb.halfExtents.x + aabb.halfExtents.y + aabb.halfExtents.z) / 3;
    var offset = averageExtent / Math.tan(0.5 * this.entity.camera.fov * Math.PI / 180.0);

    var camWtm = this.entity.getWorldTransform();
    var lookDir = camWtm.getZ();
    lookDir.normalize().scale(offset * 1.5);
    transition.eyeEnd.add2(transition.focusEnd, lookDir);

    transition.startTime = pc.time.now();
    transition.active = true;

    this.frameScale = averageExtent * 50;

    // The next line may seem redundant. However, we're forcing the script's render
    // function to be fired, thereby allowing the next animation step to be scheduled.
    pc.designer.api.setCameraTransformComponent(this.entity, 'position', transition.eyeStart, false);
};

DesignerCamera.prototype.pan = function(movement) {
    var ltm = this.entity.getLocalTransform();
    var position = this.entity.getLocalPosition();

    ltm.getX(x);
    ltm.getY(y);

    offset.sub2(this.focus, position);

    var factor = offset.length() * 0.0022;
    var factorX = pc.math.clamp(movement[0], -100.0, 100.0) * factor;
    var factorY = pc.math.clamp(movement[1], -100.0, 100.0) * factor;

    y.scale(factorY);
    x.scale(-factorX);

    position.add(y).add(x);
    this.focus.add(x).add(y);

    this.entity.setLocalPosition(position);

    var undoable = false; // Designer camera updates shouldn't be undoable

    pc.designer.api.setCameraTransformComponent(this.entity, 'position', position, undoable);
}

/**
* @function
* @name DesignerCamera#dolly
* @description Dolly the camera along the z-axis of the camera's local transform.
* The dolly amount is scaled to be a reasonable value for each turn of the mouse wheel and
* it scales to prevent dollying past the focus if there is one.
* @param {Number} distance Normalized distance to dolly between -1 and 1.
*/
DesignerCamera.prototype.dolly = function (distance) {
    // Dolly along the Z axis of the camera's local transform
    var factor = distance * 2.5;

    var ltm = this.entity.getLocalTransform();

    var position = this.entity.getLocalPosition();
    ltm.getZ(z);

    var dot = 0;

    offset.sub2(this.focus, position);
    var dis = offset.length();
    factor = factor * Math.min(dis/this.frameScale, 5);

    z.scale(-factor);
    position.add(z);

    this.entity.setLocalPosition(position);

    var undoable = false; // Designer camera updates shouldn't be undoable

    pc.designer.api.setCameraTransformComponent(this.entity, 'position', position, undoable);
}

DesignerCamera.prototype.orbit = function (rotation) {
    var ltm = this.entity.getLocalTransform();

    var eyePos = new pc.Vec3(ltm.data[12], ltm.data[13], ltm.data[14]);
    var targetToEye = new pc.Vec3();
    targetToEye.sub2(eyePos, this.focus);

    var xaxis = ltm.getX();
    var rotMat1 = new pc.Mat4().setFromAxisAngle(xaxis, -rotation[1]);
    var rotMat2 = new pc.Mat4().setFromAxisAngle(pc.Vec3.UP, -rotation[0]);

    var tempMat1 = rotMat2.mul(rotMat1);     
    tempMat1.transformPoint(targetToEye, targetToEye);

    eyePos.add2(this.focus, targetToEye);

    tempMat1.mul(ltm);

    var undoable = false; // Designer camera updates shouldn't be undoable
    var angles = tempMat1.getEulerAngles();

    pc.designer.api.setCameraTransformComponent(this.entity, 'position', eyePos, undoable);
    pc.designer.api.setCameraTransformComponent(this.entity, 'rotation', angles, undoable);
};

DesignerCamera.prototype.updateViewWindow = function (delta) {
    var newHeight = this.entity.camera.orthoHeight - delta;
    if (newHeight < 1) {
        newHeight = 1;
    }

    pc.designer.api.setCameraViewWindowSize(this.entity, newHeight);
};

DesignerCamera.prototype.onMouseWheel = function (event) {
    switch (this.entity.camera.projection) {
        case pc.scene.Projection.ORTHOGRAPHIC:
            var delta = event.wheel * 10;
            this.updateViewWindow(delta);
            break;
        case pc.scene.Projection.PERSPECTIVE:
            this.dolly(event.wheel);
            break;
        default:
            break;
    }
};

DesignerCamera.prototype.onMouseMove = function (event) {
    if (event.buttons[pc.input.MOUSEBUTTON_LEFT] && event.buttons[pc.input.MOUSEBUTTON_MIDDLE]) {
        var distance = event.dy;
        this.dolly(distance);
    }
    else if ((event.altKey && event.buttons[pc.input.MOUSEBUTTON_MIDDLE]) || 
            (event.altKey && (event.metaKey || event.shiftKey) && event.buttons[pc.input.MOUSEBUTTON_LEFT])) {
        var movement = [event.dx, event.dy];
        this.pan(movement);
    }    
    else if (event.altKey && event.buttons[pc.input.MOUSEBUTTON_LEFT] && this.entity.camera.projection !== pc.scene.Projection.ORTHOGRAPHIC) {
        var rotation = [pc.math.RAD_TO_DEG*event.dx/300.0, pc.math.RAD_TO_DEG*event.dy/300.0];
        this.orbit(rotation);
    }
};

DesignerCamera.prototype.onTouchStart = function (event) {
    if (event.touches.length === 2) {
        this.initialFingerDistance = this.calculateDistanceBetweenTouches(event.touches[0], event.touches[1]);
        this.previousFingerDistance = 0;
        this.calculateCenterOfTouches(event.touches[0], event.touches[1], this.initialCenter);
        this.copyCenter(this.initialCenter, this.previousCenter);
        this.isZooming = false;
        this.isPanning = false;
    } else if (event.touches.length === 1) {
        this.previousTouch = event.touches[0];
    }
};

DesignerCamera.prototype.calculateDistanceBetweenTouches = function (touch1, touch2) {
    var x = touch1.x - touch2.x;
    var y = touch1.y - touch2.y;
    return Math.sqrt(x*x + y*y);
};

DesignerCamera.prototype.calculateCenterOfTouches = function (touch1, touch2, result) {
    result[0] = (touch1.x + touch2.x)/2;
    result[1] = (touch1.y + touch2.y)/2;
};

DesignerCamera.prototype.calculateCenterDistance = function (center1, center2) {
    var x = center1[0] - center2[0];
    var y = center1[1] - center2[1];
    return Math.sqrt(x*x + y*y);
};

DesignerCamera.prototype.copyCenter = function (from, to) {
    to[0] = from[0];
    to[1] = from[1];
};

DesignerCamera.prototype.onTouch = function (event) { 
    if (event.touches.length == 2) {
        this.handleTwoFingerTouch(event);
    } else if (event.touches.length == 1) {
        this.handleOneFingerTouch(event);
    }
};

DesignerCamera.prototype.handleOneFingerTouch = function (event) {
    var dx = 0; dy = 0;
    var fingerDistance = 0;
    var touch = event.touches[0];

    fingerDistance = this.calculateDistanceBetweenTouches(touch, this.previousTouch);

    if (fingerDistance > ROTATION_TRIGGER_DISTANCE) {

        // calculate the difference between this touch and the previous
        dx = touch.x - this.previousTouch.x;
        dy = touch.y - this.previousTouch.y;

        this.orbit([dx*TOUCH_ROTATION_FACTOR, dy*TOUCH_ROTATION_FACTOR]);
    }

    this.previousTouch = touch;

    event.event.preventDefault();
    event.event.stopPropagation();
};

DesignerCamera.prototype.handleTwoFingerTouch = function (event) {
    var i;
    var dx = 0; dy = 0, ds = 0;
    var touch1 = event.touches[0];
    var touch2 = event.touches[1];

    // calculate center point of all touches for pan
    var center = []; 
    this.calculateCenterOfTouches(touch1, touch2, center);
    var centerDistance = this.calculateCenterDistance(center, this.initialCenter);

    // calculate finger distance for pinch zoom
    var fingerDistance = this.calculateDistanceBetweenTouches(event.touches[0], event.touches[1]);
    var fingerDistanceSinceStart = Math.abs(fingerDistance - this.initialFingerDistance);

    // if we are already zooming or if the fingers have separated enough since the beginning of the touch event
    // then scale
    if (this.isZooming || fingerDistanceSinceStart > SCALE_TRIGGER_DISTANCE) {
        ds = fingerDistance - this.previousFingerDistance;     
        this.isZooming = true;

        switch (this.entity.camera.projection) {
            case pc.scene.Projection.ORTHOGRAPHIC:
                var delta = ds*TOUCH_ZOOM_FACTOR * 10;
                this.updateViewWindow(delta);
                break;
            case pc.scene.Projection.PERSPECTIVE:
                this.dolly(ds*TOUCH_ZOOM_FACTOR);
                break;
        }
    }
    // otherwise if we are already panning or 
    // the center of all the touches has moved enough then pan 
    else if (this.isPanning || centerDistance > PAN_TRIGGER_DISTANCE) {
        this.isPanning = true;
        dx = center[0] - this.previousCenter[0];
        dy = center[1] - this.previousCenter[1];
        this.pan([dx, dy]);
    } 
    this.copyCenter(center, this.previousCenter);
    this.previousFingerDistance = fingerDistance;

    event.event.preventDefault();
    event.event.stopPropagation();
};

DesignerCamera.prototype.onTouchEnd = function (event) {
    if (event.touches.length === 1) {
        // if a finger was raised then reset the previous touch
        this.previousTouch = event.touches[0];
    }
};

DesignerCamera.prototype.toolsUpdate = function () {
    // Ideally this would be done in an update function but udpate isn't called in the Designer
    var transition = this.transition;
    if (transition.active) {
        var elapsed = (pc.time.now() - transition.startTime) / 1000;
        if (elapsed > transition.duration) {
            transition.active = false;
            elapsed = transition.duration;
        }

        var eyePos = new pc.Vec3();
        var alpha = pc.math.smootherstep(0, 1, elapsed / transition.duration);
        eyePos.lerp(transition.eyeStart, transition.eyeEnd, alpha);
        this.focus.lerp(transition.focusStart, transition.focusEnd, alpha);

        // setEntityTransfromComponent() will call this render func (because of synchronous livelink), and you end up with a recursive call which means the render 
        // doesn't finish until the transition is complete and the animation snaps to the end. Using setTimeout to prevent this.
        setTimeout(function () {
            pc.designer.api.setCameraTransformComponent(this.entity, 'position', eyePos, false);    
        }.bind(this), 0);

    }
};

return DesignerCamera;
});