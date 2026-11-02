import fs from 'node:fs';
import path from 'node:path';
import { products, all, bySlug } from './products.js';

const DOMAIN = 'https://schippercompactwonen.nl';
const baseHtml = fs.readFileSync('./index.html', 'utf8');

const groups = {
  zitcomfort: {
    t: 'Zitcomfort – Sta-op Stoelen & Seniorenstoelen op Maat',
    h1: 'Zitcomfort',
    d: 'Goed zitten is een vaak onderschatte factor voor uw gezondheid. Ontdek onze collectie elektrische sta-op stoelen en ergonomische senioren fauteuils (nieuw & gekeurde occasions v.a. € 595,-) in Dordrecht.',
    subs: ['zitcomfort_sta-op-stoelen', 'zitcomfort_seniorenstoelen']
  },
  ligcomfort: {
    t: 'Ligcomfort – Hoog/laag Bedden & Senioren Ledikanten',
    h1: 'Ligcomfort',
    d: 'Senioren ledikanten op comforthoogte, elektrisch verstelbare hoog-laag zorgbedden en matrassen voor een veilige en ontspannen nachtrust. Showroom in Dordrecht & bezorging aan huis.',
    subs: ['ligcomfort_senioren-ledikanten', 'ligcomfort_hooglaag-bedden', 'ligcomfort_bed-toebehoren']
  },
  zorgcomfort: {
    t: 'Zorgcomfort – Zorghulpmiddelen, Rollators & Trapliften',
    h1: 'Zorgcomfort',
    d: 'Zorgcomfort producten om handelingen in het dagelijks leven eenvoudiger en veiliger te maken: lichtgewicht rollators, binnenrollators en maatwerk trapliften in Dordrecht & regio Rotterdam.',
    subs: ['zorgcomfort_loophulpmiddelen', 'zorgcomfort_trapliften']
  }
};

