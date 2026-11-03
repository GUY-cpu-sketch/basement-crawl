export const ITEMS=[
{id:'ember-heart',name:'Ember Heart',desc:'+2 max health',apply:p=>{p.maxHp+=2;p.hp+=2}},
{id:'swift-boots',name:'Swift Boots',desc:'+18% movement speed',apply:p=>{p.speed*=1.18}},
{id:'heavy-shot',name:'Heavy Shot',desc:'+1 damage, slower fire',apply:p=>{p.damage+=1;p.fireRate*=1.18}},
{id:'echo-lens',name:'Echo Lens',desc:'shots pierce one target',apply:p=>{p.pierce+=1}},
{id:'tiny-familiar',name:'Tiny Familiar',desc:'adds +1 damage',apply:p=>{p.damage+=1}},
{id:'iron-skin',name:'Iron Skin',desc:'contact damage is reduced',apply:p=>{p.contactArmor+=1}},
{id:'spark-core',name:'Spark Core',desc:'shots leave a damaging spark',apply:p=>{p.spark=true}},
{id:'glass-cannon',name:'Glass Cannon',desc:'+4 damage, -2 max health',apply:p=>{p.damage+=4;p.maxHp=Math.max(2,p.maxHp-2);p.hp=Math.min(p.hp,p.maxHp)}},
{id:'deep-pocket',name:'Deep Pocket',desc:'+8 bomb/key capacity',apply:p=>{p.capacity+=8}},
{id:'cold-blood',name:'Cold Blood',desc:'+50% damage at 1 heart',apply:p=>{p.lowHealthBonus=true}},
{id:'map-fragment',name:'Map Fragment',desc:'reveals the whole floor map',apply:(p,s)=>{s.mapRevealed=true}},
{id:'golden-thread',name:'Golden Thread',desc:'+20% coin drops',apply:p=>{p.luck+=.2}}
];
export function randomItem(rng){return ITEMS[Math.floor(rng()*ITEMS.length)]}
