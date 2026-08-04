/* ======================================================
   ICONS — compact hand-drawn line icon set
====================================================== */
const ICONS = {
  grid:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/></svg>`,
  person:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c1-4 4-6 7-6s6 2 7 6"/></svg>`,
  qr:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><line x1="15" y1="15" x2="15" y2="21"/><line x1="18" y1="15" x2="21" y2="15"/><line x1="21" y1="18" x2="21" y2="21"/><line x1="18" y1="21" x2="18" y2="18"/></svg>`,
  bell:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>`,
  star:`<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,9.5 16.5,14.5 18,22 12,18 6,22 7.5,14.5 2,9.5 9,9"/></svg>`,
  starOutline:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="12,2 15,9 22,9.5 16.5,14.5 18,22 12,18 6,22 7.5,14.5 2,9.5 9,9"/></svg>`,
  users:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3 20c0.7-3.4 3-5 6-5s5.3 1.6 6 5"/><path d="M15 15c2.4 0.2 4 1.6 4.5 4"/></svg>`,
  message:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H8l-4 4V5z"/><line x1="7.5" y1="9" x2="16.5" y2="9"/><line x1="7.5" y1="12.5" x2="13" y2="12.5"/></svg>`,
  bolt:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13,2 4,14 11,14 9,22 20,9 13,9"/></svg>`,
  checklist:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l1.5 1.5L8 5"/><line x1="10.5" y1="6" x2="21" y2="6"/><path d="M4 12l1.5 1.5L8 11"/><line x1="10.5" y1="12" x2="21" y2="12"/><path d="M4 18l1.5 1.5L8 17"/><line x1="10.5" y1="18" x2="21" y2="18"/></svg>`,
  document:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5"/><line x1="9" y1="13" x2="16" y2="13"/><line x1="9" y1="17" x2="14" y2="17"/></svg>`,
  clock:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="15.5" y2="14"/></svg>`,
  book:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6c-2-1.5-5-2-8-1.5v13c3-0.5 6 0 8 1.5c2-1.5 5-2 8-1.5v-13c-3-0.5-6 0-8 1.5z"/><line x1="12" y1="6" x2="12" y2="19"/></svg>`,
  clipboard:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2.5" width="6" height="3.5" rx="1"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="16" y2="15"/></svg>`,
  chat:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M21 4v5h-5"/></svg>`,
  home:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/></svg>`,
  chartBar:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="7"/><line x1="19" y1="20" x2="19" y2="15"/></svg>`,
  arrowLeft:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,5 5,12 12,19"/></svg>`,
  upload:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4"/><polyline points="6,10 12,4 18,10"/><path d="M4 20h16"/></svg>`,
  download:`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12"/><polyline points="6,10 12,16 18,10"/><path d="M4 20h16"/></svg>`,
  link:`<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/></svg>`,
  sun:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><line x1="12" y1="1.5" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22.5"/><line x1="4.2" y1="4.2" x2="6" y2="6"/><line x1="18" y1="18" x2="19.8" y2="19.8"/><line x1="1.5" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22.5" y2="12"/><line x1="4.2" y1="19.8" x2="6" y2="18"/><line x1="18" y1="6" x2="19.8" y2="4.2"/></svg>`,
  moon:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>`,
};

/* ======================================================
   MOCK DATA
   Replace any of this with your own via the "+ Add" buttons
   in the app, or edit these arrays directly.
====================================================== */
let currentUser = { name:"Supriya Dwivedi", role:"Full-Stack Developer", code:"Target: SWE roles" };
let streak = 12;
let notifCount = 3;
let theme = "light";

const topics = [
  { id:"arrays",  name:"Arrays & Strings" },
  { id:"linked",  name:"Linked Lists & Stacks" },
  { id:"trees",   name:"Trees & Graphs" },
  { id:"dp",      name:"Dynamic Programming" },
  { id:"sorting", name:"Sorting & Searching" },
  { id:"sql",     name:"SQL & Databases" },
];

