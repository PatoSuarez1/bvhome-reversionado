/* =============================================================
   BV HOME — Catálogo demo
   -------------------------------------------------------------
   Productos, precios e imágenes: reales, tomados de bvhome.com.ar
   Medidas, materiales, colores, stock y plazos: DEMO.
   Sirven para mostrar cómo se comporta la ficha enriquecida.
   ============================================================= */

const TELAS = {
  chocolate: { nombre: 'Chocolate',   hex: '#4A3B30' },
  arena:     { nombre: 'Arena',       hex: '#C3B49C' },
  crudo:     { nombre: 'Crudo',       hex: '#E4DCCC' },
  boucle:    { nombre: 'Bouclé',      hex: '#EFEBE1' },
  oliva:     { nombre: 'Oliva',       hex: '#6A6A52' },
  grafito:   { nombre: 'Grafito',     hex: '#2A2724' },
  nogal:     { nombre: 'Nogal',       hex: '#6B4E3A' },
  roble:     { nombre: 'Roble claro', hex: '#B79A73' },
  terracota: { nombre: 'Terracota',   hex: '#9C6448' },
  humo:      { nombre: 'Humo',        hex: '#8E8B84' }
};

const CATEGORIAS = [
  { id: 'sillones', nombre: 'Sillones y sofás', img: 'sofa-sol.webp',      copy: 'Volúmenes blandos, tapizados nobles.' },
  { id: 'mesas',    nombre: 'Mesas',            img: 'mesas-comedor.webp', copy: 'Maderas macizas y siluetas limpias.' },
  { id: 'muebles',  nombre: 'Muebles',          img: 'room-arco.webp',     copy: 'Piezas que ordenan el espacio.' },
  { id: 'deco',     nombre: 'Deco',             img: 'deco-estante.webp',  copy: 'El detalle que termina el ambiente.' }
];

/* Cada producto: precio de lista. El precio con transferencia (-20%)
   y las cuotas se calculan en runtime desde config.js */
