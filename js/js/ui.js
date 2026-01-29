import { createPart, toggleSketchMode, extrudeSketch } from './parts.js';
import { undo, redo } from './history.js';
import { saveAssembly, loadAssembly } from './storage.js';

export function initUI() {
  // --- Toolbar ---
  const toolbar = document.getElementById('toolbar');
  toolbar.style.cssText = 'position:absolute; top:0; left:0; right:0; height:40px; background:#333; color:#fff; display:flex; align-items:center; padding:0 10px; z-index:20;';

  const buttons = [
    { id:'undoBtn', label:'Undo', onClick: undo },
    { id:'redoBtn', label:'Redo', onClick: redo },
    { id:'saveBtn', label:'Save', onClick: saveAssembly },
    { id:'loadBtn', label:'Load', onClick: loadAssembly },
    { id:'sketchBtn', label:'Sketch Mode', onClick: ()=>{ toggleSketchMode(true); } },
    { id:'extrudeBtn', label:'Extrude', onClick: ()=>{ extrudeSketch(1,0xffa500); } }
  ];

  buttons.forEach(b=>{
    const btn = document.createElement('button');
    btn.id = b.id;
    btn.innerText = b.label;
    btn.style.cssText = 'margin-right:8px;padding:5px 10px;background:#555;border:none;color:#fff;cursor:pointer;border-radius:3px;';
    btn.addEventListener('click', b.onClick);
    toolbar.appendChild(btn);
  });

  // --- Left Sidebar / Part Library ---
  const sidebar = document.getElementById('sidebar');
  sidebar.style.cssText = 'position:absolute; top:40px; left:0; width:120px; bottom:0; background:#222; color:#fff; padding:10px; display:flex; flex-direction:column; z-index:15;';
  sidebar.innerHTML = '<h3>Parts Library</h3>';

  const partButtons = [
    { shape:'cube', color:0xffa500 },
    { shape:'cylinder', color:0x0000ff },
    { shape:'sphere', color:0xff0000 }
  ];

  partButtons.forEach(p=>{
    const btn = document.createElement('button');
    btn.innerText = p.shape;
    btn.style.cssText = 'margin-bottom:6px;padding:6px;background:#444;border:none;color:#fff;cursor:pointer;border-radius:3px;';
    btn.addEventListener('click', ()=>createPart(p.shape,p.color));
    sidebar.appendChild(btn);
  });

  // --- Right Sidebar / Part Properties ---
  const properties = document.getElementById('properties');
  properties.style.cssText = 'position:absolute; top:40px; right:0; width:200px; bottom:0; background:#333; color:#fff; padding:10px; z-index:15;';
  properties.innerHTML = '<h3>Properties</h3><div id="propertiesContent">Select a part</div>';

  // --- Info Panel ---
  const info = document.getElementById('info');
  info.style.cssText = 'position:absolute; bottom:10px; left:140px; background:rgba(255,255,255,0.8); padding:6px; font-size:14px; border-radius:4px; min-width:250px; z-index:10;';
  info.innerText = 'Right-drag: Orbit | Middle-drag: Pan | Scroll: Zoom | Left-click: Select/Drag';
}
