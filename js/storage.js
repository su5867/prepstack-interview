/* ======================================================
   PERSISTENCE
   Uses window.storage when running inside a Claude artifact;
   falls back to the browser's localStorage on a real
   deployment (GitHub Pages, any static host); falls back to
   in-memory only if neither is available.
====================================================== */
const STORAGE_KEY = "prepstack-state-v3";
const hasWindowStorage = (typeof window !== "undefined" && !!window.storage);
const hasLocalStorage = (function(){
  try{
    if(typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__prepstack_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch(e){ return false; }
})();
const storageAvailable = hasWindowStorage || hasLocalStorage;

function buildPayload(){
  return {
    questionState: Object.fromEntries(questions.map(q => [q.id, { status:q.status, bookmarked:q.bookmarked }])),
    customQuestions: questions.filter(q => q.custom),
    notes, reminders, favorites, streak, dailyChallengeDone, notifCount, theme,
    moduleItems, communityList,
  };
}

function applyPayload(saved){
  if(!saved) return;
  if(Array.isArray(saved.customQuestions)){
    saved.customQuestions.forEach(cq => {
      if(!questions.find(q => q.id === cq.id)) questions.push(cq);
    });
  }
  if(saved.questionState){
    questions.forEach(q => {
      const s = saved.questionState[q.id];
      if(s){ q.status = s.status; q.bookmarked = !!s.bookmarked; }
    });
  }
  if(Array.isArray(saved.notes)) notes = saved.notes;
  if(Array.isArray(saved.reminders)) reminders = saved.reminders;
  if(Array.isArray(saved.favorites)) favorites = saved.favorites;
  if(typeof saved.streak === "number") streak = saved.streak;
  if(typeof saved.dailyChallengeDone === "boolean") dailyChallengeDone = saved.dailyChallengeDone;
  if(typeof saved.notifCount === "number") notifCount = saved.notifCount;
  if(saved.theme === "light" || saved.theme === "dark") theme = saved.theme;
  if(saved.moduleItems) moduleItems = saved.moduleItems;
  if(Array.isArray(saved.communityList)){
    communityList.length = 0;
    communityList.push(...saved.communityList);
  }
}

async function loadState(){
  if(!storageAvailable) return;
  try{
    if(hasWindowStorage){
      const res = await window.storage.get(STORAGE_KEY, false);
      if(res && res.value) applyPayload(JSON.parse(res.value));
    } else if(hasLocalStorage){
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if(raw) applyPayload(JSON.parse(raw));
    }
  } catch(e){ /* no saved state yet, use defaults */ }
}

async function saveState(){
  if(!storageAvailable) return;
  try{
    const payload = JSON.stringify(buildPayload());
    if(hasWindowStorage) await window.storage.set(STORAGE_KEY, payload, false);
    else if(hasLocalStorage) window.localStorage.setItem(STORAGE_KEY, payload);
  } catch(e){ /* saving is best-effort */ }
}
