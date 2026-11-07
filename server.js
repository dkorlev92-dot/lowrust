'use strict';
// Presence-only prototype: no shared combat, authentication, or persistent world.
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {WebSocketServer,WebSocket}=require('ws');
const root=__dirname,port=Number(process.env.PORT)||10000,MAX_PLAYERS=20;
const files=new Set(['index.html','style.css','characters.js','drawn-walls.js','game.js','account.js','online.js']);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end()}
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '')||'index.html'}catch{return res.writeHead(400).end()}
 if(!files.has(name)&&!/^icons\/[A-Za-z0-9_-]+\.(webp|png)$/.test(name))return res.writeHead(404).end();
 const file=path.join(root,name);fs.stat(file,(err,stat)=>{if(err||!stat.isFile())return res.writeHead(404).end();res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});if(req.method==='HEAD')return res.end();fs.createReadStream(file).pipe(res)});
});
const wss=new WebSocketServer({server,path:'/ws',maxPayload:4096,perMessageDeflate:false}),players=new Map();
function send(ws,obj){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj))}
function number(v,min,max){return typeof v==='number'&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):null}
function publicPlayer(p){return {id:p.id,name:p.name,avatar:p.avatar,x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch,held:p.held}}
const allowItems=new Set(['rock','rock__skull','torch','rifle','rifle__ice','rifle__aurora','rifle__ember','rifle__forest','smg','smg__aurora','smg__sunset','smg__void','revolver','hatchet','pickaxe','hammer','spear','plan','bow','c4','launcher','signal','furnace','cupboard','workbench','wooddoor','metaldoor','lock','bandage','storage','sleepingbag']);
wss.on('connection',(ws,req)=>{
 // Browser same-origin check protects the demo from other websites using it as a socket backend.
 if(req.headers.origin){try{if(new URL(req.headers.origin).host!==req.headers.host){ws.close(1008,'Origin rejected');return}}catch{ws.close(1008,'Origin rejected');return}}
 if(players.size>=MAX_PLAYERS){send(ws,{type:'full'});ws.close(1008,'Server full');return}
 let p={id:crypto.randomUUID(),name:'Игрок',avatar:0,x:0,y:1.7,z:-27,yaw:0,pitch:0,held:'rock',joined:false,window:Date.now(),messages:0,alive:true};players.set(ws,p);
 ws.on('pong',()=>p.alive=true);
 ws.on('error',()=>{});
 ws.on('message',raw=>{let now=Date.now();if(now-p.window>=1000){p.window=now;p.messages=0}if(++p.messages>60){ws.close(1008,'Rate limit');return}let m;try{m=JSON.parse(raw.toString())}catch{return}if(!m||typeof m!=='object')return;
  if(m.type==='hello'&&!p.joined){p.name=String(m.name||'Игрок').replace(/[^\p{L}\p{N}_-]/gu,'').slice(0,24)||'Игрок';p.avatar=Number.isInteger(m.avatar)?Math.max(0,Math.min(49,m.avatar)):0;p.joined=true;send(ws,{type:'welcome',id:p.id,limit:MAX_PLAYERS});return}
  if(!p.joined)return;
  if(m.type==='ping'){if(typeof m.n==='number'&&Number.isFinite(m.n))send(ws,{type:'pong',n:m.n});return}
  if(m.type==='state'){let x=number(m.x,-245,245),y=number(m.y,-5,20),z=number(m.z,-245,245),yaw=number(m.yaw,-1e6,1e6),pitch=number(m.pitch,-1.57,1.57);if([x,y,z,yaw,pitch].includes(null))return;if(Math.hypot(x,z)>246)return;Object.assign(p,{x,y,z,yaw,pitch,held:allowItems.has(m.held)?m.held:null})}
 });
 ws.on('close',()=>players.delete(ws));
});
const tick=setInterval(()=>{let all=[...players.values()].filter(p=>p.joined).map(publicPlayer),msg=JSON.stringify({type:'snapshot',players:all});for(let [ws,p] of players)if(p.joined&&ws.readyState===WebSocket.OPEN&&ws.bufferedAmount<65536)ws.send(msg)},50);
const heartbeat=setInterval(()=>{for(let [ws,p] of players){if(!p.alive){ws.terminate();continue}p.alive=false;ws.ping()}},30000);
server.on('close',()=>{clearInterval(tick);clearInterval(heartbeat)});server.listen(port,'0.0.0.0',()=>console.log(`GRUST online prototype listening on ${port}`));
