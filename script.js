const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js-enabled');
if (reducedMotion) root.classList.add('reduced-motion');

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const reveals = document.querySelectorAll('.section-head, .work-item, .method-copy, .contact-content');
if ('IntersectionObserver' in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.dataset.reveal = '';
      requestAnimationFrame(() => entry.target.classList.add('is-visible'));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  reveals.forEach((item) => revealObserver.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

const journey = document.querySelector('.journey');
const scene = document.querySelector('[data-scene]');
const steps = [...document.querySelectorAll('.journey-step')];
const stepCount = document.querySelector('.journey-count');
const progressBar = document.querySelector('.journey-progress span');
let scrollFrame = 0;
let activeStep = -1;

function paintJourney() {
  scrollFrame = 0;
  if (!journey || !scene) return;
  const rect = journey.getBoundingClientRect();
  const travel = Math.max(1, rect.height - window.innerHeight);
  const progress = reducedMotion ? 1 : Math.max(0, Math.min(1, -rect.top / travel));
  const draw = Math.max(0, Math.min(1, (progress - 0.04) / 0.75));
  const stepIndex = Math.min(2, Math.floor(progress * 3));
  scene.style.setProperty('--draw', String(1 - draw));
  scene.style.setProperty('--city-progress', String(draw));
  scene.style.setProperty('--grid-progress', String(Math.min(1, 0.18 + draw * 0.6)));
  scene.style.setProperty('--building-lift', `${(1 - draw) * 24}px`);
  scene.style.setProperty('--building-rotate', `${(1 - draw) * -5}deg`);
  scene.style.transform = `translateY(-48%) rotateX(${3 + progress * 3}deg) rotateY(${-8 + progress * 10}deg) scale(${0.88 + progress * 0.12})`;
  if (progressBar) progressBar.style.width = `${progress * 100}%`;
  if (stepIndex !== activeStep) {
    activeStep = stepIndex;
    steps.forEach((step, index) => step.classList.toggle('is-current', index === stepIndex));
    if (stepCount) stepCount.innerHTML = `0${stepIndex + 1} <i>/</i> 03`;
  }
}
function scheduleJourney() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(paintJourney);
}
window.addEventListener('scroll', scheduleJourney, { passive: true });
window.addEventListener('resize', scheduleJourney, { passive: true });
paintJourney();

// A slight pointer parallax gives the glass and the drawn city different depths.
if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  const shard = document.querySelector('.intro-shard');
  const city = document.querySelector('.city-scene');
  let pointerFrame = 0;
  let pointer = { x: 0, y: 0 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (shard) shard.style.marginLeft = `${pointer.x * 9}px`;
      if (city && journey) {
        const bounds = journey.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom > 0) {
          const progress = Math.max(0, Math.min(1, -bounds.top / Math.max(1, bounds.height - window.innerHeight)));
          city.style.setProperty('--pointer-x', `${pointer.x * 4}deg`);
          city.style.setProperty('--pointer-y', `${pointer.y * -2}deg`);
          city.style.transform = `translateY(-48%) rotateX(${3 + progress * 3 + pointer.y * -2}deg) rotateY(${-8 + progress * 10 + pointer.x * 4}deg) scale(${0.88 + progress * 0.12})`;
        }
      }
    });
  }, { passive: true });
}


// A small illustrated envelope follows the pointer and opens on click.
const mailCursor = document.querySelector('.mail-cursor');
if (mailCursor && !reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  document.body.classList.add('has-mail-cursor');
  let cursorX = -100, cursorY = -100, cursorFrame = 0;
  window.addEventListener('pointermove', (event) => {
    cursorX = event.clientX - 12;
    cursorY = event.clientY - 10;
    if (cursorFrame) return;
    cursorFrame = requestAnimationFrame(() => {
      cursorFrame = 0;
      mailCursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0) rotate(-8deg)`;
    });
  }, { passive: true });
  document.addEventListener('click', () => {
    mailCursor.classList.remove('is-opening');
    void mailCursor.offsetWidth;
    mailCursor.classList.add('is-opening');
    window.setTimeout(() => mailCursor.classList.remove('is-opening'), 620);
  });
}

// Gold sparks on interaction; internal page changes glide out to the left.
function sparkleAt(event, target) {
  if (reducedMotion) return;
  const bounds = target.getBoundingClientRect();
  const x = Number.isFinite(event.clientX) && event.clientX ? event.clientX : bounds.left + bounds.width / 2;
  const y = Number.isFinite(event.clientY) && event.clientY ? event.clientY : bounds.top + bounds.height / 2;
  const burst = document.createElement('span');
  burst.className = 'click-glint';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  document.body.append(burst);
  const symbols = ['✦', '✧', '✦', '·', '✧', '✦', '·', '✧'];
  symbols.forEach((symbol, index) => {
    const spark = document.createElement('span');
    const angle = (Math.PI * 2 * index) / symbols.length - Math.PI / 2;
    const distance = 25 + (index % 3) * 10;
    spark.className = 'click-spark';
    spark.textContent = symbol;
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty('--spark-x', `${Math.cos(angle) * distance}px`);
    spark.style.setProperty('--spark-y', `${Math.sin(angle) * distance}px`);
    spark.style.setProperty('--spark-delay', `${(index % 3) * 22}ms`);
    document.body.append(spark);
    spark.addEventListener('animationend', () => spark.remove(), { once: true });
  });
  burst.addEventListener('animationend', () => burst.remove(), { once: true });
}

// Animate entry after a same-site page transition.
try {
  if (sessionStorage.getItem('dgb-page-enter') === '1') {
    sessionStorage.removeItem('dgb-page-enter');
    document.documentElement.classList.add('is-entering');
    window.setTimeout(() => document.documentElement.classList.add('has-entered'), 24);
  }
} catch (_) { /* Storage may be unavailable; navigation still works. */ }

document.addEventListener('click', (event) => {
  const target = event.target.closest('a[href], button, [role="button"], input[type="button"], input[type="submit"]');
  if (!target) return;
  sparkleAt(event, target);

  if (!(target instanceof HTMLAnchorElement) || reducedMotion || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || target.hasAttribute('download') || (target.target && target.target !== '_self')) return;
  const destination = new URL(target.href, window.location.href);
  if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname && destination.search === window.location.search) return;

  event.preventDefault();
  try { sessionStorage.setItem('dgb-page-enter', '1'); } catch (_) { /* Keep the outgoing transition even without storage. */ }
  document.documentElement.classList.add('is-navigating');
  window.setTimeout(() => window.location.assign(destination.href), 560);
}, true);
