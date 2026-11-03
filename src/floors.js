import {generateRoomGraph} from './rooms.js';
import {spawnEnemy,Boss} from './enemies.js';
import {randomItem} from './items.js';
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
export function generateFloor(depth=1){const rng=mulberry32((depth*9973)^(Math.random()*0xffffffff));const rooms=generateRoomGraph(rng,depth,9+Math.floor(rng()*4));rooms.forEach((r,i)=>{if(r.kind==='combat'){const n=2+Math.floor(rng()*4);for(let k=0;k<n;k++){const types=['chaser','flyer','tank','turret','splitter'];r.enemies.push(spawnEnemy(-250+rng()*500,-145+rng()*290,types[(k+i+depth)%types.length]))}r.reward=randomItem(rng)}else if(r.kind==='treasure'){r.reward=randomItem(rng)}else if(r.kind==='boss'){r.enemies=[new Boss(0,-20)];r.reward=randomItem(rng)}});return{depth,rooms,rngSeed:Date.now()}}