const subMeta = {
  'zitcomfort_sta-op-stoelen': {
    canonicalPath: '/cat/zitcomfort/sta-op-stoelen/',
    aliases: ['/zitcomfort/sta-op-stoelen/'],
    title: 'Sta-op Stoelen Nieuw & Occasions (v.a. € 675,-) | Schipper Compact Wonen Dordrecht',
    h1: 'Sta-op stoelen op uw maat gemaakt',
    desc: 'Ruime collectie elektrische sta-op stoelen (nieuw op maat & gereviseerde Fitform occasions v.a. € 675,-). Persoonlijk aangemeten door onze bewegingstechnoloog in Dordrecht of bij u thuis in regio Rotterdam.'
  },
  'zitcomfort_seniorenstoelen': {
    canonicalPath: '/cat/zitcomfort/seniorenstoelen/',
    aliases: ['/zitcomfort/senioren-stoelen/', '/zitcomfort/seniorenstoelen/'],
    title: 'Seniorenstoelen & Senioren Fauteuils op Maat (v.a. € 595,-) | Schipper Compact Wonen',
    h1: 'Seniorenstoelen & Ergonomische Senioren Fauteuils',
    desc: 'Seniorenstoelen en ergonomische senioren fauteuils op uw maat gemaakt. Nieuwe modellen & gekeurde occasions van Fitform, Farstrup en Hjort Knudsen in onze showroom in Dordrecht.'
  },
  'ligcomfort_senioren-ledikanten': {
    canonicalPath: '/cat/ligcomfort/senioren-ledikanten/',
    aliases: ['/ligcomfort/senioren-ledikanten/'],
    title: 'Senioren Ledikanten op Comforthoogte (1- en 2-persoons) | Schipper Compact Wonen',
    h1: 'Senioren ledikanten',
    desc: 'Stijlvolle senioren ledikanten op comfortabele in- en uitstaphoogte, ook deelbaar op wielen. Vrijblijvend advies in onze showroom in Dordrecht of bij u thuis.'
  },
  'ligcomfort_hooglaag-bedden': {
    canonicalPath: '/cat/ligcomfort/hooglaag-bedden/',
    aliases: ['/ligcomfort/hooglaag-bedden/', '/cat/ligcomfort/hoog-laag-bedden/'],
    title: 'Hoog/laag Bedden & Zorgbedden (Nieuw & Occasion) | Schipper Compact Wonen',
    h1: 'Hoog/laag bedden',
    desc: 'Elektrisch verstelbare hoog-laag bedden en huiselijke zorgbedden voor optimaal ligcomfort en thuiszorg. Snel geleverd en vakkundig gemonteerd in Dordrecht & regio Rotterdam.'
  },
  'ligcomfort_bed-toebehoren': {
    canonicalPath: '/cat/ligcomfort/bed-toebehoren/',
    aliases: ['/ligcomfort/bed-toebehoren/', '/cat/ligcomfort/toebehoren/'],
    title: 'Bed Toebehoren – Hoog/laag Inlegbodems, Matrassen & Papegaai | Schipper Compact Wonen',
    h1: 'Bed toebehoren',
    desc: 'Elektrisch verstelbare hoog-laag inlegbodems voor in uw eigen ledikant, pocketvering matrassen en bedpapegaaien. Persoonlijk advies in Dordrecht.'
  },
  'zorgcomfort_loophulpmiddelen': {
    canonicalPath: '/cat/zorgcomfort/loophulpmiddelen/',
    aliases: ['/zorgcomfort/loophulpmiddelen/'],
    title: 'Loophulpmiddelen & Lichtgewicht Rollators Dordrecht | Schipper Compact Wonen',
    h1: 'Loophulpmiddelen & Rollators',
    desc: 'Lichtgewicht buitenrollators, wendbare binnenrollators (Rehasense, Premis) en loophulpmiddelen direct op uw hoogte afgesteld in onze showroom in Dordrecht.'
  },
  'zorgcomfort_trapliften': {
    canonicalPath: '/cat/zorgcomfort/trapliften/',
    aliases: ['/zorgcomfort/trapliften/'],
    title: 'Trapliften op Maat (Rechte trap & Bochten) | Schipper Compact Wonen Dordrecht',
    h1: 'Trapliften',
    desc: 'Veilig en zelfstandig boven blijven wonen met een traplift op maat voor elke rechte of gebogen trap. Vrijblijvende thuisopname en advies door Schipper Compact Wonen.'
  }
};

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(s = '') {
  return String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatEur(n) {
  if (!n) return 'Prijs op aanvraag';
  return '€ ' + Number(n).toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildPageHtml({ title, description, canonicalUrl, ogImage, jsonLd, mainContent }) {
  let html = baseHtml;

  // Ensure <base href="/"> right after <meta name="viewport"...>
  if (!html.includes('<base href="/">')) {
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/i,
      '$1\n<base href="/">'
    );
  }

  // Replace <title>
  html = html.replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);

  // Replace <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*">/i,
    `<meta name="description" content="${esc(description)}">`
  );

  // Remove any previous injected SEO block
  html = html.replace(/<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->\n?/g, '');

  const imgUrl = ogImage
    ? (ogImage.startsWith('http') ? ogImage : `${DOMAIN}/${ogImage.replace(/^\/+/, '')}`)
    : `${DOMAIN}/assets/winkel_showroom_nieuw.jpg`;

  const seoBlock = [
    '<!-- SEO_HEAD_START -->',
    `<link rel="canonical" href="${esc(canonicalUrl)}">`,
    `<meta property="og:locale" content="nl_NL">`,
    `<meta property="og:site_name" content="Schipper Compact Wonen">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(description)}">`,
    `<meta property="og:url" content="${esc(canonicalUrl)}">`,
    `<meta property="og:image" content="${esc(imgUrl)}">`,
    jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '',
    '<!-- SEO_HEAD_END -->'
  ].filter(Boolean).join('\n');

  html = html.replace('</head>', `${seoBlock}\n</head>`);

  // Inject pre-rendered semantic HTML inside <main id="app">...</main>
  html = html.replace(/<main id="app">[\s\S]*?<\/main>/, `<main id="app">${mainContent || ''}</main>`);

  return html;
}

function writeHtmlFile(relUrlPath, html) {
  const cleanRel = relUrlPath.replace(/^\/+|\/+$/g, '');
  const outPath = cleanRel ? path.join('.', cleanRel, 'index.html') : './index.html';
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
}

