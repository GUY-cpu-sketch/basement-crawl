const KEY='basement-crawl-save-v1';
export function loadSave(){try{return JSON.parse(localStorage.getItem(KEY))||{bestFloor:0,unlocks:[]}}catch{return{bestFloor:0,unlocks:[]}}}
export function recordFloor(save,depth){save.bestFloor=Math.max(save.bestFloor,depth);localStorage.setItem(KEY,JSON.stringify(save))}
