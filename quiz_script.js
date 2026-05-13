// ═══════════════════════════════════════════════
//  WEEKLY CONFIG — swap these URLs each week
// ═══════════════════════════════════════════════
const NEWS_URLS = {
  Internationalism: "https://hir.harvard.edu/breaking-gender-barriers-an-interview-with-nobel-peace-prize-laureate-malala-yousafzai",
  Democracy:        "https://online.ucpress.edu/currenthistory/article/120/823/43/115914/Chile-s-Constitutional-Moment",
  Environmentalism: "https://www.goodgoodgood.co/articles/ocean-cleanup-pacific-garbage-patch-ted-talk",
  Adventure:        "https://www.mornflake.com/roz-savage-ocean-rower/",
  Leadership:       "https://www.carnegie.org/our-work/article/how-lead-successful-movement-peace",
  Service:          "https://news.harvard.edu/gazette/story/2018/05/harvards-paul-farmer-on-traveling-the-world-to-fight-inequality-in-health"
};

// ── Cookie helpers ─────────────────────────────────────────────────────────

// Save a cookie — expires after 'days' days
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = name + "=" + value + "; expires=" + expires.toUTCString() + "; path=/";
}

// Read a cookie by name — returns null if not found
function getCookie(name) {
  const match = document.cookie.split('; ').find(row => row.startsWith(name + '='));
  return match ? match.split('=')[1] : null;
}

// ── On page load: check if returning visitor ───────────────────────────────
window.addEventListener('load', function () {
  const previousIdeal = getCookie('userIdeal');

  if (previousIdeal && IDEALS[previousIdeal]) {
    // They've been here before — show the returning screen
    const ideal = IDEALS[previousIdeal];
    const newsUrl = NEWS_URLS[ideal.name];

    const nameEl = document.getElementById('returning-ideal-name');
    nameEl.textContent = ideal.name;
    nameEl.style.color = ideal.color;

    const newsBtn = document.getElementById('returning-news-btn');
    newsBtn.href = newsUrl;
    newsBtn.style.color = ideal.color;
    newsBtn.style.borderColor = ideal.color;

    showScreen('screen-returning');
  }
  // If no cookie, screen-landing is already active by default — do nothing
});

// ── Questions ──────────────────────────────────────────────────────────────
// Each option maps to: I=Internationalism D=Democracy E=Environmentalism
//                      A=Adventure       L=Leadership S=Service

const QUESTIONS = [
  {
    text: "You're handed a free weekend and a passport. Where do you go?",
    options: [
      { text: "A city where you don't speak the language", ideal: "I" },
      { text: "A community forum in a town you've never heard of", ideal: "D" },
      { text: "Somewhere untouched — deep forest, remote coast", ideal: "E" },
      { text: "The highest peak you can safely reach", ideal: "A" },
      { text: "A leadership retreat with people who challenge you", ideal: "L" },
      { text: "A place where you can volunteer for a week", ideal: "S" }
    ]
  },
  {
    text: "Pick a superpower — be honest:",
    options: [
      { text: "Speak and understand every language on Earth", ideal: "I" },
      { text: "Make every election perfectly fair, everywhere", ideal: "D" },
      { text: "Reverse environmental damage instantly", ideal: "E" },
      { text: "Survive anywhere on the planet — jungle, desert, arctic", ideal: "A" },
      { text: "Inspire anyone to be their best self", ideal: "L" },
      { text: "Heal any illness with a touch", ideal: "S" }
    ]
  },
  {
    text: "Your friends would describe you as the one who...",
    options: [
      { text: "Always bridges different groups of people", ideal: "I" },
      { text: "Speaks up when no one else dares to", ideal: "D" },
      { text: "Turns off lights and corrects everyone's recycling", ideal: "E" },
      { text: "Suggests the plan that makes everyone nervous — but it works", ideal: "A" },
      { text: "Somehow ends up in charge, always", ideal: "L" },
      { text: "Shows up before you even ask", ideal: "S" }
    ]
  },
  {
    text: "If you could change one thing in the world overnight:",
    options: [
      { text: "No more cultural misunderstanding or xenophobia", ideal: "I" },
      { text: "Every person has a real, protected vote", ideal: "D" },
      { text: "Carbon emissions: gone", ideal: "E" },
      { text: "Every human can experience true wilderness at least once", ideal: "A" },
      { text: "Great mentors for every young person on earth", ideal: "L" },
      { text: "No one goes to bed hungry", ideal: "S" }
    ]
  },
  {
    text: "You're given £1,000 to spend on others. You:",
    options: [
      { text: "Fund a cultural exchange trip for students", ideal: "I" },
      { text: "Support a grassroots civic education programme", ideal: "D" },
      { text: "Donate to a reforestation or clean water project", ideal: "E" },
      { text: "Help someone complete their first big expedition", ideal: "A" },
      { text: "Launch a youth leadership workshop", ideal: "L" },
      { text: "Stock a food bank for three months", ideal: "S" }
    ]
  },
  {
    text: "You're in a library. You reach for a book about:",
    options: [
      { text: "A journalist's year living across six different cultures", ideal: "I" },
      { text: "How ordinary people changed laws they disagreed with", ideal: "D" },
      { text: "An ecologist who spent a decade in the Amazon", ideal: "E" },
      { text: "The first person to row an ocean alone", ideal: "A" },
      { text: "What makes a leader people actually follow", ideal: "L" },
      { text: "Unsung figures who quietly changed millions of lives", ideal: "S" }
    ]
  },
  {
    text: "Your version of success looks like:",
    options: [
      { text: "Being equally at home in any country", ideal: "I" },
      { text: "A system that's fairer than the one you inherited", ideal: "D" },
      { text: "Leaving the world's natural spaces better than you found them", ideal: "E" },
      { text: "A list of challenges that once terrified you — all ticked off", ideal: "A" },
      { text: "People who grew because of you", ideal: "L" },
      { text: "Knowing someone's life improved because you were there", ideal: "S" }
    ]
  },
  {
    text: "The quality you most admire in another person is:",
    options: [
      { text: "Genuine curiosity about lives different from their own", ideal: "I" },
      { text: "The courage to hold power accountable", ideal: "D" },
      { text: "Living by their environmental values, even when it's inconvenient", ideal: "E" },
      { text: "Fearlessness — not the absence of fear, but acting anyway", ideal: "A" },
      { text: "Knowing how to make everyone feel capable", ideal: "L" },
      { text: "Giving without any expectation of return", ideal: "S" }
    ]
  }
];

