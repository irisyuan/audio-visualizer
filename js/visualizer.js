// Create scene, camera, and render it
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
var shapes = new Array();
var camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 1000);

// Adjust camera position to render
document.body.appendChild(renderer.domElement);
camera.position.x = 0;
camera.position.y = -20;
camera.position.z = 20;

// Adjust controls
var controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

// Add lights from left, right, top, bottom
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);

// Generate a random color from colors I like, for each 3D primitive
// Saved these favorite colors, but ultimately found white looked the best
function randomColor() {
	var niceColors = [ "#e74c3c",
						"#3498db",
						"#c0392b",
						"#ffffff",
						"#f1c40f",
						"#2ecc71",
						"#FF69B4",
						"#9b59b6"  ];
    for (var i = 0; i < 6; i++ ) {
        color = niceColors[Math.floor(Math.random() * 8)];
    }
    return "rgb" + "(" + 80 + ", " + 109 + ", " + "69)";
}

// Build the grid layout 
var i = 0;
for (var x = 0; x < 30; x += 2) {
	var j = 0;
	shapes[i] = new Array();
	for (var y = 0; y < 30; y += 2) {
		// Create thin cone shape
		var geometry = new THREE.CylinderGeometry(0, 0.1, 0.08, 20, 1, false);			
		var material = new THREE.MeshPhongMaterial({
			color: randomColor(),
			wireframe: false
		});
		
		shapes[i][j] = new THREE.Mesh(geometry, material);
		shapes[i][j].position = new THREE.Vector3(x, y, 0);
		
		scene.add(shapes[i][j]);
		j++;
	}
	i++;
}

// Center the grid around the mouse click movement
for(var i = 0; i < 7; i++) {
	controls.pan(new THREE.Vector3( 1, 0, 0 ));
	controls.pan(new THREE.Vector3( 0, 1, 0 ));
}

// Animate the grid when music plays for each element in 2D matrix
var render = function () {
	if(typeof array === 'object' && array.length > 0) {
		var k = 0;
		for (var i = 0; i < shapes.length; i++) {
			for (var j = 0; j < shapes[i].length; j++) {
				var scale = (array[k] + boost) * 6 / 30;

				shapes[i][j].scale.z = (scale < 1 ? j : scale);

				k += (k < array.length ? 1 : 0);
			}
		}
	}
	requestAnimationFrame(render);
	// If we don't want it to rotate...
	controls.autoRotate = false;
	controls.update();
	renderer.render(scene, camera);
};

// Make sure the grid stays within the frame
render();
renderer.setSize($(window).width(), $(window).height());