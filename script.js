const screens = {
  intro: document.getElementById("screen-intro"),
  quiz: document.getElementById("screen-quiz"),
  finale: document.getElementById("screen-finale"),
};

const startBtn = document.getElementById("startBtn");
const questionText = document.getElementById("questionText");
const progress = document.getElementById("progress");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");

const burstLayer = document.getElementById("burstLayer");
const photoLayer = document.getElementById("photoLayer");
const kissesLayer = document.getElementById("kissesLayer");

const NOM = "Afaf";

const questions = [
  { q: "Afaf… est-ce que tu sais que tu es une perle rare ? 💛", yes: "OUIII ✨", no: "Non ?? impossible 😭" },
  { q: "Est-ce que ton cœur est plus doux que le miel ? 🍯", yes: "Exactement 😌", no: "Le bouton ment 😂" },
  { q: "Est-ce que tu mérites une année pleine de baraka et de bonheur ? 🌙", yes: "AMINE 💛", no: "On va dire OUI 😈" },
  { q: "Est-ce qu’on t’aime énormément (vraiment énormément) ? 💖", yes: "ÉVIDEMMENT 💞", no: "Arrête… si !" },
  { q: "Ok… prête pour ta surprise finale ? 🎁", yes: "LET’S GOOO 🎉", no: "TROP TARD 😈" },
];

let i = 0;

// ---------- helpers ----------
function show(which){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[which].classList.add("active");
}

function renderQ(){
  progress.textContent = `Question ${i + 1} / ${questions.length}`;
  questionText.textContent = questions[i].q;
  hint.textContent = "";

  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";

  yesBtn.style.transform = "scale(1)";
}

// ---------- YES effect ----------
function yesBurst(){
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  const icons = ["✨","💛","🌙","💖","💫","⭐","💞","🌟","💝"];
  const count = 22;

  for (let k = 0; k < count; k++){
    const el = document.createElement("div");
    el.className = "particle";
    el.textContent = icons[Math.floor(Math.random() * icons.length)];

    const sx = cx + rand(-40, 40);
    const sy = cy + rand(-30, 30);
    const tx = sx + rand(-260, 260);
    const ty = sy + rand(-220, 220);

    el.style.left = `${sx}px`;
    el.style.top = `${sy}px`;
    el.style.setProperty("--tx", `${tx}px`);
    el.style.setProperty("--ty", `${ty}px`);

    burstLayer.appendChild(el);
    setTimeout(() => el.remove(), 760);
  }
}

// ---------- NO chaos ----------
function dangerShake(){
  const app = document.getElementById("app");
  app.classList.remove("shake-danger");
  void app.offsetWidth;
  app.classList.add("shake-danger");
  setTimeout(() => app.classList.remove("shake-danger"), 560);
}

function messWithNoButton(){
  // make it run + shrink a bit
  const dx = (Math.random() * 260 - 130);
  const dy = (Math.random() * 160 - 80);
  const sc = rand(0.75, 0.95);

  noBtn.style.position = "relative";
  noBtn.style.left = `${dx}px`;
  noBtn.style.top = `${dy}px`;
  noBtn.style.transform = `scale(${sc}) rotate(${rand(-8,8)}deg)`;
}

// ---------- start ----------
startBtn.addEventListener("click", () => {
  i = 0;
  show("quiz");
  renderQ();
});

yesBtn.addEventListener("click", () => {
  hint.textContent = questions[i].yes;

  // YES: grows + sparks
  yesBtn.style.transform = "scale(1.12)";
  yesBurst();

  i++;

  if (i >= questions.length){
    show("finale");
    startFinalePhotosAndKisses();
    return;
  }

  setTimeout(() => {
    yesBtn.style.transform = "scale(1)";
    renderQ();
  }, 520);
});

// NO: click = dangerous shake + button drama
noBtn.addEventListener("click", () => {
  hint.textContent = questions[i].no;
  dangerShake();
  messWithNoButton();
});

// also: no escapes on hover after question 2
noBtn.addEventListener("mouseenter", () => {
  if (i < 2) return;
  messWithNoButton();
});

// ---------- Finale: falling + duplicating photos + flying kisses ----------
const photoSources = [
  "images/afaf1.jpeg",
  "images/afaf2.jpeg",
  "images/afaf3.jpeg",
];

let photoNodes = [];
let photoRunning = false;

function startFinalePhotosAndKisses(){
  if (photoRunning) return;
  photoRunning = true;

  // build photo duplicates
  photoLayer.innerHTML = "";
  photoNodes = [];

  const COPIES_PER_PHOTO = 5; // 3 * 5 = 15 photos falling in

  for (const src of photoSources){
    for (let k = 0; k < COPIES_PER_PHOTO; k++){
      const img = document.createElement("img");
      img.src = src;
      img.className = "photo-float";
      img.style.animationDelay = `${rand(0, 900)}ms`;

      // start above the screen (fall)
      const node = {
        el: img,
        x: rand(120, window.innerWidth - 120),
        y: rand(-700, -80),
        vx: rand(-0.30, 0.30),
        vy: rand(1.0, 2.4),
        drift: rand(0.006, 0.016),
        phase: rand(0, Math.PI * 2),
        rot: rand(-14, 14),
        rotSpeed: rand(-0.05, 0.05),
        scale: rand(0.78, 1.06),
      };

      photoLayer.appendChild(img);
      photoNodes.push(node);
    }
  }

  requestAnimationFrame(tickFinalePhotos);
  startKisses();
}

function tickFinalePhotos(t){
  const onFinale = screens.finale.classList.contains("active");
  if (!onFinale){ photoRunning = false; return; }

  const W = window.innerWidth;
  const H = window.innerHeight;

  for (const n of photoNodes){
    // falling + drifting
    n.y += n.vy;
    n.x += n.vx + 1.0 * Math.sin(t * n.drift + n.phase);
    n.rot += n.rotSpeed;

    // if goes below, respawn above (keeps it lively)
    if (n.y > H + 140){
      n.y = rand(-600, -120);
      n.x = rand(120, W - 120);
      n.vy = rand(1.0, 2.6);
    }

    // soft wrap horizontally
    if (n.x < -80) n.x = W + 80;
    if (n.x > W + 80) n.x = -80;

    n.el.style.transform =
      `translate(${n.x}px, ${n.y}px) translate(-50%, -50%) scale(${n.scale}) rotate(${n.rot}deg)`;
  }

  requestAnimationFrame(tickFinalePhotos);
}

// Kisses
let kissesTimer = null;

function startKisses(){
  stopKisses();
  kissesTimer = setInterval(() => {
    spawnKiss();
    if (Math.random() < 0.4) spawnKiss();
  }, 420);
}

function stopKisses(){
  if (kissesTimer) clearInterval(kissesTimer);
  kissesTimer = null;
}

function spawnKiss(){
  const kiss = document.createElement("div");
  kiss.className = "kiss";
  kiss.textContent = (Math.random() < 0.5) ? "💋" : "😘";

  const sx = rand(80, window.innerWidth - 80);
  const sy = rand(120, window.innerHeight - 160);
  const kx = sx + rand(-220, 220);
  const ky = sy + rand(-260, -120);

  kiss.style.left = `${sx}px`;
  kiss.style.top = `${sy}px`;
  kiss.style.setProperty("--kx", `${kx}px`);
  kiss.style.setProperty("--ky", `${ky}px`);

  kissesLayer.appendChild(kiss);
  setTimeout(() => kiss.remove(), 1200);
}

// utils
function rand(a,b){ return a + Math.random()*(b-a); }