const IDEALS = {
  I: {
    name: "Internationalism",
    color: "var(--c-internationalism)",
    desc: "You see the world as one community. Borders are just lines on a map — what matters is the bridge between people."
  },
  D: {
    name: "Democracy",
    color: "var(--c-democracy)",
    desc: "You believe every voice deserves to be heard. You speak up, invite others in, and hold power accountable."
  },
  E: {
    name: "Environmentalism",
    color: "var(--c-environmentalism)",
    desc: "You know the Earth is not ours to keep — only to protect. You live with that responsibility every single day."
  },
  A: {
    name: "Adventure",
    color: "var(--c-adventure)",
    desc: "You live at the edge of your comfort zone. That's not recklessness — it's where you feel most alive and most yourself."
  },
  L: {
    name: "Leadership",
    color: "var(--c-leadership)",
    desc: "You don't just follow paths. You clear them — and somehow others follow without you having to ask."
  },
  S: {
    name: "Service",
    color: "var(--c-service)",
    desc: "You find purpose in lifting others. Your strength is their strength. That's not a sacrifice — that's your calling."
  }
};

// ── State ──────────────────────────────────────────────────────────────────
let currentQ = 0;
let scores = { I: 0, D: 0, E: 0, A: 0, L: 0, S: 0 };

// ── Helpers ────────────────────────────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// ── Quiz logic ─────────────────────────────────────────────────────────────
function startQuiz() {
  currentQ = 0;
  scores = { I: 0, D: 0, E: 0, A: 0, L: 0, S: 0 };
  showScreen('screen-quiz');
  renderQuestion();
}

function renderQuestion() {
  const qi = document.getElementById('quiz-inner');
  qi.classList.remove('visible');

  setTimeout(() => {
    const q = QUESTIONS[currentQ];
    document.getElementById('q-label').textContent = `Question ${currentQ + 1} of ${QUESTIONS.length}`;
    document.getElementById('question-text').textContent = q.text;

    const optList = document.getElementById('options-list');
    optList.innerHTML = '';
    const letters = ['A','B','C','D','E','F'];
    const shuffled = shuffle(q.options);

    shuffled.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.innerHTML = `<span class="opt-letter">${letters[i]}</span>${opt.text}`;
      btn.onclick = () => pickAnswer(opt.ideal);
      optList.appendChild(btn);
    });

    qi.classList.add('visible');
  }, 300);
}

function pickAnswer(ideal) {
  scores[ideal]++;
  currentQ++;

  if (currentQ >= QUESTIONS.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  showScreen('screen-calc');

  setTimeout(() => {
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    const ideal = IDEALS[winner];
    const newsUrl = NEWS_URLS[ideal.name];

    // Save result as a cookie — expires in 14 days
    setCookie('userIdeal', winner, 14);

    document.getElementById('ideal-name').textContent = ideal.name;
    document.getElementById('ideal-name').style.color = ideal.color;
    document.getElementById('result-badge').style.color = ideal.color;
    document.getElementById('result-badge').style.borderColor = ideal.color;
    document.getElementById('ideal-desc').textContent = ideal.desc;

    const btn = document.getElementById('btn-news');
    btn.href = newsUrl;
    btn.style.color = ideal.color;
    btn.style.borderColor = ideal.color;

    // Force re-animation on result screen
    const rs = document.getElementById('screen-result');
    rs.querySelectorAll('[style*="animation"]').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    showScreen('screen-result');
  }, 2200);
}

function restart() {
  showScreen('screen-landing');
}