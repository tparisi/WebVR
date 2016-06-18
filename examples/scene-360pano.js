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
    // Maya Scene Source – fisheye image https://thefulldomeblog.com/2013/08/06/house-of-mirrors/
    // rendered with Domemaster3D
    // https://github.com/zicher3d-org/domemaster-stereo-shader/releases

    var textureUrl = "../images/infinitemirrorspace_spherical.jpg";
    var loader = new THREE.TextureLoader();
    var map = loader.load( 
        // resource URL
        textureUrl
    );

    // Now, create a Basic material; pass in the map

    var material = new THREE.MeshBasicMaterial({ map: map, side:THREE.DoubleSide });

    // Create the sky sphere geometry
    var geometry = new THREE.SphereGeometry(10, 32, 32);
    // We're looking at the inside
    geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

    // And put the geometry and material together into a mesh
    var sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.y = -Math.PI / 2;

    // Finally, add the mesh to our scene
    scene.add( sphere );

    camera.position.z = .001;

}

//Called on each render loop
var duration = 10000; // ms
function animateScene(timeDelta) {
}


