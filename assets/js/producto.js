/* =============================================================
   BV HOME — Ficha de producto
   ============================================================= */
(() => {
'use strict';
const { Store, byId, money, transfer, cuota, IMG, cardHTML, reveal, ICON, svg, $, $$ } = window.BV;

const id = new URLSearchParams(location.search).get('id');
const p = byId(id) || CATALOGO[0];
const cat = CATEGORIAS.find(c => c.id === p.cat);
const cols = (p.colores || []).map(k => ({ k, ...TELAS[k] })).filter(c => c.nombre);

document.title = `${p.nombre} — BV Home`;
Store.visit(p.id);

/* Galería: foto de producto + tomas de ambiente reales */
const ctx = p.cat === 'mesas' ? ['mesas-comedor.webp', 'room-arco.webp']
          : p.cat === 'deco'  ? ['deco-estante.webp', 'estar-marron.webp']
          : ['estar-marron.webp', 'sofa-sol.webp'];
const shots = [IMG(p), ...ctx.map(f => `assets/img/editorial/${f}`)];

let color = cols[0] || null;
let qty = 1;
let plan = 'transferencia';

/* ---------- Render ---------- */
$('#pdpRoot').innerHTML = `
<nav class="muted" style="font-size:.76rem;padding-top:1.2rem" aria-label="Migas">
  <a href="index.html">Inicio</a> / <a href="tienda.html?cat=${p.cat}">${cat.nombre}</a> / <span>${p.nombre}</span>
</nav>

<div class="pdp">
  <!-- Galería -->
  <div class="pdp__gal">
    <div class="pdp__main" id="galMain">
      <img src="${shots[0]}" alt="${p.nombre}" id="galImg" width="900" height="1035">
    </div>
    <div class="pdp__thumbs">
      ${shots.map((s, i) => `<button class="${i === 0 ? 'on' : ''}" data-shot="${i}" aria-label="Foto ${i + 1}">
        <img src="${s}" alt="" loading="lazy"></button>`).join('')}
    </div>
  </div>

  <!-- Info -->
  <div class="pdp__info">
    <p class="eyebrow">${cat.nombre}</p>
    <h1 class="h2" style="margin:.5rem 0 .2rem">${p.nombre}</h1>
    <p class="lede" style="font-size:.92rem">${p.desc}</p>

    <div class="pdp__price tnum">
      <span class="now">${money(p.precio)}</span>
      <span class="muted" style="font-size:.82rem">o ${money(cuota(p.precio, 6))} × 6 sin interés</span>
    </div>
    <div class="pdp__transfer tnum">${svg(ICON.check)} ${money(transfer(p.precio))} con transferencia · ahorrás ${money(p.precio - transfer(p.precio))}</div>

    ${p.stock === 0
      ? `<p style="color:var(--sale);font-weight:600;font-size:.85rem">Sin stock · ${p.entrega}</p>`
      : p.stock <= 3
        ? `<p style="color:var(--sale);font-weight:600;font-size:.85rem">Quedan ${p.stock} unidades</p>`
        : `<p class="muted" style="font-size:.85rem">${p.stock} disponibles · entrega en ${p.entrega}</p>`}

    <!-- Color -->
    ${cols.length ? `
    <div class="opt">
      <div class="opt__head"><h4>Color / terminación</h4><span id="colName">${color.nombre}</span></div>
      <div class="sw-lg" id="swatches">
        ${cols.map((c, i) => `<button class="${i === 0 ? 'on' : ''}" data-col="${c.k}"
          style="background:${c.hex}" title="${c.nombre}" aria-label="${c.nombre}"></button>`).join('')}
      </div>
    </div>` : ''}

    <!-- Medios de pago -->
    <div class="opt">
      <div class="opt__head"><h4>Cómo lo pagás</h4></div>
      <div class="pay-tabs" id="payTabs">
        <button class="on" data-plan="transferencia">Transferencia</button>
        ${CONFIG.cuotas.map(c => `<button data-plan="${c.n}">${c.n} cuotas</button>`).join('')}
      </div>
      <div class="pay-out" id="payOut"></div>
    </div>

    <!-- ¿Entra en tu espacio? -->
    <div class="opt">
      <div class="opt__head"><h4>¿Entra en tu espacio?</h4></div>
      <div class="fit">
        <p class="muted" style="font-size:.8rem">Poné las medidas de tu ambiente y te decimos si entra —y cuánto lugar te queda.</p>
        <div class="fit__viz">
          <div class="fit__room"></div>
          <div class="fit__obj" id="fitObj"><span>${p.medidas.an}×${p.medidas.pr}</span></div>
        </div>
        <div class="fit__row">
          <label>Ancho</label><input type="number" id="fitW" value="350" min="50" max="1200"> <span class="muted" style="font-size:.75rem">cm</span>
          <label style="margin-left:.6rem">Profundidad</label><input type="number" id="fitD" value="300" min="50" max="1200"> <span class="muted" style="font-size:.75rem">cm</span>
        </div>
        <p class="fit__verdict" id="fitOut"></p>
      </div>
    </div>

    <!-- Comprar -->
    <div class="opt" style="border-bottom:1px solid var(--line-soft)">
      <div style="display:flex;gap:.7rem;align-items:stretch">
        <div class="qty" style="margin:0;padding:0 .3rem">
          <button id="qMinus" aria-label="Restar">−</button>
          <span class="tnum" id="qNum">1</span>
          <button id="qPlus" aria-label="Sumar">+</button>
        </div>
        <button class="btn" id="addBtn" style="flex:1" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}</button>
        <button class="icon-btn" data-fav="${p.id}" aria-label="Guardar"
          style="border:1px solid var(--line);border-radius:999px;width:46px;height:46px">
          ${svg(ICON.heart)}</button>
      </div>
      <a class="btn btn-ghost btn-block" style="margin-top:.6rem" id="waBtn">
        ${svg(ICON.wa)} Consultar por WhatsApp</a>
    </div>

    <!-- Acordeones -->
    <div class="acc open">
      <button class="acc__t">Medidas y materiales <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      <div class="acc__c"><div>
        <div class="spec"><span>Ancho</span><span>${p.medidas.an} cm</span></div>
        <div class="spec"><span>Profundidad</span><span>${p.medidas.pr} cm</span></div>
        <div class="spec"><span>Altura</span><span>${p.medidas.al} cm</span></div>
        ${p.asientos ? `<div class="spec"><span>Asientos</span><span>${p.asientos}</span></div>` : ''}
        ${p.comensales ? `<div class="spec"><span>Comensales</span><span>${p.comensales}</span></div>` : ''}
        <p style="padding-top:.8rem">${p.materiales}</p>
      </div></div>
    </div>
    <div class="acc">
      <button class="acc__t">Envío y entrega <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      <div class="acc__c"><div>
        <div class="spec"><span>Plazo</span><span>${p.entrega}</span></div>
        <div class="spec"><span>Envío gratis</span><span>desde ${money(CONFIG.envioGratisDesde)}</span></div>
        <p style="padding-top:.8rem">Enviamos a todo el país. Coordinamos día y franja horaria por WhatsApp antes de despachar. Subida por escalera sin cargo hasta un 3.º piso.</p>
      </div></div>
    </div>
    <div class="acc">
      <button class="acc__t">Garantía y cuidado <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></button>
      <div class="acc__c"><div>
        <p>24 meses de garantía sobre estructura y tapizado. Limpiá con paño seco o levemente húmedo; evitá el sol directo y los productos con alcohol.</p>
      </div></div>
    </div>
  </div>
</div>

<!-- Relacionados -->
<section class="section-tight">
  <div class="sec-head"><div><p class="eyebrow">Combina bien con</p><h2 class="h2">Completá el ambiente</h2></div></div>
  <div class="grid-p" id="rel"></div>
</section>

<!-- Visto recientemente -->
<section class="section-tight hide" id="seenSec">
  <div class="sec-head"><div><p class="eyebrow">Seguí donde dejaste</p><h2 class="h2">Visto recientemente</h2></div></div>
  <div class="rail" id="railSeen"></div>
</section>
`;

/* ---------- Galería ---------- */
$$('[data-shot]').forEach(b => b.addEventListener('click', () => {
  $$('[data-shot]').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  $('#galImg').src = shots[+b.dataset.shot];
  $('#galMain').classList.remove('zoom');
}));
$('#galMain').addEventListener('click', e => e.currentTarget.classList.toggle('zoom'));

/* ---------- Color ---------- */
$$('[data-col]').forEach(b => b.addEventListener('click', () => {
  $$('[data-col]').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  color = cols.find(c => c.k === b.dataset.col);
  $('#colName').textContent = color.nombre;
}));

/* ---------- Medios de pago ---------- */
function drawPay() {
  const base = p.precio * qty;
  let html;
  if (plan === 'transferencia') {
    html = `<div class="pay-big tnum">${money(transfer(base))}</div>
      <div class="pay-sub">Pago único · ahorrás ${money(base - transfer(base))} (20%)</div>`;
  } else {
    const n = +plan;
    const c = CONFIG.cuotas.find(x => x.n === n);
    const total = base * (1 + c.interes);
    html = `<div class="pay-big tnum">${n} × ${money(cuota(base, n))}</div>
      <div class="pay-sub">Total ${money(total)} · ${c.interes === 0 ? 'sin interés' : `${Math.round(c.interes * 100)}% de interés`}</div>`;
  }
  $('#payOut').innerHTML = html;
}
$('#payTabs').addEventListener('click', e => {
  const b = e.target.closest('[data-plan]'); if (!b) return;
  $$('#payTabs button').forEach(x => x.classList.remove('on'));
  b.classList.add('on');
  plan = b.dataset.plan;
  drawPay();
});
drawPay();

/* ---------- ¿Entra en tu espacio? ---------- */
function drawFit() {
  const W = +$('#fitW').value || 0, D = +$('#fitD').value || 0;
  const { an, pr } = p.medidas;
  const entra = an <= W && pr <= D;
  const obj = $('#fitObj');
  // escala proporcional dentro del recuadro de 128px de alto
  const box = $('.fit__viz').getBoundingClientRect();
  const sx = Math.min(1, an / Math.max(W, an)), sy = Math.min(1, pr / Math.max(D, pr));
  obj.style.width  = Math.max(26, sx * (box.width - 16)) + 'px';
  obj.style.height = Math.max(18, sy * (box.height - 16)) + 'px';
  obj.style.background = entra ? 'var(--accent)' : 'var(--sale)';
  $('#fitOut').className = 'fit__verdict ' + (entra ? 'ok' : 'no');
  $('#fitOut').textContent = entra
    ? `Entra. Te sobran ${W - an} cm de ancho y ${D - pr} cm de fondo.`
    : `No entra: necesitás al menos ${an} × ${pr} cm libres.`;
}
$('#fitW').addEventListener('input', drawFit);
$('#fitD').addEventListener('input', drawFit);
drawFit();

/* ---------- Cantidad y carrito ---------- */
const setQty = n => {
  qty = Math.max(1, Math.min(n, Math.max(1, p.stock)));
  $('#qNum').textContent = qty;
  drawPay();
};
$('#qMinus').addEventListener('click', () => setQty(qty - 1));
$('#qPlus').addEventListener('click', () => setQty(qty + 1));
$('#addBtn').addEventListener('click', () => {
  Store.add(p.id, color ? color.k : null, qty);
  window.BV.openPanel('#cartPanel');
});

/* ---------- WhatsApp con contexto ---------- */
$('#waBtn').addEventListener('click', e => {
  e.preventDefault();
  const msg = `¡Hola BV Home! Me interesa el ${p.nombre}`
    + (color ? ` en ${color.nombre}` : '')
    + `.\nPrecio de lista: ${money(p.precio)} (${money(transfer(p.precio))} con transferencia).`
    + `\n¿Tienen stock y cómo es el envío?`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});

/* ---------- Acordeones ----------
   Animamos height en píxeles y volvemos a `auto` al terminar,
   así el contenido puede crecer sin quedar recortado. */
function toggleAcc(acc) {
  const box = acc.querySelector('.acc__c');
  const h = box.firstElementChild.offsetHeight;
  if (acc.classList.contains('open')) {
    box.style.height = h + 'px';
    void box.offsetHeight;          // reflow: fija el punto de partida
    acc.classList.remove('open');
    box.style.height = '0px';
  } else {
    acc.classList.add('open');
    box.style.height = h + 'px';
    const settle = () => {
      if (!acc.classList.contains('open')) return;
      box.style.height = 'auto';   // que pueda crecer si el texto se reacomoda
      box.removeEventListener('transitionend', onEnd);
    };
    const onEnd = e => { if (e.propertyName === 'height') settle(); };
    box.addEventListener('transitionend', onEnd);
    setTimeout(settle, 500);       // por si transitionend no llega
  }
}
$$('.acc__t').forEach(b => b.addEventListener('click', () => toggleAcc(b.parentElement)));

/* ---------- Relacionados ---------- */
const rel = CATALOGO
  .filter(x => x.id !== p.id)
  .map(x => {
    let s = 0;
    if (x.cat === p.cat) s += 3;
    s += (x.tags || []).filter(t => (p.tags || []).includes(t)).length * 2;
    if ((x.colores || []).some(c => (p.colores || []).includes(c))) s += 1;
    if (Math.abs(x.precio - p.precio) < p.precio * 0.4) s += 1;
    return { x, s };
  })
  .sort((a, b) => b.s - a.s)
  .slice(0, 4).map(o => o.x);
$('#rel').innerHTML = rel.map((x, i) => cardHTML(x, i)).join('');

/* ---------- Visto recientemente ---------- */
const seen = Store.seen.filter(x => x !== p.id).map(byId).filter(Boolean);
if (seen.length >= 3) {
  $('#seenSec').classList.remove('hide');
  $('#railSeen').innerHTML = seen.map((x, i) => cardHTML(x, i)).join('');
}

/* ---------- Barra de compra fija ---------- */
$('#bbImg').src = IMG(p);
$('#bbName').textContent = p.nombre;
$('#bbPrice').textContent = `${money(transfer(p.precio))} con transferencia`;
$('#bbAdd').disabled = p.stock === 0;
if (p.stock === 0) $('#bbAdd').textContent = 'Sin stock';
$('#bbAdd').addEventListener('click', () => {
  Store.add(p.id, color ? color.k : null, qty);
  window.BV.openPanel('#cartPanel');
});
/* Aparece cuando el botón de compra queda arriba del viewport */
const addBtn = $('#addBtn'), bar = $('#buybar');
const syncBar = () => bar.classList.toggle('on', addBtn.getBoundingClientRect().bottom < 0);
addEventListener('scroll', syncBar, { passive: true });
addEventListener('resize', syncBar);
syncBar();

reveal();
})();
