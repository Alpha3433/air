/* =================================================================
   FÜM — The Quit Pack  ·  Landing page interactions
   ================================================================= */
(function () {
  'use strict';

  const $  = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
  const money = (n) => '$' + n.toFixed(2);

  /* ---- Sticky header shadow ---------------------------------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav -------------------------------------------- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.toggle('is-open'));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => nav.classList.remove('is-open')));
  }

  /* ---- Price logic (plan + add-on) --------------------------- */
  const plans = $$('input[name="plan"]');
  const addon = $('#addonCheck');
  const atcPrice = $('#atcPrice');
  const priceLabel = $('#priceLabel');

  function selectedPlan() {
    return plans.find((p) => p.checked) || plans[0];
  }
  function recalc() {
    const base = parseFloat(selectedPlan().value);
    const extra = addon && addon.checked ? parseFloat(addon.dataset.price) : 0;
    const total = base + extra;
    if (atcPrice) atcPrice.textContent = '— ' + money(total);
    if (priceLabel) priceLabel.textContent = money(base);
  }
  plans.forEach((p) => {
    p.addEventListener('change', () => {
      $$('.plan').forEach((el) => el.classList.remove('is-selected'));
      p.closest('.plan').classList.add('is-selected');
      recalc();
    });
  });
  if (addon) addon.addEventListener('change', recalc);
  recalc();

  /* ---- ATC feedback ------------------------------------------ */
  const atc = $('#atc');
  if (atc) {
    atc.addEventListener('click', () => {
      const plan = selectedPlan().dataset.name;
      const original = atc.querySelector('.atc__price').textContent;
      atc.firstChild.textContent = 'Added ✓ ';
      const count = $('.cart__count');
      if (count) count.textContent = String((parseInt(count.textContent, 10) || 0) + 1);
      setTimeout(() => { atc.firstChild.textContent = 'Add to Cart '; }, 1400);
      console.log('Add to cart →', plan, original, addon && addon.checked ? '+ refill pods' : '');
    });
  }

  /* ---- Accordion --------------------------------------------- */
  $$('.acc').forEach((acc) => {
    const head = $('.acc__head', acc);
    const panel = $('.acc__panel', acc);
    head.addEventListener('click', () => {
      const open = acc.classList.toggle('is-open');
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : 0;
    });
  });

  /* ---- Gallery thumbnails ------------------------------------ */
  const main = $('#galleryMain');
  $$('.thumb').forEach((t) => {
    t.addEventListener('click', () => {
      $$('.thumb').forEach((x) => x.classList.remove('is-active'));
      t.classList.add('is-active');
      // copy the thumbnail's gradient class onto the main image
      if (main) {
        main.className = 'gallery__main ph ' + ([...t.classList].find((c) => c.startsWith('ph--')) || 'ph--kit');
        main.setAttribute('data-label', t.getAttribute('data-label') || '');
      }
    });
  });

  /* ---- Reviews (rendered from data) -------------------------- */
  const reviewData = [
    { n: 'Leanne S.', t: "Didn't think a wooden inhaler would do anything. Three weeks in and I haven't touched my vape. The mint is unreal.", photo: 'ph--ugc1' },
    { n: 'Olivia A.', t: "Replaced my hand-to-mouth habit completely. I reach for FÜM instead of the vape now without thinking." },
    { n: 'Terri L.', t: "I was a pack-a-day smoker for 12 years. This is the first thing that actually broke the ritual for me.", photo: 'ph--ugc3' },
    { n: 'William L.', t: "Skeptical at first. The fidget factor is what does it for me — keeps my hands and mouth busy." },
    { n: 'London W.', t: "Love that there's no battery to charge and no nasty cloud. Just a clean breath of flavor." },
    { n: 'Joel L.', t: "My partner noticed I stopped vaping in the car. Small win but it's adding up fast.", photo: 'ph--ugc5' },
    { n: 'Kevin M.', t: "The 30-day tracker kept me honest. Crossing off days became its own little reward." },
    { n: 'Marcia C.', t: "Gifted one to my dad and ordered a second for myself. Buy one gift one made that easy." },
    { n: 'Hannah M.', t: "Raspberry is my favorite. Tastes great and I'm genuinely down to a couple vapes a week now.", photo: 'ph--ugc2' },
    { n: 'Caleb B.', t: "It's beautifully made — real wood, feels premium in the hand. Doesn't look like a quit aid." },
    { n: 'Lori G.', t: "90-day guarantee made it a no-brainer to try. Didn't need it — I'm keeping mine." },
    { n: 'Jonathan A.', t: "Three cores per pack lasts me ages. Way cheaper than what I was spending on pods.", photo: 'ph--ugc4' },
    { n: 'Stephany C.', t: "The menthol throat hit is close enough that I don't miss the real thing. Impressed." },
    { n: 'Brenda J.', t: "Shipping was fast and the mystery gift was a cute touch. Whole thing feels thoughtful." },
    { n: 'Thomas G.', t: "Quietly the best $88 I've spent this year. My lungs already feel different.", photo: 'ph--ugc6' },
    { n: 'Draper C.', t: "Bought the complete kit. Having extras around means I'm never tempted to fall back." },
  ];

  function stars() {
    return '<span class="stars stars--sm">★★★★★</span>';
  }
  function card(r) {
    const initial = r.n.charAt(0);
    const photo = r.photo ? `<div class="rev__photo ph ${r.photo}" data-label="Customer photo"></div>` : '';
    return `<article class="rev">
        <div class="rev__top">
          <span class="rev__avatar">${initial}</span>
          <div><span class="rev__name">${r.n}</span>${stars()}</div>
        </div>
        <p>${r.t}</p>${photo}
        <span class="rev__verified">✓ Verified Buyer</span>
      </article>`;
  }

  const masonry = $('#masonry');
  const loadMore = $('#loadMore');
  let shown = 0;
  const STEP = 8;

  function renderMore() {
    const next = reviewData.slice(shown, shown + STEP);
    masonry.insertAdjacentHTML('beforeend', next.map(card).join(''));
    shown += next.length;
    if (shown >= reviewData.length && loadMore) {
      loadMore.style.display = 'none';
    }
  }
  if (masonry) {
    masonry.innerHTML = '';
    renderMore();
    if (loadMore) loadMore.addEventListener('click', renderMore);
  }
})();
