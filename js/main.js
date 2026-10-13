const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const ant = document.getElementById("ant");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

menuBtn.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const FRAME_COUNT = 90;
const FRAME_MS = 70;
const frames = [];
let frameReady = 0;

for (let i = 0; i < FRAME_COUNT; i += 1) {
  const img = new Image();
  const n = String(i).padStart(4, "0");
  img.src = `formiga_frames_transparentes/frames_ant/frame_${n}.png`;
  img.onload = () => {
    frameReady += 1;
  };
  frames.push(img);
}

function walkAnt() {
  if (!ant || frameReady < 8) {
    requestAnimationFrame(walkAnt);
    return;
  }

  const maxX = Math.max(window.innerWidth - 40, 200);
  let x = -80;
  let frame = 0;
  let last = 0;
  let facing = 1;
  let speed = 0.55;

  function tick(now) {
    if (!last) last = now;
    const dt = Math.min(now - last, 40);
    last = now;
    x += speed * facing * dt;
    if (x > maxX) {
      facing = -1;
      x = maxX;
    } else if (x < -80) {
      facing = 1;
      x = -80;
    }
    frame = (frame + dt / FRAME_MS) % FRAME_COUNT;
    const img = frames[Math.floor(frame)];
    if (img && img.complete) {
      ant.style.backgroundImage = `url("${img.src}")`;
    }
    ant.style.transform = `translateX(${x}px) scaleX(${facing})`;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

walkAnt();
