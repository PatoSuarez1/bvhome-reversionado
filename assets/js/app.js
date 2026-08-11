/* =============================================================
   BV HOME — Núcleo: estado, carrito, favoritos, buscador, UI
   ============================================================= */
(() => {
'use strict';

/* ---------- Helpers ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const byId = id => CATALOGO.find(p => p.id === id);
const IMG = p => `assets/img/productos/${p.img}`;
/* srcset: el celular baja 480px en vez de 1024px */
const SRCSET = p => {
  const n = p.img.replace(/\.webp$/, '');
  return `assets/img/productos/${n}-480.webp 480w, assets/img/productos/${n}-768.webp 768w, assets/img/productos/${p.img} 1024w`;
};
const SIZES = '(max-width: 560px) 50vw, (max-width: 1080px) 33vw, 23vw';

const fmt = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
const money = n => fmt.format(Math.round(n));
const transfer = n => n * (1 - CONFIG.descuentoTransferencia);
const cuota = (n, c) => {
  const plan = CONFIG.cuotas.find(x => x.n === c);
  return plan ? (n * (1 + plan.interes)) / plan.n : n / c;
};
const ICON = {
  cart:  '<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/>',
  heart: '<path d="M12 20s-7-4.6-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7 2.7C19 15.4 12 20 12 20z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/>',
  user:  '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  x:     '<path d="M6 6l12 12M18 6L6 18"/>',
  menu:  '<path d="M3 6h18M3 12h18M3 18h18"/>',
  check: '<path d="M4 12.5l5 5L20 6.5"/>',
  sun:   '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  moon:  '<path d="M20 13.5A8 8 0 1 1 10.5 4a6.3 6.3 0 0 0 9.5 9.5z"/>',
  eye:   '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z"/><circle cx="12" cy="12" r="2.6"/>',
  /* Glifo real de WhatsApp: burbuja + tubo. Va relleno con currentColor
     para que se vea tanto sobre botón oscuro como sobre fondo claro. */
  wa:    '<path fill="currentColor" stroke="none" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.85 9.85 0 0 0 12.04 2zm0 18.15a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23z"/>'
       + '<path fill="currentColor" stroke="none" d="M16.56 14.24c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.76-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.06s.89 2.39 1.01 2.56c.12.17 1.74 2.66 4.22 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z"/>',
  ig:    '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/>'
};
/* Todo ícono generado por JS sale con la clase `ico`, que le da tamaño y
   trazo por defecto. Sin eso, en un contenedor sin reglas propias el SVG
   se estira a 300x150 y el trazo se rellena de negro. */
const svg = (path, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;

/* ---------- Estado persistente ---------- */
const load = (k, f) => { try { return JSON.parse(localStorage.getItem(k)) ?? f; } catch { return f; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const Store = {
  cart: load('bv_cart', []),
  fav:  load('bv_fav', []),
  seen: load('bv_seen', []),
  subs: [],
  on(fn) { this.subs.push(fn); },
  emit() { this.subs.forEach(f => f()); },

  add(id, color = null, qty = 1) {
    const p = byId(id); if (!p || p.stock === 0) return;
    const key = id + '|' + (color || '');
    const hit = this.cart.find(l => l.key === key);
    if (hit) hit.qty = Math.min(hit.qty + qty, p.stock);
    else this.cart.push({ key, id, color, qty: Math.min(qty, p.stock) });
    save('bv_cart', this.cart); this.emit();
    toast(`${p.nombre} — agregado`, ICON.check);
  },
  setQty(key, q) {
    const l = this.cart.find(x => x.key === key); if (!l) return;
    const p = byId(l.id);
    l.qty = Math.max(0, Math.min(q, p.stock));
    if (l.qty === 0) this.cart = this.cart.filter(x => x.key !== key);
    save('bv_cart', this.cart); this.emit();
  },
  remove(key) { this.cart = this.cart.filter(x => x.key !== key); save('bv_cart', this.cart); this.emit(); },
  toggleFav(id) {
    const i = this.fav.indexOf(id);
    if (i > -1) { this.fav.splice(i, 1); toast('Quitado de favoritos'); }
    else { this.fav.push(id); toast('Guardado en favoritos', ICON.heart); }
    save('bv_fav', this.fav); this.emit();
  },
  visit(id) {
    this.seen = [id, ...this.seen.filter(x => x !== id)].slice(0, 12);
    save('bv_seen', this.seen);
  },
  get count() { return this.cart.reduce((a, l) => a + l.qty, 0); },
  get subtotal() { return this.cart.reduce((a, l) => a + byId(l.id).precio * l.qty, 0); }
};
window.BV = { Store, byId, money, transfer, cuota, IMG, SRCSET, SIZES, ICON, svg, $, $$, fmt };

/* ---------- Toast ---------- */
let toastBox;
function toast(msg, icon = '') {
  if (!toastBox) {
    toastBox = document.createElement('div');
    toastBox.className = 'toasts';
    toastBox.setAttribute('role', 'status');       // lo anuncia el lector de pantalla
    toastBox.setAttribute('aria-live', 'polite');
    document.body.append(toastBox);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = (icon ? svg(icon) : '') + `<span>${msg}</span>`;
  toastBox.append(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 340); }, 2400);
}
window.BV.toast = toast;

/* ---------- Tema ---------- */
const applyTheme = t => {
  document.documentElement.dataset.theme = t;
  save('bv_theme', t);
  const b = $('#themeBtn');
  if (b) b.innerHTML = svg(t === 'dark' ? ICON.sun : ICON.moon);
};
applyTheme(load('bv_theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

/* ---------- Card de producto ---------- */
function cardHTML(p, i = 0) {
  const out = p.stock === 0;
  const cols = (p.colores || []).map(c => TELAS[c]).filter(Boolean);
  const swatches = cols.slice(0, 4).map(c => `<i class="sw" style="background:${c.hex}" title="${c.nombre}"></i>`).join('')
    + (cols.length > 4 ? `<i class="sw--more">+${cols.length - 4}</i>` : '');
  const fav = Store.fav.includes(p.id);
  return `
  <article class="card reveal reveal-d${(i % 4) + 1}" data-id="${p.id}">
    <div class="card__media">
      <a href="producto.html?id=${p.id}" aria-label="${p.nombre}">
        <img src="assets/img/productos/${p.img.replace(/\.webp$/, '-768.webp')}"
             srcset="${SRCSET(p)}" sizes="${SIZES}"
             alt="${p.nombre}" loading="lazy" decoding="async" width="640" height="800">
      </a>
      <div class="card__flags">
        ${out ? '<span class="flag flag--out">Sin stock</span>' : ''}
        ${p.nuevo && !out ? '<span class="flag">Nuevo</span>' : ''}
        <span class="flag flag--sale">−20% transf.</span>
      </div>
      <button class="card__fav${fav ? ' on' : ''}" data-fav="${p.id}" aria-label="Guardar ${p.nombre}">${svg(ICON.heart)}</button>
      <div class="card__quick">
        <button class="qv" data-qv="${p.id}" aria-label="Vista rápida">${svg(ICON.eye)}</button>
        <button data-add="${p.id}" ${out ? 'disabled' : ''}>${out ? 'Avisame' : 'Agregar'}</button>
      </div>
    </div>
    <div class="card__body">
      <a href="producto.html?id=${p.id}"><h3 class="card__name">${p.nombre}</h3></a>
      <p class="card__meta">${p.medidas ? `${p.medidas.an} × ${p.medidas.pr} × ${p.medidas.al} cm` : ''}</p>
      <div class="card__price tnum">
        <span class="now">${money(p.precio)}</span>
      </div>
      <p class="card__transfer tnum">${money(transfer(p.precio))} con transferencia</p>
      ${cols.length ? `<div class="card__swatches">${swatches}</div>` : ''}
    </div>
  </article>`;
}
window.BV.cardHTML = cardHTML;

/* ---------- Chrome inyectado (drawers, buscador, modal) ---------- */
document.body.insertAdjacentHTML('beforeend', `
<div class="scrim" id="scrim" data-close></div>

<aside class="panel" id="cartPanel" aria-label="Carrito" role="dialog">
  <div class="panel__head"><h3>Tu carrito (<span id="cartN">0</span>)</h3>
    <button class="icon-btn" data-close aria-label="Cerrar">${svg(ICON.x)}</button></div>
  <div class="panel__body" id="cartBody"></div>
  <div class="panel__foot" id="cartFoot"></div>
</aside>

<aside class="panel" id="favPanel" aria-label="Favoritos" role="dialog">
  <div class="panel__head"><h3>Favoritos</h3>
    <button class="icon-btn" data-close aria-label="Cerrar">${svg(ICON.x)}</button></div>
  <div class="panel__body" id="favBody"></div>
</aside>

<aside class="panel panel--left" id="menuPanel" aria-label="Menú" role="dialog">
  <div class="panel__head"><h3>Menú</h3>
    <button class="icon-btn" data-close aria-label="Cerrar">${svg(ICON.x)}</button></div>
  <div class="panel__body">
    <nav class="m-nav">
      <a href="index.html">Inicio</a>
      <a href="tienda.html?cat=sillones">Sillones y sofás</a>
      <a href="tienda.html?cat=mesas">Mesas</a>
      <a href="tienda.html?cat=muebles">Muebles</a>
      <a href="tienda.html?cat=deco">Deco</a>
      <a href="tienda.html">Ver todo</a>
      <a href="tienda.html?sort=nuevo">Novedades</a>
    </nav>
  </div>
</aside>

<div class="search-ov" id="searchOv" role="dialog" aria-label="Buscar">
  <div class="search-ov__top">
    ${svg(ICON.search, 'sr-i')}
    <input id="searchIn" type="search" placeholder="Buscá un sillón, una mesa…" autocomplete="off" aria-label="Buscar productos">
    <button class="icon-btn" data-close aria-label="Cerrar">${svg(ICON.x)}</button>
  </div>
  <div class="search-ov__body"><div id="searchOut"></div></div>
</div>

<div class="modal" id="qvModal" role="dialog" aria-label="Vista rápida">
  <div class="modal__bg" data-close></div>
  <div class="modal__box" id="qvBox"></div>
</div>
`);

/* ---------- Panel abrir/cerrar ---------- */
const scrim = $('#scrim');
const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
let openEl = null, lastFocus = null;

function openPanel(sel) {
  closeAll();
  openEl = $(sel); if (!openEl) return;
  lastFocus = document.activeElement;              // para devolver el foco al cerrar
  openEl.classList.add('on');
  if (!openEl.classList.contains('modal')) scrim.classList.add('on'); // el modal trae su propio fondo
  openEl.setAttribute('aria-modal', 'true');
  document.body.classList.add('is-locked');
  const f = openEl.querySelector(FOCUSABLE);
  setTimeout(() => f && f.focus(), 120);
}
function closeAll() {
  $$('.panel.on, .search-ov.on, .modal.on').forEach(e => {
    e.classList.remove('on');
    e.removeAttribute('aria-modal');
  });
  scrim.classList.remove('on');
  document.body.classList.remove('is-locked');
  openEl = null;
  if (lastFocus && lastFocus.isConnected) { lastFocus.focus(); lastFocus = null; }
}

/* El Tab no se escapa del panel abierto */
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !openEl) return;
  const f = [...openEl.querySelectorAll(FOCUSABLE)].filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
window.BV.openPanel = openPanel;
document.addEventListener('click', e => {
  if (e.target.closest('[data-close]')) { closeAll(); return; }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

/* ---------- Render carrito ---------- */
function renderCart() {
  const body = $('#cartBody'), foot = $('#cartFoot');
  $('#cartN').textContent = Store.count;
  $$('[data-cart-count]').forEach(b => {
    b.textContent = Store.count;
    b.classList.toggle('on', Store.count > 0);
  });
  $$('[data-fav-count]').forEach(b => {
    b.textContent = Store.fav.length;
    b.classList.toggle('on', Store.fav.length > 0);
  });

  if (!Store.cart.length) {
    body.innerHTML = `<div class="empty">${svg(ICON.cart)}<p>Tu carrito está vacío.</p>
      <a href="tienda.html" class="btn btn-sm" style="margin-top:1rem">Ver la tienda</a></div>`;
    foot.innerHTML = '';
    return;
  }

  const sub = Store.subtotal, subT = transfer(sub);
  const falta = Math.max(0, CONFIG.envioGratisDesde - sub);
  const pct = Math.min(100, (sub / CONFIG.envioGratisDesde) * 100);

  body.innerHTML = `
    <div class="ship-bar">
      <p>${falta > 0
        ? `Te faltan <b class="tnum">${money(falta)}</b> para el envío gratis`
        : '<b>¡Tenés envío gratis!</b> 🎉'}</p>
      <div class="ship-bar__track"><div class="ship-bar__fill" style="width:${pct}%"></div></div>
    </div>
    ${Store.cart.map(l => {
      const p = byId(l.id), c = l.color ? TELAS[l.color] : null;
      return `<div class="line-item">
        <a href="producto.html?id=${p.id}"><img src="${IMG(p)}" alt="${p.nombre}" loading="lazy"></a>
        <div>
          <b>${p.nombre}</b>
          ${c ? `<div class="li-var">Color: ${c.nombre}</div>` : ''}
          <div class="li-price tnum">${money(p.precio * l.qty)}</div>
          <div class="qty">
            <button data-q="${l.key}" data-d="-1" aria-label="Restar">−</button>
            <span class="tnum">${l.qty}</span>
            <button data-q="${l.key}" data-d="1" aria-label="Sumar">+</button>
          </div>
        </div>
        <button class="li-del" data-del="${l.key}">Quitar</button>
      </div>`;
    }).join('')}`;

  foot.innerHTML = `
    <div class="totals tnum">
      <div><span>Subtotal</span><span>${money(sub)}</span></div>
      <div class="t-save"><span>Con transferencia (−20%)</span><span>−${money(sub - subT)}</span></div>
      <div><span>Envío</span><span>${falta > 0 ? 'A calcular' : 'Gratis'}</span></div>
      <div class="t-big"><span>Total</span><span>${money(subT)}</span></div>
    </div>
    <button class="btn btn-block" id="waCheckout">${svg(ICON.wa)} Finalizar por WhatsApp</button>
    <p class="muted" style="font-size:.72rem;text-align:center;margin-top:.7rem">
      O <a href="#" style="text-decoration:underline">pagar con tarjeta</a> en hasta 6 cuotas sin interés
    </p>`;
}

/* ---------- Render favoritos ---------- */
function renderFav() {
  const body = $('#favBody');
  if (!Store.fav.length) {
    body.innerHTML = `<div class="empty">${svg(ICON.heart)}<p>Todavía no guardaste nada.</p>
      <a href="tienda.html" class="btn btn-sm" style="margin-top:1rem">Explorar</a></div>`;
    return;
  }
  body.innerHTML = Store.fav.map(id => {
    const p = byId(id); if (!p) return '';
    return `<div class="line-item">
      <a href="producto.html?id=${p.id}"><img src="${IMG(p)}" alt="${p.nombre}" loading="lazy"></a>
      <div>
        <b>${p.nombre}</b>
        <div class="li-price tnum">${money(p.precio)}</div>
        <button class="btn btn-sm" data-add="${p.id}" style="margin-top:.5rem" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Sin stock' : 'Agregar'}</button>
      </div>
      <button class="li-del" data-fav="${p.id}">Quitar</button>
    </div>`;
  }).join('');
}

/* ---------- Sincronizar corazones en tarjetas ---------- */
function syncFavUI() {
  $$('[data-fav]').forEach(b => b.classList.toggle('on', Store.fav.includes(b.dataset.fav)));
}

Store.on(() => { renderCart(); renderFav(); syncFavUI(); });
renderCart(); renderFav();

/* ---------- Delegación global de acciones ---------- */
document.addEventListener('click', e => {
  const add = e.target.closest('[data-add]');
  if (add) { e.preventDefault(); Store.add(add.dataset.add); openPanel('#cartPanel'); return; }

  const fav = e.target.closest('[data-fav]');
  if (fav) { e.preventDefault(); Store.toggleFav(fav.dataset.fav); return; }

  const q = e.target.closest('[data-q]');
  if (q) {
    const line = Store.cart.find(l => l.key === q.dataset.q);
    if (line) Store.setQty(q.dataset.q, line.qty + Number(q.dataset.d));
    return;
  }
  const del = e.target.closest('[data-del]');
  if (del) { Store.remove(del.dataset.del); return; }

  const qv = e.target.closest('[data-qv]');
  if (qv) { e.preventDefault(); quickView(qv.dataset.qv); return; }

  if (e.target.closest('#waCheckout')) { e.preventDefault(); whatsappCheckout(); return; }
  if (e.target.closest('#cartBtn'))  { e.preventDefault(); openPanel('#cartPanel'); return; }
  if (e.target.closest('#favBtn'))   { e.preventDefault(); openPanel('#favPanel'); return; }
  if (e.target.closest('#menuBtn'))  { e.preventDefault(); openPanel('#menuPanel'); return; }
  if (e.target.closest('#searchBtn')){ e.preventDefault(); openSearch(); return; }
  if (e.target.closest('#themeBtn')) {
    applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); return;
  }
});

/* ---------- Checkout por WhatsApp ---------- */
function whatsappCheckout() {
  if (!Store.cart.length) return;
  const lineas = Store.cart.map(l => {
    const p = byId(l.id), c = l.color ? ` (${TELAS[l.color].nombre})` : '';
    return `• ${l.qty}× ${p.nombre}${c} — ${money(p.precio * l.qty)}`;
  }).join('\n');
  const total = transfer(Store.subtotal);
  const msg = `¡Hola BV Home! Quiero avanzar con este pedido:\n\n${lineas}\n\n`
    + `Total con transferencia: ${money(total)}\n\n¿Me confirman stock y envío?`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}

/* ---------- Vista rápida ---------- */
function quickView(id) {
  const p = byId(id); if (!p) return;
  const cols = (p.colores || []).map(c => TELAS[c]).filter(Boolean);
  $('#qvBox').innerHTML = `
    <button class="modal__x" data-close aria-label="Cerrar">${svg(ICON.x)}</button>
    <img src="${IMG(p)}" alt="${p.nombre}">
    <div class="modal__side">
      <p class="eyebrow">${CATEGORIAS.find(c => c.id === p.cat)?.nombre || ''}</p>
      <h2 class="h3" style="margin:.5rem 0">${p.nombre}</h2>
      <p class="lede" style="font-size:.88rem">${p.desc}</p>
      <div class="pdp__price tnum"><span class="now">${money(p.precio)}</span></div>
      <div class="pdp__transfer tnum">${money(transfer(p.precio))} con transferencia</div>
      ${cols.length ? `<div class="opt"><div class="opt__head"><h4>Color</h4></div>
        <div class="sw-lg">${cols.map((c, i) => `<button class="${i === 0 ? 'on' : ''}" style="background:${c.hex}" title="${c.nombre}" data-qvc="${c.nombre}"></button>`).join('')}</div></div>` : ''}
      <div class="spec"><span>Medidas</span><span>${p.medidas.an} × ${p.medidas.pr} × ${p.medidas.al} cm</span></div>
      <div class="spec"><span>Entrega</span><span>${p.entrega}</span></div>
      <div class="spec"><span>Stock</span><span>${p.stock > 0 ? `${p.stock} disponibles` : 'Sin stock'}</span></div>
      <div style="display:flex;gap:.5rem;margin-top:1.2rem">
        <button class="btn" style="flex:1" data-add="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}</button>
        <a class="btn btn-ghost" href="producto.html?id=${p.id}">Ver ficha</a>
      </div>
    </div>`;
  openPanel('#qvModal');
  $$('#qvBox [data-qvc]').forEach(b => b.addEventListener('click', () => {
    $$('#qvBox [data-qvc]').forEach(x => x.classList.remove('on')); b.classList.add('on');
  }));
}

/* ---------- Buscador ---------- */
const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function search(q) {
  const t = norm(q).trim();
  if (!t) return [];
  const terms = t.split(/\s+/);
  return CATALOGO.map(p => {
    const hay = norm([p.nombre, p.cat, (p.tags || []).join(' '), p.materiales || '', p.desc || ''].join(' '));
    const name = norm(p.nombre);
    let score = 0;
    for (const w of terms) {
      if (!hay.includes(w)) return null;
      if (name.startsWith(w)) score += 10;
      else if (name.includes(w)) score += 6;
      else score += 2;
    }
    return { p, score };
  }).filter(Boolean).sort((a, b) => b.score - a.score).map(x => x.p);
}
function openSearch() {
  openPanel('#searchOv');
  const inp = $('#searchIn'); inp.value = ''; drawSearch('');
  setTimeout(() => inp.focus(), 150);
}
function drawSearch(q) {
  const out = $('#searchOut');
  if (!q.trim()) {
    out.innerHTML = `<p class="eyebrow" style="margin-bottom:.9rem">Búsquedas frecuentes</p>
      <div class="sugg">${['sillón bouclé', 'mesa de comedor', 'almohadones', 'mesa baja', 'sofá 3 cuerpos', 'nogal']
        .map(s => `<button data-sug="${s}">${s}</button>`).join('')}</div>
      <p class="eyebrow" style="margin:2.4rem 0 .9rem">Lo más buscado</p>
      <div class="grid-p">${CATALOGO.filter(p => p.destacado).slice(0, 5).map((p, i) => cardHTML(p, i)).join('')}</div>`;
    reveal();
    return;
  }
  const r = search(q);
  out.innerHTML = r.length
    ? `<p class="count" style="margin-bottom:1rem">${r.length} resultado${r.length > 1 ? 's' : ''} para "<b>${q}</b>"</p>
       <div class="grid-p">${r.slice(0, 12).map((p, i) => cardHTML(p, i)).join('')}</div>`
    : `<div class="empty">${svg(ICON.search)}<p>No encontramos nada para "<b>${q}</b>".</p>
       <p style="font-size:.82rem;margin-top:.4rem">Probá con «sillón», «mesa» o «almohadón».</p></div>`;
  reveal();
}
document.addEventListener('input', e => { if (e.target.id === 'searchIn') drawSearch(e.target.value); });
document.addEventListener('click', e => {
  const s = e.target.closest('[data-sug]');
  if (s) { $('#searchIn').value = s.dataset.sug; drawSearch(s.dataset.sug); }
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});

/* ---------- Header: scroll + mega menú ---------- */
const header = $('.header');
if (header) {
  const onScroll = () => header.classList.toggle('stuck', window.scrollY > 8);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
}
$$('.nav__item').forEach(it => {
  if (!it.querySelector('.mega')) return;
  let t;
  it.addEventListener('mouseenter', () => { clearTimeout(t); it.classList.add('open'); });
  it.addEventListener('mouseleave', () => { t = setTimeout(() => it.classList.remove('open'), 140); });
  it.querySelector('.nav__link')?.addEventListener('click', e => {
    if (matchMedia('(hover: none)').matches) { e.preventDefault(); it.classList.toggle('open'); }
  });
});

/* ---------- Reveal on scroll ---------- */
let io;
function reveal() {
  if (!io) {
    io = new IntersectionObserver(es => es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  }
  $$('.reveal:not(.in)').forEach(el => io.observe(el));
}
window.BV.reveal = reveal;
addEventListener('DOMContentLoaded', reveal);
reveal();

/* ---------- Rieles con flechas ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-rail]');
  if (!b) return;
  const rail = $(b.dataset.rail);
  if (rail) rail.scrollBy({ left: (b.dataset.dir === '1' ? 1 : -1) * rail.clientWidth * .8, behavior: 'smooth' });
});

})();
