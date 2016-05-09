

var container = null,
renderer = null,
effect = null,
controls = null,
scene = null,
camera = null,
cube = null,
vrDisplay;

function initWebVR() {
    // Set up Three.js
    initThreeJS();

    // Set up VR rendering
    initVREffect();

    // Create the scene content
    initScene();

    // Set up VR camera controls
    initVRControls();

    // Set the viewport size and aspect ratio
    refreshSize();

    //Create the 3D objects in your own scene creation file (See scene-cube.js for example)
    if (createScene) {
        createScene();
    };

}

function runWebVR(){
    run( Date.now());
}

var lastTime = 0;
function run(time) {
    requestAnimationFrame(runWebVR);
    var dt = time - lastTime;
    lastTime = time;

    // Render the scene
    effect.render( scene, camera );

    // Update the VR camera controls
    controls.update();

    // If there is animation within the scene (besides camera motion), then update that animation
    if (animateScene !== undefined) {
       animateScene(dt);
    }
}

function initThreeJS() {

    container = document.getElementById("container");

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    // Set the viewport size
    container.appendChild(renderer.domElement);

    window.addEventListener( 'resize', refreshSize, false );

    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function (displays) {
            if (displays.length > 0) {
                vrDisplay = displays[0];

               /* initWebGL(true);

                if (vrDisplay.stageParameters) {
                    // If we have stageParameters use that to resize our scene to
                    // match the users available space more closely.
                    cubeIsland.resize(vrDisplay.stageParameters.sizeX, vrDisplay.stageParameters.sizeZ);
                } else {
                    VRSamplesUtil.addInfo("VRDisplay did not report stageParameters", 3000);
                    // Resetting the pose in standing space isn't useful, because the
                    // headset should always be relative to the physical room.
                    VRSamplesUtil.addButton("Reset Pose", "R", null, function () { vrDisplay.resetPose(); });
                }

                if (vrDisplay.capabilities.canPresent)
                    vrPresentButton = VRSamplesUtil.addButton("Enter VR", "E", "media/icons/cardboard64.png", onVRRequestPresent);

                window.addEventListener('vrdisplaypresentchange', onVRPresentChange, false);*/
            } else {
                /*initWebGL(false);
                VRSamplesUtil.addInfo("WebVR supported, but no VRDisplays found.", 3000);*/
            }
        });
    } else if (navigator.getVRDevices) {
      //  initWebGL(false);
         console.log("Your browser supports WebVR but not the latest version. See <a href='http://webvr.info'>webvr.info</a> for more info.");
    } else {
       // initWebGL(false);
        console.log("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.");
    }

}

function refreshSize ( ) {
    var fullWidth = document.body.clientWidth,
        fullHeight = document.body.clientHeight,
        canvasWidth,
        canvasHeight,
        aspectWidth;
    if ( effect && effect.isFullScreen ) {
        canvasWidth = effect.left.renderRect.width +
        effect.right.renderRect.width;
        canvasHeight = Math.max( effect.left.renderRect.height,
            effect.right.renderRect.height );
        aspectWidth = canvasWidth / 2;
    }
    else{
        var ratio = window.devicePixelRatio || 1;
        canvasWidth = fullWidth * ratio;
        canvasHeight = fullHeight * ratio;
        aspectWidth = canvasWidth;
    }


    if (vrDisplay && vrDisplay.isPresenting) {
        var leftEye = vrDisplay.getEyeParameters("left");
        var rightEye = vrDisplay.getEyeParameters("right");

        canvasWidth = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
        canvasHeight = Math.max(leftEye.renderHeight, rightEye.renderHeight);
        renderer.domElement.width = canvasWidth;
        renderer.domElement.height = canvasHeight;
        renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
        renderer.setSize(canvasWidth, canvasHeight);
        camera.aspect = aspectWidth / canvasHeight;
        camera.updateProjectionMatrix( );
        renderer.domElement.style.height = "256px";
        renderer.domElement.style.width = "512px";

    } else {
        renderer.domElement.style.width = fullWidth + "px";
        renderer.domElement.style.height = fullHeight + "px";
        renderer.domElement.width = canvasWidth;
        renderer.domElement.height = canvasHeight;
        renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
        renderer.setSize(canvasWidth, canvasHeight);
        camera.aspect = aspectWidth / canvasHeight;
        camera.updateProjectionMatrix( );
    }

}

function initVREffect() {

    // Set up Oculus renderer
    effect = new THREE.VREffect(renderer, function(err) {
        if (err) {
            console.log("Error creating VREffect: ", err);
        }
        else {
            console.log("Created VREffect: ", effect);
        }
    });

    // Set up fullscreen mode handling
    var fullScreenButton = document.querySelector( '.button' );
    fullScreenButton.onclick = function() {
        effect.setFullScreen(true);
        refreshSize ( );
    };

    window.addEventListener("keyup", function(evt){
        if(!evt.shiftKey &&
            !evt.altKey &&
            !evt.ctrlKey &&
            !evt.metaKey &&
            evt.keyCode === 27 &&
            effect.isFullScreen){
            effect.setFullScreen(false);
        }
    });
}

function initScene() {
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    // Note that this camera's FOV is ignored in favor of the
    // Oculus-supplied FOV for each used inside VREffect.
    // See VREffect.js h/t Michael Blix
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 4000);
    camera.position.z = 5; //NOTE: this will be ignored if there is a valid VR device but is needed on desktop view
    scene.add(camera);
}

function initVRControls() {

    // Set up VR camera controls
    controls = new THREE.VRControls(camera, function(err) {
        if (err) {
            console.log("Error creating VRControls: ", err);
        }
        else {
            console.log("Created VRControls: ", controls);
        }
    });
}