const CATALOGO = [
  /* ---------------- SILLONES Y SOFÁS ---------------- */
  {
    id: 'sofa-eden', nombre: 'Sofá Edén', cat: 'sillones', precio: 3899000, img: 'eden.webp',
    nuevo: true, destacado: true, stock: 4, entrega: '30 a 45 días',
    colores: ['chocolate', 'arena', 'crudo', 'oliva'],
    medidas: { an: 260, pr: 100, al: 78 }, asientos: 3,
    materiales: 'Estructura de eucalipto secado en horno, espuma alta densidad y plumón siliconado.',
    desc: 'Un sofá que invita a quedarse. Asiento profundo, respaldo mullido y una línea que no compite con nada.',
    tags: ['tres cuerpos', 'living', 'plumón']
  },
  {
    id: 'sillon-duna', nombre: 'Sillón Duna', cat: 'sillones', precio: 3690000, img: 'duna.webp',
    destacado: true, stock: 2, entrega: '30 a 45 días',
    colores: ['chocolate', 'arena', 'boucle'],
    medidas: { an: 230, pr: 98, al: 72 }, asientos: 3,
    materiales: 'Tapizado en pana antimanchas, base de madera maciza.',
    desc: 'Curvas continuas y volumen generoso. Duna funciona igual de bien contra la pared que en el medio del living.',
    tags: ['curvo', 'living', 'pana']
  },
  {
    id: 'sillon-zenith', nombre: 'Sillón Zenith', cat: 'sillones', precio: 2999999, img: 'zenith.webp',
    stock: 3, entrega: '30 a 45 días',
    colores: ['chocolate', 'grafito', 'arena'],
    medidas: { an: 210, pr: 95, al: 74 }, asientos: 2,
    materiales: 'Tapizado en chenille de alta resistencia.',
    desc: 'Proporción compacta, presencia grande. Ideal para ambientes que piden calidez sin saturar.',
    tags: ['dos cuerpos', 'chenille']
  },
  {
    id: 'sillon-vika', nombre: 'Sillón Vika', cat: 'sillones', precio: 2960000, img: 'vika.webp',
    stock: 2, entrega: '30 a 45 días',
    colores: ['arena', 'crudo', 'humo'],
    medidas: { an: 205, pr: 92, al: 76 }, asientos: 2,
    materiales: 'Tapizado en lino texturado, patas de madera a la vista.',
    desc: 'Líneas rectas suavizadas en los bordes. Vika es el punto medio entre lo clásico y lo contemporáneo.',
    tags: ['lino', 'living']
  },
  {
    id: 'sofa-sena', nombre: 'Sofá Sena', cat: 'sillones', precio: 2869900, img: 'sena.webp',
    nuevo: true, destacado: true, stock: 5, entrega: '30 a 45 días',
    colores: ['crudo', 'arena', 'chocolate'],
    medidas: { an: 240, pr: 96, al: 75 }, asientos: 3,
    materiales: 'Espuma soft touch y fibra siliconada. Funda desmontable.',
    desc: 'El clásico de la casa. Sena tiene el asiento más blando de la colección y funda que se saca para lavar.',
    tags: ['tres cuerpos', 'funda desmontable']
  },
  {
    id: 'divan-sahara', nombre: 'Diván Sahara', cat: 'sillones', precio: 2129000, img: 'sahara.webp',
    nuevo: true, destacado: true, stock: 3, entrega: '25 a 40 días',
    colores: ['chocolate', 'arena', 'terracota'],
    medidas: { an: 180, pr: 80, al: 68 }, asientos: 2,
    materiales: 'Tapizado en suede ecológico, relleno de espuma HR.',
    desc: 'Sin respaldo, sin apoyabrazos, sin vueltas. Un diván para leer, apoyar los pies o cerrar un ambiente.',
    tags: ['diván', 'suede']
  },
  {
    id: 'sillon-luma', nombre: 'Sillón Luma', cat: 'sillones', precio: 1869000, img: 'luma.webp',
    nuevo: true, destacado: true, stock: 6, entrega: '25 a 40 días',
    colores: ['boucle', 'crudo', 'arena', 'chocolate'],
    medidas: { an: 165, pr: 88, al: 74 }, asientos: 2,
    materiales: 'Bouclé de algodón reciclado sobre estructura de pino.',
    desc: 'Textura bouclé y una silueta que abraza. Luma entra donde otros sillones no.',
    tags: ['bouclé', 'compacto']
  },
  {
    id: 'poltrona-aura', nombre: 'Poltrona Aura giratoria', cat: 'sillones', precio: 1459000, img: 'poltrona-aura.webp',
    stock: 4, entrega: '25 a 40 días',
    colores: ['chocolate', 'arena', 'oliva', 'grafito'],
    medidas: { an: 88, pr: 86, al: 78 }, asientos: 1,
    materiales: 'Base giratoria 360° en acero con terminación mate.',
    desc: 'Gira 360°. Pensada para el rincón de lectura o para acompañar un sofá sin bloquear el paso.',
    tags: ['giratoria', 'individual']
  },
  {
    id: 'sillon-hug', nombre: 'Sillón Hug', cat: 'sillones', precio: 1399000, img: 'hug.webp',
    stock: 5, entrega: '25 a 40 días',
    colores: ['boucle', 'arena', 'chocolate'],
    medidas: { an: 96, pr: 90, al: 76 }, asientos: 1,
    materiales: 'Bouclé texturado, estructura reforzada.',
    desc: 'Se llama Hug por algo. Respaldo envolvente y asiento bajo, para hundirse.',
    tags: ['individual', 'bouclé']
  },
  {
    id: 'sillon-flore', nombre: 'Sillón Floré', cat: 'sillones', precio: 1390000, img: 'flore.webp',
    stock: 4, entrega: '25 a 40 días',
    colores: ['arena', 'crudo', 'oliva'],
    medidas: { an: 92, pr: 88, al: 80 }, asientos: 1,
    materiales: 'Tapizado en lino mixto con tratamiento antimanchas.',
    desc: 'Silueta redondeada y patas ocultas. Floré parece flotar sobre la alfombra.',
    tags: ['individual', 'lino']
  },
  {
    id: 'sillon-kumo-xl', nombre: 'Sillón Kumo XL', cat: 'sillones', precio: 969000, img: 'kumo-xl.webp',
    stock: 7, entrega: '20 a 35 días',
    colores: ['chocolate', 'arena', 'crudo', 'grafito'],
    medidas: { an: 110, pr: 100, al: 70 }, asientos: 1,
    materiales: 'Relleno de perlas de EPS y fibra. Funda lavable.',
    desc: 'La versión grande del Kumo. Informal, liviano y sorprendentemente cómodo.',
    tags: ['puff', 'lavable']
  },
  {
    id: 'sillon-aura', nombre: 'Sillón Individual Aura', cat: 'sillones', precio: 969000, img: 'aura.webp',
    nuevo: true, destacado: true, stock: 6, entrega: '20 a 35 días',
    colores: ['arena', 'chocolate', 'crudo'],
    medidas: { an: 86, pr: 84, al: 76 }, asientos: 1,
    materiales: 'Tapizado en pana, base de madera maciza.',
    desc: 'Compacto sin sentirse chico. El individual que más se repite en los proyectos.',
    tags: ['individual', 'pana']
  },
  {
    id: 'sillon-nuvo-xl', nombre: 'Sillón Nuvó XL', cat: 'sillones', precio: 799000, img: 'nuvo-xl.webp',
    stock: 8, entrega: '20 a 35 días',
    colores: ['chocolate', 'arena', 'oliva'],
    medidas: { an: 100, pr: 95, al: 62 }, asientos: 1,
    materiales: 'Funda de pana desmontable con cierre.',
    desc: 'Puff grande con alma de sillón. Se mueve de ambiente sin esfuerzo.',
    tags: ['puff', 'pana']
  },
  {
    id: 'sillon-kumo', nombre: 'Sillón Kumo', cat: 'sillones', precio: 729000, img: 'kumo.webp',
    stock: 9, entrega: '20 a 35 días',
    colores: ['boucle', 'crudo', 'arena'],
    medidas: { an: 90, pr: 85, al: 66 }, asientos: 1,
    materiales: 'Bouclé sobre relleno mixto. Funda lavable.',
    desc: 'El más liviano de la línea. Perfecto para sumar un asiento sin ocupar.',
    tags: ['puff', 'bouclé']
  },
  {
    id: 'nuvo-respaldo', nombre: 'Sillón / Puff Nuvó con respaldo', cat: 'sillones', precio: 499000, img: 'nuvo-respaldo.webp',
    stock: 10, entrega: '15 a 30 días',
    colores: ['chocolate', 'arena', 'crudo', 'oliva'],
    medidas: { an: 80, pr: 78, al: 68 }, asientos: 1,
    materiales: 'Funda de pana desmontable.',
    desc: 'Puff cuando lo necesitás, sillón cuando querés apoyar la espalda.',
    tags: ['puff', 'versátil']
  },
  {
    id: 'sillon-modul', nombre: 'Sillón Modul', cat: 'sillones', precio: 2300000, img: 'modul.webp',
    destacado: true, stock: 3, entrega: '30 a 45 días',
    colores: ['chocolate', 'arena', 'grafito'],
    medidas: { an: 220, pr: 95, al: 72 }, asientos: 3,
    materiales: 'Sistema modular: se arma en L o lineal.',
    desc: 'Modular de verdad. Lo armás en L hoy y lo pasás a lineal cuando cambies de casa.',
    tags: ['modular', 'living']
  },
  {
    id: 'puff-boucle', nombre: 'Puff Bouclé', cat: 'sillones', precio: 269000, img: 'puff-boucle.webp',
    stock: 12, entrega: '15 a 25 días',
    colores: ['boucle', 'crudo'],
    medidas: { an: 55, pr: 55, al: 42 }, asientos: 1,
    materiales: 'Bouclé de algodón, relleno de espuma.',
    desc: 'El accesorio que resuelve la visita de más. Redondo, blando y liviano.',
    tags: ['puff', 'bouclé']
  },

  /* ---------------- MESAS ---------------- */
  {
    id: 'mesa-sienna', nombre: 'Mesa de comedor Sienna', cat: 'mesas', precio: 2890000, img: 'sienna.webp',
    nuevo: true, destacado: true, stock: 2, entrega: '35 a 50 días',
    colores: ['nogal', 'roble', 'grafito'],
    medidas: { an: 240, pr: 100, al: 76 }, comensales: 8,
    materiales: 'Tapa de roble macizo con terminación al agua. Base escultórica.',
    desc: 'Ocho comensales sin que la mesa domine el ambiente. La base arqueada deja las puntas libres.',
    tags: ['comedor', 'roble', '8 personas']
  },
  {
    id: 'mesa-eira', nombre: 'Mesa de comedor Eira', cat: 'mesas', precio: 2760000, img: 'eira.webp',
    destacado: true, stock: 2, entrega: '35 a 50 días',
    colores: ['nogal', 'roble'],
    medidas: { an: 220, pr: 100, al: 76 }, comensales: 8,
    materiales: 'Roble macizo, canto redondeado a mano.',
    desc: 'Óvalo puro. Eira suaviza los comedores rectos y hace que circular sea más fácil.',
    tags: ['comedor', 'ovalada', '8 personas']
  },
  {
    id: 'mesa-eter', nombre: 'Mesa Éter', cat: 'mesas', precio: 2490000, img: 'eter.webp',
    nuevo: true, stock: 3, entrega: '35 a 50 días',
    colores: ['nogal', 'grafito', 'roble'],
    medidas: { an: 200, pr: 95, al: 76 }, comensales: 6,
    materiales: 'Tapa laqueada mate, base de madera maciza.',
    desc: 'Terminación mate que no marca huellas. Éter es la opción para quien odia limpiar la mesa.',
    tags: ['comedor', 'mate', '6 personas']
  },
  {
    id: 'mesa-eria', nombre: 'Mesa de comedor Eria', cat: 'mesas', precio: 2469000, img: 'eria.webp',
    stock: 3, entrega: '35 a 50 días',
    colores: ['roble', 'nogal'],
    medidas: { an: 200, pr: 100, al: 76 }, comensales: 6,
    materiales: 'Roble macizo con veta viva.',
    desc: 'Cada tapa tiene su propia veta. No hay dos Eria iguales.',
    tags: ['comedor', 'roble', '6 personas']
  },
  {
    id: 'mesa-nuro', nombre: 'Mesa Nüro', cat: 'mesas', precio: 1999999, img: 'nuro.webp',
    stock: 4, entrega: '30 a 45 días',
    colores: ['grafito', 'nogal'],
    medidas: { an: 180, pr: 90, al: 76 }, comensales: 6,
    materiales: 'Estructura metálica con tapa de madera.',
    desc: 'Metal y madera en la proporción justa. Nüro entra bien en espacios industriales o mixtos.',
    tags: ['comedor', 'metal', '6 personas']
  },
  {
    id: 'mesa-nuvia', nombre: 'Mesa Nuvia', cat: 'mesas', precio: 1999000, img: 'nuvia.webp',
    nuevo: true, destacado: true, stock: 4, entrega: '30 a 45 días',
    colores: ['roble', 'nogal'],
    medidas: { an: 160, pr: 90, al: 76 }, comensales: 6,
    materiales: 'Madera maciza, base de doble pata.',
    desc: 'La medida más pedida. Seis personas cómodas en un ambiente que no sobra.',
    tags: ['comedor', '6 personas']
  },
  {
    id: 'mesa-oria', nombre: 'Mesa de comedor Oria', cat: 'mesas', precio: 1899000, img: 'oria.webp',
    nuevo: true, stock: 3, entrega: '30 a 45 días',
    colores: ['nogal', 'roble'],
    medidas: { an: 180, pr: 95, al: 76 }, comensales: 6,
    materiales: 'Tapa de madera maciza, base tipo trípode.',
    desc: 'Base central: nadie pelea con una pata. Oria es la mesa más práctica del catálogo.',
    tags: ['comedor', 'base central']
  },
  {
    id: 'mesa-ona', nombre: 'Mesa Ona', cat: 'mesas', precio: 1899000, img: 'ona.webp',
    destacado: true, stock: 5, entrega: '30 a 45 días',
    colores: ['nogal', 'roble', 'grafito', 'terracota', 'oliva', 'humo'],
    medidas: { an: 120, pr: 120, al: 76 }, comensales: 4,
    materiales: 'Disponible en seis terminaciones.',
    desc: 'Redonda, para cuatro, y en seis colores. Ona es la que más se personaliza.',
    tags: ['comedor', 'redonda', '6 colores']
  },
  {
    id: 'mesa-gaia', nombre: 'Mesa Gaia', cat: 'mesas', precio: 1890000, img: 'gaia.webp',
    stock: 4, entrega: '30 a 45 días',
    colores: ['roble', 'nogal'],
    medidas: { an: 160, pr: 85, al: 76 }, comensales: 6,
    materiales: 'Madera maciza con terminación aceitada.',
    desc: 'Terminación aceitada que se puede retocar en casa. Gaia envejece bien.',
    tags: ['comedor', 'aceitada']
  },
  {
    id: 'set-sora', nombre: 'Set de Mesas Sōra', cat: 'mesas', precio: 1890000, img: 'sora.webp',
    nuevo: true, destacado: true, stock: 5, entrega: '25 a 40 días',
    colores: ['nogal', 'grafito'],
    medidas: { an: 90, pr: 90, al: 38 },
    materiales: 'Set de dos mesas que se guardan una debajo de la otra.',
    desc: 'Dos alturas, un solo lugar. Se separan cuando hay gente y se apilan cuando no.',
    tags: ['auxiliar', 'set x2']
  },
  {
    id: 'mesa-koa', nombre: 'Mesa auxiliar Koa', cat: 'mesas', precio: 1450000, img: 'koa.webp',
    destacado: true, stock: 6, entrega: '25 a 40 días',
    colores: ['nogal', 'roble'],
    medidas: { an: 100, pr: 100, al: 35 },
    materiales: 'Madera maciza torneada.',
    desc: 'Baja, redonda y maciza. Koa es la mesa de living que combina con todo.',
    tags: ['auxiliar', 'living']
  },
  {
    id: 'mesa-domo', nombre: 'Mesa baja Domo', cat: 'mesas', precio: 1290000, img: 'domo.webp',
    stock: 5, entrega: '25 a 40 días',
    colores: ['nogal', 'grafito'],
    medidas: { an: 110, pr: 60, al: 32 },
    materiales: 'Tapa rectangular con cantos redondeados.',
    desc: 'Rectangular y bien baja. Domo acompaña sofás profundos sin estorbar las piernas.',
    tags: ['auxiliar', 'baja']
  },
  {
    id: 'mesa-noir', nombre: 'Mesa Noir', cat: 'mesas', precio: 1099000, img: 'noir.webp',
    stock: 6, entrega: '25 a 40 días',
    colores: ['grafito', 'nogal'],
    medidas: { an: 90, pr: 90, al: 34 },
    materiales: 'Terminación wengué mate.',
    desc: 'La más oscura del catálogo. Noir ancla los livings claros.',
    tags: ['auxiliar', 'oscura']
  },
  {
    id: 'mesa-bosco', nombre: 'Mesa Bosco', cat: 'mesas', precio: 699000, img: 'bosco.webp',
    stock: 8, entrega: '20 a 35 días',
    colores: ['roble', 'nogal'],
    medidas: { an: 50, pr: 50, al: 50 },
    materiales: 'Madera maciza, pieza única.',
    desc: 'Mesa de rincón o banqueta según el día. Bosco es chica y resuelve mucho.',
    tags: ['auxiliar', 'rincón']
  },
  {
    id: 'mesa-amane', nombre: 'Mesa Amane', cat: 'mesas', precio: 599000, img: 'amane.webp',
    stock: 0, entrega: 'Repone en 30 días',
    colores: ['roble', 'nogal'],
    medidas: { an: 45, pr: 45, al: 55 },
    materiales: 'Madera maciza con base cilíndrica.',
    desc: 'Mesita de apoyo al lado del sillón. Justo la altura del apoyabrazos.',
    tags: ['auxiliar', 'apoyo']
  },

  /* ---------------- MUEBLES ---------------- */
  {
    id: 'gosh-terra', nombre: 'Espejo Gosh & Banco Terra', cat: 'muebles', precio: 2980000, img: 'gosh-terra.webp',
    destacado: true, stock: 2, entrega: '35 a 50 días',
    colores: ['nogal', 'roble'],
    medidas: { an: 120, pr: 40, al: 200 },
    materiales: 'Espejo con marco de madera + banco a juego. Se venden como set.',
    desc: 'El set que arma un recibidor entero. Espejo de cuerpo entero y banco para calzarse.',
    tags: ['recibidor', 'set', 'espejo']
  },
  {
    id: 'recibidor-hebano', nombre: 'Recibidor Hébano', cat: 'muebles', precio: 1650000, img: 'hebano.webp',
    stock: 3, entrega: '35 a 50 días',
    colores: ['grafito', 'nogal'],
    medidas: { an: 120, pr: 35, al: 80 },
    materiales: 'Madera maciza con herrajes de cierre suave.',
    desc: 'Profundidad de 35 cm: entra en pasillos angostos y sigue guardando de todo.',
    tags: ['recibidor', 'guardado']
  },

  /* ---------------- DECO ---------------- */
  {
    id: 'florero-smith', nombre: 'Set x2 Florero Smith Blanco', cat: 'deco', precio: 149299, img: 'florero-smith.webp',
    destacado: true, stock: 15, entrega: '5 a 12 días',
    colores: ['crudo'],
    medidas: { an: 18, pr: 18, al: 32 },
    materiales: 'Cerámica esmaltada. Set de dos piezas de distinto alto.',
    desc: 'Dos alturas para agrupar. Funcionan con ramas secas o directamente vacíos.',
    tags: ['cerámica', 'set x2']
  },
  {
    id: 'almohadon-akari', nombre: 'Almohadón Akari', cat: 'deco', precio: 129900, img: 'akari.webp',
    nuevo: true, stock: 20, entrega: '5 a 12 días',
    colores: ['crudo', 'arena', 'chocolate'],
    medidas: { an: 50, pr: 15, al: 50 },
    materiales: 'Funda de lino con relleno de vellón siliconado incluido.',
    desc: 'Lino lavado con caída pesada. Viene con relleno, no hay que comprarlo aparte.',
    tags: ['almohadón', 'lino']
  },
  {
    id: 'almohadon-yura', nombre: 'Almohadón Yura marrón', cat: 'deco', precio: 129900, img: 'yura.webp',
    nuevo: true, stock: 18, entrega: '5 a 12 días',
    colores: ['chocolate', 'terracota'],
    medidas: { an: 45, pr: 15, al: 45 },
    materiales: 'Tejido texturado, relleno incluido.',
    desc: 'El marrón que levanta un sofá claro. Textura gruesa y trama visible.',
    tags: ['almohadón', 'textura']
  },
  {
    id: 'almohadon-nudo', nombre: 'Almohadón Nudo Bouclé Blanco', cat: 'deco', precio: 129499, img: 'nudo-boucle.webp',
    destacado: true, stock: 16, entrega: '5 a 12 días',
    colores: ['boucle'],
    medidas: { an: 45, pr: 18, al: 45 },
    materiales: 'Bouclé de algodón tejido a mano.',
    desc: 'Tejido nudo hecho a mano. Es el almohadón que la gente toca antes de comprar.',
    tags: ['almohadón', 'bouclé', 'artesanal']
  },
  {
    id: 'almohadon-kai-ow', nombre: 'Almohadón Kai Candy off white', cat: 'deco', precio: 89266, img: 'kai-off-white.webp',
    stock: 24, entrega: '5 a 12 días',
    colores: ['crudo', 'boucle'],
    medidas: { an: 40, pr: 14, al: 40 },
    materiales: 'Funda con cierre invisible, relleno incluido.',
    desc: 'El neutro que falta. Tamaño chico para apoyar sobre almohadones más grandes.',
    tags: ['almohadón', 'neutro']
  },
  {
    id: 'almohadon-kai', nombre: 'Almohadón Kai Candy', cat: 'deco', precio: 89266, img: 'kai-candy.webp',
    stock: 22, entrega: '5 a 12 días',
    colores: ['arena', 'humo'],
    medidas: { an: 40, pr: 14, al: 40 },
    materiales: 'Funda con cierre invisible, relleno incluido.',
    desc: 'Mismo Kai, tono más cálido. Se compran de a dos.',
    tags: ['almohadón', 'neutro']
  }
];

