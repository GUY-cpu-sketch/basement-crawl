import assert from 'node:assert/strict';
import {SCHEMES,SCHEME_INFO,createInput,detectScheme,keyMove,keyShoot,readGamepad,stickVector} from '../src/input.js';

const listeners={},canvasListeners={};
globalThis.addEventListener=(type,fn)=>{(listeners[type]||=[]).push(fn)};
globalThis.matchMedia=()=>({matches:false});
Object.defineProperty(globalThis,'navigator',{value:{maxTouchPoints:0,getGamepads:()=>[]},configurable:true,writable:true});
globalThis.innerWidth=1000;globalThis.innerHeight=700;
const canvas={addEventListener:(type,fn)=>{(canvasListeners[type]||=[]).push(fn)}};
const fire=(type,event,target=listeners)=>{(target[type]||[]).forEach(fn=>fn(event))};
const key=(k,down)=>fire(down?'keydown':'keyup',{key:k,preventDefault(){}});
const pointer=(type,pointerId,x,y,target=canvasListeners)=>fire(type,{pointerId,pointerType:'touch',clientX:x,clientY:y,preventDefault(){}},target);

assert.deepEqual(stickVector(0,0),{x:0,y:0});
assert.deepEqual(stickVector(.1,.1),{x:0,y:0});
assert.deepEqual(stickVector(1,0),{x:1,y:0});
const diagonal=stickVector(1,1);
assert.ok(Math.abs(diagonal.x-Math.SQRT1_2)<1e-9&&Math.abs(diagonal.y-Math.SQRT1_2)<1e-9);

assert.deepEqual(keyMove(new Set(['w','d'])),{x:1,y:-1});
assert.deepEqual(keyMove(new Set(['arrowup'])),{x:0,y:0});
assert.deepEqual(keyShoot(new Set(['arrowleft'])),{x:-1,y:0});
assert.equal(keyShoot(new Set(['arrowleft','arrowright'])),null);
assert.equal(keyShoot(new Set(['w'])),null);

assert.equal(detectScheme({coarsePointer:true,maxTouchPoints:5}),SCHEMES.TOUCH);
assert.equal(detectScheme({finePointer:true,maxTouchPoints:5}),SCHEMES.PC);
assert.equal(detectScheme({coarsePointer:true,gamepad:true}),SCHEMES.GAMEPAD);
assert.equal(detectScheme({}),SCHEMES.PC);

const pad=(axes,buttons)=>({connected:true,axes,buttons:buttons.map(v=>({pressed:v>.5,value:v}))});
let gp=readGamepad(pad([.9,.1,0,0],[0,0,0,0,0,0,0,0]));
assert.ok(gp.move.x>.9&&Math.abs(gp.move.y)<.2);
assert.equal(gp.shooting,false);
gp=readGamepad(pad([0,0,0,-.9],[0,0,0,0,0,0,0,0]));
assert.deepEqual(gp.aim,{x:0,y:-1});
assert.equal(gp.shooting,true);
gp=readGamepad(pad([0,0,0,0],[0,1,0,0,0,0,0,0]));
assert.equal(gp.bombHeld,true);
assert.equal(readGamepad(null).active,false);
assert.equal(readGamepad({connected:true,axes:[0,0,0,0],buttons:[0,0,0,0].map(()=>({pressed:false,value:0}))}).active,false);

// Live input manager: keyboard is the default on a desktop.
const input=createInput(canvas);
assert.equal(input.scheme,SCHEMES.PC);
key('w',true);
input.poll();
assert.deepEqual(input.frame.move,{x:0,y:-1});
assert.equal(input.frame.shooting,false);
key('w',false);
key('ArrowRight',true);
input.poll();
assert.equal(input.frame.shooting,true);
assert.deepEqual(input.frame.aim,{x:1,y:0});
key('ArrowRight',false);
input.poll();
assert.equal(input.frame.shooting,false);

// A touch pointer switches to touch controls; the left half is the move stick.
pointer('pointerdown',1,100,600);
input.poll();
assert.equal(input.scheme,SCHEMES.TOUCH);
assert.deepEqual(input.frame.move,{x:0,y:0});
pointer('pointermove',1,170,600);
input.poll();
assert.deepEqual(input.frame.move,{x:1,y:0});
// The right half aims and fires.
pointer('pointerdown',2,800,600);
pointer('pointermove',2,800,530);
input.poll();
assert.equal(input.frame.shooting,true);
assert.ok(Math.abs(input.frame.aim.y+1)<1e-9);
assert.equal(input.visuals().sticks.length,2);
// Bomb button fires once per press.
pointer('pointerdown',3,500,700-64);
input.poll();
assert.equal(input.frame.bomb,true);
input.poll();
assert.equal(input.frame.bomb,false);
pointer('pointerup',3,500,700-64,listeners);
input.poll();
assert.equal(input.frame.bomb,false);
pointer('pointerup',1,170,600,listeners);
pointer('pointerup',2,800,530,listeners);
input.poll();
assert.equal(input.frame.shooting,false);

// A gamepad press takes over and drives movement.
navigator.getGamepads=()=>[pad([0,-1,0,0],[0,0,0,0,0,0,0,0])];
input.poll();
assert.equal(input.scheme,SCHEMES.GAMEPAD);
assert.deepEqual(input.frame.move,{x:0,y:-1});
const rightTrigger=pad([0,0,0,0],[0,0,0,0,0,0,0,1]);
navigator.getGamepads=()=>[rightTrigger];
input.poll();
assert.equal(input.frame.shooting,true);
assert.deepEqual(input.frame.aim,{x:0,y:-1});

// Any key press hands control back to the keyboard scheme once the pad goes idle.
navigator.getGamepads=()=>[];
key('d',true);
input.poll();
assert.equal(input.scheme,SCHEMES.PC);
assert.deepEqual(input.frame.move,{x:1,y:0});
key('d',false);

assert.equal(SCHEME_INFO[SCHEMES.PC].hint.includes('WASD'),true);
assert.equal(SCHEME_INFO[SCHEMES.TOUCH].label,'Touch');
assert.equal(SCHEME_INFO[SCHEMES.GAMEPAD].label,'Controller');
console.log('Basement Crawl device input test passed');
