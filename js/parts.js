import * as THREE from '../libs/three.module.js';
import { saveHistory } from './history.js';

let parts = [];
let sceneRef = null;
let selected = null;

// --- Sketch state ---
let sketchMode = false;
let currentSketch = [];
let sketchPlaneY = 0.5; // Y plane for sketches
let tempLine = null;

export function initParts(scene){
  sceneRef = scene;
  enableSketchTools();
}

// --- Create a 3D Part from Sketch (Extrude) ---
export function extrudeSketch(height=1, color=0xffa500){
  if(currentSketch.length < 3) return; // need at least 3 points for shape

  const shape = new THREE.Shape();
  shape.moveTo(currentSketch[0].x, currentSketch[0].z);
  for(let i=1;i<currentSketch.length;i++){
    shape.lineTo(currentSketch[i].x, currentSketch[i].z);
  }
  shape.lineTo(currentSketch[0].x, currentSketch[0].z); // close shape

  const geometry = new THREE.ExtrudeGeometry(shape, {depth: height, bevelEnabled:false});
  const material = new THREE.MeshStandardMaterial({color});
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = sketchPlaneY;
  mesh.castShadow = true; mesh.receiveShadow = true;
  mesh.userData = { shape: 'extrude', color };
  sceneRef.add(mesh);
  parts.push(mesh);

  currentSketch = [];
  if(tempLine) { sceneRef.remove(tempLine); tempLine=null; }

  saveHistory(parts);
  return mesh;
}

// --- Sketch Tool Events ---
function enableSketchTools(){
  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  window.addEventListener('mousedown', e=>{
    if(!sketchMode || e.button!==0) return;

    mouse.x = (e.clientX/window.innerWidth)*2-1;
    mouse.y = -(e.clientY/window.innerHeight)*2+1;
    ray.setFromCamera(mouse, window.camera || new THREE.PerspectiveCamera()); // fallback

    const plane = new THREE.Plane(new THREE.Vector3(0,1,0), -sketchPlaneY);
    const point = new THREE.Vector3();
    ray.ray.intersectPlane(plane, point);

    currentSketch.push(point.clone());

    // Draw temp line
    if(tempLine) sceneRef.remove(tempLine);
    if(currentSketch.length>1){
      const geometry = new THREE.BufferGeometry().setFromPoints([currentSketch[currentSketch.length-2], currentSketch[currentSketch.length-1]]);
      const material = new THREE.LineBasicMaterial({color:0x00ff00});
      tempLine = new THREE.Line(geometry, material);
      sceneRef.add(tempLine);
    }
  });
}

// --- Toggle Sketch Mode ---
export function toggleSketchMode(enable){
  sketchMode = enable;
  currentSketch = [];
  if(tempLine) { sceneRef.remove(tempLine); tempLine=null; }
  console.log('Sketch mode:', sketchMode);
}

// --- Part selection (optional for later) ---
export function selectPart(part){
  if(selected) selected.material.color.set(selected.userData.color);
  selected = part;
  selected.material.color.set(0x00ff00);
}

// --- Existing: create primitive part ---
export function createPart(shape="cube", color=0xffa500){
  let geom;
  switch(shape){
    case "cube": geom = new THREE.BoxGeometry(1,1,1); break;
    case "cylinder": geom = new THREE.CylinderGeometry(0.5,0.5,1,32); break;
    case "sphere": geom = new THREE.SphereGeometry(0.5,32,32); break;
  }
  const mat = new THREE.MeshStandardMaterial({color});
  const mesh = new THREE.Mesh(geom, mat);
  mesh.position.set(0,0.5,0);
  mesh.castShadow=true; mesh.receiveShadow=true;
  mesh.userData = { shape, color };
  sceneRef.add(mesh);
  parts.push(mesh);
  saveHistory(parts);
  return mesh;
}
