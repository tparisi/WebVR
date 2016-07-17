

var container = null,
renderer = null,
effect = null,
controls = null,
scene = null,
camera = null,
cube = null,
vrDisplay;

function run() {
    // Set up Three.js
    initThreeJS();

    // Create the scene content
    initScene();

    // Set up VR rendering and camera controls (if available)
    initVR();
}

function initThreeJS() {

    container = document.getElementById("container");

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    // Set the viewport size
    container.appendChild(renderer.domElement);

    window.addEventListener( 'resize', refreshSize, false );

}

function initScene() {
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    // Note that this camera's FOV is ignored in favor of the
    // Oculus-supplied FOV for each used inside VREffect.
    // See VREffect.js h/t Michael Blix
    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 4000);
    scene.add(camera);

    //NOTE: this will be ignored if there is a valid VR device but is needed on desktop view
    camera.position.z = .001;

    //Create the 3D objects in your own scene creation file (See scene-cube.js for example)
    if (createScene) {
        createScene();
    };


}

// call this once we're set up, either w valid VR or just 2D windowed
function onWebVRInitialized(gotVR) {

    if (gotVR) {
        // If we have a valid VR device,
        // set up Three.js rendering and controls
        initVREffect();
        initVRControls();
        // 
        $('.startVRButton').css('display', 'block');
    }
    else {
        // Otherwise use regular orbit controls
        initOrbitControls();
    }

    // Make sure our rendering viewports are sized properly
    refreshSize();

    // start the run loop
    runWebVR(Date.now());

}

function initVR() {

    var gotVR = false;

    if (navigator.getVRDisplays) {
        navigator.getVRDisplays().then(function (displays) {
            if (displays.length > 0) {
                vrDisplay = displays[0];

                onWebVRInitialized(true);

            } else {
                console.log("WebVR supported, but no VRDisplays found.");
            }

        });

        gotVR = true;
    } else if (navigator.getVRDevices) {
      //  initWebGL(false);
         console.log("Your browser supports WebVR but not the latest version. See <a href='http://webvr.info'>webvr.info</a> for more info.");
    } else {
       // initWebGL(false);
        console.log("Your browser does not support WebVR. See <a href='http://webvr.info'>webvr.info</a> for assistance.");
    }


    onWebVRInitialized(gotVR);
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
    var fullScreenButton = document.querySelector( '.startVRButton' );
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

function initOrbitControls() {

    controls = new THREE.OrbitControls(this.camera, renderer.domElement);

}

var lastTime = 0;
function runWebVR(time) {

    if (vrDisplay) {
        vrDisplay.requestAnimationFrame(runWebVR);
    }
    else {
        requestAnimationFrame(runWebVR);
    }

    var dt = time - lastTime;
    lastTime = time;

    // Render the scene
    if (effect) {
        effect.render( scene, camera );
    }
    else {
        renderer.render( scene, camera );
    }

    // Update the VR camera controls
    controls.update();

    // If there is animation within the scene (besides camera motion), then update that animation
    if (animateScene !== undefined) {
       animateScene(dt);
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


