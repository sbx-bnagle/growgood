const images = [
  { src: "/assets/images/fpo.png", label: "Image 1" },
  { src: "/assets/images/fpo.png", label: "Image 2" },
  { src: "/assets/images/fpo.png", label: "Image 3" },
  { src: "/assets/images/fpo.png", label: "Image 4" },
];

let current = 0;
let animating = false;
const mainEl = document.getElementById('mainImg');
const thumbsEl = document.getElementById('thumbs');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateArrows() {
  // aria-disabled, not disabled, so a keyboard user on the button keeps their place.
  [[prevBtn, current === 0], [nextBtn, current === images.length - 1]].forEach(([btn, off]) => {
    btn.classList.toggle('disabled', off);
    btn.setAttribute('aria-disabled', String(off));
  });
}

function makeSlide(img, extraClass) {
  const slide = document.createElement('div');
  slide.className = 'slide ' + extraClass;
  if (img.src) {
    const i = document.createElement('img');
    i.src = img.src;
    i.alt = img.label;
    slide.appendChild(i);
  } else {
    const p = document.createElement('div');
    p.className = 'slide-label';
    p.textContent = img.label;
    slide.appendChild(p);
  }
  return slide;
}

function initSlides() {
  const slide = makeSlide(images[0], 'current');
  mainEl.insertBefore(slide, prevBtn);
}

function setActive(i) {
  if (i === current || animating || i < 0 || i >= images.length) return;
  animating = true;

  const direction = i > current ? 'right' : 'left';
  const oldSlide = mainEl.querySelector('.slide.current');
  const newSlide = makeSlide(images[i], direction === 'right' ? 'enter-from-right' : 'enter-from-left');
  mainEl.insertBefore(newSlide, prevBtn);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      newSlide.classList.remove('enter-from-right', 'enter-from-left');
      newSlide.classList.add('current');
      oldSlide.classList.remove('current');
      oldSlide.classList.add(direction === 'right' ? 'exit-to-left' : 'exit-to-right');

      newSlide.addEventListener('transitionend', () => {
        oldSlide.remove();
        animating = false;
      }, { once: true });
    });
  });

  current = i;
  updateArrows();
  document.querySelectorAll('.thumb').forEach((t, idx) => {
    t.classList.toggle('active', idx === i);
    if (idx === i) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
  });
}

prevBtn.addEventListener('click', () => setActive(current - 1));
nextBtn.addEventListener('click', () => setActive(current + 1));

images.forEach((img, i) => {
  // A button, so the keyboard reaches each image (A11Y-007); its image's alt text names it.
  const thumb = document.createElement('button');
  thumb.type = 'button';
  thumb.className = 'thumb' + (i === 0 ? ' active' : '');
  if (i === 0) thumb.setAttribute('aria-current', 'true');
  if (img.src) {
    const t = document.createElement('img');
    t.src = img.src; t.alt = img.label;
    thumb.appendChild(t);
  } else {
    const p = document.createElement('div');
    p.className = 'thumb-placeholder';
    p.textContent = img.label;
    thumb.appendChild(p);
  }
  thumb.addEventListener('click', () => setActive(i));
  thumbsEl.appendChild(thumb);
});

initSlides();
updateArrows();