/* ------- Ambientes shoppables: puntos sobre la foto (en %) ------- */
const AMBIENTES = [
  {
    id: 'living-sol',
    titulo: 'Living luminoso',
    copy: 'Blancos rotos, madera oscura y sombra de ventana. El ambiente más pedido del año.',
    img: 'sofa-sol.webp',
    puntos: [
      { x: 45, y: 55, producto: 'sofa-sena' },
      { x: 32, y: 78, producto: 'mesa-domo' },
      { x: 20, y: 47, producto: 'almohadon-nudo' },
      { x: 68, y: 50, producto: 'almohadon-kai-ow' }
    ]
  },
  {
    id: 'estar-marron',
    titulo: 'Estar en chocolate',
    copy: 'Dos sillones curvos enfrentados y una mesa baja maciza en el medio.',
    img: 'estar-marron.webp',
    puntos: [
      { x: 17, y: 30, producto: 'sillon-duna' },
      { x: 74, y: 27, producto: 'poltrona-aura' },
      { x: 43, y: 55, producto: 'mesa-koa' },
      { x: 76, y: 15, producto: 'almohadon-yura' }
    ]
  },
  {
    id: 'arco',
    titulo: 'Rincón del arco',
    copy: 'Luz indirecta, textiles crudos y volúmenes bajos.',
    img: 'room-arco.webp',
    puntos: [
      { x: 30, y: 63, producto: 'sillon-nuvo-xl' },
      { x: 66, y: 58, producto: 'divan-sahara' },
      { x: 62, y: 79, producto: 'mesa-noir' },
      { x: 73, y: 57, producto: 'almohadon-akari' }
    ]
  }
];

