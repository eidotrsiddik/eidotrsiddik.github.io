const projects = {
  'short-story': {title: 'Everyday, in motion', category: 'SHORT NARRATIVE EDIT / 00:29', portrait: false},
  'rooftop-edit': {title: 'Rooftop — cinematic edit', category: 'CINEMATIC EDIT / 00:29', portrait: false},
  'toothpaste-guide': {title: 'Choosing the right toothpaste', category: 'DENTAL EDUCATIONAL REEL / 00:45', portrait: true},
  'whitening-explained': {title: 'Whitening toothpaste, explained', category: 'DENTAL EDUCATIONAL REEL / 00:54', portrait: true},
  'parenting-mistakes': {title: '5 mistakes in parenting', category: 'PARENTING REEL — MAIN EDIT / 00:53', portrait: true},
  'child-confidence': {title: '5 mistakes in parenting — social version', category: 'PARENTING REEL — SOCIAL VERSION / 00:53', portrait: true},
  'lead-by-example': {title: 'Lead by behavior, not by blame', category: 'PARENTING REEL / 00:51', portrait: true},
  'kids-youtube': {title: '5 learning channels for kids', category: 'EDUCATIONAL REEL / 01:03', portrait: true},
  'saffron-business': {title: 'Saffron business explainer', category: 'BUSINESS REEL / 01:30', portrait: true},
  'edit-0410': {title: 'Cooking oils — before & after', category: 'EDITING COMPARISON / 01:03', portrait: true},
  'crook-junk-bts': {title: 'Creator reel — before & after', category: 'EDITING COMPARISON / 01:34', portrait: true},
  'energy-drink': {title: 'Energy drink — before & after', category: 'EDITING COMPARISON / 01:18', portrait: true}
};
const dialog = document.querySelector('#video-dialog');
const player = document.querySelector('#project-player');
const error = document.querySelector('#video-error');
let opener = null;

function openProject(key, trigger) {
  const project = projects[key];
  if (!project) return;
  opener = trigger;
  document.querySelector('#video-title').textContent = project.title;
  document.querySelector('#video-category').textContent = project.category;
  dialog.classList.toggle('portrait-player', project.portrait);
  player.src = `assets/${key}.mp4`;
  player.poster = `assets/${key}.jpg`;
  document.querySelector('#video-direct').href = player.src;
  error.hidden = true;
  dialog.showModal();
  document.body.classList.add('modal-open');
  player.play().catch(() => { /* Native controls remain available if autoplay is blocked. */ });
}
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => openProject(button.dataset.project, button));
});
document.querySelector('#close-player').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  player.pause();
  player.removeAttribute('src');
  player.load();
  document.body.classList.remove('modal-open');
  opener?.focus({preventScroll: true});
});
player.addEventListener('error', () => { if (player.getAttribute('src')) error.hidden = false; });

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(filter => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    let count = 0;
    const videos = new Set();
    document.querySelectorAll('[data-category]').forEach(project => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) {
        count++;
        project.classList.remove('pending-reveal');
        project.querySelectorAll('[data-project]').forEach(play => videos.add(play.dataset.project));
      }
    });
    document.querySelector('.work-count').textContent = `${videos.size} ${videos.size === 1 ? 'VIDEO' : 'VIDEOS'} / ${count} ${count === 1 ? 'PROJECT' : 'PROJECTS'}`;
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  mobileNav.hidden = true;
}
menuToggle.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(expanded));
  menuToggle.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  mobileNav.hidden = !expanded;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.remove('pending-reveal'); observer.unobserve(entry.target); }
    });
  }, {threshold: 0.07});
  document.querySelectorAll('.project, .about-layout, .tool, .craft-list > div').forEach(element => {
    element.classList.add('reveal', 'pending-reveal');
    observer.observe(element);
  });
}
