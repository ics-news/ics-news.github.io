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
    text: "You're handed a free weekend. Where do you go?",
    options: [
      { text: "A city where you don't speak the language", ideal: "I" },
      { text: "A new restaurant you've always wanted to try", ideal: "D" },
      { text: "Somewhere untouched like deep forest, for camping", ideal: "E" },
      { text: "A tall mountain to enjoy the view", ideal: "A" },
      { text: "Nowhere- you'd rather recharge your batteries", ideal: "L" },
      { text: "Your grandparents' house - to see how they're doing", ideal: "S" }
    ]
  },
  {
    text: "Pick a superpower:",
    options: [
      { text: "Talk to animals", ideal: "I" },
      { text: "Mind control", ideal: "D" },
      { text: "Control any element", ideal: "E" },
      { text: "Invincibility", ideal: "A" },
      { text: "Telepathy", ideal: "L" },
      { text: "Heal any illness", ideal: "S" }
    ]
  },
  {
    text: "Your friends would describe you as the one who...",
    options: [
      { text: "Always makes new friends", ideal: "I" },
      { text: "Speaks up when no one else dares to", ideal: "D" },
      { text: "Needs a clean environment", ideal: "E" },
      { text: "Is always trying something new", ideal: "A" },
      { text: "Somehow ends up in charge, always", ideal: "L" },
      { text: "Shows up before you even ask", ideal: "S" }
    ]
  },
  {
    text: "If you could end one thing in the world overnight, it would be:",
    options: [
      { text: "No more racism or xenophobia", ideal: "I" },
      { text: "Youth Unemployment", ideal: "D" },
      { text: "Climate Change", ideal: "E" },
      { text: "The AI Uprising", ideal: "A" },
      { text: "Childhood Traumas", ideal: "L" },
      { text: "World Hunger", ideal: "S" }
    ]
  },
  {
    text: "Your spirit animal would likely be:",
    options: [
      { text: "An eagle", ideal: "I" },
      { text: "A bee", ideal: "D" },
      { text: "An earthworm", ideal: "E" },
      { text: "A dolphin", ideal: "A" },
      { text: "A wolf", ideal: "L" },
      { text: "An elephant", ideal: "S" }
    ]
  },
  {
    text: "You're in a library. You reach for a book about:",
    options: [
      { text: "A journalist's report on different cultures", ideal: "I" },
      { text: "How ordinary people changed laws they disagreed with", ideal: "D" },
      { text: "People stranded in the Amazon", ideal: "E" },
      { text: "The first person to row an ocean alone", ideal: "A" },
      { text: "Countries and their worst presidents", ideal: "L" },
      { text: "Unknown figures who quietly changed millions of lives", ideal: "S" }
    ]
  },
  {
    text: "Your version of success looks like:",
    options: [
      { text: "Being rich enough to travel the world", ideal: "I" },
      { text: "Creating a system that's fairer than the one you inherited", ideal: "D" },
      { text: "Leaving the world's natural spaces better than you found them", ideal: "E" },
      { text: "A list of challenges that you set — all ticked off", ideal: "A" },
      { text: "People growing because of your work", ideal: "L" },
      { text: "Knowing someone's life improved because you were there", ideal: "S" }
    ]
  },
  {
    text: "The quality you most admire in another person is:",
    options: [
      { text: "Empathy", ideal: "I" },
      { text: "Responsibility", ideal: "D" },
      { text: "Principles", ideal: "E" },
      { text: "Fearlessness", ideal: "A" },
      { text: "Inclusion", ideal: "L" },
      { text: "Selflessness", ideal: "S" }
    ]
  }
];

const IDEALS = {
  I: {
    name: "Internationalism",
    color: "var(--c-internationalism)",
    desc: "You see the world as one community. Borders are just lines on a map — what matters is the bridge between people.",
    discoveries: [
      { name: "Diversity Dani",      desc: "Dani crosses every boundary with curiosity. She collects languages, friendships, and perspectives the way others collect stamps." },
      { name: "Communication Cara",  desc: "Cara believes that the right words — chosen carefully — can build bridges across any divide." }
    ]
  },
  D: {
    name: "Democracy",
    color: "var(--c-democracy)",
    desc: "You believe every voice deserves to be heard. You speak up, invite others in, and hold power accountable.",
    discoveries: [
      { name: "Courageous Collette", desc: "Collette speaks up in rooms where silence would be easier. She knows courage isn't the absence of fear — it's acting anyway." },
      { name: "Self-Aware Simba",    desc: "Simba questions his own assumptions before questioning anyone else's. Change, he believes, starts from within." }
    ]
  },
  E: {
    name: "Environmentalism",
    color: "var(--c-environmentalism)",
    desc: "You know the Earth is not ours to keep — only to protect. You live with that responsibility every single day.",
    discoveries: [
      { name: "Sustainability Suki", desc: "Suki lives by one rule: leave things better than you found them. Every small choice is a vote for the planet." },
      { name: "Responsible Rami",    desc: "Rami understands that the Earth doesn't belong to us — we belong to it. He acts like it." }
    ]
  },
  A: {
    name: "Adventure",
    color: "var(--c-adventure)",
    desc: "You live at the edge of your comfort zone. That's not recklessness — it's where you feel most alive and most yourself.",
    discoveries: [
      { name: "Inquisitive Indu",  desc: "Indu never stops asking why. Her questions open doors that others didn't even notice were there." },
      { name: "Tenacious Tino",    desc: "Tino doesn't quit. When the path gets hard, he leans in — because that's exactly where growth lives." }
    ]
  },
  L: {
    name: "Leadership",
    color: "var(--c-leadership)",
    desc: "You don't just follow paths. You clear them — and somehow others follow without you having to ask.",
    disco8veries: [
      { name: "Inventive Idris",        desc: "Idris sees solutions where others see obstacles. His ideas don't just solve problems — they reimagine them." },
      { name: "Problem Solving Papri",  desc: "Papri breaks the impossible into steps. She's the person you want in the room when everything goes wrong." }
    ]
  },
  S: {
    name: "Service",
    color: "var(--c-service)",
    desc: "You find purpose in lifting others. Your strength is their strength. That's not a sacrifice — that's your calling.",
    discoveries: [
      { name: "Compassionate Carlos", desc: "Carlos feels the weight of others' struggles as his own — and then does something about it."},
      { name: "Teamwork Tama",        desc: "Tama knows the best things are built together. She lifts others up because that's how everyone rises." }
    ]
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