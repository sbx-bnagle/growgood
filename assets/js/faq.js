// ---------------------------------------------------------------------------
// FAQ accordion
//
// Wires up the click-to-expand behaviour for any .faq_q trigger rendered by
// _includes/faq.html. Previously this exact script was pasted inline into
// both services.markdown and preplanned.markdown.
// ---------------------------------------------------------------------------

document.querySelectorAll('.faq_q').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';
    const drawer = document.getElementById(trigger.getAttribute('aria-controls'));

    trigger.setAttribute('aria-expanded', String(!isOpen));
    drawer.classList.toggle('hidden', isOpen);
  });
});
