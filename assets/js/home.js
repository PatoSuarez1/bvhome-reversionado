/* =============================================================
   BV HOME — Home
   ============================================================= */
(() => {
'use strict';
const { Store, byId, money, transfer, IMG, cardHTML, reveal, toast, $, $$ } = window.BV;

/* ---------- Categorías ---------- */
$('#cats').innerHTML = CATEGORIAS.map((c, i) => `
  <a class="cat reveal reveal-d${i + 1}" href="tienda.html?cat=${c.id}">
    <img src="assets/img/editorial/${c.img}" alt="${c.nombre}" loading="lazy">
    <div class="cat__t">
      <h3>${c.nombre}</h3>
      <p>${c.copy}</p>
    </div>
  </a>`).join('');

/* ---------- Rieles y grillas ---------- */
$('#railDest').innerHTML = CATALOGO.filter(p => p.destacado).map((p, i) => cardHTML(p, i)).join('');
$('#gridNuevo').innerHTML = CATALOGO.filter(p => p.nuevo).slice(0, 8).map((p, i) => cardHTML(p, i)).join('');

/* ---------- Ambiente shoppable ---------- */
let ambIdx = 0;

$('#lookTabs').innerHTML = AMBIENTES
  .map((a, i) => `<button data-amb="${i}" class="${i === 0 ? 'on' : ''}">${a.titulo}</button>`).join('');

function drawAmbiente() {
  const a = AMBIENTES[ambIdx];
  const items = a.puntos.map(pt => ({ pt, p: byId(pt.producto) })).filter(x => x.p);

  $('#lookStage').innerHTML = `
    <img src="assets/img/editorial/${a.img}" alt="${a.titulo}" loading="lazy">
    ${items.map(({ pt, p }, i) => `
      <button class="hotspot" data-hs="${i}" style="left:${pt.x}%;top:${pt.y}%" aria-label="${p.nombre}">
        <i></i>
        <span class="hotspot__pop">
          <img src="${IMG(p)}" alt="">
          <span>
            <b>${p.nombre}</b>
            <span class="tnum">${money(p.precio)}</span>
          </span>
        </span>
      </button>`).join('')}`;

  $('#lookTitle').textContent = a.titulo;
  $('#lookCopy').textContent = a.copy;

  $('#lookList').innerHTML = items.map(({ p }, i) => `
    <li data-hs="${i}">
      <img src="${IMG(p)}" alt="" loading="lazy">
      <span style="flex:1">
        <b>${p.nombre}</b>
        <span class="tnum">${money(p.precio)}</span>
      </span>
      <button class="btn btn-sm btn-ghost" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
        ${p.stock === 0 ? 'Sin stock' : 'Sumar'}</button>
    </li>`).join('');

  const total = items.reduce((s, x) => s + x.p.precio, 0);
  $('#lookTotal').innerHTML = `El look completo: <b>${money(transfer(total))}</b> con transferencia`;
  $('#lookAdd').dataset.ids = items.filter(x => x.p.stock > 0).map(x => x.p.id).join(',');
  reveal();
}
drawAmbiente();

/* Cambiar de ambiente */
$('#lookTabs').addEventListener('click', e => {
  const b = e.target.closest('[data-amb]'); if (!b) return;
  $$('#lookTabs button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  ambIdx = Number(b.dataset.amb);
  drawAmbiente();
});

/* Sincronizar hotspot <-> lista */
function highlight(i, on) {
  const hs = $(`#lookStage [data-hs="${i}"]`);
  const li = $(`#lookList [data-hs="${i}"]`);
  if (hs) hs.classList.toggle('on', on);
  if (li) li.classList.toggle('on', on);
}
document.addEventListener('mouseover', e => {
  const t = e.target.closest('[data-hs]'); if (!t) return;
  highlight(t.dataset.hs, true);
});
document.addEventListener('mouseout', e => {
  const t = e.target.closest('[data-hs]'); if (!t) return;
  highlight(t.dataset.hs, false);
});
/* Táctil: tocar el punto abre/cierra el popover */
$('#lookStage').addEventListener('click', e => {
  const t = e.target.closest('[data-hs]'); if (!t) return;
  const was = t.classList.contains('on');
  $$('#lookStage .hotspot').forEach(h => h.classList.remove('on'));
  if (!was) t.classList.add('on');
});

/* Sumar el ambiente entero */
$('#lookAdd').addEventListener('click', function () {
  const ids = (this.dataset.ids || '').split(',').filter(Boolean);
  if (!ids.length) return;
  ids.forEach(id => {
    const p = byId(id);
    const key = id + '|';
    const hit = Store.cart.find(l => l.key === key);
    if (hit) hit.qty = Math.min(hit.qty + 1, p.stock);
    else Store.cart.push({ key, id, color: null, qty: 1 });
  });
  localStorage.setItem('bv_cart', JSON.stringify(Store.cart));
  Store.emit();
  toast(`${ids.length} piezas agregadas`, window.BV.ICON.check);
  window.BV.openPanel('#cartPanel');
});

/* ---------- Opiniones ---------- */
const estrellas = n => Array.from({ length: 5 }, (_, i) =>
  `<svg class="star${i < n ? ' on' : ''}" viewBox="0 0 24 24" aria-hidden="true">
     <path d="M12 3.2l2.6 5.5 5.9.8-4.3 4.2 1 6-5.2-2.9-5.2 2.9 1-6-4.3-4.2 5.9-.8z"/>
   </svg>`).join('');

$('#score').innerHTML = `
  <div class="score__n">${OPINIONES.promedio.toFixed(1).replace('.', ',')}</div>
  <div>
    <div class="score__stars" role="img" aria-label="${OPINIONES.promedio} de 5">
      ${estrellas(Math.round(OPINIONES.promedio))}
    </div>
    <p class="score__t">${OPINIONES.total} opiniones verificadas</p>
  </div>`;

$('#opiniones').innerHTML = OPINIONES.items.map((o, i) => {
  const p = byId(o.producto);
  return `
  <article class="tcard reveal reveal-d${(i % 4) + 1}">
    <div class="tcard__stars" role="img" aria-label="${o.estrellas} de 5 estrellas">${estrellas(o.estrellas)}</div>
    <h3 class="tcard__t">${o.titulo}</h3>
    <p class="tcard__q">${o.texto}</p>
    <footer class="tcard__f">
      <div class="tcard__who">
        <b>${o.nombre}</b>
        <span>${o.lugar} · ${o.fecha}</span>
      </div>
      ${p ? `<a class="tcard__p" href="producto.html?id=${p.id}">
        <img src="${IMG(p)}" alt="" loading="lazy" width="44" height="54">
        <span>Compró <b>${p.nombre}</b></span>
      </a>` : ''}
    </footer>
  </article>`;
}).join('');

/* ---------- Visto recientemente ---------- */
const seen = Store.seen.map(byId).filter(Boolean);
if (seen.length >= 3) {
  $('#seenSec').classList.remove('hide');
  $('#railSeen').innerHTML = seen.map((p, i) => cardHTML(p, i)).join('');
}

/* ---------- Newsletter ---------- */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const i = e.target.querySelector('input');
  toast('Listo, te sumamos a la lista', window.BV.ICON.check);
  i.value = '';
});

reveal();
})();
