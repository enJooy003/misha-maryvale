import * as T from './vendor/three.js';

// Deterministic, original surface textures. Generated on device, never fetched.
const cache = new Map();
export function surface(kind, color, repeatX = 1, repeatY = 1) {
  const key = [kind,color,repeatX,repeatY].join(':'); if(cache.has(key)) return cache.get(key);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d'); context.fillStyle = color; context.fillRect(0,0,256,256);
  let seed = 42; const random = () => ((seed = (seed*1664525+1013904223)>>>0)/4294967296);
  for(let i=0;i<24000;i++) { const n = random(); context.fillStyle = n>.5?'rgba(255,255,255,.12)':'rgba(0,0,0,.16)'; const d = kind==='wall'?1:random()*2+1; context.fillRect(random()*256,random()*256,d,d); }
  if(kind==='road') {
    context.strokeStyle='rgba(12,14,17,.4)';context.lineWidth=.7;
    for(let i=0;i<7;i++){let x=random()*256,y=random()*256;context.beginPath();context.moveTo(x,y);for(let j=0;j<5;j++){x+=(random()-.5)*40;y+=random()*22;context.lineTo(x,y)}context.stroke()}
  }
  if(kind==='sidewalk') {
    context.strokeStyle='rgba(50,38,29,.3)';context.lineWidth=1.4;
    for(let p=0;p<=256;p+=64){context.beginPath();context.moveTo(p,0);context.lineTo(p,256);context.moveTo(0,p);context.lineTo(256,p);context.stroke()}
  }
  const texture = new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(repeatX,repeatY);texture.anisotropy=4;
  const mat = new T.MeshStandardMaterial({map:texture,roughness:kind==='road'?.96:.89,metalness:0,color:'#ffffff',bumpMap:texture,bumpScale:kind==='road'?.035:.018});
  mat.userData.softwareColor=color;cache.set(key,mat);return mat;
}
