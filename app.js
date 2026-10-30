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
const pSw=`<svg class="prod-sw" viewBox="0 0 320 20" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="pswG" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1f9d3f" stop-opacity=".18"/><stop offset="55%" stop-color="#34c759" stop-opacity=".45"/><stop offset="100%" stop-color="#f59e0b" stop-opacity=".55"/></linearGradient></defs><path class="psw-fill" d="M0,20 L0,11 C95,22 215,-1 320,11 L320,20 Z"/><path d="M0,11 C95,22 215,-1 320,11" fill="none" stroke="url(#pswG)" stroke-width="2.2"/></svg>`;
const prod=p=>{const tg=`${p.old?'<span class="tag sale"><img class="ti3d" src="icons/aanbieding.svg" alt=""><span>Aanbieding</span></span>':''}${p.condition&&p.condition!=='nieuw'?`<span class="tag rev"><img class="ti3d" src="icons/gereviseerd.svg" alt=""><span>${p.condition}</span></span>`:''}`;return `<article class="card prod reveal" tabindex="0" data-s="${p.slug}">${tg?`<div class="p-tags">${tg}</div>`:''}<div class="im"><img loading="lazy" src="${p.img}" alt="${p.name}"></div><div class="b">${pSw}<h3>${p.name}</h3><div class="pfoot">${p.price?`<div class="price">${p.old?`<s>${eur(p.old)}</s>`:''}${eur(p.price)}</div>`:'<div class="ask">Prijs op aanvraag</div>'}<span class="p-go" aria-hidden="true">${icons.arrow}</span></div></div></article>`;};
const swDefs=`<defs><linearGradient id="secSw" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1f9d3f" stop-opacity="0"/><stop offset="28%" stop-color="#1f9d3f" stop-opacity=".32"/><stop offset="68%" stop-color="#f59e0b" stop-opacity=".5"/><stop offset="100%" stop-color="#1f9d3f" stop-opacity="0"/></linearGradient></defs>`;
const swTop=`<svg class="sec-wave top" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">${swDefs}<path class="wave-bg" d="M0,0 L1440,0 L1440,22 C980,68 460,-14 0,42 Z"/><path d="M0,42 C460,-14 980,68 1440,22 L1440,30 C980,76 460,-6 0,49 Z" fill="url(#secSw)"/></svg>`;
const swBot=`<svg class="sec-wave bot" viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true">${swDefs}<path d="M0,26 C480,74 960,-12 1440,36 L1440,64 L0,64 Z" fill="rgba(31,157,63,.06)"/><path d="M0,34 C480,78 960,-6 1440,42 L1440,48 C960,2 480,84 0,40 Z" fill="url(#secSw)"/><path class="wave-bg" d="M0,39 C480,83 960,0 1440,46 L1440,65 L0,65 Z"/></svg>`;
const cta=`<section><div class="wrap"><div class="cta reveal"><svg class="cta-art" viewBox="0 0 1200 320" preserveAspectRatio="none" aria-hidden="true"><path d="M-60,280 C260,200 540,40 920,110 C1080,140 1160,70 1260,20 L1260,320 L-60,320 Z" fill="rgba(255,255,255,.07)"/><path d="M-40,300 C320,210 620,70 1020,150 C1140,174 1210,120 1260,80" fill="none" stroke="rgba(255,194,71,.38)" stroke-width="3"/></svg><img class="cicon" src="icon-afspraak.svg" alt=""><h2 class="t">Neem de tijd voor het kiezen</h2><p>Kom langs in onze showroom of laat ons bij u thuis adviseren.</p><a class="btn" href="#/afspraak">Afspraak maken</a></div></div></section>`;
const featured=[...products['zitcomfort_sta-op-stoelen']].filter(p=>p.price&&p.condition==='nieuw').slice(0,2).concat([...products['zitcomfort_sta-op-stoelen']].filter(p=>p.condition&&p.condition!=='nieuw').slice(0,2),products['zitcomfort_seniorenstoelen'].slice(0,1),products['ligcomfort_hooglaag-bedden'].slice(0,1),products['ligcomfort_senioren-ledikanten'].slice(0,1),products['zorgcomfort_loophulpmiddelen'].slice(0,1));
const checklistSec=`<section class="alt" id="checklist">${swTop}<div class="wrap lead-grid">
 <div class="doc-card card reveal">
  <div class="doc-top"><span><b>PDF Gids</b> · Uitgave 2026</span><span>Schipper Zorgadvies</span></div>
  <span class="tag lg">Zelftest in 3 Minuten</span>
  <h3>De Ergonomische Zithouding Checklist</h3>
  <p class="ask">Herken de 5 meest voorkomende zitfouten en voorkom chronische rug-, nek- en heupklachten.</p>
  <ul class="feat doc-list">
   <li><b>Zithoogte:</b> Rusten uw voeten plat op de vloer zonder druk in de knieholte?</li>
   <li><b>Zitdiepte:</b> Past er een vuist tussen uw knieholte en de voorzijde van de zitting?</li>
   <li><b>Lendensteun:</b> Wordt uw onderrug actief ondersteund bij ontspannen zitten?</li>
   <li><b>Opstaan:</b> Kunt u zelfstandig opstaan zonder pijnlijke schouders of knieën?</li>
  </ul>
  <div class="doc-foot"><span>Samengesteld door bewegingstechnologen</span><b class="tag">100% Gratis PDF</b></div>
 </div>
 <div class="reveal">
  <span class="tag lg">Directe PDF Download</span>
  <h2 class="t" style="margin-top:8px">Zit u wel echt goed? Doe binnen 3 minuten de check.</h2>
  <p class="prose">Een verkeerde zithouding kan sluipenderwijs leiden tot rug-, nek- en heupklachten of vermoeidheid bij het opstaan. Download onze gratis <b>‘Zithouding Checklist’ (PDF)</b> en ontdek direct of uw huidige stoel uw lichaam voldoende ondersteunt.</p>
  <form id="cl-form" class="card cl-form">
   <div class="cl-row">
    <label><span>Uw voornaam *</span><input type="text" id="cl-name" required placeholder="Bijv. Geert"></label>
    <label><span>Uw e-mailadres *</span><input type="email" id="cl-email" required placeholder="naam@voorbeeld.nl"></label>
   </div>
   <button type="submit" class="btn"><i class="tic">${icons.download}</i>Download de PDF Checklist (1.2 MB)</button>
   <small class="ask"><i class="tic">${icons.lock}</i>Geen spam. Direct op uw scherm te openen en op te slaan.</small>
  </form>
  <div id="cl-done" class="card cl-done" hidden><i class="tic">${icons.check2}</i><b>Bedankt!</b> De checklist download is direct gestart. <a href="assets/zithouding-checklist.pdf" download="Schipper-Zithouding-Checklist.pdf">Klik hier om de PDF nogmaals te openen</a>.</div>
 </div>
</div>${swBot}</section>`;

