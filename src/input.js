// Device-aware input: picks a control scheme from the hardware actually in use.
// PC: WASD moves, arrow keys shoot. Touch: dual virtual sticks. Controller: gamepad sticks.
export const SCHEMES={PC:'pc',TOUCH:'touch',GAMEPAD:'gamepad'};
export const SCHEME_INFO={
 [SCHEMES.PC]:{label:'PC',hint:'WASD move · Arrow keys shoot · B bomb'},
 [SCHEMES.TOUCH]:{label:'Touch',hint:'Left stick move · Right stick aim & shoot · BOMB button'},
 [SCHEMES.GAMEPAD]:{label:'Controller',hint:'Left stick move · Right stick aim & shoot · B bomb'}
};
const STICK_DEADZONE=.28,TOUCH_DEADZONE=12,STICK_RADIUS=46,BOMB_RADIUS=30,BOMB_BOTTOM=64;
const MOVE_KEYS={w:[0,-1],a:[-1,0],s:[0,1],d:[1,0]};
const SHOOT_KEYS={arrowup:[0,-1],arrowleft:[-1,0],arrowdown:[0,1],arrowright:[1,0]};
const GAME_KEYS=new Set([...Object.keys(MOVE_KEYS),...Object.keys(SHOOT_KEYS),'b']);

function media(query){return typeof matchMedia==='function'?matchMedia(query):null}
function unit(x,y){const m=Math.hypot(x,y);return m?{x:x/m,y:y/m}:{x:0,y:0}}
function padButton(buttons,i){const b=buttons[i];return !!b&&(b.pressed||b.value>.5)}
function connectedPads(){
 if(typeof navigator==='undefined'||typeof navigator.getGamepads!=='function')return[];
 try{return Array.from(navigator.getGamepads()).filter(Boolean)}catch{return[]}
}
function bombButton(){
 return{x:(typeof innerWidth==='number'?innerWidth:0)/2,y:(typeof innerHeight==='number'?innerHeight:0)-BOMB_BOTTOM,r:BOMB_RADIUS};
}

export function stickVector(dx,dy,deadzone=STICK_DEADZONE){
 return Math.hypot(dx,dy)<=deadzone?{x:0,y:0}:unit(dx,dy);
}

export function keyMove(keys){
 let x=0,y=0;
 for(const [k,[kx,ky]] of Object.entries(MOVE_KEYS))if(keys.has(k)){x+=kx;y+=ky}
 return{x,y};
}

export function keyShoot(keys){
 let x=0,y=0;
 for(const [k,[kx,ky]] of Object.entries(SHOOT_KEYS))if(keys.has(k)){x+=kx;y+=ky}
 return x||y?unit(x,y):null;
}

// Decide the starting scheme from the device capabilities, not the user agent.
export function detectScheme({coarsePointer=false,finePointer=false,maxTouchPoints=0,gamepad=false}={}){
 if(gamepad)return SCHEMES.GAMEPAD;
 if(coarsePointer||(!finePointer&&maxTouchPoints>0))return SCHEMES.TOUCH;
 return SCHEMES.PC;
}

// Normalise a Gamepad API snapshot into the same shape as the other schemes.
export function readGamepad(pad){
 const out={move:{x:0,y:0},aim:null,shooting:false,bombHeld:false,active:false};
 if(!pad||pad.connected===false)return out;
 const axes=pad.axes||[],buttons=pad.buttons||[];
 const axis=i=>Number(axes[i])||0;
 out.move=stickVector(axis(0),axis(1));
 const aim=stickVector(axis(2),axis(3));
 if(aim.x||aim.y)out.aim=aim;
 const dpad=unit((padButton(buttons,15)?1:0)-(padButton(buttons,14)?1:0),(padButton(buttons,13)?1:0)-(padButton(buttons,12)?1:0));
 if(!out.move.x&&!out.move.y&&(dpad.x||dpad.y))out.move=dpad;
 out.shooting=!!out.aim||padButton(buttons,7)||padButton(buttons,0)||padButton(buttons,2);
 out.bombHeld=padButton(buttons,1)||padButton(buttons,6);
 out.active=!!(out.move.x||out.move.y||out.aim||out.shooting||out.bombHeld)||buttons.some((b,i)=>i<12&&padButton(buttons,i));
 return out;
}

