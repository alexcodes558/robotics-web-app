let scene, camera, renderer, controls;
let objects = [];
let sketchPoints = [];
let sketchMode = false;
let selected = null;

init();

function init() {

scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth/window.innerHeight,
  0.1,
  1000
);
camera.position.set(5,5,5);

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const grid = new THREE.GridHelper(50,50);
scene.add(grid);

scene.add(new THREE.AmbientLight(0xffffff,0.6));

const light = new THREE.DirectionalLight(0xffffff,0.8);
light.position.set(5,10,5);
scene.add(light);

window.addEventListener('resize', resize);
window.addEventListener('click', handleClick);

animate();
}

function resize() {
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
requestAnimationFrame(animate);
controls.update();
renderer.render(scene,camera);
}

function handleClick(event) {

if (!sketchMode) return;

const mouse = new THREE.Vector2(
  (event.clientX / window.innerWidth) * 2 - 1,
  -(event.clientY / window.innerHeight) * 2 + 1
);

const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mouse, camera);

const plane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
const point = new THREE.Vector3();
raycaster.ray.intersectPlane(plane, point);

sketchPoints.push(point.clone());

const dot = new THREE.Mesh(
  new THREE.SphereGeometry(0.05),
  new THREE.MeshBasicMaterial({color:0xff0000})
);

dot.position.copy(point);
scene.add(dot);
}

function extrudeSketch() {

if (sketchPoints.length < 3) return;

const shape = new THREE.Shape();

shape.moveTo(sketchPoints[0].x, sketchPoints[0].z);

for (let i=1; i<sketchPoints.length; i++) {
  shape.lineTo(sketchPoints[i].x, sketchPoints[i].z);
}

shape.lineTo(sketchPoints[0].x, sketchPoints[0].z);

const geometry = new THREE.ExtrudeGeometry(shape,{
  depth:1,
  bevelEnabled:false
});

const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshStandardMaterial({color:0x2194ce})
);

mesh.rotation.x = -Math.PI/2;
scene.add(mesh);
objects.push(mesh);

sketchPoints = [];
}