let questions = [
  { id:"q1",  topicId:"arrays",  title:"Two Sum",                                         difficulty:"Easy",   companies:["Google","Amazon"],              status:"solved",    bookmarked:false },
  { id:"q2",  topicId:"arrays",  title:"Best Time to Buy and Sell Stock",                  difficulty:"Easy",   companies:["Amazon","Meta"],                 status:"solved",    bookmarked:false },
  { id:"q3",  topicId:"arrays",  title:"Longest Substring Without Repeating Characters",    difficulty:"Medium", companies:["Microsoft","Fusemachines"],      status:"attempted", bookmarked:true  },
  { id:"q4",  topicId:"arrays",  title:"Trapping Rain Water",                              difficulty:"Hard",   companies:["Google","Leapfrog Technology"],  status:"todo",      bookmarked:false },
  { id:"q5",  topicId:"linked",  title:"Reverse Linked List",                              difficulty:"Easy",   companies:["Amazon"],                        status:"solved",    bookmarked:false },
  { id:"q6",  topicId:"linked",  title:"Detect Cycle in Linked List",                       difficulty:"Medium", companies:["Microsoft"],                     status:"solved",    bookmarked:false },
  { id:"q7",  topicId:"linked",  title:"Valid Parentheses",                                 difficulty:"Easy",   companies:["Meta","Cotiviti Nepal"],         status:"solved",    bookmarked:false },
  { id:"q8",  topicId:"linked",  title:"LRU Cache",                                         difficulty:"Hard",   companies:["Google","Amazon"],               status:"attempted", bookmarked:true  },
  { id:"q9",  topicId:"trees",   title:"Binary Tree Level Order Traversal",                 difficulty:"Medium", companies:["Amazon"],                        status:"solved",    bookmarked:false },
  { id:"q10", topicId:"trees",   title:"Validate Binary Search Tree",                       difficulty:"Medium", companies:["Microsoft"],                     status:"attempted", bookmarked:false },
  { id:"q11", topicId:"trees",   title:"Lowest Common Ancestor",                            difficulty:"Medium", companies:["Google"],                        status:"todo",      bookmarked:false },
  { id:"q12", topicId:"trees",   title:"Number of Islands",                                 difficulty:"Medium", companies:["Meta","Fusemachines"],           status:"solved",    bookmarked:true  },
  { id:"q13", topicId:"dp",      title:"Climbing Stairs",                                   difficulty:"Easy",   companies:["Amazon"],                        status:"solved",    bookmarked:false },
  { id:"q14", topicId:"dp",      title:"Coin Change",                                       difficulty:"Medium", companies:["Google"],                        status:"attempted", bookmarked:false },
  { id:"q15", topicId:"dp",      title:"Longest Increasing Subsequence",                    difficulty:"Medium", companies:["Microsoft"],                     status:"todo",      bookmarked:false },
  { id:"q16", topicId:"dp",      title:"House Robber",                                      difficulty:"Medium", companies:["Meta"],                          status:"todo",      bookmarked:false },
  { id:"q17", topicId:"sorting", title:"Merge Intervals",                                   difficulty:"Medium", companies:["Google","Amazon"],               status:"solved",    bookmarked:false },
  { id:"q18", topicId:"sorting", title:"Kth Largest Element in an Array",                   difficulty:"Medium", companies:["Meta"],                          status:"solved",    bookmarked:false },
  { id:"q19", topicId:"sorting", title:"Search in Rotated Sorted Array",                    difficulty:"Medium", companies:["Microsoft"],                     status:"solved",    bookmarked:false },
  { id:"q20", topicId:"sorting", title:"Median of Two Sorted Arrays",                       difficulty:"Hard",   companies:["Google"],                        status:"todo",      bookmarked:false },
  { id:"q21", topicId:"sql",     title:"Second Highest Salary",                             difficulty:"Medium", companies:["Amazon"],                        status:"solved",    bookmarked:false },
  { id:"q22", topicId:"sql",     title:"Department Top Three Salaries",                     difficulty:"Hard",   companies:["Google"],                        status:"todo",      bookmarked:false },
  { id:"q23", topicId:"sql",     title:"Rising Temperature",                                difficulty:"Easy",   companies:["Cotiviti Nepal"],                status:"attempted", bookmarked:false },
  { id:"q24", topicId:"sql",     title:"Duplicate Emails",                                  difficulty:"Easy",   companies:["Deerwalk"],                      status:"solved",    bookmarked:false },
];

