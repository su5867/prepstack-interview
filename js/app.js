/* ======================================================
   FORM SHEET — reusable in-app modal form
   Replaces browser prompt()/alert() dialogs used for adding
   items, so the app feels like a real product rather than a
   demo held together with window.prompt().
====================================================== */
function fieldControlHTML(f){
  const id = `form-${f.key}`;
  if(f.type === 'select'){
    const opts = f.options.map(o => {
      const val = typeof o === 'object' ? o.value : o;
      const label = typeof o === 'object' ? o.label : o;
      const selected = val === f.value ? 'selected' : '';
      return `<option value="${val}" ${selected}>${label}</option>`;
    }).join('');
    return `<select id="${id}">${opts}</select>`;
  }
  if(f.type === 'textarea'){
    return `<textarea id="${id}" placeholder="${f.placeholder||''}" rows="3">${f.value||''}</textarea>`;
  }
  return `<input id="${id}" type="text" placeholder="${f.placeholder||''}" value="${f.value||''}">`;
}

function openFormSheet(title, fields, onSubmit){
  document.getElementById('sheet-content').innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-title">${title}</div>
    <div style="margin-top:14px;">
      ${fields.map(f => `<div class="field-row"><label for="form-${f.key}">${f.label}</label>${fieldControlHTML(f)}</div>`).join('')}
      <div style="display:flex; gap:10px; margin-top:4px;">
        <button class="toggle-mini" id="form-cancel-btn" style="flex:1;">Cancel</button>
        <button class="btn-primary" id="form-submit-btn" style="flex:2;">Save</button>
      </div>
    </div>
  `;
  document.getElementById('modal').classList.add('active');
  document.getElementById('form-cancel-btn').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('active');
  });
  document.getElementById('form-submit-btn').addEventListener('click', () => {
    const values = {};
    let missingRequired = false;
    fields.forEach(f => {
      const el = document.getElementById(`form-${f.key}`);
      values[f.key] = el.value.trim();
      if(f.required && !values[f.key]) missingRequired = true;
    });
    if(missingRequired){
      const firstEmpty = fields.find(f => f.required && !values[f.key]);
      document.getElementById(`form-${firstEmpty.key}`).style.borderColor = 'var(--coral)';
      return;
    }
    document.getElementById('modal').classList.remove('active');
    onSubmit(values);
  });
}

/* ======================================================
   THEME
====================================================== */
function applyTheme(){
  document.body.setAttribute('data-theme', theme);
}

/* ======================================================
   LOCAL ACCOUNT EXPERIENCE
   This static app has no server, so sign-in is deliberately local-first:
   a session and profile are kept only in this browser. A real deployment
   can replace these helpers with an API without changing the app screens.
====================================================== */
const ACCOUNT_KEY = 'prepstack-account-v1';
const SESSION_KEY = 'prepstack-session-v1';
let authMode = 'login';

function initials(name){
  return (name || 'PS').split(/\s+/).filter(Boolean).slice(0,2).map(p => p[0]).join('').toUpperCase();
}
function updateUserChrome(){
  document.querySelectorAll('.avatar').forEach(el => { if(!el.closest('.auth-card')) el.textContent = initials(currentUser.name); });
  const headerName = document.querySelector('.profile-name');
  const headerSub = document.querySelector('.profile-sub');
  if(headerName) headerName.textContent = currentUser.name;
  if(headerSub) headerSub.textContent = `${currentUser.role} · ${currentUser.code}`;
}
function localGet(key){
  try { return window.localStorage ? window.localStorage.getItem(key) : null; } catch(e) { return null; }
}
function localSet(key, value){
  try { if(window.localStorage) window.localStorage.setItem(key, value); } catch(e) { /* private browsing may block persistence */ }
}
function showAuth(){
  const screen = document.getElementById('auth-screen');
  if(screen) screen.classList.remove('is-hidden');
}
function completeSignIn(user){
  currentUser = { ...currentUser, ...user };
  localSet(SESSION_KEY, 'active');
  updateUserChrome();
  saveState();
  const screen = document.getElementById('auth-screen');
  if(screen) screen.classList.add('is-hidden');
}
function setAuthMode(mode){
  authMode = mode;
  const screen = document.getElementById('auth-screen');
  const button = document.getElementById('auth-switch-btn');
  const copy = document.getElementById('auth-switch-copy');
  const submit = document.getElementById('auth-submit');
  const password = document.getElementById('auth-password');
  if(!screen) return;
  screen.dataset.mode = mode;
  button.textContent = mode === 'login' ? 'Create an account' : 'I already have an account';
  copy.textContent = mode === 'login' ? 'New here?' : 'Already have an account?';
  if(submit) submit.innerHTML = mode === 'login' ? 'Sign in to PrepStack <span>→</span>' : 'Create my workspace <span>→</span>';
  password.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  document.getElementById('auth-error').textContent = '';
}
function initAuth(){
  const screen = document.getElementById('auth-screen');
  if(!screen) return;
  setAuthMode('login');
  if(localGet(SESSION_KEY) === 'active') screen.classList.add('is-hidden');
  document.getElementById('auth-switch-btn').addEventListener('click', () => setAuthMode(authMode === 'login' ? 'signup' : 'login'));
  document.getElementById('auth-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('auth-name').value.trim();
    const email = document.getElementById('auth-email').value.trim().toLowerCase();
    const password = document.getElementById('auth-password').value;
    const error = document.getElementById('auth-error');
    if(!email || password.length < 6){ error.textContent = 'Enter a valid email and a password with at least 6 characters.'; return; }
    const saved = (() => { try { return JSON.parse(localGet(ACCOUNT_KEY) || 'null'); } catch(e) { return null; } })();
    if(authMode === 'signup'){
      if(!name){ error.textContent = 'Please tell us what to call you.'; return; }
      const account = { name, email, password, role:'Interview candidate', code:'Building my next opportunity' };
      localSet(ACCOUNT_KEY, JSON.stringify(account));
      completeSignIn(account);
    } else {
      if(!saved || saved.email !== email || saved.password !== password){ error.textContent = 'We could not find that account on this device. Create an account to get started.'; return; }
      completeSignIn(saved);
    }
  });
}
function signOut(){
  try { window.localStorage.removeItem(SESSION_KEY); } catch(e) { /* no persistent storage */ }
  document.getElementById('auth-form').reset();
  setAuthMode('login');
  showAuth();
}

/* ======================================================
   MODULE DEFINITIONS + HOME RENDER
====================================================== */
let activeView = "home";
let searchQuery = "";
let currentQuestionListOpts = null;

function renderHome(){
  const q = searchQuery.trim().toLowerCase();
  let html = "";

  const favItems = ALL_ITEMS.filter(i => favorites.includes(i.id) && (!q || i.label.toLowerCase().includes(q)));
  if(!q || favItems.length){
    html += `<div class="section">
      <div class="section-label"><span>★ Favorites Menu</span><span class="section-count">${favItems.length}</span></div>
      <div class="tile-grid">${favItems.map(tileHTML).join('') || `<div class="empty-fav">Tap the star on any module to pin it here.</div>`}</div>
    </div>`;
  }

  MODULES.forEach(section => {
    const items = q ? section.items.filter(i => i.label.toLowerCase().includes(q)) : section.items;
    if(items.length === 0) return;
    html += `<div class="section">
      <div class="section-label"><span>${section.section}</span><span class="section-count">${items.length}</span></div>
      <div class="tile-grid">${items.map(tileHTML).join('')}</div>
    </div>`;
  });

  if(q && MODULES.every(s => s.items.filter(i=>i.label.toLowerCase().includes(q)).length === 0)){
    html = `<div class="empty-fav" style="padding:60px 20px;">No modules match "${searchQuery}"</div>`;
  }

  document.getElementById('scroll-area').innerHTML = html;
  bindHomeEvents();
}

function tileHTML(item){
  const isFav = favorites.includes(item.id);
  return `
    <button class="tile" data-module="${item.id}">
      <span class="star-toggle ${isFav?'on':''}" data-fav="${item.id}">${isFav ? ICONS.star : ICONS.starOutline}</span>
      <span class="tile-icon">${ICONS[item.icon]}</span>
      <span class="tile-label">${item.label}</span>
    </button>
  `;
}

function bindHomeEvents(){
  document.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', (e) => {
      if(e.target.closest('.star-toggle')) return;
      openModule(t.dataset.module);
    });
  });
  document.querySelectorAll('.star-toggle').forEach(s => {
    s.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = s.dataset.fav;
      if(favorites.includes(id)) favorites = favorites.filter(f => f !== id);
      else favorites.push(id);
      renderHome();
      saveState();
    });
  });
}

document.getElementById('module-search').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  if(activeView === 'home') renderHome();
});

/* ======================================================
   NAVIGATION
====================================================== */
function setActiveNav(view){
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
}

document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.view));
});
document.getElementById('open-profile').addEventListener('click', () => navigateTo('profile'));
document.getElementById('open-profile-2').addEventListener('click', () => navigateTo('profile'));

function navigateTo(view){
  activeView = view;
  setActiveNav(['home','progress','saved','alerts'].includes(view) ? view : '');
  if(view === 'home') { searchQuery=''; document.getElementById('module-search').value=''; renderHome(); return; }
  if(view === 'progress') return renderDashboardView();
  if(view === 'saved') return openModule('bookmarks', true);
  if(view === 'alerts') return openModule('reminders', true);
  if(view === 'profile') return renderProfileView();
}

function subheader(title, sub){
  return `<div class="subview-header">
    <button class="back-btn" onclick="navigateTo('home')">${ICONS.arrowLeft}</button>
    <div><div class="subview-title">${title}</div>${sub ? `<div class="subview-sub">${sub}</div>` : ''}</div>
  </div>`;
}

/* ======================================================
   DASHBOARD / PROGRESS VIEW
====================================================== */
function topicChartSVG(topicRows){
  const barH = 16, gap = 12, width = 350;
  const height = topicRows.length * (barH + gap) - gap;
  const bars = topicRows.map((t, i) => {
    const y = i * (barH + gap);
    const w = Math.max(3, width * t.pct / 100);
    const color = t.pct >= 70 ? '#1F9C7E' : t.pct >= 40 ? '#F0B23C' : '#E5484D';
    return `
      <rect x="0" y="${y}" width="${width}" height="${barH}" rx="6" fill="var(--ice)"/>
      <rect x="0" y="${y}" width="${w}" height="${barH}" rx="6" fill="${color}"/>
      <text x="6" y="${y + barH - 4}" font-size="9" font-family="Inter, sans-serif" font-weight="600" fill="var(--ink)">${t.name}</text>
    `;
  }).join('');
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" style="display:block;">${bars}</svg>`;
}

