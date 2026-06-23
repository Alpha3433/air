/* =================================================================
   FÜM — Journey Pack  ·  Landing page interactions
   ================================================================= */
(function () {
  'use strict';

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const money = (n) => '$' + n.toFixed(2);

  const BASE = 150.76;        // one-time base price (AUD)
  const SUB_DISCOUNT = 0.30;  // subscribe & save
  const PACK_SIZE = 3;        // cores required

  /* ---- Sticky header ----------------------------------------- */
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

  /* ---- Flavor cores (build grid) ----------------------------- */
  const flavors = [
    { n: 'Crisp Mint',     note: 'Citrus · Mint',   c: '#7fbfae' },
    { n: 'Peppermint',     note: 'Cooling · Minty', c: '#a9d6a0' },
    { n: 'Peach',          note: 'Sour · Minty',    c: '#fdd7b6' },
    { n: 'Spearmint',      note: 'Cooling · Minty', c: '#c3e1d8' },
    { n: 'Cinnamon',       note: 'Sweet · Spice',   c: '#e0b07a' },
    { n: 'Black Licorice', note: 'Spicy · Sweet',   c: '#5a5a5a' },
    { n: 'Eucalyptus',     note: 'Sweet · Earthy',  c: '#b6c79a' },
    { n: 'Vanilla',        note: 'Sweet · Citrus',  c: '#f3ead0' },
    { n: 'Grapefruit',     note: 'Citrus · Minty',  c: '#f6a98f' },
    { n: 'Cran-Spruce',    note: 'Fruity · Spicy',  c: '#e0697a' },
    { n: 'Raspberry',      note: 'Sweet · Tangy',   c: '#db5c84' },
  ];

  const coresEl = $('#cores');
  if (coresEl) {
    coresEl.innerHTML = flavors.map((f, i) => `
      <button class="core" data-i="${i}" type="button" aria-pressed="false">
        <span class="core__pick">✓</span>
        <span class="core__chip" style="background:${f.c}"></span>
        <span class="core__name">${f.n}</span>
        <span class="core__note">${f.note}</span>
      </button>`).join('');
  }

  let selectedCores = 0;
  $$('.core').forEach((btn) => {
    btn.addEventListener('click', () => {
      const on = btn.classList.contains('is-selected');
      if (!on && selectedCores >= PACK_SIZE) {
        // bump: replace the oldest selection
        const first = $('.core.is-selected');
        if (first) { first.classList.remove('is-selected'); first.setAttribute('aria-pressed', 'false'); selectedCores--; }
      }
      btn.classList.toggle('is-selected');
      btn.setAttribute('aria-pressed', btn.classList.contains('is-selected'));
      selectedCores = $$('.core.is-selected').length;
      recalc();
    });
  });

  /* ---- Device + accessories + purchase options --------------- */
  const devices = $$('input[name="device"]');
  const accs = $$('#accs input[type="checkbox"]');
  const pos = $$('input[name="po"]');

  function selectedDevice() { return devices.find((d) => d.checked) || devices[0]; }
  function selectedPO() { return (pos.find((p) => p.checked) || pos[0]).value; }

  function subtotal(sub) {
    let t = BASE + parseFloat(selectedDevice().value);
    accs.forEach((a) => { if (a.checked) t += parseFloat(a.dataset.price); });
    if (sub) t = t * (1 - SUB_DISCOUNT);
    return t;
  }

  function recalc() {
    // purchase-option prices
    $('#poOne').textContent = money(subtotal(false));
    $('#poSub').textContent = money(subtotal(true));
    $('#priceNow').textContent = money(BASE + parseFloat(selectedDevice().value));

    // core counter + gating
    const remaining = PACK_SIZE - selectedCores;
    const hint = $('#coreHint');
    if (hint) {
      hint.textContent = remaining > 0 ? `Choose ${remaining}` : 'Done ✓';
      hint.classList.toggle('is-done', remaining <= 0);
    }

    const atc = $('#atc');
    const atcText = $('#atcText');
    const total = subtotal(selectedPO() === 'sub');
    if (remaining > 0) {
      atc.classList.add('is-locked'); atc.disabled = true;
      atcText.textContent = `Choose ${remaining} more core${remaining > 1 ? 's' : ''} to continue`;
    } else {
      atc.classList.remove('is-locked'); atc.disabled = false;
      atcText.textContent = `Add to Cart — ${money(total)}`;
    }
  }

  devices.forEach((d) => d.addEventListener('change', () => {
    $$('.device').forEach((el) => el.classList.remove('is-selected'));
    d.closest('.device').classList.add('is-selected');
    recalc();
  }));
  accs.forEach((a) => a.addEventListener('change', recalc));
  pos.forEach((p) => p.addEventListener('change', () => {
    $$('.po').forEach((el) => el.classList.remove('is-selected'));
    p.closest('.po').classList.add('is-selected');
    recalc();
  }));

  /* ---- ATC ---------------------------------------------------- */
  const atc = $('#atc');
  if (atc) {
    atc.addEventListener('click', () => {
      if (atc.disabled) return;
      const count = $('#cartCount');
      if (count) count.textContent = String((parseInt(count.textContent, 10) || 0) + 1);
      const cores = $$('.core.is-selected').map((c) => flavors[c.dataset.i].n);
      const label = $('#atcText').textContent;
      $('#atcText').textContent = 'Added ✓';
      setTimeout(recalc, 1400);
      console.log('Add to cart →', {
        device: selectedDevice().dataset.name,
        cores,
        purchase: selectedPO(),
        total: label,
      });
    });
  }

  recalc();

  /* ---- Gallery ----------------------------------------------- */
  const main = $('#galleryMain');
  $$('.thumb').forEach((t) => {
    t.addEventListener('click', () => {
      $$('.thumb').forEach((x) => x.classList.remove('is-active'));
      t.classList.add('is-active');
      if (main) {
        const phClass = [...t.classList].find((c) => c.startsWith('ph--')) || 'ph--flatlay';
        main.className = 'gallery__main ph ' + phClass;
        main.setAttribute('data-label', t.getAttribute('data-label') || '');
      }
    });
  });

  /* ---- Reviews ----------------------------------------------- */
  const reviewData = [
    { n: 'Leanne S.', t: "Didn't think a wooden inhaler would do anything. Three weeks in and I haven't touched my vape. Crisp Mint is unreal.", photo: 'ph--ugc1' },
    { n: 'Olivia A.', t: "Replaced my hand-to-mouth habit completely. I reach for the FÜM instead of the vape now without thinking." },
    { n: 'Terri L.', t: "Pack-a-day smoker for 12 years. This is the first thing that actually broke the ritual for me.", photo: 'ph--ugc3' },
    { n: 'William L.', t: "Skeptical at first. The fidget factor is what does it — keeps my hands and mouth busy." },
    { n: 'London W.', t: "Love that there's no battery to charge and no cloud. Just a clean breath of flavor." },
    { n: 'Joel L.', t: "My partner noticed I stopped vaping in the car. Small win, but it's adding up fast.", photo: 'ph--ugc5' },
    { n: 'Kevin M.', t: "The 30-day tracker kept me honest. Crossing off days became its own reward." },
    { n: 'Marcia C.', t: "Gifted one to my dad and ordered the Quit Together pack for us both. So easy." },
    { n: 'Hannah M.', t: "Raspberry core is my favorite. Tastes great and I'm down to a couple vapes a week now.", photo: 'ph--ugc2' },
    { n: 'Caleb B.', t: "Beautifully made — real maple, feels premium. Doesn't look like a quit aid at all." },
    { n: 'Lori G.', t: "90-day guarantee made it a no-brainer to try. Didn't need it — I'm keeping mine." },
    { n: 'Jonathan A.', t: "Cores Club means I never run out. Way cheaper than what I spent on pods.", photo: 'ph--ugc4' },
    { n: 'Stephany C.', t: "The menthol throat hit is close enough that I don't miss the real thing." },
    { n: 'Brenda J.', t: "Fast shipping and the whole unboxing felt thoughtful. Welcome to the good side indeed." },
    { n: 'Thomas G.', t: "Quietly the best $150 I've spent this year. My lungs already feel different.", photo: 'ph--ugc1' },
    { n: 'Draper C.', t: "Built the Complete Pack. Having extra cores around means I'm never tempted to slip." },
  ];

  function stars() { return '<span class="stars stars--sm">★★★★★</span>'; }
  function card(r) {
    const photo = r.photo ? `<div class="rev__photo ph ${r.photo}" data-label="Customer photo"></div>` : '';
    return `<article class="rev">
        <div class="rev__top"><span class="rev__avatar">${r.n.charAt(0)}</span>
          <div><span class="rev__name">${r.n}</span>${stars()}</div></div>
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
    if (shown >= reviewData.length && loadMore) loadMore.style.display = 'none';
  }
  if (masonry) {
    masonry.innerHTML = '';
    renderMore();
    if (loadMore) loadMore.addEventListener('click', renderMore);
  }
})();
