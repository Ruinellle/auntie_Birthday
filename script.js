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

const finaleTitle = document.getElementById("finaleTitle");
const finaleMessage = document.getElementById("finaleMessage");

// ✅ Change this line to her name (example)
const NOM = "Ma Tante 💖";

// ✅ Choose: "anniversaire" or "anniversaire + anniversaire de mariage" vibe
const OCCASION = "anniversaire";

const questions = [
  { q: "Est-ce que tu es une personne exceptionnelle ?", yes: "Évidemment ✨", no: "Hmm… je pense que si 😌" },
  { q: "Est-ce que tu rends la vie des autres plus belle ?", yes: "TELLEMENT 💗", no: "Arrête… si !" },
  { q: "Est-ce que tu mérites une journée remplie de bonheur ?", yes: "Ouiiii 🎉", no: "Le bouton n’est pas d’accord 😌" },
  { q: "Est-ce que tu sais à quel point tu es précieuse ?", yes: "J’espère que oui 💖", no: "Je vais te le rappeler 😤" },
  { q: "Ok… prête pour la surprise finale ?", yes: "Allons-y !! 😍", no: "Trop tard 😈" },
];

let i = 0;

function show(which){
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[which].classList.add("active");
}

function renderQ(){
  progress.textContent = `Question ${i + 1} / ${questions.length}`;
  questionText.textContent = questions[i].q;
  hint.textContent = "";

  // reset no
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
}

startBtn.addEventListener("click", () => {
  i = 0;
  show("quiz");
  renderQ();
});

yesBtn.addEventListener("click", () => {
  hint.textContent = questions[i].yes;
  i++;

  if (i >= questions.length){
    show("finale");

    finaleTitle.textContent = `Joyeux ${OCCASION} 🎉`;
    finaleMessage.textContent = `Pour ${NOM} : merci pour ton amour, ta gentillesse et ta lumière. Je t’aime fort 💖`;

    startSlideshow();
    return;
  }
  setTimeout(renderQ, 520);
});

// Petit côté fun: le bouton "Non" s’échappe sur les dernières questions
noBtn.addEventListener("mouseenter", () => {
  if (i < 2) return;
  dodgeNo();
});

noBtn.addEventListener("click", () => {
  hint.textContent = questions[i].no;
  if (i >= 2) dodgeNo();
});

function dodgeNo(){
  const dx = (Math.random() * 220 - 110);
  const dy = (Math.random() * 120 - 60);
  noBtn.style.position = "relative";
  noBtn.style.left = `${dx}px`;
  noBtn.style.top = `${dy}px`;
}

/* -------- Slideshow -------- */
const slides = Array.from(document.querySelectorAll(".slide"));
const dotsWrap = document.getElementById("dots");

let slideIndex = 0;
let slideTimer = null;

function buildDots(){
  dotsWrap.innerHTML = "";
  slides.forEach((_, idx) => {
    const d = document.createElement("button");
    d.className = "dot" + (idx === 0 ? " active" : "");
    d.addEventListener("click", () => {
      goToSlide(idx);
      restartTimer();
    });
    dotsWrap.appendChild(d);
  });
}

function setActiveSlide(idx){
  slides.forEach((s, i) => s.classList.toggle("active", i === idx));
  const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
  dots.forEach((d, i) => d.classList.toggle("active", i === idx));
}

function goToSlide(idx){
  slideIndex = (idx + slides.length) % slides.length;
  setActiveSlide(slideIndex);
}

function nextSlide(){
  goToSlide(slideIndex + 1);
}

function restartTimer(){
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 3200);
}

function startSlideshow(){
  if (!dotsWrap) return;
  buildDots();
  setActiveSlide(0);
  restartTimer();
}
