import * as T from './vendor/three.js';

// Original geometry and fur, generated locally. No asset/API charges or downloads.
let seed = 9173;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const material = (color, roughness = .84) => new T.MeshStandardMaterial({ color, roughness });
function ellipsoid(parent, position, scale, color, shiny = false) {
  const mesh = new T.Mesh(new T.SphereGeometry(1, shiny ? 28 : 22, 16), material(color, shiny ? .12 : .87));
  mesh.position.set(...position); mesh.scale.set(...scale);
  mesh.castShadow = mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function fur(parent, center, size, count, length, dark = '#2f160e', light = '#ad7040') {
  const positions = [], colors = [], a = new T.Color(dark), b = new T.Color(light);
  for (let i = 0; i < count; i++) {
    const y = random() * 2 - 1, theta = random() * Math.PI * 2, radius = Math.sqrt(1 - y*y);
    const n = new T.Vector3(Math.cos(theta)*radius, y, Math.sin(theta)*radius);
    const p = new T.Vector3(n.x*size[0]+center[0], n.y*size[1]+center[1], n.z*size[2]+center[2]);
    const normal = new T.Vector3(n.x/size[0], n.y/size[1], n.z/size[2]).normalize();
    const side = new T.Vector3(normal.z, .14, -normal.x).normalize().multiplyScalar(.003 + random()*.0035);
    const h = length*(.35+random()*.8);
    const tip = p.clone().addScaledVector(normal,h); tip.y -= h*.45;
    const mid = p.clone().lerp(tip,.5); mid.addScaledVector(normal,h*.15);
    const l = p.clone().sub(side), r = p.clone().add(side), ml = mid.clone().sub(side.clone().multiplyScalar(.55)), mr = mid.clone().addScaledVector(side,.55);
    const shade = a.clone().lerp(b,.12+random()*.7), tipShade = shade.clone().lerp(b,.18);
    for (const [v,c] of [[l,shade],[r,shade],[ml,shade],[r,shade],[mr,shade],[ml,shade],[ml,shade],[mr,shade],[tip,tipShade]]) {
      positions.push(v.x,v.y,v.z); colors.push(c.r,c.g,c.b);
    }
  }
  const geometry = new T.BufferGeometry();
  geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3)); geometry.computeVertexNormals();
  const mesh = new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:.94,side:T.DoubleSide}));
  mesh.userData.webglOnly = true; mesh.castShadow = false; parent.add(mesh);
}
export function dog(color = '#543020', accessory = true) {
  seed = 9173;
  const group = new T.Group(), coat = color, cream = '#b58b5b', deep = '#21100c';
  ellipsoid(group,[0,1.02,.02],[.43,.48,.83],coat);
  fur(group,[0,1.02,.02],[.43,.48,.83],3200,.25);
  ellipsoid(group,[0,1.35,-.55],[.43,.59,.44],coat);
  fur(group,[0,1.32,-.56],[.43,.58,.45],1700,.27);
  ellipsoid(group,[0,1.25,-.87],[.3,.42,.14],cream);
  fur(group,[0,1.25,-.87],[.3,.42,.14],650,.15,'#7b4d2e','#d1ab78');
  ellipsoid(group,[0,1.93,-.76],[.53,.51,.48],coat);
  fur(group,[0,1.93,-.76],[.53,.51,.48],2100,.15);
  for (const s of [-1,1]) {
    ellipsoid(group,[s*.27,1.75,-1.08],[.24,.22,.22],cream);
    fur(group,[s*.27,1.75,-1.08],[.24,.22,.22],230,.07,'#70482a','#d2b17e');
    ellipsoid(group,[s*.265,2.01,-1.155],[.17,.18,.105],'#351c0f',true);
    ellipsoid(group,[s*.265,2.02,-1.24],[.121,.138,.035],'#0d0909',true);
    ellipsoid(group,[s*.245,2.08,-1.269],[.032,.035,.012],'#fff4da',true);
    ellipsoid(group,[s*.30,2.19,-1.09],[.13,.055,.055],'#b68957');
    const ear = new T.Group(); ear.position.set(s*.37,2.22,-.72); ear.rotation.z = -s*.36; ear.scale.set(1.28,.72,1);
    const shape = new T.Shape(); shape.moveTo(-.23,0); shape.quadraticCurveTo(-.39,.45,-.22,1.13); shape.quadraticCurveTo(-.12,1.24,.02,1.04); shape.quadraticCurveTo(.34,.55,.27,.06); shape.quadraticCurveTo(0,-.11,-.23,0);
    const earMesh = new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.04,bevelThickness:.035,curveSegments:10}),material(coat));
    earMesh.castShadow = true; ear.add(earMesh);
    const inner = new T.Mesh(new T.ShapeGeometry(shape,12),new T.MeshStandardMaterial({color:'#b37f6a',roughness:.95,side:T.DoubleSide}));
    inner.scale.set(.72,.79,1); inner.position.set(0,.08,-.055); ear.add(inner);
    fur(ear,[0,.48,.02],[.24,.50,.09],620,.22);
    group.add(ear);
  }
  ellipsoid(group,[0,1.69,-1.21],[.25,.15,.24],cream);
  ellipsoid(group,[0,1.76,-1.405],[.128,.09,.075],'#170e0c',true);
  ellipsoid(group,[0,1.605,-1.30],[.13,.017,.07],'#30160f');
  const legs = [];
  for (const x of [-.28,.28]) for (const z of [-.52,.58]) {
    const leg = new T.Group(); leg.position.set(x,.81,z);
    ellipsoid(leg,[0,-.19,0],[.12,.33,.15],coat);
    ellipsoid(leg,[0,-.55,-.025],[.082,.25,.085],cream);
    ellipsoid(leg,[0,-.75,-.085],[.145,.09,.19],cream);
    fur(leg,[0,-.18,.04],[.12,.29,.14],220,.12);
    for (const t of [-1,0,1]) ellipsoid(leg,[t*.043,-.755,-.24],[.022,.016,.025],'#39251c');
    group.add(leg); legs.push(leg);
  }
  const tail = new T.Group(); tail.position.set(0,1.17,.69); tail.rotation.x = -.3;
  const tailPath = new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(.04,.3,.3),new T.Vector3(.07,.68,.3),new T.Vector3(.04,.81,.04)]);
  ellipsoid(tail,[.035,.41,.24],[.15,.34,.18],coat);
  const tailMesh = new T.Mesh(new T.TubeGeometry(tailPath,20,.085,8,false),material(coat)); tail.add(tailMesh);
  fur(tail,[.035,.42,.23],[.13,.38,.15],1100,.31,'#402116','#c08c58'); group.add(tail);
  if (accessory) {
    const collar = new T.Mesh(new T.TorusGeometry(.385,.065,8,40),material('#111820')); collar.rotation.x = Math.PI/2; collar.position.set(0,1.51,-.61); group.add(collar);
    const scarf = new T.Mesh(new T.ConeGeometry(.28,.45,3),material('#131b21')); scarf.position.set(0,1.31,-.99); scarf.rotation.z = Math.PI; scarf.rotation.y = Math.PI; group.add(scarf);
    const tag = new T.Mesh(new T.SphereGeometry(1,16,10),new T.MeshStandardMaterial({color:'#e4b75f',metalness:.7,roughness:.25})); tag.position.set(0,1.43,-1.13); tag.scale.set(.07,.09,.02); group.add(tag);
  }
  group.scale.setScalar(.34);
  group.userData = {legs,tail,originalCharacter:true}; return group;
}