function renderDashboardView(){
  const totalQ = questions.length;
  const solvedQ = questions.filter(x=>x.status==='solved').length;
  const rate = successRate(questions);
  const topicRows = topics.map(t => {
    const s = topicStats(t.id, questions);
    return { ...t, ...s, pct: percentSolved(s) };
  });
  const weakest = weakestTopic(topicRows);
  const sdDone = moduleItems['system-design'].filter(x=>x.status==='Reviewed').length;
  const behPracticed = moduleItems['behavioral'].filter(x=>x.status==='Practiced').length;
  const spDone = moduleItems['study-plan'].filter(x=>x.status==='Done').length;
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('Progress Report','Your prep at a glance')}
    <div class="stat-row">
      <div class="stat-mini"><div class="n">${solvedQ}/${totalQ}</div><div class="l">Solved</div></div>
      <div class="stat-mini"><div class="n">${rate}%</div><div class="l">Success rate</div></div>
      <div class="stat-mini"><div class="n">${streak} 🔥</div><div class="l">Day streak</div></div>
    </div>
    <div class="section" style="padding-top:0;">
      <div class="section-label"><span>By topic</span></div>
      <div style="padding:2px 4px 14px;">${topicChartSVG(topicRows)}</div>
      ${topicRows.map(t=>`<div class="list-item" style="cursor:default;"><div><div class="li-name">${t.name}</div><div class="li-meta">${t.solved} of ${t.total} solved</div></div><span class="pill ${t.pct>=70?'pill-good':t.pct>=40?'pill-gold':'pill-bad'}">${t.pct}%</span></div>`).join('')}
    </div>
    <div class="section" style="padding-top:0;">
      <div class="section-label"><span>Other skills</span></div>
      <div class="list-item" style="cursor:default;"><div class="li-name">System Design reviewed</div><span class="pill pill-neutral">${sdDone} of ${moduleItems['system-design'].length}</span></div>
      <div class="list-item" style="cursor:default;"><div class="li-name">Behavioral practiced</div><span class="pill pill-neutral">${behPracticed} of ${moduleItems['behavioral'].length}</span></div>
      <div class="list-item" style="cursor:default;"><div class="li-name">Study plan goals done</div><span class="pill pill-neutral">${spDone} of ${moduleItems['study-plan'].length}</span></div>
    </div>
    <div class="info-box">Weakest DSA area right now: <strong>${weakest.name}</strong> (${weakest.pct}% solved). Consider scheduling extra practice this week.</div>
  `;
}

/* ======================================================
   PROFILE VIEW (with backup / restore + theme)
====================================================== */
function renderProfileView(){
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('My Profile')}
    <div style="padding:0 20px;">
      <div class="id-mini">
        <div class="avatar">${initials(currentUser.name)}</div>
        <div>
          <div class="name">${currentUser.name}</div>
          <div class="meta">${currentUser.role} · ${currentUser.code}</div>
        </div>
      </div>
    </div>
    <div class="section" style="padding-top:0;">
      <div class="list-item" style="cursor:default;"><div class="li-name">Focus area</div><span class="pill pill-neutral">Backend & Full-Stack</span></div>
      <div class="list-item" style="cursor:default;"><div class="li-name">Questions solved</div><span class="pill pill-neutral">${questions.filter(x=>x.status==='solved').length} of ${questions.length}</span></div>
      <div class="list-item" style="cursor:default;"><div class="li-name">Current streak</div><span class="pill pill-neutral">${streak} days</span></div>
      <div class="list-item" style="cursor:default;"><div class="li-name">Bookmarked questions</div><span class="pill pill-neutral">${questions.filter(x=>x.bookmarked).length}</span></div>
    </div>
    <div class="section" style="padding-top:0;">
      <div class="section-label"><span>Appearance</span></div>
      <button class="toggle-mini" id="theme-toggle-btn" style="width:100%; padding:12px; display:flex; align-items:center; justify-content:center; gap:8px;">
        ${theme === 'dark' ? ICONS.sun + ' Switch to Light Mode' : ICONS.moon + ' Switch to Dark Mode'}
      </button>
    </div>
    <div class="section" style="padding-top:0;">
      <div class="section-label"><span>Backup</span></div>
      <div style="display:flex; gap:10px;">
        <button class="toggle-mini" id="export-btn" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px;">${ICONS.download} Export</button>
        <button class="toggle-mini" id="import-btn" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px;">${ICONS.upload} Import</button>
        <input type="file" id="import-file" accept="application/json" style="display:none;">
      </div>
      ${storageAvailable ? '' : `<div class="li-meta" style="margin-top:10px;">Auto-save isn't available in this environment — use Export to save your progress and Import to restore it.</div>`}
    </div>
    <div class="section" style="padding-top:0;">
      <button class="toggle-mini logout-btn" id="sign-out-btn" style="width:100%; padding:12px;">Sign out of this device</button>
    </div>
  `;
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    renderProfileView();
    saveState();
  });
  document.getElementById('export-btn').addEventListener('click', exportData);
  document.getElementById('import-btn').addEventListener('click', () => document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', (e) => {
    const file = e.target.files[0];
      if(file) importData(file);
  });
  document.getElementById('sign-out-btn').addEventListener('click', signOut);
}

function exportData(){
  const blob = new Blob([JSON.stringify(buildPayload(), null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'prepstack-backup.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importData(file){
  const reader = new FileReader();
  reader.onload = () => {
    try{
      applyPayload(JSON.parse(reader.result));
      applyTheme();
      saveState();
      renderProfileView();
    } catch(e){
      alert('That file could not be read as a PrepStack backup.');
    }
  };
  reader.readAsText(file);
}

/* ======================================================
   MODULE ROUTER
====================================================== */
function openModule(id, fromNav){
  activeView = id;
  if(!fromNav) setActiveNav('');

  if(id === 'dsa-topics') return renderTopicList();
  if(id === 'company-wise') return renderCompanyList();
  if(id === 'daily-challenge') return renderDailyChallenge();
  if(id === 'bookmarks') { setActiveNav('saved'); return renderQuestionList({ bookmarkedOnly:true, title:'Bookmarked Questions' }); }
  if(id === 'progress-report') { setActiveNav('progress'); return renderDashboardView(); }
  if(id === 'notes') return renderNotes();
  if(id === 'community') return renderCommunity();
  if(id === 'reminders') { setActiveNav('alerts'); return renderReminders(); }
  if(MODULE_CONFIG[id]) return renderInteractiveList(id);
}

/* ---------------- DSA Topics ---------------- */
function renderTopicList(){
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('DSA Topics', topics.length + ' topics')}
    <div id="topic-list">
      ${topics.map(t=>{
        const s = topicStats(t.id, questions);
        const pct = percentSolved(s);
        const cls = pct>=70?'pill-good':pct>=40?'pill-gold':'pill-bad';
        return `<div class="list-item" data-topic="${t.id}"><div><div class="li-name">${t.name}</div><div class="li-meta">${s.solved} of ${s.total} solved</div></div><span class="pill ${cls}">${pct}%</span></div>`;
      }).join('')}
    </div>
    <div style="padding:14px 20px 0;"><button class="toggle-mini" id="add-question-anywhere-btn" style="width:100%; padding:12px;">+ Add Question</button></div>
  `;
  document.querySelectorAll('#topic-list [data-topic]').forEach(row => {
    row.addEventListener('click', () => {
      const t = topics.find(x=>x.id===row.dataset.topic);
      renderQuestionList({ topicId: t.id, title: t.name });
    });
  });
  document.getElementById('add-question-anywhere-btn').addEventListener('click', () => openAddQuestionForm());
}