const showroomSec=`<section id="showroom"><div class="wrap"><div class="sr-spot card reveal">
 <div class="sr-spot-img">
  <img src="assets/winkel_interieur.jpg" alt="Sfeervolle showroom van Schipper Compact Wonen in Dordrecht met sta-op stoelen en adviesbalie" loading="lazy">
  <span class="sr-badge"><i class="tic">${icons.pin}</i>Merwedestraat 239, Dordrecht</span>
 </div>
 <div class="sr-spot-body">
  <span class="tag lg">Welkom in onze showroom</span>
  <h2 class="t" style="margin-top:8px">Kom ontspannen proefzitten in Dordrecht</h2>
  <p class="prose">In onze sfeervolle showroom aan de Merwedestraat ervaart u in alle rust het verschil van een ergonomisch aangemeten sta-op stoel of zorgbed. Geen opdringerige verkooppraatjes, maar een warm welkom met verse koffie en eerlijk deskundig advies van onze bewegingstechnoloog.</p>
  <ul class="feat">
   <li>Ruim 40 demonstratiestoelen en zorgbedden direct uitproberen</li>
   <li>Gratis parkeren voor de deur &amp; gelijkvloerse entree</li>
   <li>Persoonlijk meetadvies van bewegingstechnoloog Geertjan</li>
  </ul>
  <div class="acts" style="margin-top:18px">
   <a class="btn" href="#/afspraak">Plan adviesgesprek</a>
   <a class="btn ghost" href="#/contact">Route &amp; openingstijden</a>
  </div>
 </div>
</div></div></section>`;