/* ------------------------- Opiniones -------------------------
   DEMO: testimonios ficticios. Cada uno responde una objeción real
   de compra de muebles. Reemplazar por reseñas verdaderas antes de
   publicar. */
const OPINIONES = {
  promedio: 4.9,
  total: 127,
  items: [
    {
      nombre: 'Malena R.', lugar: 'Palermo, CABA', fecha: 'Marzo 2026',
      estrellas: 5, producto: 'sofa-sena',
      titulo: 'Llegó antes de lo que decía',
      texto: 'Lo pedí calculando que iba a estar para marzo y llegó en 32 días. Me escribieron dos veces por WhatsApp para coordinar, una para avisar que salía de fábrica y otra el día anterior. Cero incertidumbre.'
    },
    {
      nombre: 'Julián P.', lugar: 'Villa Crespo, CABA', fecha: 'Febrero 2026',
      estrellas: 5, producto: 'sillon-luma',
      titulo: 'El bouclé es igual a la foto',
      texto: 'Mi miedo era que el bouclé viniera más grisado que en la web. Es exactamente el mismo tono. La textura incluso se siente mejor en persona de lo que se ve en pantalla.'
    },
    {
      nombre: 'Carolina D.', lugar: 'Rosario, Santa Fe', fecha: 'Enero 2026',
      estrellas: 5, producto: 'mesa-nuvia',
      titulo: 'Nos la hicieron en nuestra medida',
      texto: 'Nuestro comedor es angosto y ninguna mesa de dos metros entraba. Les mandé las medidas del ambiente y me la fabricaron de 1,70 con la misma base. Tardó dos semanas más y valió la pena.'
    },
    {
      nombre: 'Federico M.', lugar: 'Vicente López, GBA', fecha: 'Febrero 2026',
      estrellas: 4, producto: 'sillon-duna',
      titulo: 'Lo subieron a un tercero sin ascensor',
      texto: 'Vivo en un tercer piso por escalera y lo subieron sin cobrarme extra, con dos personas y sin marcar la pared. Le pongo cuatro porque tuve que reprogramar la entrega una vez, pero lo resolvieron bien.'
    }
  ]
};

/* ---------------------- Configuración ---------------------- */
const CONFIG = {
  descuentoTransferencia: 0.20,
  cuotas: [
    { n: 3,  interes: 0    },
    { n: 6,  interes: 0    },
    { n: 12, interes: 0.35 }
  ],
  envioGratisDesde: 200000,
  whatsapp: '541164340861',
  instagram: 'bvhome.boutique',

  /* Fabricación a medida: se ofrece cuando la pieza no entra en el ambiente */
  aMedida: {
    categorias: ['sillones', 'mesas', 'muebles'],  // en deco no aplica
    recargo: 0.25,        // 25% sobre el precio de lista
    margenPared: 20,      // cm que dejamos libres respecto de la pared
    minEscala: 0.6,       // no achicamos por debajo del 60% del original
    plazoExtra: 15        // días adicionales sobre el plazo estándar
  }
};
