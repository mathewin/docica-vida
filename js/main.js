function fillMarquees() {
  document.querySelectorAll(".strip-track").forEach((track) => {
    const original = track.querySelector(".strip-group");
    if (!original) return;
    if (!track.dataset.seed) track.dataset.seed = original.innerHTML;
    track.replaceChildren();
    const group = document.createElement("div");
    group.className = "strip-group";
    group.innerHTML = track.dataset.seed;
    track.appendChild(group);
    let guard = 0;
    while (group.offsetWidth < window.innerWidth + 120 && guard < 16) {
      group.insertAdjacentHTML("beforeend", track.dataset.seed);
      guard += 1;
    }
    const copy = group.cloneNode(true);
    copy.setAttribute("aria-hidden", "true");
    track.appendChild(copy);
  });
}

fillMarquees();
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(fillMarquees);
}
let marqueeTimer;
window.addEventListener("resize", () => {
  clearTimeout(marqueeTimer);
  marqueeTimer = setTimeout(fillMarquees, 150);
});

const header = document.getElementById("header");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

function setMenuOpen(open) {
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  menuBtn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

menuBtn.addEventListener("click", () => {
  setMenuOpen(!nav.classList.contains("open"));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.querySelectorAll(".carousel").forEach((carousel, i) => {
  const slides = carousel.querySelectorAll("img");
  if (slides.length < 2) return;
  let index = 0;
  slides[0].classList.add("active");
  if (reduceMotion) return;
  const interval = Number(carousel.dataset.interval) || 2600 + i * 400;
  const delay = 400 + i * 650;
  setTimeout(() => {
    setInterval(() => {
      slides[index].classList.remove("active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("active");
    }, interval);
  }, delay);
});

{
  const ANT_FRAMES = 90;
  const antFrames = [];
  for (let i = 0; i < ANT_FRAMES; i++) {
    const img = new Image();
    img.src = `img/formiga-crop/frame_${String(i).padStart(4, "0")}.png`;
    antFrames.push(img);
  }

  const antWalker = document.getElementById("antWalker");
  const antSprite = document.getElementById("antSprite");
  let lastAnt = performance.now();
  let lastFrame = -1;
  let antVisible = true;
  let hideAt = performance.now() + 14000 + Math.random() * 8000;
  let showAt = 0;
  let walkDist = 0;
  let speed = 46;
  let x = window.innerWidth * 0.18;
  let y = window.innerHeight * 0.58;
  let tx = window.innerWidth * 0.72;
  let ty = window.innerHeight * 0.32;
  let rot = 0;

  function antSize() {
    return window.innerWidth < 900 ? 52 : 70;
  }

  function randomSpot() {
    const size = antSize();
    const pad = 24;
    return {
      x: pad + Math.random() * Math.max(40, window.innerWidth - size - pad * 2),
      y: pad + Math.random() * Math.max(40, window.innerHeight - size - pad * 2)
    };
  }

  function pickTarget() {
    const next = randomSpot();
    tx = next.x;
    ty = next.y;
    speed = 40 + Math.random() * 18;
  }

  function tickAnt(now) {
    const dt = Math.min(0.05, (now - lastAnt) / 1000);
    lastAnt = now;
    const size = antSize();
    antWalker.style.width = `${size}px`;
    antWalker.style.height = `${Math.round(size * 0.77)}px`;

    if (antVisible && now >= hideAt) {
      antVisible = false;
      antWalker.classList.add("is-away");
      showAt = now + 1800 + Math.random() * 2200;
    }

    if (!antVisible && now >= showAt) {
      const spot = randomSpot();
      x = spot.x;
      y = spot.y;
      pickTarget();
      antVisible = true;
      antWalker.classList.remove("is-away");
      hideAt = now + 12000 + Math.random() * 8000;
    }

    if (antVisible) {
      const dx = tx - x;
      const dy = ty - y;
      const dist = Math.hypot(dx, dy);
      if (dist < 8) {
        pickTarget();
      } else {
        x += (dx / dist) * speed * dt;
        y += (dy / dist) * speed * dt;
        rot = Math.atan2(dy, dx) * 180 / Math.PI;
        walkDist += speed * dt;
      }
      antWalker.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
      const frame = Math.floor(walkDist / 4) % ANT_FRAMES;
      if (frame !== lastFrame && antFrames[frame] && antFrames[frame].complete) {
        antSprite.src = antFrames[frame].src;
        lastFrame = frame;
      }
    }

    requestAnimationFrame(tickAnt);
  }

  requestAnimationFrame(tickAnt);
}