/* ---------------- Company Wise ---------------- */
function renderCompanyList(){
  const companies = getCompanies(questions);
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('Company Wise Questions', companies.length + ' companies tracked')}
    <div id="company-list">
      ${companies.map(([name,count]) => `<div class="list-item" data-company="${name}"><div class="li-name">${name}</div><span class="pill pill-neutral">${count} Qs</span></div>`).join('')}
    </div>
  `;
  document.querySelectorAll('#company-list [data-company]').forEach(row => {
    row.addEventListener('click', () => renderQuestionList({ company: row.dataset.company, title: row.dataset.company }));
  });
}

/* ---------------- Question List (shared: topics / companies / bookmarks) ---------------- */
const STATUS_FILTERS = [
  { id:'all', label:'All' },
  { id:'solved', label:'Solved' },
  { id:'attempted', label:'Attempted' },
  { id:'todo', label:'To Do' },
];
const DIFFICULTY_FILTERS = ['All','Easy','Medium','Hard'];

function statusPill(status){
  if(status==='solved') return `<span class="pill pill-good">Solved</span>`;
  if(status==='attempted') return `<span class="pill pill-gold">Attempted</span>`;
  return `<span class="pill pill-bad">To Do</span>`;
}
function questionRow(x){
  const t = topics.find(tp => tp.id === x.topicId);
  return `<div class="list-item" data-id="${x.id}"><div><div class="li-name">${x.bookmarked?'★ ':''}${x.title}</div><div class="li-meta">${x.difficulty} · ${t?t.name:''}</div></div>${statusPill(x.status)}</div>`;
}

function renderQuestionList(opts, searchText, statusFilter, difficultyFilter){
  opts = opts || currentQuestionListOpts || {};
  currentQuestionListOpts = opts;
  statusFilter = statusFilter || opts.statusFilter || 'all';
  difficultyFilter = difficultyFilter || opts.difficultyFilter || 'All';
  opts.statusFilter = statusFilter;
  opts.difficultyFilter = difficultyFilter;

  const list = filterQuestions(questions, { ...opts, statusFilter, difficultyFilter, searchText });

  const chipsHTML = STATUS_FILTERS.map(f =>
    `<button class="toggle-mini filter-chip ${statusFilter===f.id?'active-chip':''}" data-status="${f.id}">${f.label}</button>`
  ).join('');
  const diffHTML = DIFFICULTY_FILTERS.map(d =>
    `<button class="toggle-mini filter-chip ${difficultyFilter===d?'active-chip':''}" data-diff="${d}">${d}</button>`
  ).join('');

  document.getElementById('scroll-area').innerHTML = `
    ${subheader(opts.title || 'Questions', list.length + ' questions')}
    <input class="search-mini" id="ql-search" placeholder="Search questions..." value="${searchText||''}">
    <div style="display:flex; gap:6px; flex-wrap:wrap; padding:0 20px 10px;">${chipsHTML}</div>
    <div style="display:flex; gap:6px; flex-wrap:wrap; padding:0 20px 14px;">${diffHTML}</div>
    <div id="ql-list">
      ${list.map(questionRow).join('') || `<div class="empty-fav">No questions match.</div>`}
    </div>
    <div style="padding:14px 20px 0;"><button class="toggle-mini" id="add-question-btn" style="width:100%; padding:12px;">+ Add Question${opts.topicId ? '' : ' (choose topic)'}</button></div>
  `;
  const searchEl = document.getElementById('ql-search');
  searchEl.addEventListener('input', (e) => renderQuestionList(opts, e.target.value, statusFilter, difficultyFilter));
  searchEl.focus();
  searchEl.selectionStart = searchEl.value.length;

  document.querySelectorAll('#ql-list .list-item').forEach(row => {
    row.addEventListener('click', () => openQuestionSheet(row.dataset.id));
  });
  document.querySelectorAll('[data-status]').forEach(btn => {
    btn.addEventListener('click', () => renderQuestionList(opts, searchText, btn.dataset.status, difficultyFilter));
  });
  document.querySelectorAll('[data-diff]').forEach(btn => {
    btn.addEventListener('click', () => renderQuestionList(opts, searchText, statusFilter, btn.dataset.diff));
  });
  document.getElementById('add-question-btn').addEventListener('click', () => openAddQuestionForm(opts.topicId));
}

function openAddQuestionForm(presetTopicId){
  const fields = [];
  if(!presetTopicId){
    fields.push({ key:'topicId', label:'Topic', type:'select', options: topics.map(t => ({ value:t.id, label:t.name })), required:true });
  }
  fields.push({ key:'title', label:'Question title', required:true });
  fields.push({ key:'difficulty', label:'Difficulty', type:'select', options:['Easy','Medium','Hard'], value:'Medium' });
  fields.push({ key:'companies', label:'Companies (comma separated)', placeholder:'e.g. Google, Amazon' });

  openFormSheet('Add Question', fields, (values) => {
    const topicId = presetTopicId || values.topicId;
    const companies = (values.companies || '').split(',').map(s => s.trim()).filter(Boolean);
    const id = 'custom-' + Date.now();
    questions.push({ id, topicId, title: values.title, difficulty: values.difficulty || 'Medium', companies, status:'todo', bookmarked:false, custom:true });
    saveState();
    const t = topics.find(x => x.id === topicId);
    renderQuestionList({ topicId, title: t ? t.name : 'Questions' });
  });
}

function openQuestionSheet(id){
  const x = questions.find(q => q.id === id);
  const t = topics.find(tp => tp.id === x.topicId);
  document.getElementById('sheet-content').innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-title">${x.title}</div>
    <div class="sheet-sub">${t?t.name:''} · ${x.difficulty}</div>
    <div class="list-item" style="padding:12px 0;"><div class="li-name">Asked at</div><span class="pill pill-neutral">${x.companies.length ? x.companies.join(', ') : '—'}</span></div>
    <div class="list-item" style="padding:12px 0;"><div class="li-name">Status</div>${statusPill(x.status)}</div>
    <div class="list-item" style="padding:12px 0; border-bottom:none;"><div class="li-name">Bookmarked</div><span class="pill ${x.bookmarked?'pill-gold':'pill-neutral'}">${x.bookmarked?'Yes':'No'}</span></div>
    <div style="display:flex; gap:10px; margin-top:6px;">
      <button class="toggle-mini" id="toggle-solved-btn" style="flex:1;">${x.status==='solved' ? 'Mark as To Do' : 'Mark as Solved'}</button>
      <button class="toggle-mini" id="toggle-bookmark-btn" style="flex:1;">${x.bookmarked ? 'Remove Bookmark' : 'Bookmark'}</button>
    </div>
  `;
  document.getElementById('modal').classList.add('active');
  document.getElementById('toggle-solved-btn').addEventListener('click', () => {
    x.status = x.status === 'solved' ? 'todo' : 'solved';
    openQuestionSheet(id);
    if(currentQuestionListOpts) renderQuestionList(currentQuestionListOpts);
    saveState();
  });
  document.getElementById('toggle-bookmark-btn').addEventListener('click', () => {
    x.bookmarked = !x.bookmarked;
    openQuestionSheet(id);
    if(currentQuestionListOpts) renderQuestionList(currentQuestionListOpts);
    saveState();
  });
}

