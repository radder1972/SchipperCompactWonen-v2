import {icons} from './icons.js';
import {afspraakHtml,initAfspraak,openAfspraakModal} from './afspraak.js';
import {products,all,bySlug} from './products.js';
import {slides} from './slides.js';
const $=s=>document.querySelector(s), app=$('#app');
const groups={
 zitcomfort:{t:'Zitcomfort',i:'<img class="gi" src="logo-modern.svg" alt="">',d:'Goed zitten is een vaak onderschatte factor voor uw gezondheid. Sta-op stoelen en seniorenstoelen op maat.',subs:['zitcomfort_sta-op-stoelen','zitcomfort_seniorenstoelen']},
 ligcomfort:{t:'Ligcomfort',i:'<img class="gi" src="icon-bed.svg" alt="">',d:'Senioren ledikanten, hoog/laag bedden en bed toebehoren voor een goede nachtrust.',subs:['ligcomfort_senioren-ledikanten','ligcomfort_hooglaag-bedden','ligcomfort_bed-toebehoren']},
 zorgcomfort:{t:'Zorgcomfort',i:'<img class="gi" src="icon-looprek.svg" alt="">',d:'Loophulpmiddelen en trapliften voor zelfstandigheid en veiligheid in en om het huis.',subs:['zorgcomfort_loophulpmiddelen','zorgcomfort_trapliften']}};
