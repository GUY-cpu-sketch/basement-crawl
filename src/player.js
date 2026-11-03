import {fireProjectile,detonateBomb} from './combat.js';
export class Player{
 constructor(){this.reset()}
 reset(){this.x=0;this.y=0;this.hp=6;this.maxHp=6;this.speed=185;this.damage=2;this.fireRate=.24;this.cooldown=0;this.pierce=0;this.contactArmor=0;this.bombs=3;this.keys=1;this.coins=10;this.capacity=9;this.luck=0;this.spark=false;this.lowHealthBonus=false;this.items=[]}
 getDamage(){return this.damage+(this.lowHealthBonus&&this.hp<=2?Math.ceil(this.damage*.5):0)}
 takeDamage(n){this.hp=Math.max(0,this.hp-n)}
 update(dt,s){const inp=s.input.frame;const x=inp.move.x,y=inp.move.y,m=Math.hypot(x,y)||1,px=this.x,py=this.y;this.x=Math.max(-310,Math.min(310,px+x/m*this.speed*dt));this.y=Math.max(-205,Math.min(205,py+y/m*this.speed*dt));const vx=dt>0?(this.x-px)/dt:0,vy=dt>0?(this.y-py)/dt:0;this.cooldown-=dt;if(this.cooldown<=0&&inp.shooting&&inp.aim){s.shots.push(fireProjectile(Math.atan2(inp.aim.y,inp.aim.x),this,{x:vx,y:vy}));this.cooldown=this.fireRate}if(inp.bomb)detonateBomb(s,this.x,this.y)}
 collect(item,state){if(!item)return;item.apply(this,state);this.items.push(item.name)}
}
