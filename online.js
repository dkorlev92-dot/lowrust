'use strict';
// Experimental player-presence layer. This is deliberately not a shared world.
let onlineSocket=null,onlineId=null,onlineRemote=new Map(),onlinePing=null,onlineCount=0,lastOnlineState=0,lastOnlinePing=0,onlineConnecting=false;
function onlineMessage(text){$('onlineStatus').textContent=text}
function onlineSend(data){if(onlineSocket?.readyState===WebSocket.OPEN)onlineSocket.send(JSON.stringify(data))}
function onlineDisconnect(){let socket=onlineSocket;onlineSocket=null;onlineId=null;onlineRemote.clear();onlinePing=null;onlineCount=0;onlineConnecting=false;if(socket)socket.close();$('onlineHud').hidden=true}
function joinOnline(){
 if(!activeAccount||onlineConnecting)return;
 if(!['http:','https:'].includes(location.protocol)){onlineMessage('Для онлайна откройте игру через Node-сервер или ссылку Render, а не через файл.');return}
 onlineConnecting=true;onlineMessage('Подключаемся… На бесплатном Render запуск может занять около минуты.');let ws=new WebSocket((location.protocol==='https:'?'wss://':'ws://')+location.host+'/ws');onlineSocket=ws;
 ws.onopen=()=>onlineSend({type:'hello',name:activeAccount.name,avatar:activeAccount.characterId});
 ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}
  if(m.type==='full'){onlineMessage('Сервер заполнен: максимум 20 игроков.');return}
  if(m.type==='welcome'){onlineConnecting=false;onlineId=m.id;onlineMode=true;onlineMessage('Подключено.');start(2,true);$('onlineHud').hidden=false;setTimeout(()=>{if(onlineSocket===ws&&mode==='game'){document.querySelector('.location strong').textContent='ОНЛАЙН-ТЕСТ · ДВИЖЕНИЕ';toast('Онлайн-тест: общий бой и мир пока не работают')}},1550);return}
  if(m.type==='pong'&&Number.isFinite(m.n))onlinePing=Math.max(0,Math.round(performance.now()-m.n));
  if(m.type==='snapshot'&&Array.isArray(m.players)){onlineCount=m.players.length;let seen=new Set();for(let p of m.players){if(p.id===onlineId||!p.id)continue;seen.add(p.id);let r=onlineRemote.get(p.id);if(!r){r={...p,display:{x:p.x,y:p.y,z:p.z,yaw:p.yaw,pitch:p.pitch}};onlineRemote.set(p.id,r)}else Object.assign(r,p)}for(let id of onlineRemote.keys())if(!seen.has(id))onlineRemote.delete(id)}
 };
 ws.onerror=()=>onlineMessage('Не удалось подключиться. Проверьте адрес и доступность сервера.');
 ws.onclose=()=>{if(onlineSocket!==ws)return;let wasOnline=onlineMode;onlineDisconnect();if(wasOnline){onlineMode=false;closeBuildWheel();stopFiring();mode='menu';ui.loading.hidden=true;ui.hud.hidden=true;ui.menu.hidden=false;closeInv();document.exitPointerLock?.();onlineMessage('Соединение потеряно. Нажмите «Онлайн-тест», чтобы подключиться снова.')}else if($('onlineStatus').textContent.startsWith('Подключаемся'))onlineMessage('Сервер недоступен или соединение закрыто.')};
}
$('onlineJoin').onclick=joinOnline;
const originalMenuClick=$('menuBtn').onclick;$('menuBtn').onclick=()=>{originalMenuClick();if(onlineMode){onlineDisconnect();onlineMode=false;onlineMessage('Вы вышли из онлайн-теста.')}};
function onlineTick(now,dt){if(!onlineMode||!onlineSocket||!onlineId)return;if(now-lastOnlineState>=50){lastOnlineState=now;onlineSend({type:'state',x:player.x,y:player.y,z:player.z,yaw:player.yaw,pitch:player.pitch,held:hot[selected]||null})}if(now-lastOnlinePing>=2000){lastOnlinePing=now;onlineSend({type:'ping',n:now})}let f=1-Math.exp(-dt*12);for(let r of onlineRemote.values()){for(let k of ['x','y','z','pitch'])r.display[k]+=(r[k]-r.display[k])*f;let diff=Math.atan2(Math.sin(r.yaw-r.display.yaw),Math.cos(r.yaw-r.display.yaw));r.display.yaw+=diff*f}$('onlineHud').textContent='ОНЛАЙН-ТЕСТ · '+onlineCount+'/20 · ПИНГ '+(onlinePing==null?'—':onlinePing+' мс');}
function drawOnlinePlayers(){if(!onlineMode)return;for(let p of onlineRemote.values()){let r=p.display;if(!r)continue;let subject={x:r.x,y:r.y,z:r.z,yaw:r.yaw,pitch:r.pitch};drawAvatar(subject,{},p.avatar,p.held);if(p.held&&items[p.held])drawHeld(p.held,true,subject,{},p.avatar)}}
