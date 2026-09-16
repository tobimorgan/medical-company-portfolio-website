document.addEventListener('DOMContentLoaded', () => {
  const localImages = ['assets/images/hero.jpg', 'assets/images/doctor-maya.jpg', 'assets/images/doctor-james.jpg', 'assets/images/doctor-aisha.jpg'];
  document.querySelectorAll('.portrait img').forEach((image, index) => { image.src = localImages[index]; });
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
  navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  }));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const stats = document.querySelectorAll('[data-count]');
  const statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const stat = entry.target; const target = Number(stat.dataset.count); let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const count = () => { current = Math.min(current + step, target); stat.textContent = current; if (current < target) requestAnimationFrame(count); };
      count(); statObserver.unobserve(stat);
    });
  }, { threshold: 0.8 });
  stats.forEach(stat => statObserver.observe(stat));

  const testimonials = [...document.querySelectorAll('.testimonial')];
  const countLabel = document.querySelector('#story-count'); let activeStory = 0;
  const showStory = index => { activeStory = (index + testimonials.length) % testimonials.length; testimonials.forEach((story, i) => story.classList.toggle('is-active', i === activeStory)); if (countLabel) countLabel.textContent = `0${activeStory + 1} / 0${testimonials.length}`; };
  document.querySelector('#previous-story')?.addEventListener('click', () => showStory(activeStory - 1));
  document.querySelector('#next-story')?.addEventListener('click', () => showStory(activeStory + 1));
  let sliderTimer = setInterval(() => showStory(activeStory + 1), 6000);
  document.querySelector('.testimonial-wrap')?.addEventListener('mouseenter', () => clearInterval(sliderTimer));
  document.querySelector('.testimonial-wrap')?.addEventListener('mouseleave', () => { sliderTimer = setInterval(() => showStory(activeStory + 1), 6000); });

  const form = document.querySelector('#appointment-form');
  const setError = (id, message) => { const input = document.querySelector(`#${id}`); const error = document.querySelector(`#${id}-error`); input.classList.toggle('invalid', Boolean(message)); if (error) error.textContent = message; return !message; };
  form?.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.querySelector('#name').value.trim(); const email = document.querySelector('#email').value.trim(); const phone = document.querySelector('#phone').value.trim();
    const validName = setError('name', name ? '' : 'Please enter your name.');
    const validEmail = setError('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Please enter a valid email.');
    const validPhone = setError('phone', /^[\d\s()+-]{7,}$/.test(phone) ? '' : 'Please enter a valid phone number.');
    const status = document.querySelector('#form-status');
    if (!validName || !validEmail || !validPhone) { status.textContent = 'Please check the highlighted fields.'; status.className = 'form-status'; return; }
    status.textContent = 'Thank you. We received your request and will be in touch within one business day.'; status.className = 'form-status success'; form.reset();
  });
});