/* ---------------- Daily Challenge ---------------- */
function renderDailyChallenge(){
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('Daily Challenge', "Today's problem")}
    <div class="stat-row">
      <div class="stat-mini"><div class="n">${streak} 🔥</div><div class="l">Day streak</div></div>
      <div class="stat-mini"><div class="n">${dailyChallengeDone?'Done':'Pending'}</div><div class="l">Today</div></div>
    </div>
    <div class="section" style="padding-top:0;">
      <div class="list-item" style="cursor:default;">
        <div><div class="li-name">${dailyQuestion.title}</div><div class="li-meta">${dailyQuestion.difficulty} · ${dailyQuestion.topic} · ${dailyQuestion.companies.join(', ')}</div></div>
      </div>
    </div>
    <div style="padding:0 20px;">
      <button class="toggle-mini" id="daily-done-btn" style="width:100%; padding:12px;">${dailyChallengeDone ? 'Completed today ✓' : 'Mark as Done'}</button>
    </div>
  `;
  document.getElementById('daily-done-btn').addEventListener('click', () => {
    if(!dailyChallengeDone){ dailyChallengeDone = true; streak++; renderDailyChallenge(); saveState(); }
  });
}

/* ---------------- My Notes ---------------- */
function renderNotes(){
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('My Notes', notes.length + ' notes')}
    <div id="notes-list">
      ${notes.map(n => `<div class="list-item" style="cursor:default; display:block;"><div class="li-name">${n.title}</div><div class="li-meta" style="margin-top:6px;">${n.body}</div></div>`).join('') || `<div class="empty-fav">No notes yet.</div>`}
    </div>
    <div style="padding:0 20px;">
      <button class="toggle-mini" id="add-note-btn" style="width:100%; padding:12px;">+ Add Note</button>
    </div>
  `;
  document.getElementById('add-note-btn').addEventListener('click', () => {
    openFormSheet('Add Note', [
      { key:'title', label:'Title', required:true },
      { key:'body', label:'Content', type:'textarea' },
    ], (values) => {
      notes.unshift({ title: values.title, body: values.body || '' });
      renderNotes();
      saveState();
    });
  });
}