function renderProductCardsStatic(items) {
  return `<div class="grid g4">${items.map(p => {
    const img = p.img || (p.images && p.images[0]) || '';
    const pr = p.price ? formatEur(p.price) : 'Prijs op aanvraag';
    return `<article class="card prod" data-s="${esc(p.slug)}">
      <div class="im">${img ? `<img loading="lazy" src="${esc(img)}" alt="${esc(p.name)}">` : ''}</div>
      <div class="b">
        <h3><a href="/product/${esc(p.slug)}/" style="color:inherit;text-decoration:none">${esc(p.name)}</a></h3>
        <div class="pfoot"><div class="price">${esc(pr)}</div></div>
      </div>
    </article>`;
  }).join('')}</div>`;
}

const sitemapUrls = new Set();

// 1. Update root index.html
{
  const homeTitle = 'Schipper Compact Wonen – Sta-op Stoelen, Seniorenstoelen & Zorgcomfort Dordrecht';
  const homeDesc = 'Al ruim 35 jaar dé specialist in sta-op stoelen (nieuw & occasions v.a. € 595,-), senioren fauteuils, hoog-laag bedden en zorghulpmiddelen. Showroom in Dordrecht & thuisadvies in regio Rotterdam.';
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: 'Schipper Compact Wonen BV',
    url: `${DOMAIN}/`,
    telephone: '+31786314858',
    email: 'info@schippercompactwonen.nl',
    image: `${DOMAIN}/assets/winkel_showroom_nieuw.jpg`,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Merwedestraat 239',
      postalCode: '3313 GT',
      addressLocality: 'Dordrecht',
      addressCountry: 'NL'
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '16:00'
      }
    ]
  };
  const homeMain = `<div class="page"><div class="wrap">
    <h1>Sta-op stoelen, Seniorenstoelen &amp; Zorgcomfort op Maat in Dordrecht</h1>
    <p class="sub">${esc(homeDesc)}</p>
    <h2>Populaire modellen in onze showroom</h2>
    ${renderProductCardsStatic(all.slice(0, 12))}
  </div></div>`;
  const html = buildPageHtml({
    title: homeTitle,
    description: homeDesc,
    canonicalUrl: `${DOMAIN}/`,
    ogImage: 'assets/winkel_showroom_nieuw.jpg',
    jsonLd: homeJsonLd,
    mainContent: homeMain
  });
  writeHtmlFile('/', html);
  sitemapUrls.add('/');
}

// 2. Main Category Groups (/cat/zitcomfort/, /cat/ligcomfort/, /cat/zorgcomfort/ + root aliases)
for (const [gk, g] of Object.entries(groups)) {
  const items = g.subs.flatMap(s => products[s] || []);
  const canonicalPath = `/cat/${gk}/`;
  const aliasPath = `/${gk}/`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: g.h1,
    description: g.d,
    url: `${DOMAIN}${canonicalPath}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${DOMAIN}/product/${p.slug}/`,
        name: p.name
      }))
    }
  };
  const mainContent = `<div class="page"><div class="wrap">
    <div class="crumbs"><a href="/">Home</a> / ${esc(g.h1)}</div>
    <h1>${esc(g.h1)}</h1>
    <p class="sub">${esc(g.d)}</p>
    ${renderProductCardsStatic(items)}
  </div></div>`;
  const html = buildPageHtml({
    title: `${g.t} | Schipper Compact Wonen Dordrecht`,
    description: g.d,
    canonicalUrl: `${DOMAIN}${canonicalPath}`,
    ogImage: items[0]?.images?.[0] || 'assets/winkel_showroom_nieuw.jpg',
    jsonLd,
    mainContent
  });
  writeHtmlFile(canonicalPath, html);
  writeHtmlFile(aliasPath, html);
  sitemapUrls.add(canonicalPath);
  if (gk === 'zorgcomfort') sitemapUrls.add('/zorgcomfort/');
}

