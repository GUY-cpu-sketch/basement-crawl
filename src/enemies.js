export const ENEMY_TYPES={
 chaser:{hp:3,speed:72,radius:17,contact:1,color:'#c76',ai:'chase'},
 flyer:{hp:2,speed:105,radius:15,contact:1,color:'#8cc',ai:'zigzag'},
 tank:{hp:9,speed:38,radius:22,contact:2,color:'#a68',ai:'chase'},
 turret:{hp:4,speed:0,radius:18,contact:1,color:'#d8a',ai:'shoot'},
 splitter:{hp:5,speed:58,radius:19,contact:1,color:'#8d8',ai:'chase'}
};
export class Enemy{
 constructor(x,y,type='chaser'){const d=ENEMY_TYPES[type]||ENEMY_TYPES.chaser;this.x=x;this.y=y;this.type=type;this.hp=d.hp;this.maxHp=d.hp;this.speed=d.speed;this.radius=d.radius;this.contact=d.contact;this.color=d.color;this.ai=d.ai;this.alive=true;this.cool=Math.random();this.phase=Math.random()*7;}
 update(dt,p,s){if(!this.alive)return;this.cool-=dt;this.phase+=dt;const dx=p.x-this.x,dy=p.y-this.y,d=Math.hypot(dx,dy)||1;
  if(this.ai==='chase'){this.x+=dx/d*this.speed*dt;this.y+=dy/d*this.speed*dt}
  if(this.ai==='zigzag'){const nx=-dy/d,ny=dx/d;const sway=Math.sin(this.phase*4)*.65;this.x+=(dx/d+nx*sway)*this.speed*dt;this.y+=(dy/d+ny*sway)*this.speed*dt}
  if(this.ai==='shoot'&&this.cool<=0){s.enemyShots.push({x:this.x,y:this.y,vx:dx/d*180,vy:dy/d*180,damage:1,life:2,kind:'enemy'});this.cool=1.7}
  if(d<this.radius+16&&this.cool<=0){p.takeDamage(Math.max(1,this.contact-p.contactArmor));this.cool=.75}
 }
}
export class Boss extends Enemy{
 constructor(x,y){super(x,y,'tank');this.name='The Burrow Warden';this.hp=36;this.maxHp=36;this.radius=34;this.speed=46;this.color='#e7b14f';this.ai='boss';this.phase=0;this.cool=.5}
 update(dt,p,s){if(!this.alive)return;this.phase+=dt;this.cool-=dt;const dx=p.x-this.x,dy=p.y-this.y,d=Math.hypot(dx,dy)||1;
  this.x+=dx/d*this.speed*dt;this.y+=dy/d*this.speed*dt;
  if(this.cool<=0){const base=Math.atan2(dy,dx),n=this.hp<this.maxHp*.5?7:5;for(let i=0;i<n;i++){const a=base+(i-(n-1)/2)*.18;s.enemyShots.push({x:this.x,y:this.y,vx:Math.cos(a)*210,vy:Math.sin(a)*210,damage:1,life:2.2,kind:'enemy'})}this.cool=this.hp<this.maxHp*.5?.8:1.2}
  if(d<this.radius+16&&this.cool<=0){p.takeDamage(Math.max(1,2-p.contactArmor));this.cool=.9}
 }
}
export function spawnEnemy(x,y,type='chaser'){return new Enemy(x,y,type)}