let dailyChallengeDone = false;
const dailyQuestion = { title:"Merge k Sorted Lists", difficulty:"Hard", topic:"Trees & Graphs", companies:["Google","Amazon"] };

/* ---------------- Interactive generic modules ---------------- */
const MODULE_CONFIG = {
  "system-design": {
    title:"System Design", sub:"Tap a topic to cycle its status",
    statuses:["Not Started","In Progress","Reviewed"],
    statusClass:{ "Not Started":"pill-bad", "In Progress":"pill-gold", "Reviewed":"pill-good" },
    addLabel:"+ Add Topic",
    formLabels:["Topic title", "What to review (optional)"],
  },
  "behavioral": {
    title:"Behavioral Questions", sub:"STAR method — tap to mark practiced",
    statuses:["Pending","Practiced"],
    statusClass:{ "Pending":"pill-gold", "Practiced":"pill-good" },
    addLabel:"+ Add Question",
    formLabels:["Question", "Your STAR notes (optional)"],
  },
  "mock-interviews": {
    title:"Mock Interviews", sub:"Tap to update status",
    statuses:["Pending","Scheduled","Done"],
    statusClass:{ "Pending":"pill-bad", "Scheduled":"pill-gold", "Done":"pill-good" },
    addLabel:"+ Add Mock Interview",
    formLabels:["Interview title", "Mentor & time (optional)"],
  },
  "study-plan": {
    title:"Study Plan", sub:"This week's goals — tap to check off",
    statuses:["Pending","Done"],
    statusClass:{ "Pending":"pill-gold", "Done":"pill-good" },
    addLabel:"+ Add Goal",
    formLabels:["Goal", "Details (optional)"],
  },
  "resources": {
    title:"Resources", sub:"Tap Open to visit a link, tap the row to mark read",
    statuses:["New","Read"],
    statusClass:{ "New":"pill-gold", "Read":"pill-neutral" },
    addLabel:"+ Add Resource",
    formLabels:["Resource title", "Note (optional)"],
  },
};

let moduleItems = {
  "system-design": [
    { id:"sd1", title:"Designing a URL Shortener", note:"Load balancing, hashing, caching", status:"Reviewed" },
    { id:"sd2", title:"Designing a Rate Limiter", note:"Token bucket, sliding window", status:"Reviewed" },
    { id:"sd3", title:"Designing a Chat System", note:"WebSockets, message queues", status:"In Progress" },
    { id:"sd4", title:"Designing a News Feed", note:"Fan-out, ranking, caching", status:"Not Started" },
    { id:"sd5", title:"Scaling a Database", note:"Sharding, replication, indexes", status:"Not Started" },
  ],
  "behavioral": [
    { id:"bh1", title:"Tell me about a time you disagreed with a teammate", note:"Practiced twice", status:"Practiced" },
    { id:"bh2", title:"Describe a project you're proud of", note:"AuralithBit ERP build", status:"Practiced" },
    { id:"bh3", title:"How do you handle tight deadlines", note:"Not yet drafted", status:"Pending" },
    { id:"bh4", title:"Tell me about a time you failed", note:"Not yet drafted", status:"Pending" },
    { id:"bh5", title:"How do you give feedback to a teammate", note:"Not yet drafted", status:"Pending" },
    { id:"bh6", title:"Why do you want to work here", note:"Needs a company-specific answer", status:"Pending" },
  ],
  "mock-interviews": [
    { id:"mi1", title:"Mock DSA Round", note:"With Bishal Shrestha · Fri, 5:00 PM", status:"Scheduled" },
    { id:"mi2", title:"System Design Mock", note:"With Anisha KC · completed last week", status:"Done" },
    { id:"mi3", title:"Behavioral Round Practice", note:"With study group", status:"Pending" },
  ],
  "study-plan": [
    { id:"sp1", title:"Finish Arrays & Strings topic", note:"4 of 4 questions", status:"Done" },
    { id:"sp2", title:"Complete 5 DP problems", note:"1 of 5 done", status:"Pending" },
    { id:"sp3", title:"Mock interview with Bishal", note:"Scheduled Friday", status:"Pending" },
    { id:"sp4", title:"Review System Design fundamentals", note:"Not started", status:"Pending" },
    { id:"sp5", title:"Update resume with recent project", note:"AuralithBit ERP added", status:"Done" },
  ],
  "resources": [
    { id:"r1", title:"NeetCode 150 roadmap", note:"Structured DSA problem list", status:"New", url:"https://neetcode.io/practice" },
    { id:"r2", title:"System Design Primer", note:"GitHub reference repo", status:"Read", url:"https://github.com/donnemartin/system-design-primer" },
    { id:"r3", title:"Grokking the System Design Interview", note:"Course notes", status:"Read", url:"https://www.designgurus.io/course/grokking-the-system-design-interview" },
    { id:"r4", title:"Cracking the Coding Interview", note:"Book notes and summaries", status:"Read" },
    { id:"r5", title:"Nepal Tech Interview Community", note:"Peer study group — ask a mentor for the invite", status:"New" },
  ],
};

