

	var container = null,
    renderer = null,
    effect = null,
    controls = null,
    scene = null,
    camera = null,
    cube = null;



$(document).ready(function() {
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

    // Run the run loop
    requestAnimationFrame(run);
});

var duration = 10000; // ms
function animate(deltat) {
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;
    cube.rotation.y += angle;
}

var lastTime = 0;
function run(time) {
    requestAnimationFrame(run);
    var dt = time - lastTime;
    lastTime = time;
    // Render the scene
    effect.render( scene, camera );

    // Update the VR camera controls
    controls.update();

    // Spin the cube for next frame
    animate(dt);
}

function initThreeJS() {

    container = document.getElementById("container");

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    // Set the viewport size
    container.appendChild(renderer.domElement);

    window.addEventListener( 'resize', refreshSize, false );

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
    renderer.domElement.style.width = fullWidth + "px";
    renderer.domElement.style.height = fullHeight + "px";
    renderer.domElement.width = canvasWidth;
    renderer.domElement.height = canvasHeight;
    renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    renderer.setSize(canvasWidth, canvasHeight);
    camera.aspect = aspectWidth / canvasHeight;
    camera.updateProjectionMatrix( );
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
    //effect.setSize(window.innerWidth, window.innerHeight);

    // Set up fullscreen mode handling
    var fullScreenButton = document.querySelector( '.button' );
    fullScreenButton.onclick = function() {
        effect.setFullScreen(true);
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
    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.01, 4000 );
    scene.add(camera);

    // Create a texture-mapped cube and add it to the scene
    // First, create the texture map
    var mapUrl = "../images/webvr-logo-512.jpeg";
    var map = THREE.ImageUtils.loadTexture(mapUrl);

    // Now, create a Basic material; pass in the map
    var material = new THREE.MeshBasicMaterial({ map: map });

    // Create the cube geometry
    var geometry = new THREE.BoxGeometry(.5,.5,.5);

    // And put the geometry and material together into a mesh
    cube = new THREE.Mesh(geometry, material);

    // Move the mesh back from the camera and tilt it toward the viewer
    cube.position.z = 0;
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Finally, add the mesh to our scene
    scene.add( cube );

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