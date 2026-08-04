/* ======================================================
   PURE LOGIC
   No DOM access — safe to unit test with plain Node.
   Exposed as globals in the browser via a normal <script>
   tag, and as CommonJS exports under Node for tests
   (see tests/logic.test.js).
====================================================== */

function topicStats(topicId, questionsList){
  const qs = questionsList.filter(x => x.topicId === topicId);
  return { total: qs.length, solved: qs.filter(x => x.status === 'solved').length };
}

function percentSolved(stats){
  return stats.total ? Math.round(stats.solved / stats.total * 100) : 0;
}

function getCompanies(questionsList){
  const map = {};
  questionsList.forEach(q => q.companies.forEach(c => { map[c] = (map[c] || 0) + 1; }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

function filterQuestions(questionsList, opts){
  opts = opts || {};
  const q = (opts.searchText || '').toLowerCase();
  return questionsList.filter(x => {
    if(opts.topicId && x.topicId !== opts.topicId) return false;
    if(opts.company && !x.companies.includes(opts.company)) return false;
    if(opts.bookmarkedOnly && !x.bookmarked) return false;
    if(opts.statusFilter && opts.statusFilter !== 'all' && x.status !== opts.statusFilter) return false;
    if(opts.difficultyFilter && opts.difficultyFilter !== 'All' && x.difficulty !== opts.difficultyFilter) return false;
    if(q && !x.title.toLowerCase().includes(q)) return false;
    return true;
  });
}

function nextStatus(statuses, current){
  const idx = statuses.indexOf(current);
  return statuses[(idx + 1) % statuses.length];
}

function successRate(questionsList){
  if(!questionsList.length) return 0;
  const solved = questionsList.filter(x => x.status === 'solved').length;
  return Math.round(solved / questionsList.length * 100);
}

function weakestTopic(topicRows){
  return topicRows.slice().sort((a, b) => a.pct - b.pct)[0];
}

if(typeof module !== 'undefined' && module.exports){
  module.exports = {
    topicStats, percentSolved, getCompanies,
    filterQuestions, nextStatus, successRate, weakestTopic,
  };
}
