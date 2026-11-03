Attempting to perform the InitializeDefaultDrives operation on the 'FileSystem' provider failed.
import {fireProjectile,detonateBomb} from './combat.js';
export class Player{
 constructor(){this.reset()}
 reset(){this.x=0;this.y=0;this.hp=6;this.maxHp=6;this.speed=185;this.damage=2;this.fireRate=.24;this.cooldown=0;this.pierce=0;this.contactArmor=0;this.bombs=3;this.keys=1;this.coins=10;this.capacity=9;this.luck=0;this.spark=false;this.lowHealthBonus=false;this.items=[]}
 getDamage(){return this.damage+(this.lowHealthBonus&&this.hp<=2?Math.ceil(this.damage*.5):0)}
 takeDamage(n){this.hp=Math.max(0,this.hp-n)}
 update(dt,s){let x=(s.keys.has('d')||s.keys.has('arrowright')?1:0)-(s.keys.has('a')||s.keys.has('arrowleft')?1:0),y=(s.keys.has('s')||s.keys.has('arrowdown')?1:0)-(s.keys.has('w')||s.keys.has('arrowup')?1:0);const move=s.touch.move;if(move){const dx=move.x-move.originX,dy=move.y-move.originY,m=Math.hypot(dx,dy);if(m>12){x=dx/m;y=dy/m}}const m=Math.hypot(x,y)||1;this.x+=x/m*this.speed*dt;this.y+=y/m*this.speed*dt;this.cooldown-=dt;const aim=s.touch.aim;if(aim&&Math.hypot(aim.x-aim.originX,aim.y-aim.originY)>10&&this.cooldown<=0){const a=Math.atan2(aim.y-aim.originY,aim.x-aim.originX);s.shots.push(fireProjectile(a,this));this.cooldown=this.fireRate}if(s.keys.has('b')&&!s.lastBomb){detonateBomb(s,this.x,this.y);s.lastBomb=true}else if(!s.keys.has('b'))s.lastBomb=false;this.x=Math.max(-310,Math.min(310,this.x));this.y=Math.max(-205,Math.min(205,this.y))}
 collect(item,state){if(!item)return;item.apply(this,state);this.items.push(item.name)}
}

