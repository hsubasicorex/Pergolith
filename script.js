const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const audienceTabs = [...document.querySelectorAll('[data-audience]')];
const audiencePanels = [...document.querySelectorAll('[data-panel]')];
const projectSelect = document.querySelector('[data-project-select]');
const systemInterest = document.querySelector('[data-system-interest]');
const interestBanner = document.querySelector('[data-interest-banner]');
const interestLabel = document.querySelector('[data-interest-label]');

const updateHeader = () => header?.classList.toggle('is-fixed', window.scrollY > 120);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  menuButton?.setAttribute('aria-label', 'Open menu');
  mobileNav?.classList.remove('is-open');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
  mobileNav?.classList.toggle('is-open', opening);
  document.body.classList.toggle('menu-open', opening);
});

mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

audienceTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.audience;
    audienceTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    audiencePanels.forEach(panel => {
      const active = panel.dataset.panel === target;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  });
  tab.addEventListener('keydown', event => {
    const current = audienceTabs.indexOf(tab);
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % audienceTabs.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + audienceTabs.length) % audienceTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = audienceTabs.length - 1;
    if (next !== current) {
      event.preventDefault();
      audienceTabs[next].focus();
      audienceTabs[next].click();
    }
  });
});

const mobileCta = document.querySelector('.mobile-cta');
const quoteSection = document.querySelector('#quote');
const heroSection = document.querySelector('.hero');
if (mobileCta && quoteSection && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    mobileCta.classList.toggle('is-in-quote', entry.isIntersecting);
  }, { threshold: 0.08 }).observe(quoteSection);
}
if (mobileCta && heroSection && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    mobileCta.classList.toggle('is-on-hero', entry.isIntersecting);
  }, { threshold: 0.12 }).observe(heroSection);
}

document.querySelectorAll('[data-project-choice]').forEach(link => {
  link.addEventListener('click', () => {
    const choice = link.dataset.projectChoice;
    if (!projectSelect || !choice) return;
    const matchingOption = [...projectSelect.options].find(option => option.value === choice);
    if (matchingOption) {
      projectSelect.value = choice;
    } else if (systemInterest) {
      systemInterest.value = choice;
      if (interestLabel) interestLabel.textContent = choice;
      if (interestBanner) interestBanner.hidden = false;
    }
  });
});

document.querySelectorAll('.faq details').forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq details').forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

const quoteForm = document.querySelector('[data-quote-form]');
quoteForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!quoteForm.reportValidity()) return;

  const data = new FormData(quoteForm);
  const priorities = data.getAll('priority').join(', ') || 'Not specified';
  const subject = `Pergolith project inquiry — ${data.get('projectType')} — ${data.get('city')}`;
  const body = [
    'New Pergolith project inquiry',
    '',
    `Name: ${data.get('firstName')} ${data.get('lastName')}`,
    `Email: ${data.get('email')}`,
    `Phone: ${data.get('phone') || 'Not provided'}`,
    `Project type: ${data.get('projectType')}`,
    `System interest: ${data.get('systemInterest') || 'Open to recommendation'}`,
    `Location: ${data.get('city')}, ${data.get('state')}`,
    `Approximate size: ${data.get('size') || 'Not provided'}`,
    `Priorities: ${priorities}`,
    `Target timing: ${data.get('timeline')}`,
    `Investment range: ${data.get('budget')}`,
    '',
    'Project details:',
    data.get('details') || 'Not provided'
  ].join('\n');

  const status = quoteForm.querySelector('[data-form-status]');
  if (status) {
    status.textContent = 'Your email application is opening with the project details prepared. Review the message and send it to complete your inquiry.';
    status.classList.add('is-visible');
  }
  window.location.href = `mailto:hello@pergolith.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