const geertjanSec=`<section class="alt" id="ervaringen">${swTop}<div class="wrap">
 <div class="gj-grid reveal">
  <div class="gj-photo">
   <img src="assets/geertjan_advies_showroom.jpg" alt="Geertjan Klein Haneveld, bewegingstechnoloog, adviseert een klant met ergonomisch meetadvies" loading="lazy">
   <span class="gj-pill"><i></i>Geertjan Klein Haneveld • Bewegingstechnoloog</span>
  </div>
  <div class="gj-copy">
   <span class="tag lg">Uw vaste specialist</span>
   <blockquote class="gj-quote">“Als bewegingstechnoloog heb ik zowel medische als technische kennis. Ik begrijp de lichamelijke uitdaging én weet wat er technisch gewenst is. Mijn passie is om obstakels uit de weg te ruimen en mensen weer mobieler en zelfstandiger te maken.”</blockquote>
   <p class="prose">Iedereen wil oud worden, maar niemand wil het zijn. Met de jaren komen de nodige gebreken en bewegen wordt moeizamer. Wij leveren al ruim 35 jaar ergonomische zitoplossingen, seniorenbedden en zorghulpmiddelen voor zorgverzekeraars, zorginstellingen en particulieren. In Dordrecht en de omliggende regio noemt men ons daarom niet voor niets dé ‘zit- en zorgspecialist’.</p>
   <div class="gj-sig"><b>Geertjan Klein Haneveld</b><small>Bewegingstechnoloog &amp; Adviseur • Schipper Compact Wonen</small></div>
  </div>
 </div>
 <h2 class="t" style="margin-top:56px">Wat klanten vertellen</h2>
 <p class="sub">Ervaringen van klanten uit Dordrecht, Papendrecht, Sliedrecht en omgeving.</p>
 <div class="grid g3">
  ${[
   ['Wat een verademing vergeleken met de reguliere meubelgiganten. Geertjan kwam keurig op tijd aan huis voor het advies en een vakkundige meting. Geen seconde gepusht om te kopen. De stoel werd binnen een week geleverd en perfect afgesteld. Mijn man kan na zijn heupoperatie eindelijk weer zelfstandig uit zijn stoel!','Mevr. M. van Vliet','Regio Dordrecht • Fitform 570 Vario'],
   ['We zochten een mooie stoel die niet direct als ‘ziekenhuisstoel’ oogt in onze gerenoveerde woonkamer. De deskundigheid viel meteen op: binnen 10 minuten legde de adviseur uit waarom mijn vorige stoel rugpijn gaf. De bekleding matcht perfect met ons interieur.','Dhr. en Mw. De Jong','Regio Papendrecht • Maatwerk Relaxfauteuil'],
   ['We hebben gekozen voor een gereconditioneerde Fitform occasion. De stoel is letterlijk niet van nieuw te onderscheiden, rook fris en werkt vlekkeloos. Binnen 4 dagen bezorgd en de bezorger heeft de tijd genomen om alles aan mijn vader uit te leggen.','Dhr. H. Bakker','Regio Sliedrecht • Jong Gebruikte Occasion']
  ].map(([q,n,m])=>`<div class="card reveal"><div class="stars">${icons.star.repeat(5)}</div><p>“${q}”</p><br><b>${n}</b><small class="ask" style="display:block;margin-top:2px">${m}</small></div>`).join('')}
 </div>
</div>${swBot}</section>`;

const werkwijzeSec=`<section id="werkwijze"><div class="wrap"><h2 class="t">Al ruim 35 jaar uw vertrouwde zit- en zorgspecialist</h2><p class="sub">Van persoonlijk meetadvies tot vakkundige levering en service bij u thuis.</p><div class="steps">
 ${[
  ['Ergonomisch maatwerk','Onze bewegingstechnoloog heeft zowel medische als technische kennis. Wij kijken naar uw lichamelijke uitdaging en meten uw zithoogte, zitdiepte, armleggerhoogte en lendensteun exact na.',['Zitdiepte','Zithoogte','Armleggerhoogte','Lendensteun']],
  ['Gratis advies aan huis','Moeite met reizen of wilt u in uw eigen vertrouwde woonkamer advies? Onze bewegingstechnoloog komt kosteloos en vrijblijvend bij u thuis langs voor een persoonlijk zitadvies op maat.',['Dordrecht · Zwijndrecht · Papendrecht · Sliedrecht','Alblasserdam · Ridderkerk · Barendrecht · Rotterdam']],
  ['Eigen bezorg- & servicedienst','Van advies tot levering: wij bezorgen zelf, stellen de stoel vakkundig af in uw woonkamer en nemen uw oude stoel indien gewenst direct mee.',['Eigen bezorgers','Geen voorrijkosten','Oude stoel retour']]
 ].map(([t,d,tags],i)=>`<div class="card step reveal"><span>${i+1}</span><h3>${t}</h3><p>${d}</p><div class="stags">${tags.map(x=>`<i>${x}</i>`).join('')}</div></div>`).join('')}
</div></div></section>`;

