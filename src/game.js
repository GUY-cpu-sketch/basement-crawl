import { Player } from './player.js';
import { generateFloor } from './floors.js';
import { drawGame } from './rendering.js';
import { updateProjectiles, hitTestProjectiles } from './combat.js';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const state={time:0,keys:new Set(),touch:{x:0,y:0,active:false},shots:[],floor:generateFloor(1),roomIndex:0};
const player=new Player();state.player=player;
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}addEventListener('resize',resize);resize();
addEventListener('keydown',e=>state.keys.add(e.key.toLowerCase()));addEventListener('keyup',e=>state.keys.delete(e.key.toLowerCase()));
canvas.addEventListener('pointerdown',e=>state.touch={x:e.clientX,y:e.clientY,active:true});canvas.addEventListener('pointermove',e=>{if(state.touch.active)state.touch={x:e.clientX,y:e.clientY,active:true}});canvas.addEventListener('pointerup',()=>state.touch.active=false);
function update(dt){state.time+=dt;player.update(dt,state);const room=state.floor.rooms[state.roomIndex];for(const e of room.enemies)e.update(dt,player);updateProjectiles(state.shots,dt);hitTestProjectiles(state.shots,room.enemies);if(player.hp<=0){state.floor=generateFloor(1);state.roomIndex=0;player.reset()}}
function loop(t){const dt=Math.min(.033,(t-(state.last||t))/1000);state.last=t;update(dt);drawGame(ctx,state);requestAnimationFrame(loop)}requestAnimationFrame(loop);
