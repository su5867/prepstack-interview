// Minimal DOM/browser stub so we can execute the concatenated
// browser scripts under plain Node and catch ReferenceErrors /
// broken cross-file calls before shipping.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeElement(){
  const listeners = {};
  const el = {
    _html: '',
    style: {},
    classList: {
      set: new Set(),
      add(c){ this.set.add(c); },
      remove(c){ this.set.delete(c); },
      toggle(c, cond){ if(cond) this.set.add(c); else this.set.delete(c); },
      contains(c){ return this.set.has(c); },
    },
    dataset: {},
    children: [],
    addEventListener(evt, fn){ (listeners[evt] = listeners[evt] || []).push(fn); },
    querySelectorAll(){ return []; },
    querySelector(){ return null; },
    closest(){ return null; },
    appendChild(){ return el; },
    remove(){},
    focus(){},
    click(){ (listeners['click']||[]).forEach(fn => fn({ target: el })); },
    setAttribute(k,v){ el.dataset[k.replace('data-','')] = v; el['_attr_'+k]=v; },
    getAttribute(k){ return el['_attr_'+k]; },
  };
  Object.defineProperty(el, 'innerHTML', {
    get(){ return el._html; },
    set(v){ el._html = String(v); },
  });
  Object.defineProperty(el, 'value', { value: '', writable: true });
  return el;
}

const elements = {};
function getEl(id){
  if(!elements[id]) elements[id] = makeElement();
  return elements[id];
}

const documentStub = {
  getElementById(id){ return getEl(id); },
  querySelectorAll(){ return []; },
  querySelector(){ return null; },
  addEventListener(){},
  createElement(){ return makeElement(); },
  body: makeElement(),
};

const windowStub = {
  storage: undefined, // simulate "no Claude storage" -> falls back to localStorage stub below
  localStorage: (function(){
    const store = {};
    return {
      getItem:(k)=> (k in store ? store[k] : null),
      setItem:(k,v)=>{ store[k]=String(v); },
      removeItem:(k)=>{ delete store[k]; },
    };
  })(),
  open(){},
};

const sandbox = {
  document: documentStub,
  window: windowStub,
  console,
  URL: { createObjectURL: ()=>'blob://x', revokeObjectURL: ()=>{} },
  Blob: function(){},
  alert: ()=>{},
  prompt: ()=>null,
  fetch: undefined,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const files = ['js/logic.js', 'js/data.js', 'js/storage.js', 'js/app.js'];
const combined = files.map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n;\n');

try{
  vm.runInContext(combined, sandbox, { filename: 'combined-app.js' });
  console.log('Loaded all scripts without a ReferenceError.');
} catch(e){
  console.error('FAILED while loading scripts:', e.message);
  process.exit(1);
}

// Exercise the main render paths the way a user's clicks would.
const checks = [
  () => sandbox.renderHome(),
  () => sandbox.navigateTo('progress'),
  () => sandbox.navigateTo('profile'),
  () => sandbox.openModule('dsa-topics'),
  () => sandbox.renderQuestionList({ topicId: 'arrays', title: 'Arrays & Strings' }),
  () => sandbox.openQuestionSheet('q1'),
  () => sandbox.openModule('company-wise'),
  () => sandbox.openModule('daily-challenge'),
  () => sandbox.openModule('bookmarks', true),
  () => sandbox.openModule('notes'),
  () => sandbox.openModule('community'),
  () => sandbox.openModule('reminders', true),
  () => sandbox.openModule('system-design'),
  () => sandbox.openModule('behavioral'),
  () => sandbox.openModule('mock-interviews'),
  () => sandbox.openModule('study-plan'),
  () => sandbox.openModule('resources'),
  () => sandbox.openAddQuestionForm('arrays'),
  () => sandbox.openAddQuestionForm(),
  () => sandbox.openAddModuleItemForm('resources'),
  () => sandbox.cycleStatus('study-plan', 'sp1'),
  () => { sandbox.theme = 'dark'; sandbox.applyTheme(); },
  () => sandbox.exportData(),
];

let failed = 0;
checks.forEach((fn, i) => {
  try{ fn(); }
  catch(e){ failed++; console.error(`Check #${i} (${fn.toString().slice(0,60)}...) FAILED:`, e.message); }
});

if(failed){
  console.error(`\n${failed} of ${checks.length} runtime checks failed.`);
  process.exit(1);
} else {
  console.log(`All ${checks.length} runtime smoke checks passed.`);
}