export function createInput(canvas,{onSchemeChange}={}){
 const coarsePointer=!!media('(pointer: coarse)')?.matches,finePointer=!!media('(pointer: fine)')?.matches;
 const maxTouchPoints=typeof navigator!=='undefined'?navigator.maxTouchPoints||0:0;
 const keys=new Set();
 let moveStick=null,aimStick=null,bombPointer=null,bombPrev=false,lastAim={x:1,y:0};
 const frame={move:{x:0,y:0},aim:null,shooting:false,bomb:false};
 const detect=gamepad=>detectScheme({coarsePointer,finePointer,maxTouchPoints,gamepad});
 const input={scheme:detect(connectedPads().length>0),frame,setScheme,poll,visuals};
 const capture=e=>{try{canvas.setPointerCapture?.(e.pointerId)}catch{}};

 function setScheme(next){
  if(input.scheme===next)return;
  input.scheme=next;
  if(next!==SCHEMES.TOUCH){moveStick=null;aimStick=null;bombPointer=null}
  if(next!==SCHEMES.PC)keys.clear();
  onSchemeChange?.(next);
 }

 addEventListener('keydown',e=>{
  const key=e.key.toLowerCase();
  if(key===' '||GAME_KEYS.has(key))e.preventDefault();
  keys.add(key);
  if(GAME_KEYS.has(key))setScheme(SCHEMES.PC);
 });
 addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
 addEventListener('blur',()=>{keys.clear();moveStick=null;aimStick=null;bombPointer=null});
 addEventListener('gamepadconnected',()=>setScheme(SCHEMES.GAMEPAD));
 addEventListener('gamepaddisconnected',()=>setScheme(detect(false)));

 canvas.addEventListener('contextmenu',e=>e.preventDefault());
 canvas.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse')return;
  setScheme(SCHEMES.TOUCH);
  e.preventDefault();
  const x=e.clientX,y=e.clientY,bomb=bombButton();
  if(bombPointer===null&&Math.hypot(x-bomb.x,y-bomb.y)<=bomb.r){bombPointer=e.pointerId;capture(e);return}
  const kind=x<(typeof innerWidth==='number'?innerWidth:0)/2?'move':'aim';
  if(kind==='move'?moveStick:aimStick)return;
  const stick={id:e.pointerId,ox:x,oy:y,x,y};
  if(kind==='move')moveStick=stick;else aimStick=stick;
  capture(e);
 });
 canvas.addEventListener('pointermove',e=>{
  if(moveStick?.id===e.pointerId){moveStick.x=e.clientX;moveStick.y=e.clientY}
  else if(aimStick?.id===e.pointerId){aimStick.x=e.clientX;aimStick.y=e.clientY}
 });
 const releasePointer=e=>{
  if(moveStick?.id===e.pointerId)moveStick=null;
  if(aimStick?.id===e.pointerId)aimStick=null;
  if(bombPointer===e.pointerId)bombPointer=null;
 };
 addEventListener('pointerup',releasePointer);
 addEventListener('pointercancel',releasePointer);

 // Called once per frame: resolves the active scheme into one normalised frame.
 function poll(){
  const gamepad=readGamepad(connectedPads()[0]);
  if(gamepad.active)setScheme(SCHEMES.GAMEPAD);
  frame.move={x:0,y:0};frame.aim=null;frame.shooting=false;frame.bomb=false;
  let bombHeld=false;
  if(input.scheme===SCHEMES.GAMEPAD){
   frame.move=gamepad.move;frame.shooting=gamepad.shooting;bombHeld=gamepad.bombHeld;
   if(gamepad.aim)lastAim=gamepad.aim;
   if(gamepad.shooting)frame.aim=gamepad.aim||lastAim;
  }else if(input.scheme===SCHEMES.TOUCH){
   if(moveStick)frame.move=stickVector(moveStick.x-moveStick.ox,moveStick.y-moveStick.oy,TOUCH_DEADZONE);
   if(aimStick){
    const aim=stickVector(aimStick.x-aimStick.ox,aimStick.y-aimStick.oy,TOUCH_DEADZONE);
    if(aim.x||aim.y){lastAim=aim;frame.aim=aim;frame.shooting=true}
   }
   bombHeld=bombPointer!==null;
  }else{
   frame.move=keyMove(keys);
   const aim=keyShoot(keys);
   if(aim){lastAim=aim;frame.aim=aim;frame.shooting=true}
   bombHeld=keys.has('b');
  }
  frame.bomb=bombHeld&&!bombPrev;
  bombPrev=bombHeld;
 }

 function visuals(){
  const sticks=[];
  for(const [kind,stick] of [['move',moveStick],['aim',aimStick]])if(stick)sticks.push({kind,ox:stick.ox,oy:stick.oy,x:stick.x,y:stick.y});
  return{sticks,bomb:{...bombButton(),pressed:bombPointer!==null},radius:STICK_RADIUS};
 }

 return input;
}
