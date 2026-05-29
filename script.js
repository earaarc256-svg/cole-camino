const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const cursorGlow = document.querySelector('.cursor-glow');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.addEventListener('click', (event) => {
  if (event.target.matches('a')) {
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('pointermove', (event) => {
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        entry.target.textContent = Math.round(target * progress);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll('[data-count]').forEach((counter) => countObserver.observe(counter));

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    document.querySelectorAll('.action-card').forEach((card) => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

document.querySelectorAll('.tab-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach((tab) => tab.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

const sections = [...document.querySelectorAll('main section[id], header[id]')];
const links = [...document.querySelectorAll('.nav-links a')];

window.addEventListener('scroll', () => {
  const current = sections.findLast((section) => window.scrollY >= section.offsetTop - 160);
  links.forEach((link) => {
    link.classList.toggle('active', current && link.getAttribute('href') === `#${current.id}`);
  });
});