/* ---------------- Mentors & Community ---------------- */
function renderCommunity(){
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('Mentors & Community', communityList.length + ' contacts')}
    <div id="community-list">
      ${communityList.map(p => `<div class="list-item" style="cursor:default;"><div><div class="li-name">${p.name}</div><div class="li-meta">${p.dept}</div></div><span class="pill pill-neutral">${p.role}</span></div>`).join('')}
    </div>
    <div style="padding:14px 20px 0;"><button class="toggle-mini" id="add-contact-btn" style="width:100%; padding:12px;">+ Add Contact</button></div>
  `;
  document.getElementById('add-contact-btn').addEventListener('click', () => {
    openFormSheet('Add Contact', [
      { key:'name', label:'Name', required:true },
      { key:'role', label:'Role', value:'Peer', placeholder:'e.g. Senior SWE, Mentor, Peer' },
      { key:'dept', label:'How they help', type:'textarea' },
    ], (values) => {
      communityList.unshift({ name: values.name, role: values.role || 'Peer', dept: values.dept || '' });
      renderCommunity();
      saveState();
    });
  });
}

/* ---------------- Interactive generic modules (System Design, Behavioral, Mock Interviews, Study Plan, Resources) ---------------- */
function cycleStatus(id, itemId){
  const cfg = MODULE_CONFIG[id];
  const item = moduleItems[id].find(x => x.id === itemId);
  if(!item) return;
  item.status = nextStatus(cfg.statuses, item.status);
  renderInteractiveList(id);
  saveState();
}

function openResourceLink(itemId){
  const item = moduleItems['resources'].find(x => x.id === itemId);
  if(!item || !item.url) return;
  window.open(item.url, '_blank', 'noopener');
  if(item.status !== 'Read'){ item.status = 'Read'; saveState(); }
  renderInteractiveList('resources');
}

function openAddModuleItemForm(id){
  const cfg = MODULE_CONFIG[id];
  const fields = [
    { key:'title', label: cfg.formLabels[0], required:true },
  ];
  if(cfg.formLabels[1]) fields.push({ key:'note', label: cfg.formLabels[1], type:'textarea' });
  if(id === 'resources') fields.push({ key:'url', label:'Link URL (optional)', placeholder:'https://...' });

  openFormSheet(cfg.addLabel.replace('+ ', ''), fields, (values) => {
    const item = { id: id + '-' + Date.now(), title: values.title, note: values.note || '', status: cfg.statuses[0] };
    if(id === 'resources' && values.url) item.url = values.url;
    moduleItems[id].unshift(item);
    renderInteractiveList(id);
    saveState();
  });
}

function interactiveRow(id, item, cfg){
  const linkHTML = (id === 'resources' && item.url)
    ? `<span class="link-btn" data-item="${item.id}" style="color:var(--navy-700); font-weight:700; display:inline-flex; align-items:center; gap:4px; margin-top:4px; cursor:pointer;">${ICONS.link} Open</span>`
    : '';
  return `<div class="list-item" data-item="${item.id}">
    <div>
      <div class="li-name">${item.title}</div>
      <div class="li-meta">${item.note || ''}</div>
      ${linkHTML}
    </div>
    <span class="pill ${cfg.statusClass[item.status]}">${item.status}</span>
  </div>`;
}

function renderInteractiveList(id){
  const cfg = MODULE_CONFIG[id];
  const list = moduleItems[id];
  document.getElementById('scroll-area').innerHTML = `
    ${subheader(cfg.title, cfg.sub)}
    <div id="il-list">
      ${list.map(item => interactiveRow(id, item, cfg)).join('') || `<div class="empty-fav">Nothing here yet.</div>`}
    </div>
    <div style="padding:14px 20px 0;"><button class="toggle-mini" id="il-add-btn" style="width:100%; padding:12px;">${cfg.addLabel}</button></div>
  `;
  document.querySelectorAll('#il-list [data-item]').forEach(row => {
    row.addEventListener('click', (e) => {
      if(e.target.closest('.link-btn')) return;
      cycleStatus(id, row.dataset.item);
    });
  });
  document.querySelectorAll('#il-list .link-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openResourceLink(btn.dataset.item);
    });
  });
  document.getElementById('il-add-btn').addEventListener('click', () => openAddModuleItemForm(id));
}

/* ---------------- Reminders ---------------- */
function renderReminders(){
  document.getElementById('scroll-area').innerHTML = `
    ${subheader('Reminders', reminders.filter(n=>!n.read).length + ' unread')}
    ${reminders.map((n,i) => `<div class="list-item" data-i="${i}"><div><div class="li-name">${n.title}</div><div class="li-meta">${n.meta}</div></div>${n.read?'':'<span class="pill pill-gold">New</span>'}</div>`).join('')}
  `;
  document.querySelectorAll('[data-i]').forEach(row => {
    row.addEventListener('click', () => {
      const n = reminders[row.dataset.i];
      if(!n.read){ n.read = true; notifCount = Math.max(0, notifCount-1); updateBadge(); renderReminders(); saveState(); }
    });
  });
}
function updateBadge(){
  const b = document.getElementById('bell-badge');
  if(notifCount<=0){ b.style.display='none'; } else { b.style.display='flex'; b.textContent = notifCount; }
}

/* ======================================================
   HEADER ICON ACTIONS
====================================================== */
document.getElementById('qr-btn').innerHTML = ICONS.qr;
document.getElementById('bell-btn').innerHTML = ICONS.bell + '<span class="badge" id="bell-badge">3</span>';
document.getElementById('qr-btn').addEventListener('click', () => {
  const solvedQ = questions.filter(x=>x.status==='solved').length;
  document.getElementById('sheet-content').innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-title">My Progress Card</div>
    <div class="sheet-sub">Share your prep milestones</div>
    <div class="qr-box">${ICONS.qr}</div>
    <div class="li-meta mono" style="text-align:center;">${currentUser.name} · ${solvedQ}/${questions.length} solved · ${streak} day streak</div>
  `;
  document.getElementById('modal').classList.add('active');
});
document.getElementById('bell-btn').addEventListener('click', () => navigateTo('alerts'));

document.querySelectorAll('.qa-icon').forEach((el,i) => {
  el.innerHTML = i===0 ? ICONS.chartBar : ICONS.person;
});
document.querySelectorAll('.nav-btn').forEach(btn => {
  const map = { home:ICONS.home, progress:ICONS.chartBar, saved:ICONS.star, alerts:ICONS.bell };
  const labels = { home:'Home', progress:'Progress', saved:'Saved', alerts:'Alerts' };
  btn.innerHTML = map[btn.dataset.view] + `<span>${labels[btn.dataset.view]}</span>`;
});

document.getElementById('modal').addEventListener('click', (e) => {
  if(e.target.id === 'modal') e.target.classList.remove('active');
});

/* ======================================================
   INIT
====================================================== */
(async function init(){
  await loadState();
  applyTheme();
  updateUserChrome();
  initAuth();
  renderHome();
  updateBadge();
})();