// 3. Subcategories (/cat/zitcomfort/seniorenstoelen/, /cat/zitcomfort/sta-op-stoelen/, etc.)
for (const [sk, sm] of Object.entries(subMeta)) {
  const items = products[sk] || [];
  const gk = sk.split('_')[0];
  const g = groups[gk];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: sm.h1,
    description: sm.desc,
    url: `${DOMAIN}${sm.canonicalPath}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${DOMAIN}/` },
        { '@type': 'ListItem', position: 2, name: g.h1, item: `${DOMAIN}/cat/${gk}/` },
        { '@type': 'ListItem', position: 3, name: sm.h1, item: `${DOMAIN}${sm.canonicalPath}` }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${DOMAIN}/product/${p.slug}/`,
        name: p.name
      }))
    }
  };
  const mainContent = `<div class="page"><div class="wrap">
    <div class="crumbs"><a href="/">Home</a> / <a href="/cat/${gk}/">${esc(g.h1)}</a> / ${esc(sm.h1)}</div>
    <h1>${esc(sm.h1)}</h1>
    <p class="sub">${esc(sm.desc)}</p>
    ${renderProductCardsStatic(items)}
  </div></div>`;
  const html = buildPageHtml({
    title: sm.title,
    description: sm.desc,
    canonicalUrl: `${DOMAIN}${sm.canonicalPath}`,
    ogImage: items[0]?.images?.[0] || 'assets/winkel_showroom_nieuw.jpg',
    jsonLd,
    mainContent
  });
  writeHtmlFile(sm.canonicalPath, html);
  for (const al of sm.aliases) writeHtmlFile(al, html);
  sitemapUrls.add(sm.canonicalPath);
}

// 4. All 71 Product Pages (/product/<slug>/)
for (const p of all) {
  const canonicalPath = `/product/${p.slug}/`;
  const gk = p.cat.split('_')[0];
  const g = groups[gk] || groups.zitcomfort;
  const sm = subMeta[p.cat] || subMeta['zitcomfort_sta-op-stoelen'];
  const priceStr = p.price ? ` – € ${Number(p.price).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}` : '';
  const condStr = p.condition && p.condition !== 'nieuw' ? ` (${p.condition})` : '';
  const title = `${p.name}${condStr}${priceStr} | Schipper Compact Wonen Dordrecht`;
  const rawText = stripTags(p.short || p.desc || '');
  const desc = rawText
    ? `${p.name}${priceStr}: ${rawText}`.slice(0, 158)
    : `${p.name}${condStr}${priceStr} – Persoonlijk op uw maat afgesteld door onze bewegingstechnoloog in Dordrecht of vrijblijvend bij u thuis.`;

  const offerObj = p.price
    ? {
        '@type': 'Offer',
        url: `${DOMAIN}${canonicalPath}`,
        priceCurrency: 'EUR',
        price: Number(p.price).toFixed(2),
        availability: 'https://schema.org/InStock',
        itemCondition: p.condition && p.condition !== 'nieuw'
          ? 'https://schema.org/RefurbishedCondition'
          : 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: 'Schipper Compact Wonen BV' }
      }
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: rawText || desc,
    image: (p.images || []).map(im => `${DOMAIN}/${im.replace(/^\/+/, '')}`),
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers: offerObj
  };

  const specsEntries = Object.entries(p.specs || {});
  const mainContent = `<div class="page"><div class="wrap">
    <div class="crumbs"><a href="/">Home</a> / <a href="/cat/${gk}/">${esc(g.h1)}</a> / <a href="${sm.canonicalPath}">${esc(sm.h1)}</a> / ${esc(p.name)}</div>
    <div class="pd">
      <div class="gal">${p.images?.[0] ? `<div class="main"><img id="mainimg" src="${esc(p.images[0])}" alt="${esc(p.name)}"></div>` : ''}</div>
      <div class="info">
        <h1>${esc(p.name)}</h1>
        <div class="price big">${esc(formatEur(p.price))}</div>
        ${p.short ? `<div class="prose short">${p.short}</div>` : ''}
        ${p.features?.length ? `<ul class="feat">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        <div class="acts"><a class="btn" href="/advies-afspraak/">Proefzitten? Maak een afspraak</a><a class="btn ghost" href="tel:0786314858">Bel 078 - 631 4858</a></div>
      </div>
    </div>
    ${p.desc ? `<h2 class="t" style="margin-top:50px">Over ${esc(p.name)}</h2><div class="prose desc">${p.desc}</div>` : ''}
    ${specsEntries.length ? `<h2 class="t" style="margin-top:40px">Specificaties</h2><table class="spec">${specsEntries.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}</table>` : ''}
  </div></div>`;

  const html = buildPageHtml({
    title,
    description: desc,
    canonicalUrl: `${DOMAIN}${canonicalPath}`,
    ogImage: p.images?.[0] || 'assets/winkel_showroom_nieuw.jpg',
    jsonLd,
    mainContent
  });
  writeHtmlFile(canonicalPath, html);
  sitemapUrls.add(canonicalPath);
}

