import assert from 'node:assert/strict';
import {generateFloor} from '../src/floors.js';
for(let n=0;n<20;n++){
 const floor=generateFloor(1+n%4),rooms=floor.rooms;
 assert.equal(rooms[0].kind,'start');
 assert.ok(rooms.some(r=>r.kind==='boss'));
 for(let i=0;i<rooms.length;i++) for(const [dir,target] of Object.entries(rooms[i].connections||{})){
  assert.ok(rooms[target],`missing target ${target}`);
  if(!rooms[i].fromHidden){const opposite={N:'S',E:'W',S:'N',W:'E'}[dir];assert.equal(rooms[target].connections[opposite],i,`broken ${i}->${target}`)}
 }
}
console.log('Basement Crawl room-generation smoke test passed');
