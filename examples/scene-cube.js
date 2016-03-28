/**
 * This file is used to create your own scene.
 *
 * The minimal framework in app.js will call createScene() as part of the initialization.
 *
 * The minimal framework will also call animateScene() on each render loop, if it exists.
 *
 */

function createScene() {

    // Create a texture-mapped cube and add it to the scene
    // First, create the texture map
    var textureUrl = "../images/webvr-logo-512.jpeg";
    var loader = new THREE.TextureLoader();
    var map = loader.load( 
        // resource URL
        textureUrl
    );

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

//Called on each render loop
var duration = 10000; // ms
function animateScene(timeDelta) {
    var fract = timeDelta / duration;
    var angle = Math.PI * 2 * fract;

    cube.rotation.y += angle;
}