const names={'zitcomfort_sta-op-stoelen':'Sta op stoelen','zitcomfort_seniorenstoelen':'Seniorenstoelen','ligcomfort_senioren-ledikanten':'Senioren ledikanten','ligcomfort_hooglaag-bedden':'Hoog/laag bedden','ligcomfort_bed-toebehoren':'Bed toebehoren','zorgcomfort_loophulpmiddelen':'Loophulpmiddelen','zorgcomfort_trapliften':'Trapliften'};
const eur=p=>'€ '+Number(p.replace(/,/g,'')).toLocaleString('nl-NL',{minimumFractionDigits:2});
const prod=p=>`<article class="card prod reveal" tabindex="0" data-s="${p.slug}">${p.old?'<span class="badge">Aanbieding</span>':''}<div class="im"><img loading="lazy" src="${p.img}" alt="${p.name}"></div><div class="b">${p.condition&&p.condition!=='nieuw'?`<span class="tag">${p.condition}</span>`:''}<h3>${p.name}</h3>${p.price?`<div class="price">${p.old?`<s>${eur(p.old)}</s>`:''}${eur(p.price)}</div>`:'<div class="ask">Prijs op aanvraag</div>'}</div></article>`;
const swDefs=`<defs><linearGradient id="secSw" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1f9d3f" stop-opacity="0"/><stop offset="28%" stop-color="#1f9d3f" stop-opacity=".32"/><stop offset="68%" stop-color="#f59e0b" stop-opacity=".5"/><stop offset="100%" stop-color="#1f9d3f" stop-opacity="0"/></linearGradient></defs>`;
const swTop=`<svg class="sec-wave top" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">${swDefs}<path class="wave-bg" d="M0,0 L1440,0 L1440,22 C980,68 460,-14 0,42 Z"/><path d="M0,42 C460,-14 980,68 1440,22 L1440,30 C980,76 460,-6 0,49 Z" fill="url(#secSw)"/></svg>`;
const swBot=`<svg class="sec-wave bot" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">${swDefs}<path d="M0,26 C480,74 960,-12 1440,36 L1440,64 L0,64 Z" fill="rgba(31,157,63,.06)"/><path d="M0,34 C480,78 960,-6 1440,42 L1440,48 C960,2 480,84 0,40 Z" fill="url(#secSw)"/><path class="wave-bg" d="M0,39 C480,83 960,0 1440,46 L1440,65 L0,65 Z"/></svg>`;
const cta=`<section><div class="wrap"><div class="cta reveal"><svg class="cta-art" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true"><path d="M-60,280 C260,200 540,40 920,110 C1080,140 1160,70 1260,20 L1260,320 L-60,320 Z" fill="rgba(255,255,255,.07)"/><path d="M-40,300 C320,210 620,70 1020,150 C1140,174 1210,120 1260,80" fill="none" stroke="rgba(255,194,71,.38)" stroke-width="3"/></svg><img class="cicon" src="icon-afspraak.svg" alt=""><h2 class="t">Neem de tijd voor het kiezen</h2><p>Kom langs in onze showroom of laat ons bij u thuis adviseren.</p><a class="btn" href="#/afspraak">Afspraak maken</a></div></div></section>`;
const featured=[...products['zitcomfort_sta-op-stoelen']].filter(p=>p.price).slice(0,4).concat(products['zitcomfort_seniorenstoelen'].slice(0,1),products['ligcomfort_hooglaag-bedden'].slice(0,1),products['ligcomfort_senioren-ledikanten'].slice(0,1),products['zorgcomfort_loophulpmiddelen'].slice(0,1));
const views={
home:()=>`<section class="hero"><div class="wrap"><div><h1>De specialist in sta-op stoelen en zorghulpmiddelen</h1>
<p>Al ruim 35 jaar leveren wij aan zorgverzekeraars, zorginstellingen en particulieren. Persoonlijk advies van een ervaren bewegingstechnoloog.</p>
<a class="btn" href="#/afspraak">Afspraak maken</a><a class="btn ghost" href="#/cat/zitcomfort_sta-op-stoelen">Bekijk assortiment</a>
<div class="stats"><div><b>35+</b><span>jaar ervaring</span></div><div><b>1 jaar</b><span>garantie op occasions</span></div><div><b>Op maat</b><span>advies & thuisbezoek</span></div></div></div>
<div class="sl" role="region" aria-roledescription="carrousel" aria-label="Onze producten in een gezellig interieur"><div class="sl-track">${slides.map((s,i)=>{const p=bySlug[s.slug]||{};return `<a class="sl-slide${i?'':' on'}" href="#/product/${s.slug}" aria-label="${p.name||''}" ${i?'tabindex="-1"':''}><img src="${i<2?s.img:'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}" data-src="${s.img}" alt="${p.name||''} in een gezellig interieur"><span class="sl-cap"><em>${names[p.cat]||''}</em><b>${p.name||''}</b><small>${p.price?'Vanaf '+eur(p.price.toFixed(2)):'Prijs op aanvraag'} · Bekijk <i>→</i></small></span></a>`}).join('')}</div>
<button class="sl-nav sl-prev" aria-label="Vorige foto"></button><button class="sl-nav sl-next" aria-label="Volgende foto"></button>
<div class="sl-dots">${slides.map((s,i)=>`<button class="${i?'':'on'}" aria-label="Foto ${i+1}"></button>`).join('')}</div><div class="sl-bar"><i></i></div></div></div>
<svg class="hero-art" viewBox="0 0 1440 560" preserveAspectRatio="none" aria-hidden="true">
 <defs>
  <linearGradient id="hrib1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#fff" stop-opacity="0"/><stop offset="45%" stop-color="#a7f3bd" stop-opacity=".14"/><stop offset="100%" stop-color="#fff" stop-opacity=".04"/></linearGradient>
  <linearGradient id="hrib2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffc247" stop-opacity="0"/><stop offset="50%" stop-color="#ffc247" stop-opacity=".28"/><stop offset="100%" stop-color="#34c759" stop-opacity="0"/></linearGradient>
 </defs>
 <path d="M-120,460 C260,380 520,120 960,180 C1220,215 1360,90 1560,40 L1560,560 L-120,560 Z" fill="url(#hrib1)"/>
 <path d="M-80,500 C320,390 640,150 1080,230 C1280,266 1410,170 1540,110" fill="none" stroke="url(#hrib2)" stroke-width="3.5"/>
 <path d="M120,560 C480,430 790,240 1220,290 C1360,306 1450,250 1540,200" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
</svg>
<svg class="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
 <defs>
  <linearGradient id="goldSw" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0"/><stop offset="28%" stop-color="#ffc247" stop-opacity=".85"/><stop offset="68%" stop-color="#f59e0b" stop-opacity=".65"/><stop offset="100%" stop-color="#ffc247" stop-opacity="0"/></linearGradient>
 </defs>
 <path d="M0,36 C340,124 780,-24 1440,52 L1440,120 L0,120 Z" fill="rgba(255,255,255,.11)"/>
 <path d="M0,66 C380,136 860,-4 1440,70 L1440,79 C860,10 380,146 0,74 Z" fill="url(#goldSw)"/>
 <path class="wave-bg" d="M0,73 C380,143 860,8 1440,78 L1440,122 L0,122 Z"/>
</svg></section>
<section><div class="wrap"><h2 class="t">Onze productgroepen</h2><p class="sub">Alles voor zit-, lig- en zorgcomfort onder één dak.</p><div class="grid g3">
${Object.entries(groups).map(([k,g])=>`<a class="card reveal" href="#/cat/${k}"><div class="ico">${g.i}</div><h3>${g.t}</h3><p>${g.d}</p></a>`).join('')}</div></div></section>
<section class="alt">${swTop}<div class="wrap split"><div class="reveal"><h2 class="t">Sta op stoel op maat</h2><p class="prose">Net zoals bij schoenen of een maatkostuum passen wij een stoel helemaal aan op uw persoonlijke maten en wensen. Kom ons <a href="#/cat/zitcomfort_sta-op-stoelen">ruime assortiment</a> bekijken en proberen, of laat ons u thuis bezoeken.</p><a class="btn" href="#/informatie">Meer informatie</a></div>
<div class="card reveal"><div class="ico">${icons.recycle}</div><h3>Occasion sta-op stoelen</h3><p>Onze tweedehands sta-op stoelen zijn altijd gereinigd en gereviseerd, met standaard 1 jaar garantie.</p><br><a class="btn ghost" href="https://www.staopstoelen.nl/product-categorie/occasion-sta-op-stoelen/" target="_blank" rel="noopener">Bekijk occasions ↗</a></div></div>${swBot}</section>
<section><div class="wrap"><h2 class="t">Een greep uit ons assortiment</h2><p class="sub">Een selectie van onze populairste producten.</p><div class="grid g4">${featured.map(prod).join('')}</div></div></section>
<section class="alt">${swTop}<div class="wrap"><h2 class="t">Waarom Schipper?</h2><p class="sub">Persoonlijk, deskundig en met aandacht voor uw situatie.</p><div class="grid g4">
${[[icons.doctor,'Bewegingstechnoloog','Advies van een ervaren specialist, geen snelle verkoper.'],[icons.ruler,'Altijd op maat','Stoelen aangepast aan uw maten en wensen.'],[icons.home,'Thuisbezoek','Liever thuis proberen? Wij komen langs.'],[icons.shield,'Garantie','Gereviseerde occasions met 1 jaar garantie.']].map(([i,t,d])=>`<div class="card reveal"><div class="ico">${i}</div><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div>${swBot}</section>
<section><div class="wrap"><h2 class="t">Zo werkt het</h2><p class="sub">In drie stappen naar de juiste stoel.</p><div class="steps">
${[['Maak een afspraak','Bel ons of plan online een adviesgesprek.'],['Proefzitten','Probeer verschillende modellen in de showroom of thuis.'],['Op maat geleverd','Wij leveren, stellen af en leggen alles uit.']].map(([t,d],i)=>`<div class="step reveal"><span>${i+1}</span><h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></section>
<section class="alt">${swTop}<div class="wrap"><h2 class="t">Wat klanten zeggen</h2><p class="sub">Ervaringen van klanten uit Dordrecht en omgeving.</p><div class="grid g3">
${[['Fijne stoel en heel prettig advies. We zijn er echt goed geholpen.','Familie de Jong'],['Eindelijk zit mijn moeder comfortabel. Alles werd thuis netjes afgesteld.','Mevr. Visser'],['Snelle levering en deskundig personeel. Aanrader!','Zorginstelling Merwede']].map(([q,n])=>`<div class="card reveal"><div class="stars">★★★★★</div><p>“${q}”</p><br><b>${n}</b></div>`).join('')}</div></div>${swBot}</section>
<section><div class="wrap"><h2 class="t">Veelgestelde vragen</h2><p class="sub">Antwoord op de meest gestelde vragen over onze werkwijze.</p><div class="prose">
${[['Kan ik een stoel eerst proberen?','Zeker, in onze showroom in Dordrecht. Ook thuis kunnen we u adviseren.'],['Zijn jullie een webwinkel?','Nee. Wij werken persoonlijk: u wordt geholpen door een ervaren bewegingstechnoloog.'],['Hebben jullie tweedehands stoelen?','Ja, gereinigd en gereviseerd, met 1 jaar garantie.'],['Wordt een stoel vergoed?','Dat hangt af van uw verzekeraar en situatie. Wij denken graag met u mee.']].map(([q,a])=>`<details class="faq reveal"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section>${cta}`,
informatie:()=>`<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / Informatie</div><h1>Informatie</h1><div class="prose">
<p>Wij leveren al ruim 35 jaar sta-op stoelen en zorghulpmiddelen voor onder andere zorgverzekeraars, zorginstellingen en particulieren. Men noemt ons in de regio ook wel ‘zit-specialist’ en ‘sta op stoel specialist’.</p>
<p>Iedereen wil oud worden maar niemand wil het zijn. Met ouder worden komen de nodige gebreken. Onze passie is om met onze producten deze gebreken te ontkrachten.</p>
<p>Wij zijn geen webwinkel: u bent van harte welkom in onze showroom. U wordt niet geholpen door een ‘snelle verkoper’ maar door een ervaren bewegingstechnoloog.</p>
<p>Goed zitten is een vaak onderschatte factor die bijdraagt aan uw gezondheid. Wij kunnen u ook thuis bezoeken als dat makkelijker is.</p><a class="btn" href="#/afspraak">Afspraak maken</a></div></div></div>`,
contact:()=>`<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / Contact</div><h1>Contact</h1><div class="split"><div class="card"><h3>Schipper Compact Wonen BV</h3><p>Merwedestraat 239<br>3313 GT Dordrecht<br><br>Tel: <a href="tel:0786314858">078 – 631 4858</a><br>Mail: <a href="mailto:info@schippercompactwonen.nl">info@schippercompactwonen.nl</a></p><br><a class="btn ghost" href="https://www.google.com/maps/dir/?api=1&destination=Merwedestraat+239,+3313+GT+Dordrecht" target="_blank" rel="noopener">Plan route in Google Maps ↗</a></div>
<iframe title="Google Maps - Schipper Compact Wonen BV, Merwedestraat 239, 3313 GT Dordrecht" style="width:100%;height:340px;border:0;border-radius:16px" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="https://www.google.com/maps?q=Schipper+Compact+Wonen+BV,+Merwedestraat+239,+3313+GT+Dordrecht&hl=nl&z=16&output=embed"></iframe></div></div></div>`,
afspraak:s=>afspraakHtml(s&&bySlug[s]?bySlug[s].name:''),
cat:k=>{const g=groups[k];
 if(g)return `<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / ${g.t}</div><h1>${g.t}</h1><p class="sub">${g.d}</p>${g.subs.map(s=>`<h2 class="t" style="margin-top:40px"><a href="#/cat/${s}">${names[s]}</a></h2><div class="grid g4">${products[s].map(prod).join('')}</div>`).join('')}</div></div>`;
 if(!products[k])return views.nf();const gk=k.split('_')[0];
 return `<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / <a href="#/cat/${gk}">${groups[gk].t}</a> / ${names[k]}</div><h1>${names[k]}</h1><p class="sub">Neem gerust contact op voor advies en prijzen.</p><input id="q" type="search" placeholder="Zoek in deze categorie…" style="width:100%;max-width:360px;margin-bottom:24px"><div class="grid g4" id="pl">${products[k].map(prod).join('')}</div></div></div>`},
product:s=>{const p=bySlug[s];if(!p)return views.nf();const g=Object.keys(groups).find(k=>p.cat.startsWith(k));
 const rel=all.filter(x=>x.cat===p.cat&&x.slug!==p.slug).slice(0,4).map(x=>({name:x.name,slug:x.slug,img:x.images[0]||'',price:x.price?x.price.toFixed(2):'',old:x.old?x.old.toFixed(2):'',condition:x.condition}));
 const sp=Object.entries(p.specs||{});
 return `<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / <a href="#/cat/${g}">${groups[g].t}</a> / <a href="#/cat/${p.cat}">${names[p.cat]}</a> / ${p.name}</div>
 <div class="pd"><div class="gal">${p.images.length?`<div class="main"><img id="mainimg" src="${p.images[0]}" alt="${p.name}"></div><div class="thumbs">${p.images.slice(0,8).map(i=>`<img loading="lazy" src="${i}" alt="">`).join('')}</div>`:'<div class="main"><div class="ask">Foto op aanvraag</div></div>'}</div>
 <div class="info"><span class="tag lg">${p.condition==='nieuw'?'Nieuw':p.condition}</span>${p.brand?` <span class="tag lg alt">${p.brand}</span>`:''}<h1>${p.name}</h1>
 ${p.price?`<div class="price big">${p.old?`<s>${eur(p.old.toFixed(2))}</s>`:''}${eur(p.price.toFixed(2))}</div><small class="ask">Prijs kan per uitvoering en bekleding verschillen</small>`:'<div class="ask big">Prijs op aanvraag</div>'}
 ${p.short?`<div class="prose short">${p.short}</div>`:''}
 ${p.features&&p.features.length?`<ul class="feat">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>`:''}
 <div class="acts"><a class="btn" href="#/afspraak/${p.slug}">Proefzitten? Maak een afspraak</a><a class="btn ghost" href="tel:0786314858">Bel 078 - 631 4858</a></div>
 <p class="ask">Liever persoonlijk advies? Wij komen ook bij u thuis.</p></div></div>
 ${p.desc?`<h2 class="t" style="margin-top:50px">Over deze ${p.cat.includes('stoel')?'stoel':'uitvoering'}</h2><div class="prose desc">${p.desc}</div>`:''}
 ${sp.length?`<h2 class="t" style="margin-top:40px">Specificaties</h2><table class="spec">${sp.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`:''}
 ${rel.length?`<h2 class="t" style="margin-top:60px">Meer in ${names[p.cat]}</h2><div class="grid g4">${rel.map(prod).join('')}</div>`:''}</div></div>`},
nf:()=>`<div class="page"><div class="wrap"><h1>Pagina niet gevonden</h1><a class="btn" href="#/">Naar home</a></div></div>`};
function route(){setTimeout(()=>document.querySelectorAll('a.nl').forEach(l=>l.classList.toggle('on',l.getAttribute('href')===(location.hash||'#/')||(location.hash.startsWith(l.getAttribute('href'))&&l.getAttribute('href').length>3&&l.getAttribute('href')!=='#/'))));const [,r,a]=location.hash.split('/');const v=views[r||'home'];app.innerHTML=(v?v(a):views.nf());
 $('#nav').classList.remove('open');scrollTo(0,0);document.title=(r&&r!=='home'?'':'')+'Schipper Compact Wonen';
 const q=$('#q');if(q)q.oninput=()=>document.querySelectorAll('#pl .prod').forEach(c=>c.style.display=c.querySelector('h3').textContent.toLowerCase().includes(q.value.toLowerCase())?'':'none');
 initAfspraak();initSlider();
 const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.1});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el))}
addEventListener('hashchange',route);route();
$('#y').textContent=new Date().getFullYear();
console.log('%c Schipper Compact Wonen • v1.2.0 ','background:#1f9d3f;color:#fff;font-weight:700;padding:4px 8px;border-radius:4px');
$('.burger').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
const root=document.documentElement,th=localStorage.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');root.dataset.theme=th;
$('.theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.theme=root.dataset.theme};

app.addEventListener('click',e=>{const c=e.target.closest('.prod');if(c)location.hash='#/product/'+c.dataset.s;const t=e.target.closest('.thumbs img');if(t)$('#mainimg').src=t.src});
app.addEventListener('keydown',e=>{if(e.key==='Enter'){const c=e.target.closest('.prod');if(c)location.hash='#/product/'+c.dataset.s}});
const up=document.createElement('button');up.className='up';up.textContent='↑';up.setAttribute('aria-label','Naar boven');up.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.append(up);
addEventListener('scroll',()=>up.classList.toggle('show',scrollY>500));
document.querySelectorAll('[data-i]').forEach(e=>e.innerHTML=icons[e.dataset.i]);

// Afspraakknoppen openen de snelle "Bel mij"-pop-up; de agenda staat op #/afspraak
document.addEventListener('click',e=>{const l=e.target.closest('a[href^="#/afspraak"]');if(!l||l.closest('.ap-modal'))return;
 const s=l.getAttribute('href').split('/')[2];e.preventDefault();openAfspraakModal(s&&bySlug[s]?bySlug[s].name:'')});
window.__slugFor=n=>(all.find(p=>p.name===n)||{}).slug||'';

function initSlider(){const sl=document.querySelector('.sl');if(!sl)return;
 const S=[...sl.querySelectorAll('.sl-slide')],D=[...sl.querySelectorAll('.sl-dots button')],bar=sl.querySelector('.sl-bar i');let i=0,t,paused=false;const T=5500;
 const loadImg=idx=>{const im=S[(idx+S.length)%S.length]?.querySelector('img');if(im&&im.dataset.src&&im.src!==im.dataset.src)im.src=im.dataset.src};
 const go=n=>{S[i].classList.remove('on');S[i].tabIndex=-1;D[i].classList.remove('on');i=(n+S.length)%S.length;loadImg(i);loadImg(i+1);S[i].classList.add('on');S[i].tabIndex=0;D[i].classList.add('on');restart()};
 const restart=()=>{clearTimeout(t);bar.style.animation='none';void bar.offsetWidth;if(!paused&&!matchMedia('(prefers-reduced-motion:reduce)').matches){bar.style.animation=`slbar ${T}ms linear forwards`;t=setTimeout(()=>go(i+1),T)}};
 sl.querySelector('.sl-prev').onclick=()=>go(i-1);sl.querySelector('.sl-next').onclick=()=>go(i+1);D.forEach((d,n)=>d.onclick=()=>go(n));
 sl.onmouseenter=()=>{paused=true;clearTimeout(t);bar.style.animationPlayState='paused'};sl.onmouseleave=()=>{paused=false;restart()};
 sl.addEventListener('focusin',()=>{paused=true;clearTimeout(t)});sl.addEventListener('focusout',()=>{paused=false;restart()});
 let x0=null;sl.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});sl.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));x0=null});
 sl.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(i-1);if(e.key==='ArrowRight')go(i+1)});
 restart()}
