const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const code = ts.transpileModule(fs.readFileSync('lib/museum-layout.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const sandbox = { exports: {} }; vm.runInNewContext(code, sandbox);
const { canWalk, moveThroughMuseum, ENTRANCE, exhibitSlots } = sandbox.exports;
assert(canWalk(ENTRANCE.x, ENTRANCE.z), 'Entrance must be clear');
for (const [x, z] of [[-6,-2.5],[6,-2.5],[-19,-3],[19,-3],[13,-17],[-13,-17],[-11,16],[11,17],[0,-21]]) {
  assert(!canWalk(x,z), `Solid wall or furniture must block (${x}, ${z})`);
}
for (const [x,z] of [[-6,5],[6,5],[-6,-10],[6,-10],[-14,-3],[14,-3],[0,-17]]) {
  assert(canWalk(x,z), `Door must be open at (${x}, ${z})`);
}
const blocked=moveThroughMuseum(0,-2.5,15,0);
assert(blocked.x<5.5, 'Large movement must not tunnel through corridor wall');
assert(canWalk(blocked.x,blocked.z), 'Collision response must leave player in free space');
const throughDoor=moveThroughMuseum(0,5,14,0);
assert(Math.abs(throughDoor.x-14)<.01, 'Player must pass through the east doorway');
const diagonal=moveThroughMuseum(5,-2.5,4,4);
assert(diagonal.z>-2, 'Player must slide along walls instead of getting stuck');
// Independent flood-fill verifies every display has an accessible viewing point.
const start=[0,21], queue=[start], visited=new Set(['0,21']);
for(let i=0;i<queue.length;i++){
 const [x,z]=queue[i];
 for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const nx=x+dx,nz=z+dz,key=`${nx},${nz}`;
  if(!visited.has(key)&&canWalk(nx,nz)){visited.add(key);queue.push([nx,nz]);}
 }
}
for(const point of [[-17,4],[-17,-10],[17,4],[17,-10],[-11,-22],[11,-22]]) assert(visited.has(point.join(',')),`Viewing point ${point} must connect to the entrance`);
assert(exhibitSlots.length===6, 'All six exhibits need a display position');
assert(!canWalk(23,0)&&!canWalk(0,-26), 'Building boundary must block exits');
console.log('Museum layout: collision, door clearance, wall sliding and reachability checks passed.');

const { nearbyExhibit, viewSectorPath } = sandbox.exports;
const displays = exhibitSlots.map((slot, index) => ({ ...slot, id: `exhibit-${index}` }));
assert.equal(nearbyExhibit(17,4,displays)?.id, 'exhibit-2', 'Approaching a display should reveal its introduction');
assert.equal(nearbyExhibit(12,4,displays,'exhibit-2'), null, 'Leaving the display should hide its introduction');
assert.equal(nearbyExhibit(14.5,4,displays), null, 'A distant display should not activate early');
assert.equal(nearbyExhibit(14.5,4,displays,'exhibit-2')?.id, 'exhibit-2', 'Release margin should prevent edge flicker');
assert.equal(nearbyExhibit(5,-2.5,[{id:'behind-wall',position:[7,0,-2.5],yaw:-Math.PI/2}]),null,'A neighbouring room must not activate through its wall');
assert.equal(nearbyExhibit(23,4,displays),null,'Standing behind the artwork must not reveal its introduction');
assert.match(viewSectorPath(0,0,0,90),/^M 0 0 L .* A 10 10 0 0 1 .* Z$/, 'Field of view must be a filled arc sector');
assert.notEqual(viewSectorPath(0,0,0,90),viewSectorPath(0,0,Math.PI/2,90),'Field of view must rotate with camera yaw');
assert.notEqual(viewSectorPath(0,0,0,90),viewSectorPath(0,0,0,55),'Field of view must adapt to the camera aspect ratio');
const contentSandbox={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/culture.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,contentSandbox);
const introductions=[...contentSandbox.exports.culturalExhibits,...contentSandbox.exports.lanternExhibits];
assert.equal(introductions.length,12);
for(const exhibit of introductions){assert(exhibit.introduction?.split(/\s+/).length>=65,`${exhibit.id} needs a complete English introduction`);assert(fs.existsSync(`public${exhibit.imageUrl}`),`${exhibit.id} needs a valid image`);}
assert.equal(new Set(introductions.map(e=>e.introduction)).size,12,'Every image needs its own introduction');
console.log('Museum proximity, wall occlusion, field of view and all 12 English introductions passed.');
