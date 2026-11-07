'use strict';
const FISHING={x:59,z:73,r:19};
const EXPEDITION_SITES=[{x:140,z:120},{x:-145,z:-110},{x:-125,z:140}];
function isSafe(x,z){return Math.hypot(x-FISHING.x,z-FISHING.z)<FISHING.r}
let randSeed=1937;function rnd(){randSeed=(randSeed*1664525+1013904223)>>>0;return randSeed/4294967296}function r(a,b){return a+rnd()*(b-a)}
function createWorld(){
 randSeed=1937;let objects=[];
 function add(type,x,z){objects.push({type,x,z,hp:type==='tree'?5:type==='barrel'?2:4,id:objects.length})}
 function populate(count,inner,outer){for(let i=0;i<count;i++){let type=i%10<6?'tree':i%10<8?'stone':i%10===8?'metalOre':'sulfurOre';for(let tries=0;tries<100;tries++){let a=r(0,Math.PI*2),radius=Math.sqrt(r(inner*inner,outer*outer)),x=Math.sin(a)*radius,z=Math.cos(a)*radius;if(isSafe(x,z)||Math.hypot(x-FISHING.x,z-FISHING.z)<34||Math.hypot(x-15,z-10)<11||Math.hypot(x+43,z-20)<13||Math.hypot(x,z+27)<6||EXPEDITION_SITES.some(q=>Math.hypot(x-q.x,z-q.z)<20))continue;let clear=objects.every(o=>Math.hypot(x-o.x,z-o.z)>((type==='tree'&&o.type==='tree')?4.15:(type==='tree'||o.type==='tree')?3.3:2.45));if(clear){add(type,x,z);break}}}}
 populate(220,5,101);populate(380,102,225);
 for(let [x,z,t] of [[12,15,'barrel'],[18,15,'barrel'],[10,9,'crate'],[20,11,'crate'],[11,5,'barrel'],[-48,15,'barrel'],[-39,15,'crate'],[-47,13,'crate'],[-40,14,'military'],[-42,11,'barrel'],
 [134,113,'military'],[141,112,'military'],[146,115,'crate'],[132,116,'barrel'],[147,111,'barrel'],
 [-151,-117,'military'],[-145,-117,'military'],[-138,-116,'crate'],[-153,-113,'barrel'],[-137,-112,'barrel'],
 [-131,133,'military'],[-124,132,'military'],[-118,134,'crate'],[-133,137,'barrel'],[-117,137,'barrel'],
 [65,-45,'barrel'],[68,-46,'crate'],[100,-85,'barrel'],[-85,-55,'barrel'],[-83,-53,'crate'],[30,150,'barrel'],[33,151,'crate'],[-40,190,'barrel'],[175,20,'barrel'],[177,21,'crate'],[-185,25,'barrel'],[-183,27,'crate']])add(t,x,z)
 return objects;
}
module.exports={createWorld,isSafe};