const communityList = [
  { name:"Bishal Shrestha", role:"Senior SWE", dept:"Mock interviewer" },
  { name:"Anisha KC", role:"Staff Engineer", dept:"System design mentor" },
  { name:"AuralithBit Dev Team", role:"Peer group", dept:"Internal practice partners" },
  { name:"Nepal Tech Interview Community", role:"Discord group", dept:"Peer practice & referrals" },
];

let notes = [
  { title:"DP pattern: 0/1 Knapsack", body:"Think of it as include/exclude recursion, memoize on (index, remaining capacity)." },
  { title:"Two pointer trick", body:"Sort first when order doesn't matter, then converge from both ends." },
  { title:"Company note: Fusemachines", body:"Focus rounds were ML-adjacent + DSA. Asked about production debugging." },
];

let reminders = [
  { title:"Time to revisit Dynamic Programming", meta:"2 weeks since last practice", read:false },
  { title:"Mock interview tomorrow at 5 PM with Bishal", meta:"Reminder", read:false },
  { title:"Keep your daily streak alive", meta:"Solve today's challenge before midnight", read:false },
  { title:"New resource added: System Design Primer", meta:"2 days ago", read:true },
];

let favorites = ["dsa-topics", "daily-challenge", "progress-report"];

/* ======================================================
   MODULE DEFINITIONS (home tile grid)
====================================================== */
const MODULES = [
  { section:"Practice", items:[
    { id:"dsa-topics", icon:"grid", label:"DSA Topics" },
    { id:"company-wise", icon:"users", label:"Company Wise Qs" },
    { id:"daily-challenge", icon:"bolt", label:"Daily Challenge" },
    { id:"bookmarks", icon:"starOutline", label:"Bookmarked Qs" },
  ]},
  { section:"Interview Skills", items:[
    { id:"system-design", icon:"document", label:"System Design" },
    { id:"behavioral", icon:"chat", label:"Behavioral Qs" },
    { id:"mock-interviews", icon:"clock", label:"Mock Interviews" },
    { id:"study-plan", icon:"checklist", label:"Study Plan" },
  ]},
  { section:"Progress & Notes", items:[
    { id:"progress-report", icon:"chartBar", label:"Progress Report" },
    { id:"notes", icon:"clipboard", label:"My Notes" },
  ]},
  { section:"Community & Resources", items:[
    { id:"resources", icon:"book", label:"Resources" },
    { id:"community", icon:"message", label:"Mentors & Community" },
    { id:"reminders", icon:"bell", label:"Reminders" },
  ]},
];
const ALL_ITEMS = MODULES.flatMap(s => s.items);
