/**
 * This file is used to create your own scene.
 *
 * The minimal framework in app.js will call createScene() as part of the initialization.
 *
 * The minimal framework will also call animateScene() on each render loop, if it exists.
 *
 */

 /**
 * Plane
 *
 *  from http://stars.chromeexperiments.com/
 */

var cylinderMesh = null;

function createScene() {


    var S = 512;

    var canvas = document.createElement('canvas');
    canvas.width = S;
    canvas.height = S;

    var ctx = canvas.getContext('2d');

    var grd = ctx.createLinearGradient(0,0, 0,S);

    var colors = [
        ['0.000', 'rgb(26, 24, 127)'],
        ['0.230', 'rgb(0,0,0)'],
        ['0.337', 'rgb(39,35,191)'],
        ['0.731', 'rgb(0,0,0)'],
        ['1.000', 'rgb(13,12,64)']
        ];

    for (var i = 0; i < colors.length; i++) {
        var c = colors[i];
        var stop  = c[0];
        var color = c[1];
        grd.addColorStop(stop, color);
    }

    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, S, S);

    var texture = new THREE.Texture(canvas);

    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial({ map: texture, side:THREE.DoubleSide });

    // Create the sky sphere geometry
    var geometry = new THREE.SphereGeometry(10, 32, 32);
    // We're looking at the inside
    geometry.applyMatrix( new THREE.Matrix4().makeScale( -1, 1, 1 ) );

    // And put the geometry and material together into a mesh
    var sphere = new THREE.Mesh(geometry, material);

    // Finally, add the mesh to our scene
    scene.add( sphere );

    var material = new THREE.MeshBasicMaterial();
    var geometry = new THREE.BoxGeometry(.5, .5, .5);
    // And put the geometry and material together into a mesh
    var box = new THREE.Mesh(geometry, material);

    //scene.add( box );

    var textureUrl = "../images/glowspan.png";
    var loader = new THREE.TextureLoader();
    var map = loader.load( 
        // resource URL
        textureUrl,
        function(map) {
        var cylinderMaterial = new THREE.MeshBasicMaterial({
            map: map,
           //blending: THREE.AdditiveBlending,
            transparent: true,
            depthTest: true,
            depthWrite: true,
            wireframe: true,
            opacity: 0.1
        })

        var planeRadius = 10;

        var cylinderGeo = new THREE.CylinderGeometry( planeRadius, 0, 0, (360/8) - 1, 20 );
        var matrix = new THREE.Matrix4();
        matrix.scale( new THREE.Vector3(1,0.0001,1) );
        cylinderGeo.applyMatrix( matrix );
        cylinderMaterial.map.wrapS = THREE.RepeatWrapping;
        cylinderMaterial.map.wrapT = THREE.RepeatWrapping;
        cylinderMaterial.map.needsUpdate = true;
        cylinderMesh = new THREE.Mesh( cylinderGeo, cylinderMaterial );

        scene.add( cylinderMesh );

        var cubeGeo = new THREE.BoxGeometry(.5, .5, .5);
        var cubeMesh = new THREE.Mesh( cubeGeo, new THREE.MeshBasicMaterial );

        scene.add( cubeMesh );

        }
    );

}

//Called on each render loop
var duration = 10000; // ms
function animateScene(timeDelta) {
    if (cylinderMesh) {
        cylinderMesh.material.map.offset.y -= timeDelta / duration;
        cylinderMesh.material.map.needsUpdate = true;        
    }
}


