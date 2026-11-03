import assert from 'node:assert/strict';
import {fireProjectile} from '../src/combat.js';
import {Player} from '../src/player.js';

const fakePlayer=()=>({x:0,y:0,getDamage:()=>2,pierce:0});
const close=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-6,`${msg}: ${a} !== ${b}`);

// A projectile adds the supplied momentum to its aim velocity.
let shot=fireProjectile(0,fakePlayer(),{x:120,y:-60});
close(shot.vx,580,'vx with momentum');
close(shot.vy,-60,'vy with momentum');
shot=fireProjectile(Math.PI/2,fakePlayer());
close(shot.vx,0,'vx without momentum');
close(shot.vy,460,'vy without momentum');

const frame=(move,aim={x:1,y:0},shooting=true)=>({input:{frame:{move,aim,shooting,bomb:false}},shots:[]});

// Moving up while shooting right pushes the shot upward at player speed.
const player=new Player();
let state=frame({x:0,y:-1});
player.update(.1,state);
assert.equal(state.shots.length,1);
close(state.shots[0].vx,460,'strafe shot vx');
close(state.shots[0].vy,-185,'strafe shot vy');
close(player.y,-18.5,'player y');
assert.equal(state.shots[0].x,0);

// Standing still adds nothing.
player.reset();player.cooldown=0;
state=frame({x:0,y:0});
player.update(.1,state);
close(state.shots[0].vx,460,'idle shot vx');
close(state.shots[0].vy,0,'idle shot vy');

// Diagonal movement contributes the normalised speed, not the raw sum.
player.reset();player.cooldown=0;
state=frame({x:1,y:1});
player.update(.1,state);
close(Math.hypot(state.shots[0].vx-460,state.shots[0].vy),Math.hypot(185,185)/Math.SQRT2,'diagonal momentum');

// Pinned against a wall there is no real velocity to inherit.
player.reset();player.x=-310;player.cooldown=0;
state=frame({x:-1,y:0});
player.update(.1,state);
assert.equal(player.x,-310);
close(state.shots[0].vx,460,'wall shot vx');
close(state.shots[0].vy,0,'wall shot vy');

// Fire rate is unchanged: one shot per cooldown window.
player.reset();player.cooldown=0;
state=frame({x:0,y:0});
player.update(.1,state);
player.update(.1,state);
assert.equal(state.shots.length,1);

console.log('Basement Crawl shot-momentum test passed');
