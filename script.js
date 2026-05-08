const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const typedTarget = document.getElementById('typed');
const themeToggle = document.getElementById('themeToggle');
const form = document.getElementById('contact-form');
const year = document.getElementById('year');

function setScrolledHeader() {
  header.classList.toggle('scrolled', window.scrollY > 8);
}

document.addEventListener('scroll', setScrolledHeader);
setScrolledHeader();

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('no-scroll', isOpen);
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  });
});

const sections = document.querySelectorAll('section[id]');
const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navAnchors.forEach((anchor) => {
      anchor.classList.toggle('active', anchor.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-48% 0px -48% 0px', threshold: 0.01 });

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const words = ['data dashboards', 'SQL insights', 'Excel reports', 'AI web apps'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
let lastTime = 0;

function typeLoop(timestamp) {
  const word = words[wordIndex];
  const speed = deleting ? 45 : 80;

  if (timestamp - lastTime > speed) {
    lastTime = timestamp;

    if (!deleting) {
      charIndex += 1;
      typedTarget.textContent = word.slice(0, charIndex);
      if (charIndex === word.length) {
        deleting = true;
        lastTime = timestamp + 950;
      }
    } else {
      charIndex -= 1;
      typedTarget.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        lastTime = timestamp + 240;
      }
    }
  }

  requestAnimationFrame(typeLoop);
}
requestAnimationFrame(typeLoop);

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') {
  document.documentElement.setAttribute('data-theme', 'light');
  themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const nextTheme = isLight ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('portfolio-theme', nextTheme);
  themeToggle.innerHTML = nextTheme === 'light'
    ? '<i class="fa-solid fa-sun"></i>'
    : '<i class="fa-solid fa-moon"></i>';
});

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    document.querySelectorAll('.project-card').forEach((card) => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !shouldShow);
    });
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = encodeURIComponent(document.getElementById('name').value.trim());
  const email = encodeURIComponent(document.getElementById('email').value.trim());
  const subject = encodeURIComponent(document.getElementById('subject').value.trim() || 'Portfolio contact');
  const message = encodeURIComponent(document.getElementById('message').value.trim());

  const body = `Name: ${name}%0AEmail: ${email}%0A%0A${message}`;
  window.location.href = `mailto:sourabh2087gupta@gmail.com?subject=${subject}&body=${body}`;
});

year.textContent = new Date().getFullYear();