const views={
home:()=>`<section class="hero"><div class="wrap"><div><h1>De specialist in sta-op stoelen en zorghulpmiddelen</h1>
<p>Al ruim 35 jaar leveren wij aan zorgverzekeraars, zorginstellingen en particulieren. Persoonlijk advies van een ervaren bewegingstechnoloog — bij u thuis of in onze showroom in Dordrecht.</p>
<a class="btn" href="#/afspraak">Afspraak maken</a><a class="btn ghost" href="#/cat/zitcomfort_sta-op-stoelen">Bekijk assortiment</a>
<div class="stats"><div><b>35+</b><span>jaar ervaring</span></div><div><b>1 jaar</b><span>garantie op occasions</span></div><div><b>Op maat</b><span>advies & thuisbezoek</span></div></div></div>
<div class="sl" role="region" aria-roledescription="carrousel" aria-label="Onze producten in een gezellig interieur"><div class="sl-track">${slides.map((s,i)=>{const p=bySlug[s.slug]||{};return `<a class="sl-slide${i?'':' on'}" href="#/product/${s.slug}" aria-label="${p.name||''}" ${i?'tabindex="-1"':''}><img src="${i<2?s.img:'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='}" data-src="${s.img}" alt="${p.name||''} in een gezellig interieur"><span class="sl-cap"><em>${names[p.cat]||''}</em><b>${p.name||''}</b><small>${p.price?'Vanaf '+eur(p.price.toFixed(2)):'Prijs op aanvraag'} · Bekijk <i class="tic">${icons.arrow}</i></small></span></a>`}).join('')}</div>
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
<section><div class="wrap"><h2 class="t">Onze productgroepen</h2><p class="sub">Alles voor zit-, lig- en zorgcomfort onder één dak in Dordrecht.</p><div class="grid g3">
${Object.entries(groups).map(([k,g])=>`<a class="card reveal" href="#/cat/${k}"><div class="ico">${g.i}</div><h3>${g.t}</h3><p>${g.d}</p></a>`).join('')}</div></div></section>
<section class="alt">${swTop}<div class="wrap split"><div class="reveal"><h2 class="t">Sta op stoel op maat</h2><p class="prose">Net zoals bij schoenen of een maatkostuum passen wij een stoel helemaal aan op uw persoonlijke maten en wensen. Kom ons <a href="#/cat/zitcomfort_sta-op-stoelen">ruime assortiment</a> bekijken en proberen, of laat ons u thuis bezoeken.</p><a class="btn" href="#/informatie">Meer informatie</a></div>
<div class="card reveal"><div class="ico">${icons.recycle}</div><h3>Occasion sta-op stoelen</h3><p>Onze tweedehands sta-op stoelen zijn altijd gereinigd en gereviseerd, met standaard 1 jaar garantie.</p><br><a class="btn ghost" href="#/cat/zitcomfort_sta-op-stoelen">Bekijk occasions <i class="tic">${icons.arrow}</i></a></div></div>${swBot}</section>
<section><div class="wrap"><h2 class="t">Een greep uit ons assortiment</h2><p class="sub">Een selectie van onze populairste producten uit alle categorieën.</p><div class="grid g4">${featured.map(prod).join('')}</div><div style="margin-top:28px;text-align:center"><a class="btn ghost" href="#/cat/all">Bekijk alle ${all.length} modellen in de collectie <i class="tic">${icons.arrow}</i></a></div></div></section>
${checklistSec}
${werkwijzeSec}
${geertjanSec}
${showroomSec}
<section><div class="wrap"><h2 class="t">Veelgestelde vragen</h2><p class="sub">Antwoord op de meest gestelde vragen over onze werkwijze.</p><div class="prose">
${[['Kan ik een stoel eerst proberen?','Zeker, in onze showroom aan de Merwedestraat 239 in Dordrecht staan ruim 40 modellen klaar. Ook thuis kunnen we u vrijblijvend adviseren.'],['Zijn jullie een webwinkel?','Nee. Wij werken uitsluitend met persoonlijk maatwerkadvies: u wordt geholpen door onze ervaren bewegingstechnoloog Geertjan Klein Haneveld.'],['Hebben jullie tweedehands stoelen?','Ja, wij hebben een ruime collectie jong gebruikte Fitform en Farstrup occasions — altijd professioneel gereinigd, technisch gereviseerd en geleverd met 1 jaar garantie.'],['Wordt een stoel of zorgbed vergoed?','Dat hangt af van uw zorgverzekeraar, gemeente (Wmo) en medische situatie. Wij begeleiden u graag bij het aanvragen van een vergoeding of PGB.']].map(([q,a])=>`<details class="faq reveal"><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section>${cta}`,

informatie:()=>`<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / Informatie</div><h1>Over Schipper Compact Wonen</h1>
<div class="gj-grid" style="margin-top:24px">
 <div class="prose">
  <p>Wij leveren al ruim 35 jaar sta-op stoelen, hoog/laag bedden en zorghulpmiddelen voor onder andere zorgverzekeraars, zorginstellingen en particulieren in Dordrecht, de Drechtsteden en Rijnmond. Men noemt ons in de regio ook wel dé <b>‘zit- en zorgspecialist’</b>.</p>
  <p>Iedereen wil oud worden maar niemand wil het zijn. Met ouder worden komen de nodige gebreken. Onze passie is om met ergonomisch aangemeten producten deze gebreken te ontkrachten en u zo lang mogelijk zelfstandig en comfortabel thuis te laten wonen.</p>
  <p>Wij zijn geen webwinkel: u bent van harte welkom in onze showroom aan de Merwedestraat 239 in Dordrecht. U wordt niet geholpen door een ‘snelle verkoper’, maar door ervaren bewegingstechnoloog <b>Geertjan Klein Haneveld</b>.</p>
  <p>Goed zitten is een vaak onderschatte factor die bijdraagt aan uw gezondheid. Wij ontvangen u graag met verse koffie in Dordrecht of bezoeken u kosteloos thuis als dat makkelijker is.</p>
  <div class="acts" style="margin-top:20px"><a class="btn" href="#/afspraak">Plan een adviesafspraak</a><a class="btn ghost" href="nieuwe-zaak.html">De Nieuwe Zaak (Storyboard) <i class="tic">${icons.ext}</i></a></div>
 </div>
 <div class="gj-photo">
  <img src="assets/geert_in_de_winkel_welkom.jpg" alt="Geertjan Klein Haneveld heet u welkom in de showroom van Schipper Compact Wonen in Dordrecht" loading="lazy">
  <span class="gj-pill"><i></i>Geertjan Klein Haneveld • Bewegingstechnoloog</span>
 </div>
</div></div></div>${werkwijzeSec}${checklistSec}${showroomSec}`,

contact:()=>`<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / Contact</div><h1>Contact &amp; Showroom Dordrecht</h1><div class="split">
<div class="card">
 <h3>Schipper Compact Wonen BV</h3>
 <p><b>Bezoekadres showroom:</b><br>Merwedestraat 239<br>3313 GT Dordrecht <small>(gratis parkeren voor de deur)</small></p>
 <p style="margin-top:14px"><b>Contactgegevens:</b><br>Tel: <a href="tel:0786314858"><b>078 – 631 4858</b></a><br>Mail: <a href="mailto:info@schippercompactwonen.nl">info@schippercompactwonen.nl</a></p>
 <p style="margin-top:14px"><b>Openingstijden showroom:</b><br>Di t/m Vr: 10:00 – 16:00 uur<br>Ma &amp; Za: Op afspraak (ook thuisbezoek mogelijk)</p>
 <p class="ask" style="margin-top:14px">KvK: 24391284 · BTW: NL815610427B01</p>
 <div class="acts" style="margin-top:18px">
  <a class="btn" href="#/afspraak">Plan een afspraak</a>
  <a class="btn ghost" href="https://www.google.com/maps/dir/?api=1&destination=Merwedestraat+239,+3313+GT+Dordrecht" target="_blank" rel="noopener"><i class="tic">${icons.route}</i>Plan route in Google Maps</a>
 </div>
</div>
<div>
 <iframe title="Google Maps - Schipper Compact Wonen BV, Merwedestraat 239, 3313 GT Dordrecht" style="width:100%;height:340px;border:0;border-radius:16px;box-shadow:var(--sh)" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen src="https://www.google.com/maps?q=Schipper+Compact+Wonen+BV,+Merwedestraat+239,+3313+GT+Dordrecht&hl=nl&z=16&output=embed"></iframe>
 <div class="grid" style="grid-template-columns:1fr 1fr;gap:14px;margin-top:14px">
  <img src="assets/winkel_interieur.jpg" alt="Interieur showroom Dordrecht" style="border-radius:12px;height:140px;width:100%;object-fit:cover;cursor:pointer" data-open-showroom="1">
  <img src="assets/winkel_showroom_nieuw.jpg" alt="Voorgevel en parkeren Merwedestraat 239 Dordrecht" style="border-radius:12px;height:140px;width:100%;object-fit:cover;cursor:pointer" data-open-showroom="1">
 </div>
</div></div></div></div>`,

afspraak:s=>afspraakHtml(s&&bySlug[s]?bySlug[s].name:''),

cat:k=>{
 const isAll=!k||k==='all';
 const g=groups[k];
 const items=isAll?all:g?g.subs.flatMap(s=>products[s].map(p=>({...p,cat:s}))):(products[k]||[]).map(p=>({...p,cat:k}));
 if(!isAll&&!g&&!products[k])return views.nf();
 const gk=!isAll&&!g?k.split('_')[0]:k;
 const grp=g||(!isAll&&groups[gk]);
 const title=isAll?'Complete Collectie':g?g.t:names[k];
 const desc=isAll?`Ontdek onze actuele collectie van ${all.length} modellen verdeeld over zitcomfort, ligcomfort en zorgcomfort — vrijblijvend uit te proberen in onze showroom in Dordrecht of bij u thuis.`:g?g.d:'Neem gerust contact op voor persoonlijk maatwerkadvies en actuele uitvoeringen.';
 const brands=[...new Set(items.map(x=>all.find(a=>a.slug===x.slug)?.brand).filter(Boolean))].sort();
 return `<div class="page"><div class="wrap">
  <div class="crumbs"><a href="#/">Home</a>${!isAll&&!g?` / <a href="#/cat/${gk}">${groups[gk].t}</a>`:''} / ${title}</div>
  <h1>${title}</h1><p class="sub">${desc}</p>
  <div class="fpanel card">
   <div class="fp-top">
    <div class="cat-tabs">
     <a class="ctab${isAll?' on':''}" href="#/cat/all">Alle producten <span>${all.length}</span></a>
     ${Object.entries(groups).map(([gk2,gr])=>{const cnt=gr.subs.reduce((n,s)=>n+products[s].length,0);return `<a class="ctab${k===gk2||(!isAll&&!g&&gk===gk2)?' on':''}" href="#/cat/${gk2}">${gr.t} <span>${cnt}</span></a>`}).join('')}
    </div>
    <span class="fp-count" id="f-count">${items.length} modellen getoond</span>
   </div>
   ${grp?`<div class="sub-pills"><span class="fp-sublbl">Subcategorie:</span><a class="spill${g?' on':''}" href="#/cat/${gk}">Alles in ${grp.t} <b>${grp.subs.reduce((n,s)=>n+products[s].length,0)}</b></a>${grp.subs.map(s=>`<a class="spill${k===s?' on':''}" href="#/cat/${s}">${names[s]} <b>${products[s].length}</b></a>`).join('')}</div>`:''}
   <div class="fbar">
    <label class="f-field f-search"><span>Zoeken</span><div class="f-in"><i class="tic">${icons.search}</i><input id="q" type="search" placeholder="Model, merk of trefwoord…"></div></label>
    <label class="f-field"><span>Conditie</span><select id="f-cond" aria-label="Filter op conditie"><option value="">Alle condities</option><option value="nieuw">Nieuw op maat</option><option value="occasion">Occasion / Gereviseerd</option></select></label>
    ${brands.length?`<label class="f-field"><span>Merk</span><select id="f-brand" aria-label="Filter op merk"><option value="">Alle merken (${brands.length})</option>${brands.map(b=>`<option value="${b}">${b}</option>`).join('')}</select></label>`:''}
    <label class="f-field"><span>Sortering</span><select id="f-sort" aria-label="Sorteer op"><option value="default">Aanbevolen</option><option value="price-asc">Prijs: laag naar hoog</option><option value="price-desc">Prijs: hoog naar laag</option><option value="name">Naam: A t/m Z</option></select></label>
   </div>
  </div>
  <div class="grid g4" id="pl">${items.map(p=>prod({name:p.name,slug:p.slug,img:p.img||(p.images&&p.images[0])||'',price:p.price?(typeof p.price==='number'?p.price.toFixed(2):p.price):'',old:p.old?(typeof p.old==='number'?p.old.toFixed(2):p.old):'',condition:p.condition})).join('')}</div>
 </div></div>${cta}`},
product:s=>{const p=bySlug[s];if(!p)return views.nf();const g=Object.keys(groups).find(k=>p.cat.startsWith(k));
 const rel=all.filter(x=>x.cat===p.cat&&x.slug!==p.slug).slice(0,4).map(x=>({name:x.name,slug:x.slug,img:x.images[0]||'',price:x.price?x.price.toFixed(2):'',old:x.old?x.old.toFixed(2):'',condition:x.condition}));
 const sp=Object.entries(p.specs||{});
 return `<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / <a href="#/cat/${g}">${groups[g].t}</a> / <a href="#/cat/${p.cat}">${names[p.cat]}</a> / ${p.name}</div>
 <div class="pd"><div class="gal">${p.images.length?`<div class="main"><img id="mainimg" src="${p.images[0]}" alt="${p.name}"></div><div class="thumbs">${p.images.slice(0,8).map(i=>`<img loading="lazy" src="${i}" alt="">`).join('')}</div>`:'<div class="main"><div class="ask">Foto op aanvraag</div></div>'}</div>
 <div class="info"><div class="pd-tags">${p.old?'<span class="tag lg sale"><img class="ti3d" src="icons/aanbieding.svg" alt=""><span>Aanbieding</span></span>':''}${p.condition==='nieuw'?'<span class="tag lg new"><img class="ti3d" src="icons/nieuw.svg" alt=""><span>Nieuw</span></span>':`<span class="tag lg rev"><img class="ti3d" src="icons/gereviseerd.svg" alt=""><span>${p.condition}</span></span>`}${p.brand?`<span class="tag lg alt">${p.brand}</span>`:''}</div><h1>${p.name}</h1>
 ${p.price?`<div class="price big">${p.old?`<s>${eur(p.old.toFixed(2))}</s>`:''}${eur(p.price.toFixed(2))}</div><small class="ask">Prijs kan per uitvoering en bekleding verschillen</small>`:'<div class="ask big">Prijs op aanvraag</div>'}
 ${p.short?`<div class="prose short">${p.short}</div>`:''}
 ${p.features&&p.features.length?`<ul class="feat">${p.features.map(f=>`<li>${f}</li>`).join('')}</ul>`:''}
 <div class="acts"><a class="btn" href="#/afspraak/${p.slug}">Proefzitten? Maak een afspraak</a><a class="btn ghost" href="tel:0786314858">Bel 078 - 631 4858</a></div>
 <p class="ask">Liever persoonlijk advies? Wij komen ook bij u thuis.</p></div></div>
 ${p.desc?`<h2 class="t" style="margin-top:50px">Over deze ${p.cat.includes('stoel')?'stoel':'uitvoering'}</h2><div class="prose desc">${p.desc}</div>`:''}
 ${sp.length?`<h2 class="t" style="margin-top:40px">Specificaties</h2><table class="spec">${sp.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>`:''}
 ${rel.length?`<h2 class="t" style="margin-top:60px">Meer in ${names[p.cat]}</h2><div class="grid g4">${rel.map(prod).join('')}</div>`:''}</div></div>`},
nf:()=>`<div class="page"><div class="wrap"><h1>Pagina niet gevonden</h1><a class="btn" href="#/">Naar home</a></div></div>`};
function initFilters(){
 const pl=$('#pl'),q=$('#q'),fc=$('#f-cond'),fb=$('#f-brand'),fs=$('#f-sort'),cnt=$('#f-count');
 if(!pl||!q)return;
 const cards=[...pl.querySelectorAll('.prod')];
 const run=()=>{
  const qv=(q.value||'').toLowerCase().trim(),cv=fc?fc.value:'',bv=fb?fb.value:'',sv=fs?fs.value:'default';
  let vis=[];
  cards.forEach(c=>{
   const p=bySlug[c.dataset.s]||{};
   const isOcc=(p.condition||'').toLowerCase()&&p.condition.toLowerCase()!=='nieuw';
   const okQ=!qv||(p.name||'').toLowerCase().includes(qv)||(p.brand||'').toLowerCase().includes(qv)||(p.short||'').toLowerCase().includes(qv);
   const okC=!cv||(cv==='nieuw'?!isOcc:isOcc);
   const okB=!bv||p.brand===bv;
   const show=okQ&&okC&&okB;
   c.style.display=show?'':'none';
   if(show)vis.push({c,p});
  });
  if(sv!=='default'){
   vis.sort((a,b)=>sv==='name'?(a.p.name||'').localeCompare(b.p.name||''):sv==='price-asc'?((a.p.price||999999)-(b.p.price||999999)):((b.p.price||0)-(a.p.price||0)));
   vis.forEach(x=>pl.appendChild(x.c));
  }else cards.forEach(c=>pl.appendChild(c));
  if(cnt)cnt.textContent=`${vis.length} ${vis.length===1?'model':'modellen'} getoond`;
 };
 [q,fc,fb,fs].filter(Boolean).forEach(el=>{el.oninput=run;el.onchange=run});
}
function initChecklist(){
 const f=$('#cl-form'),d=$('#cl-done');if(!f)return;
 f.onsubmit=e=>{
  e.preventDefault();
  if(d)d.hidden=false;f.style.opacity='.6';
  const a=document.createElement('a');a.href='assets/zithouding-checklist.pdf';a.download='Schipper-Zithouding-Checklist.pdf';document.body.appendChild(a);a.click();a.remove();
 };
}
function route(){setTimeout(()=>document.querySelectorAll('a.nl').forEach(l=>l.classList.toggle('on',l.getAttribute('href')===(location.hash||'#/')||(location.hash.startsWith(l.getAttribute('href'))&&l.getAttribute('href').length>3&&l.getAttribute('href')!=='#/'))));const [,r,a]=location.hash.split('/');const v=views[r||'home'];app.innerHTML=(v?v(a):views.nf());
 $('#nav').classList.remove('open');scrollTo(0,0);document.title=(r&&r!=='home'?'':'')+'Schipper Compact Wonen';
 initFilters();initChecklist();initAfspraak();initSlider();
 const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&(x.target.classList.add('in'),io.unobserve(x.target))),{threshold:.1});
 document.querySelectorAll('.reveal').forEach(el=>io.observe(el))}
addEventListener('hashchange',route);route();
$('#y').textContent=new Date().getFullYear();
console.log('%c Schipper Compact Wonen • v1.4.5 ','background:#1f9d3f;color:#fff;font-weight:700;padding:4px 8px;border-radius:4px');
$('.burger').onclick=e=>{const o=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
const root=document.documentElement,th=localStorage.theme||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');root.dataset.theme=th;
$('.theme').onclick=()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';localStorage.theme=root.dataset.theme};

app.addEventListener('click',e=>{const c=e.target.closest('.prod');if(c)location.hash='#/product/'+c.dataset.s;const t=e.target.closest('.thumbs img');if(t)$('#mainimg').src=t.src});
app.addEventListener('keydown',e=>{if(e.key==='Enter'){const c=e.target.closest('.prod');if(c)location.hash='#/product/'+c.dataset.s}});
const up=document.createElement('button');up.className='up';up.textContent='↑';up.setAttribute('aria-label','Naar boven');up.onclick=()=>scrollTo({top:0,behavior:'smooth'});document.body.append(up);
addEventListener('scroll',()=>up.classList.toggle('show',scrollY>500));
document.querySelectorAll('[data-i]').forEach(e=>e.innerHTML=icons[e.dataset.i]);

// Showroom modal & afspraakknoppen
const srModal=$('#showroom-modal');
document.addEventListener('click',e=>{
 if(e.target.closest('[data-open-showroom]')){
  if(srModal){const m=$('#sr-map');if(m&&!m.src)m.src=m.dataset.src;srModal.hidden=false;document.body.style.overflow='hidden'}
  return;
 }
 if(e.target.closest('[data-close-showroom]')){
  if(srModal){srModal.hidden=true;document.body.style.overflow=''}
 }
 const pbtn=e.target.closest('[data-sr-photo]');
 if(pbtn){
  const t=pbtn.dataset.srPhoto,im=$('#sr-img');
  if(im)im.src=t==='interieur'?'assets/winkel_interieur.jpg':'assets/winkel_showroom_nieuw.jpg';
  document.querySelectorAll('[data-sr-photo]').forEach(b=>b.classList.toggle('on',b===pbtn));
  return;
 }
 const l=e.target.closest('a[href^="#/afspraak"]');if(!l||l.closest('.ap-modal'))return;
 const s=l.getAttribute('href').split('/')[2];e.preventDefault();openAfspraakModal(s&&bySlug[s]?bySlug[s].name:'');
});
addEventListener('keydown',e=>{if(e.key==='Escape'&&srModal&&!srModal.hidden){srModal.hidden=true;document.body.style.overflow=''}});
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

// Dubbelklik op het sta-op stoel logo laat de stoel dansen
const danceTimers=new WeakMap();
function triggerChairDance(img){
 if(!img)return;
 img.classList.remove('chair-dancing');
 void img.offsetWidth;
 img.src='logo-modern-dance.svg';
 img.classList.add('chair-dancing');
 clearTimeout(danceTimers.get(img));
 danceTimers.set(img,setTimeout(()=>{
  img.classList.remove('chair-dancing');
  img.src='logo-modern.svg';
 },3200));
}
document.querySelectorAll('.mark,.flogo').forEach(el=>el.title='Dubbelklik om de stoel te laten dansen');
let logoClickTimer=null;
const headerLogo=$('.header .logo');
if(headerLogo){
 headerLogo.addEventListener('click',e=>{
  if(e.target.closest('.mark')){
   e.preventDefault();
   if(e.detail===1){
    clearTimeout(logoClickTimer);
    logoClickTimer=setTimeout(()=>{if(location.hash&&location.hash!=='#/')location.hash='#/'},230);
   }
  }
 });
}
document.addEventListener('dblclick',e=>{
 const directImg=e.target.closest('img[src*="logo-modern"]');
 const logoWrap=e.target.closest('.logo,.flogo,.ico');
 const targetImg=directImg||(logoWrap&&logoWrap.querySelector('img[src*="logo-modern"]'));
 if(targetImg){
  e.preventDefault();
  clearTimeout(logoClickTimer);
  triggerChairDance(targetImg);
 }
});
