function enterSketch() {
  sketchMode = true;
}

function extrude() {
  extrudeSketch();
}

function moveMode() {
  sketchMode = false;
}

function rotateMode() {
  sketchMode = false;
}

function save() {
  const data = objects.map(o => ({
    position:o.position,
    rotation:o.rotation
  }));
  localStorage.setItem("cadSave", JSON.stringify(data));
}

function load() {
  const data = JSON.parse(localStorage.getItem("cadSave"));
  if (!data) return;
  data.forEach(d=>{
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(1,1,1),
      new THREE.MeshStandardMaterial({color:0x00ff00})
    );
    cube.position.set(d.position.x,d.position.y,d.position.z);
    scene.add(cube);
  });
}
