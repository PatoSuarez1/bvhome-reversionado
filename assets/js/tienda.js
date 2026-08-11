/* =============================================================
   BV HOME — Tienda: filtros en vivo, orden, URL sincronizada
   ============================================================= */
(() => {
'use strict';
const { money, cardHTML, reveal, openPanel, $, $$ } = window.BV;

const PAGE = 12;
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/* ---------- Estado desde la URL ---------- */
const qs = new URLSearchParams(location.search);
const state = {
  cats:  (qs.get('cat')   || '').split(',').filter(Boolean),
  cols:  (qs.get('color') || '').split(',').filter(Boolean),
  q:      qs.get('q')    || '',
  sort:   qs.get('sort') || 'rel',
  max:   +qs.get('max')  || 4000000,
  stock:  qs.get('stock') === '1',
  nuevo:  qs.get('nuevo') === '1' || qs.get('sort') === 'nuevo',
  shown:  PAGE
};

function pushURL() {
  const u = new URLSearchParams();
  if (state.cats.length)  u.set('cat', state.cats.join(','));
  if (state.cols.length)  u.set('color', state.cols.join(','));
  if (state.q)            u.set('q', state.q);
  if (state.sort !== 'rel') u.set('sort', state.sort);
  if (state.max < 4000000) u.set('max', state.max);
  if (state.stock)        u.set('stock', '1');
  if (state.nuevo)        u.set('nuevo', '1');
  history.replaceState(null, '', u.toString() ? `?${u}` : location.pathname);
}

/* ---------- Filtrado ---------- */
function matches(p, ignore = null) {
  if (ignore !== 'cat'   && state.cats.length && !state.cats.includes(p.cat)) return false;
  if (ignore !== 'color' && state.cols.length && !(p.colores || []).some(c => state.cols.includes(c))) return false;
  if (ignore !== 'price' && p.precio > state.max) return false;
  if (ignore !== 'stock' && state.stock && p.stock === 0) return false;
  if (ignore !== 'nuevo' && state.nuevo && !p.nuevo) return false;
  if (state.q) {
    const hay = norm([p.nombre, p.cat, (p.tags || []).join(' '), p.materiales || '', p.desc || ''].join(' '));
    if (!norm(state.q).split(/\s+/).every(w => hay.includes(w))) return false;
  }
  return true;
}

function results() {
  const r = CATALOGO.filter(p => matches(p));
  const s = state.sort;
  if (s === 'asc')    r.sort((a, b) => a.precio - b.precio);
  else if (s === 'desc') r.sort((a, b) => b.precio - a.precio);
  else if (s === 'nombre') r.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  else if (s === 'nuevo')  r.sort((a, b) => (b.nuevo ? 1 : 0) - (a.nuevo ? 1 : 0));
  else r.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
  return r;
}

/* ---------- Render ---------- */
function render() {
  const r = results();
  const page = r.slice(0, state.shown);

  $('#grid').innerHTML = page.map((p, i) => cardHTML(p, i)).join('');
  $('#resCount').textContent = r.length
    ? `${r.length} producto${r.length > 1 ? 's' : ''}`
    : '';
  $('#moreBtn').parentElement.classList.toggle('hide', state.shown >= r.length);

  $('#noRes').innerHTML = r.length ? '' : `
    <div class="empty" style="padding:5rem 1rem">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>
      <p>No hay productos con esos filtros.</p>
      <button class="btn btn-sm" id="clearBtn2" style="margin-top:1rem">Limpiar filtros</button>
    </div>`;

  /* Título contextual */
  const cat = state.cats.length === 1 && CATEGORIAS.find(c => c.id === state.cats[0]);
  $('#shopTitle').textContent = state.q ? `"${state.q}"` : cat ? cat.nombre : 'Toda la colección';
  $('#crumb').textContent = cat ? cat.nombre : 'Tienda';
  if (cat) $('#shopSub').textContent = cat.copy;

  drawChips();
  drawCounts();
  reveal();
  pushURL();
}

/* ---------- Chips rápidos de categoría ---------- */
$('#quickCats').innerHTML = CATEGORIAS
  .map(c => `<button class="chip" data-cat="${c.id}">${c.nombre}</button>`).join('');

/* ---------- Chips de filtros activos ---------- */
function drawChips() {
  const chips = [];
  state.cats.forEach(c => chips.push(
    [`cat:${c}`, CATEGORIAS.find(x => x.id === c)?.nombre || c]));
  state.cols.forEach(c => chips.push([`color:${c}`, TELAS[c]?.nombre || c]));
  if (state.q)            chips.push(['q', `Búsqueda: ${state.q}`]);
  if (state.max < 4000000) chips.push(['price', `Hasta ${money(state.max)}`]);
  if (state.stock)        chips.push(['stock', 'Con stock']);
  if (state.nuevo)        chips.push(['nuevo', 'Novedades']);

  $('#activeChips').innerHTML = chips.length
    ? chips.map(([k, l]) => `<button class="chip on" data-rm="${k}">${l}
        <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>`).join('')
      + `<button class="chip" id="clearBtn3">Limpiar todo</button>`
    : '';

  $('#fCount').textContent = chips.length ? chips.length : '';
  $('#fCount').classList.toggle('hide', !chips.length);
  $$('#quickCats [data-cat]').forEach(b =>
    b.classList.toggle('on', state.cats.includes(b.dataset.cat)));
}

/* ---------- Panel de filtros ---------- */
$('#fCats').innerHTML = CATEGORIAS.map(c => `
  <label class="check"><input type="checkbox" data-fcat="${c.id}"> ${c.nombre}
    <span class="c-n" data-n="${c.id}"></span></label>`).join('');

$('#fColors').innerHTML = Object.entries(TELAS).map(([k, v]) =>
  `<button data-fcol="${k}" style="background:${v.hex}" title="${v.nombre}" aria-label="${v.nombre}"></button>`).join('');

/* Contadores vivos: cuántos quedarían si sumo ese filtro */
function drawCounts() {
  CATEGORIAS.forEach(c => {
    const n = CATALOGO.filter(p => p.cat === c.id && matches(p, 'cat')).length;
    const el = $(`[data-n="${c.id}"]`); if (el) el.textContent = n;
  });
  $('#nStock').textContent = CATALOGO.filter(p => p.stock > 0 && matches(p, 'stock')).length;
  $('#nNew').textContent   = CATALOGO.filter(p => p.nuevo && matches(p, 'nuevo')).length;
  $('#fPriceOut').textContent = money(state.max);
  $$('#fCats [data-fcat]').forEach(i => i.checked = state.cats.includes(i.dataset.fcat));
  $$('#fColors [data-fcol]').forEach(b => b.classList.toggle('on', state.cols.includes(b.dataset.fcol)));
  $('#fPrice').value = state.max;
  $('#fStock').checked = state.stock;
  $('#fNew').checked   = state.nuevo;
  $('#sortSel').value  = state.sort;
}

/* ---------- Eventos ---------- */
const toggle = (arr, v) => { const i = arr.indexOf(v); i > -1 ? arr.splice(i, 1) : arr.push(v); };
const reset = () => { state.shown = PAGE; };

document.addEventListener('click', e => {
  const qc = e.target.closest('[data-cat]');
  if (qc) { toggle(state.cats, qc.dataset.cat); reset(); render(); return; }

  const rm = e.target.closest('[data-rm]');
  if (rm) {
    const [k, v] = rm.dataset.rm.split(':');
    if (k === 'cat')   toggle(state.cats, v);
    if (k === 'color') toggle(state.cols, v);
    if (k === 'q')     state.q = '';
    if (k === 'price') state.max = 4000000;
    if (k === 'stock') state.stock = false;
    if (k === 'nuevo') state.nuevo = false;
    reset(); render(); return;
  }

  const fc = e.target.closest('[data-fcol]');
  if (fc) { toggle(state.cols, fc.dataset.fcol); reset(); render(); return; }

  if (e.target.closest('#clearBtn, #clearBtn2, #clearBtn3')) {
    state.cats = []; state.cols = []; state.q = '';
    state.max = 4000000; state.stock = false; state.nuevo = false;
    reset(); render(); return;
  }
  if (e.target.closest('#filtersBtn')) { openPanel('#filtersPanel'); return; }
  if (e.target.closest('#moreBtn')) { state.shown += PAGE; render(); return; }

  const d = e.target.closest('[data-dens]');
  if (d) {
    $$('[data-dens]').forEach(x => x.classList.remove('on'));
    d.classList.add('on');
    $('#grid').classList.toggle('dense', d.dataset.dens === '1');
  }
});

document.addEventListener('change', e => {
  if (e.target.matches('[data-fcat]')) { toggle(state.cats, e.target.dataset.fcat); reset(); render(); }
  if (e.target.id === 'fStock') { state.stock = e.target.checked; reset(); render(); }
  if (e.target.id === 'fNew')   { state.nuevo = e.target.checked; reset(); render(); }
  if (e.target.id === 'sortSel'){ state.sort  = e.target.value;   reset(); render(); }
});
$('#fPrice').addEventListener('input', e => {
  state.max = +e.target.value; reset();
  $('#fPriceOut').textContent = money(state.max);
  render();
});

render();
})();
