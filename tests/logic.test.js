const test = require('node:test');
const assert = require('node:assert/strict');
const {
  topicStats, percentSolved, getCompanies,
  filterQuestions, nextStatus, successRate, weakestTopic,
} = require('../js/logic.js');

const sampleQuestions = [
  { id:'q1', topicId:'arrays', title:'Two Sum', difficulty:'Easy', companies:['Google','Amazon'], status:'solved', bookmarked:false },
  { id:'q2', topicId:'arrays', title:'Trapping Rain Water', difficulty:'Hard', companies:['Google'], status:'todo', bookmarked:true },
  { id:'q3', topicId:'trees', title:'Number of Islands', difficulty:'Medium', companies:['Meta'], status:'attempted', bookmarked:false },
  { id:'q4', topicId:'trees', title:'Validate BST', difficulty:'Medium', companies:['Amazon'], status:'solved', bookmarked:false },
];

test('topicStats counts total and solved questions for a topic', () => {
  assert.deepEqual(topicStats('arrays', sampleQuestions), { total: 2, solved: 1 });
  assert.deepEqual(topicStats('trees', sampleQuestions), { total: 2, solved: 1 });
  assert.deepEqual(topicStats('missing-topic', sampleQuestions), { total: 0, solved: 0 });
});

test('percentSolved computes a rounded percentage, avoiding divide-by-zero', () => {
  assert.equal(percentSolved({ total: 2, solved: 1 }), 50);
  assert.equal(percentSolved({ total: 0, solved: 0 }), 0);
  assert.equal(percentSolved({ total: 3, solved: 1 }), 33);
});

test('getCompanies counts and sorts companies by question count, descending', () => {
  const companies = getCompanies(sampleQuestions);
  assert.deepEqual(companies[0], ['Google', 2]);
  assert.ok(companies.some(([name, count]) => name === 'Amazon' && count === 2));
});

test('filterQuestions filters by topic', () => {
  const result = filterQuestions(sampleQuestions, { topicId: 'trees' });
  assert.equal(result.length, 2);
  assert.ok(result.every(q => q.topicId === 'trees'));
});

test('filterQuestions filters by company', () => {
  const result = filterQuestions(sampleQuestions, { company: 'Meta' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'q3');
});

test('filterQuestions filters by bookmarkedOnly', () => {
  const result = filterQuestions(sampleQuestions, { bookmarkedOnly: true });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'q2');
});

test('filterQuestions filters by status and difficulty together', () => {
  const result = filterQuestions(sampleQuestions, { statusFilter: 'solved', difficultyFilter: 'Medium' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'q4');
});

test('filterQuestions filters by search text (case-insensitive)', () => {
  const result = filterQuestions(sampleQuestions, { searchText: 'rain' });
  assert.equal(result.length, 1);
  assert.equal(result[0].id, 'q2');
});

test('filterQuestions with no options returns everything', () => {
  assert.equal(filterQuestions(sampleQuestions, {}).length, sampleQuestions.length);
  assert.equal(filterQuestions(sampleQuestions).length, sampleQuestions.length);
});

test('nextStatus cycles forward and wraps around', () => {
  const statuses = ['Pending', 'Scheduled', 'Done'];
  assert.equal(nextStatus(statuses, 'Pending'), 'Scheduled');
  assert.equal(nextStatus(statuses, 'Scheduled'), 'Done');
  assert.equal(nextStatus(statuses, 'Done'), 'Pending');
});

test('successRate computes percent solved across a question list', () => {
  assert.equal(successRate(sampleQuestions), 50);
  assert.equal(successRate([]), 0);
});

test('weakestTopic returns the topic row with the lowest pct', () => {
  const rows = [
    { id:'a', pct: 80 },
    { id:'b', pct: 20 },
    { id:'c', pct: 50 },
  ];
  assert.equal(weakestTopic(rows).id, 'b');
});
