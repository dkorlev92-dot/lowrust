// Original canvas illustrations, drawn at startup. No reference photos are embedded.
window.DRAWN_WALLS=(()=>{
 const N=1024;let seed=736281;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296},between=(a,b)=>a+(b-a)*rnd();
 function canvas(){let c=document.createElement('canvas');c.width=c.height=N;return [c,c.getContext('2d')]}
 function line(g,x,y,x2,y2,color,w){g.strokeStyle=color;g.lineWidth=w;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke()}
 const [wood,w]=canvas();w.fillStyle='#2e1d19';w.fillRect(0,0,N,N);
 for(let row=0;row<8;row++){
  let y=row*128,grad=w.createLinearGradient(0,y,0,y+128);grad.addColorStop(0,'#392621');grad.addColorStop(.12,row%2?'#684839':'#71513e');grad.addColorStop(.4,row%2?'#80604b':'#85614a');grad.addColorStop(.69,'#6c4a39');grad.addColorStop(.92,'#452d28');grad.addColorStop(1,'#261b19');w.fillStyle=grad;w.fillRect(0,y+3,N,122);
  // Long uneven bark fibres, scratches and small splinters.
  for(let i=0;i<420;i++){let x=between(0,N),yy=y+between(9,118),len=between(5,95);w.strokeStyle=i%5===0?'rgba(211,167,122,.23)':i%3===0?'rgba(29,19,17,.27)':'rgba(48,30,24,.20)';w.lineWidth=between(.5,2.2);w.beginPath();w.moveTo(x,yy);w.bezierCurveTo(x+len*.3,yy+between(-4,4),x+len*.7,yy+between(-5,5),x+len,yy+between(-3,3));w.stroke()}
  for(let i=0;i<24;i++){let x=between(10,1000),yy=y+between(22,103),len=between(8,38);line(w,x,yy,x+len,yy+between(-5,5),'rgba(209,162,111,.32)',between(1,4))}
  // Alternating end joints and imperfect dark gaps, as in a log wall.
  let joint=row%2?760:258;w.fillStyle='rgba(29,18,17,.72)';w.fillRect(joint-4,y+9,7,105);w.fillStyle='rgba(191,141,94,.72)';w.beginPath();w.moveTo(joint-9,y+9);w.lineTo(joint+7,y+12);w.lineTo(joint+13,y+30);w.lineTo(joint+4,y+46);w.lineTo(joint+11,y+67);w.lineTo(joint+3,y+101);w.lineTo(joint+8,y+117);w.lineTo(joint-8,y+116);w.closePath();w.fill();
  if(row%2===1){w.fillStyle='#1c1514';w.beginPath();let gap=between(100,650);w.moveTo(gap,y+119);w.lineTo(gap+between(55,120),y+119);w.lineTo(gap+between(15,40),y+126);w.closePath();w.fill()}
 }
 const [stone,s]=canvas();s.fillStyle='#353b3c';s.fillRect(0,0,N,N);
 let yy=0;for(let row=0;row<10;row++){let h=102.4,x=row%2?-85:0;while(x<1024){let width=between(75,230),left=x+2,right=Math.min(1024,x+width-2),top=yy+between(-12,12),bottom=yy+h+between(-13,12);
   let shade=Math.floor(between(-13,13)),rr=96+shade,gg=103+shade,bb=105+shade;
   s.save();s.beginPath();s.moveTo(left+between(7,27),top+between(2,12));s.lineTo(left+(right-left)*.45,top+between(-6,12));s.lineTo(right-between(5,26),top+between(1,15));s.lineTo(right-between(0,8),top+between(15,35));s.lineTo(right-between(3,17),bottom-between(15,30));s.lineTo(right-between(12,31),bottom-between(0,10));s.lineTo(left+(right-left)*.5,bottom-between(-4,12));s.lineTo(left+between(6,27),bottom-between(0,14));s.lineTo(left+between(0,10),bottom-between(13,30));s.lineTo(left+between(2,14),top+between(15,30));s.closePath();let grad=s.createLinearGradient(0,top,0,bottom);grad.addColorStop(0,`rgb(${rr+21},${gg+21},${bb+21})`);grad.addColorStop(.24,`rgb(${rr+5},${gg+5},${bb+5})`);grad.addColorStop(.78,`rgb(${rr-7},${gg-7},${bb-7})`);grad.addColorStop(1,`rgb(${rr-25},${gg-25},${bb-25})`);s.fillStyle=grad;s.fill();s.lineWidth=3;s.strokeStyle='#4a504f';s.stroke();s.clip();
   for(let k=0;k<220;k++){let px=between(left,right),py=between(top,bottom);s.fillStyle=k%2?'rgba(22,27,29,.11)':'rgba(206,205,192,.11)';s.fillRect(px,py,between(1,9),between(.5,3))}
   for(let k=0;k<4;k++){let px=between(left,right),py=between(top,bottom);s.strokeStyle='rgba(27,35,37,.25)';s.lineWidth=between(.7,1.6);s.beginPath();s.moveTo(px,py);s.lineTo(px+between(6,17),py+between(-8,8));s.lineTo(px+between(17,30),py+between(-8,8));s.stroke()}s.restore();x+=width}yy+=h}
 const [metal,m]=canvas();m.fillStyle='#66584f';m.fillRect(0,0,N,N);
 // Overlapping sheets of rusty corrugated steel with independently offset seams.
 let cols=[0,143,322,495,685,856,1024];for(let ci=0;ci<cols.length-1;ci++){let x0=cols[ci],x1=cols[ci+1],cuts=ci%2?[0,255,660,1024]:[0,330,770,1024];for(let si=0;si<3;si++){let top=cuts[si],bottom=cuts[si+1],base=between(110,143);m.fillStyle=`rgb(${base+22},${base+5},${base-7})`;m.fillRect(x0,top,x1-x0,bottom-top);
  m.save();m.beginPath();m.rect(x0,top,x1-x0,bottom-top);m.clip();
  for(let x=x0;x<x1;x+=18){let gr=m.createLinearGradient(x,0,x+18,0);gr.addColorStop(0,'rgba(40,30,27,.52)');gr.addColorStop(.22,'rgba(90,74,62,.12)');gr.addColorStop(.48,'rgba(230,205,174,.35)');gr.addColorStop(.7,'rgba(177,156,135,.18)');gr.addColorStop(1,'rgba(38,29,25,.46)');m.fillStyle=gr;m.fillRect(x,top,18,bottom-top)}
  for(let k=0;k<190;k++){let x=between(x0,x1),y=between(top,bottom),r=between(2,20);m.fillStyle=k%3===0?'rgba(102,47,27,.09)':k%3===1?'rgba(199,111,66,.08)':'rgba(50,46,42,.06)';m.beginPath();m.ellipse(x,y,r*.7,r*between(1,2.7),0,0,Math.PI*2);m.fill()}for(let k=0;k<16;k++){let x=between(x0,x1),y=between(top,bottom);line(m,x,y,x+between(-2,2),y+between(8,35),'rgba(220,192,161,.16)',between(.5,1.5))}m.restore();
  line(m,x0,top+2,x1,top+2,'rgba(35,28,25,.72)',5);line(m,x0+2,top+7,x1-2,top+7,'rgba(222,188,148,.26)',2);for(let x=x0+12;x<x1;x+=52){m.fillStyle='#41352e';m.beginPath();m.arc(x,top+13,2.5,0,7);m.fill()}
 }line(m,x0,0,x0,1024,'rgba(32,26,24,.55)',4)}
 return [wood,stone,metal];
})();