// 5. Core Static Pages (/informatie/, /contact/, /advies-afspraak/, /winkel/)
const corePages = [
  {
    path: '/informatie/',
    title: 'Over Ons & Bewegingstechnoloog Geertjan | Schipper Compact Wonen Dordrecht',
    h1: 'Persoonlijk Zit- en Zorgadvies door Bewegingstechnoloog',
    desc: 'Al ruim 35 jaar specialist in sta-op stoelen, seniorenstoelen en zorghulpmiddelen in Dordrecht. Medische én technische kennis voor 100% zitcomfort op maat.'
  },
  {
    path: '/contact/',
    title: 'Contact & Showroom Merwedestraat 239 Dordrecht | Schipper Compact Wonen',
    h1: 'Contact & Bezoek Onze Showroom in Dordrecht',
    desc: 'Bezoek onze drempelvrije showroom aan de Merwedestraat 239 in Dordrecht (gratis parkeren voor de deur) of bel 078 - 631 4858 voor een vrijblijvend thuisbezoek.'
  },
  {
    path: '/advies-afspraak/',
    title: 'Adviesafspraak Plannen (Showroom of Thuisbezoek) | Schipper Compact Wonen',
    h1: 'Plan uw vrijblijvende proefzit- of thuisafspraak',
    desc: 'Plan direct online uw afspraak in onze showroom in Dordrecht of bij u thuis. Onze bewegingstechnoloog neemt alle tijd om uw stoel exact op maat aan te meten.'
  },
  {
    path: '/winkel/',
    title: 'Complete Collectie Sta-op Stoelen, Seniorenstoelen & Bedden | Schipper Compact Wonen',
    h1: 'Complete Collectie (71 Modellen)',
    desc: 'Bekijk onze volledige collectie van 71 sta-op stoelen, senioren fauteuils, hoog-laag bedden, senioren ledikanten en rollators met transparante prijzen.'
  }
];

for (const cp of corePages) {
  const mainContent = `<div class="page"><div class="wrap">
    <div class="crumbs"><a href="/">Home</a> / ${esc(cp.h1)}</div>
    <h1>${esc(cp.h1)}</h1>
    <p class="sub">${esc(cp.desc)}</p>
    ${cp.path === '/winkel/' ? renderProductCardsStatic(all) : ''}
  </div></div>`;
  const html = buildPageHtml({
    title: cp.title,
    description: cp.desc,
    canonicalUrl: `${DOMAIN}${cp.path}`,
    ogImage: 'assets/winkel_showroom_nieuw.jpg',
    jsonLd: null,
    mainContent
  });
  writeHtmlFile(cp.path, html);
  sitemapUrls.add(cp.path);
}

// 6. Include /zithouding-check.html and all /lp/<slug>/ directories in sitemap.xml
sitemapUrls.add('/zithouding-check.html');
if (fs.existsSync('./lp')) {
  sitemapUrls.add('/lp/');
  for (const entry of fs.readdirSync('./lp', { withFileTypes: true })) {
    if (entry.isDirectory()) {
      sitemapUrls.add(`/lp/${entry.name}/`);
    }
  }
}

const today = new Date().toISOString().slice(0, 10);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...sitemapUrls].map(u => {
  const prio = u === '/' ? '1.0' : u.startsWith('/cat/') || u === '/zorgcomfort/' ? '0.9' : u.startsWith('/product/') ? '0.85' : '0.8';
  return `  <url>
    <loc>${DOMAIN}${u}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${prio}</priority>
  </url>`;
}).join('\n')}
</urlset>
`;
fs.writeFileSync('./sitemap.xml', sitemapXml, 'utf8');

console.log(`Generated ${sitemapUrls.size} static SEO URLs and updated sitemap.xml!`);
