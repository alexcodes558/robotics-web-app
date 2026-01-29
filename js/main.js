import * as THREE from '../libs/three.module.js';
import { initUI } from './ui.js';
import { initCameraControls } from './camera.js';
import { initParts } from './parts.js';
import { initHistory } from './history.js';
import { initStorage } from './storage.js';

// --- Scene & Renderer ---
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe0e0e0);

export const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 100);
camera.position.set(10,10,10);

export const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// --- Lights ---
const ambient = new THREE.AmbientLight(0xffffff,0.6);
scene.add(ambient);
const dirLight = new THREE.DirectionalLight(0xffffff,0.6);
dirLight.position.set(10,20,10);
dirLight.castShadow = true;
scene.add(dirLight);

// --- Grid & plate ---
const grid = new THREE.GridHelper(20, 40, 0x888888, 0xcccccc);
scene.add(grid);
const plate = new THREE.Mesh(new THREE.PlaneGeometry(20,20), new THREE.MeshStandardMaterial({color:0xaaaaaa, side:THREE.DoubleSide}));
plate.rotation.x = -Math.PI/2;
plate.receiveShadow = true;
scene.add(plate);

// --- Initialize Modules ---
initUI();
initCameraControls(camera, renderer.domElement);
initParts(scene);
initHistory();
initStorage();

// --- Render loop ---
function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
}
animate();

window.addEventListener('resize',()=>{
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
