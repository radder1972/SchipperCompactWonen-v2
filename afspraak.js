import {config as C} from './config.js';
import {icons} from './icons.js';
const $=s=>document.querySelector(s);
const st={mode:'callback',type:'showroom',month:new Date(),date:null,slot:null,chair:''};
const pad=n=>String(n).padStart(2,'0');
const ymd=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);

export function afspraakHtml(chairName=''){
 st.chair=chairName;st.mode='callback';st.type='showroom';st.date=null;st.slot=null;st.month=new Date();
 return `<div class="page"><div class="wrap"><div class="crumbs"><a href="#/">Home</a> / Advies afspraak</div>
 <div class="aficon"><img src="icon-afspraak.svg" alt=""><h1>Plan uw adviesafspraak</h1></div>
 <p class="sub">Showroom Dordrecht · Persoonlijk advies van een ervaren bewegingstechnoloog. ${chairName?`<br><b>Gekozen product: ${chairName}</b>`:''}</p>
 <div class="ap-choice" role="tablist" aria-label="Kies afspraakmethode">
  <button type="button" class="ap-tab active" data-mode="callback" role="tab"><b>Bel mij terug</b><small>Laat uw nummer achter, wij bellen u</small></button>
  <button type="button" class="ap-tab" data-mode="agenda" role="tab"><b>Kies zelf een moment</b><small>Selecteer datum en tijd in de agenda</small></button>
 </div>
 <p class="ask ap-loc"><i class="tic">${icons.pin}</i>${C.showroom}<span class="ap-sep"></span><i class="tic">${icons.phone}</i><a href="tel:${C.phone.replace(/\D/g,'')}">${C.phone}</a></p>
 <div id="ap-callback" class="ap-panel card">${callbackForm()}</div>
 <div id="ap-agenda" class="ap-panel card" hidden>${agendaForm()}</div>
 <div id="ap-done" class="card ap-done" hidden></div></div></div>`}

const field=(id,label,attrs='',req=true)=>`<label class="ap-f" for="${id}"><span>${label}${req?' <em>*</em>':''}</span><input id="${id}" ${attrs}><small class="ap-err" id="${id}-e"></small></label>`;
const callbackForm=()=>`<form id="qf" novalidate>${st.chair?`<div class="ap-tag">Gekozen product: ${st.chair}</div>`:''}
 ${field('qn','Uw naam','autocomplete="name"')}${field('qp','Uw telefoonnummer','type="tel" autocomplete="tel" inputmode="tel"')}
 <button class="btn" id="qs">Bel mij voor een afspraak</button><p class="ask">Uw gegevens worden alleen gebruikt voor deze afspraak.</p></form>`;
const agendaForm=()=>`<form id="af" novalidate>
 <div class="ap-types"><label class="ap-type selected" data-type="showroom"><input type="radio" name="t" checked><b>Showroombezoek</b><small>Merwedestraat 239, Dordrecht</small></label>
 <label class="ap-type" data-type="home"><input type="radio" name="t"><b>Passing aan huis</b><small>Wij komen bij u langs (16:00 – 20:00)</small></label></div>
 <div class="ap-cal"><div class="ap-calh"><button type="button" id="pm" aria-label="Vorige maand">‹</button><b id="mn"></b><button type="button" id="nm" aria-label="Volgende maand">›</button></div><div id="cd" class="ap-days"></div></div>
 <p class="ask">Gekozen datum: <b id="sd">Geen datum geselecteerd</b></p><div id="ts" class="ap-slots"></div><small class="ap-err" id="slot-e"></small>
 <div class="ap-two">${field('an','Naam','autocomplete="name"')}${field('ap','Telefoonnummer','type="tel" autocomplete="tel" inputmode="tel"')}</div>
 ${field('ae','E-mailadres','type="email" autocomplete="email"')}
 <div id="ha" hidden><div class="ap-two">${field('apc','Postcode','autocomplete="postal-code" placeholder="1234 AB"',false)}${field('ahn','Huisnummer','autocomplete="address-line2"',false)}</div>${field('aa','Adres','autocomplete="street-address"',false)}<small class="ap-fb" id="afb"></small></div>
 <label class="ap-f" for="ano"><span>Opmerkingen</span><textarea id="ano" rows="3" placeholder="Bijvoorbeeld welke stoel u wilt proberen">${st.chair?`Ik wil deze stoel graag uitproberen tijdens mijn afspraak: ${st.chair}.`:''}</textarea></label>
 <button class="btn" id="as">Afspraak aanvragen</button></form>`;

function drawCal(){
 const y=st.month.getFullYear(),m=st.month.getMonth();$('#mn').textContent=cap(st.month.toLocaleString('nl-NL',{month:'long',year:'numeric'}));
 const g=$('#cd');g.innerHTML=['Ma','Di','Wo','Do','Vr','Za','Zo'].map(d=>`<span class="ap-dl">${d}</span>`).join('');
 let off=new Date(y,m,1).getDay();off=(off===0?7:off)-1;g.insertAdjacentHTML('beforeend','<i></i>'.repeat(off));
 const t=new Date();const min=new Date(t.getFullYear(),t.getMonth(),t.getDate()+C.minDaysAhead);
 for(let d=1;d<=new Date(y,m+1,0).getDate();d++){const dt=new Date(y,m,d),b=document.createElement('button');b.type='button';b.textContent=d;b.className='ap-d';
  if(dt<min||C.closedWeekdays.includes(dt.getDay()))b.disabled=true;
  if(st.date&&dt.toDateString()===st.date.toDateString())b.classList.add('selected');
  b.onclick=()=>{st.date=dt;st.slot=null;$('#sd').textContent=dt.toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long'});drawCal();drawSlots()};g.append(b)}
}
function drawSlots(){
 const box=$('#ts');if(!st.date){box.innerHTML='<p class="ask">Selecteer eerst een datum.</p>';return}
 const slots=C.slots[st.type],sat=st.date.getDay()===6;
 const draw=busy=>{box.innerHTML='';slots.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='ap-s';b.textContent=s;
  const closed=sat&&i>=C.saturdayOpenSlots[st.type];const full=busy&&busy.includes(s);
  if(closed||full){b.disabled=true;b.textContent=`${s} (${closed?'Gesloten':'Vol'})`}
  if(st.slot===s&&!b.disabled)b.classList.add('selected');
  b.onclick=()=>{st.slot=s;box.querySelectorAll('.ap-s').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');$('#slot-e').textContent=''};box.append(b)})};
 if(C.webhookUrl){box.innerHTML='<p class="ask">Tijden laden…</p>';
  fetch(`${C.webhookUrl}?date=${ymd(st.date)}`).then(r=>r.json()).then(d=>draw(Array.isArray(d.busySlots)?d.busySlots:null)).catch(()=>draw(null))}
 else draw(null)
}
const setErr=(id,t)=>{const e=$('#'+id+'-e');if(e)e.textContent=t||''};
const validPhone=p=>{const c=p.replace(/\s+/g,'');return c.startsWith('+31')?/^\+31\d{9}$/.test(c):/^\d{10}$/.test(c)};
async function send(payload,mailBody,subject){
 const mail=`mailto:${C.replyTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`;
 // 1. Probeer eerst onze eigen Serverless API route (/api/contact via Nodemailer + Google Calendar API)
 try{
  const apiRes=await fetch('/api/contact',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({
    voornaam:payload.name||'Klant',
    email:payload.email||'',
    datum:payload.startISO||payload.date||new Date().toISOString(),
    tijd:payload.timeSlot||'',
    telefoon:payload.phone||'',
    locatie:payload.address||C.showroom,
    opmerkingen:payload.notes||'',
    type:'afspraak'
   })
  });
  const apiData=await apiRes.json().catch(()=>({}));
  if(apiRes.ok&&apiData.success){
   send.viaApi=true;
   return true;
  }
 }catch{}
 // 2. Fallback naar C.webhookUrl of mailto wanneer .env variabelen nog niet geconfigureerd zijn
 if(!C.webhookUrl){location.href=mail;return true}
 const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),15000);
 return fetch(C.webhookUrl,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain'},body:JSON.stringify(payload),signal:ctl.signal})
  .then(()=>true).catch(()=>{send.mail=mail;return false}).finally(()=>clearTimeout(t));
}
const failHtml=()=>`<div class="ap-fail" role="alert"><b>Versturen is niet gelukt.</b> Controleer uw internetverbinding en probeer het opnieuw, of neem direct contact op:<br><i class="tic">${icons.phone}</i><a href="tel:${C.phone.replace(/\D/g,'')}">${C.phone}</a> · <a href="${send.mail||'#'}">stuur ons een e-mail</a></div>`;
function showFail(btn,label,host){btn.disabled=false;btn.textContent=label;let f=host.querySelector('.ap-fail');if(f)f.remove();btn.insertAdjacentHTML('beforebegin',failHtml())}
function done(html){$('#ap-callback').hidden=true;$('#ap-agenda').hidden=true;document.querySelector('.ap-choice').hidden=true;const d=$('#ap-done');d.hidden=false;d.innerHTML=html;scrollTo({top:0,behavior:'smooth'})}
const doneBox=(extra)=>`<div class="ico"><img class="gi" src="icons/bedankt.svg" alt=""></div><h2>Bedankt voor uw aanvraag!</h2>${extra}<p>Heeft u vragen? Bel gerust <a href="tel:${C.phone.replace(/\D/g,'')}">${C.phone}</a>.</p><a class="btn" href="#/">Terug naar home</a>`;

export function initAfspraak(){
 if(!$('#qf'))return;
 document.querySelectorAll('.ap-tab').forEach(t=>t.onclick=()=>{st.mode=t.dataset.mode;document.querySelectorAll('.ap-tab').forEach(x=>x.classList.toggle('active',x===t));
  $('#ap-callback').hidden=st.mode!=='callback';$('#ap-agenda').hidden=st.mode!=='agenda';if(st.mode==='agenda'){drawCal();drawSlots()}});
 $('#qf').onsubmit=e=>{e.preventDefault();setErr('qn');setErr('qp');const n=$('#qn').value.trim(),p=$('#qp').value.trim();
  if(!n){setErr('qn','Vul alstublieft uw naam in.');$('#qn').focus();return}
  if(p.replace(/\D/g,'').length<8){setErr('qp','Vul alstublieft een geldig telefoonnummer in (minimaal 8 cijfers).');$('#qp').focus();return}
  const notes=st.chair?`Klant wil gebeld worden voor proefzitten. Gekozen product: ${st.chair}`:'Klant wil gebeld worden om een adviesafspraak in te plannen.';
  const payload={brand:C.brand,site:C.site,type:'quick_appointment_call_me',appointmentType:'showroom',name:n,phone:p,email:`belmij@${C.site}`,replyTo:C.replyTo,notificationEmail:C.notificationEmail,notes,source:'Afspraakpagina (Bel mij)',pageUrl:location.href,timestamp:new Date().toISOString()};
  $('#qs').disabled=true;$('#qs').innerHTML='<span class="btn-spin" aria-hidden="true"></span>Versturen…';send(payload,`Naam: ${n}\nTelefoon: ${p}\n${notes}`,'Bel-mij verzoek adviesafspraak').then(ok=>ok?done(doneBox(`<p>Wij bellen u zo snel mogelijk op <b>${p}</b> om een afspraak in te plannen.</p>`)):showFail($('#qs'),'Bel mij voor een afspraak',$('#qf')))};
 const ha=$('#ha');
 document.querySelectorAll('.ap-type').forEach(l=>l.onclick=()=>{st.type=l.dataset.type;st.slot=null;document.querySelectorAll('.ap-type').forEach(x=>{x.classList.toggle('selected',x===l);x.querySelector('input').checked=x===l});
  ha.hidden=st.type!=='home';if(st.date&&C.closedWeekdays.includes(st.date.getDay())){st.date=null;$('#sd').textContent='Geen datum geselecteerd'}drawCal();drawSlots()});
 $('#pm').onclick=()=>{st.month=new Date(st.month.getFullYear(),st.month.getMonth()-1,1);drawCal()};
 $('#nm').onclick=()=>{st.month=new Date(st.month.getFullYear(),st.month.getMonth()+1,1);drawCal()};
 const look=async()=>{const pc=$('#apc').value.replace(/\s+/g,'').toUpperCase(),hn=$('#ahn').value.trim(),fb=$('#afb');
  if(/^[1-9][0-9]{3}[A-Z]{2}$/.test(pc)&&hn){fb.textContent='Adres zoeken…';try{const r=await fetch(`https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?fq=postcode:${pc}&fq=huisnummer:${encodeURIComponent(hn)}&rows=1`);const d=await r.json();const doc=d.response&&d.response.docs&&d.response.docs[0];
   if(doc){$('#aa').value=doc.weergavenaam;fb.innerHTML=`<i class="tic">${icons.check2}</i>Adres gevonden`;}else fb.textContent='Adres niet gevonden, vul het handmatig in.'}catch{fb.textContent='Zoeken mislukt, vul het adres handmatig in.'}}};
 $('#apc').onblur=look;$('#ahn').onblur=look;
 $('#af').onsubmit=e=>{e.preventDefault();['an','ap','ae','aa'].forEach(i=>setErr(i));setErr('slot','');
  if(!st.date||!st.slot){setErr('slot','Kies een datum en een tijdstip.');return}
  const n=$('#an').value.trim(),p=$('#ap').value.trim(),m=$('#ae').value.trim(),a=$('#aa').value.trim(),no=$('#ano').value.trim();
  if(!n){setErr('an','Vul uw naam in.');return}
  if(!p||!validPhone(p)){setErr('ap','Vul een geldig telefoonnummer in (10 cijfers, of +31 gevolgd door 9 cijfers).');return}
  if(!m||!m.includes('@')){setErr('ae','Vul een geldig e-mailadres in.');return}
  if(st.type==='home'&&!a){setErr('aa','Vul het adres in voor de passing aan huis.');return}
  const [s,en]=st.slot.split(' - ');const iso=t=>{const [h,mi]=t.split(':');const d=new Date(st.date.getFullYear(),st.date.getMonth(),st.date.getDate(),+h,+mi);const o=-d.getTimezoneOffset();return `${ymd(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:00${o>=0?'+':'-'}${pad(Math.floor(Math.abs(o)/60))}:${pad(Math.abs(o)%60)}`};
  const label=st.type==='home'?'Passing aan huis':'Showroombezoek Dordrecht',loc=st.type==='home'?a:C.showroom;
  const when=st.date.toLocaleDateString('nl-NL',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const emailHtml=`<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;max-width:600px;margin:0 auto;padding:24px 20px"><h2 style="color:#1f9d3f;margin:0 0 4px">${C.senderName}</h2><p style="margin:0 0 20px;color:#666">De specialist in sta-op stoelen en zorghulpmiddelen</p><p>Beste ${n},</p><p>Bedankt voor uw aanvraag. Uw afspraak staat bij ons genoteerd:</p><table style="border-collapse:collapse;font-size:14px"><tr><td style="padding:4px 14px 4px 0;color:#666">Type afspraak:</td><td><b>${label}</b></td></tr><tr><td style="padding:4px 14px 4px 0;color:#666">Datum:</td><td><b>${when}</b></td></tr><tr><td style="padding:4px 14px 4px 0;color:#666">Tijdstip:</td><td><b>${st.slot}</b></td></tr><tr><td style="padding:4px 14px 4px 0;color:#666">Locatie:</td><td>${loc}</td></tr><tr><td style="padding:4px 14px 4px 0;color:#666">Telefoon:</td><td>${p}</td></tr>${no&&no!=='-'?`<tr><td style="padding:4px 14px 4px 0;color:#666">Opmerkingen:</td><td>${no}</td></tr>`:''}</table><p>Wij nemen telefonisch contact met u op om de afspraak te bevestigen.</p>${st.type==='showroom'?`<p><b>Showroom:</b> ${C.showroom}. Gratis parkeren voor de deur.</p>`:''}<p>Met vriendelijke groet,<br><b>${C.senderName}</b><br>${C.phone} · <a href="mailto:${C.replyTo}">${C.replyTo}</a><br>${C.showroom}</p></div>`;
  const payload={brand:C.brand,site:C.site,name:n,phone:p,email:m,date:ymd(st.date),timeSlot:st.slot,startTime:s,endTime:en,startISO:iso(s),endISO:iso(en),appointmentType:st.type,address:loc,notes:no||'-',emailSubject:`Bevestiging van uw aanvraag voor een adviesgesprek - ${C.senderName}`,senderName:C.senderName,replyTo:C.replyTo,notificationEmail:C.notificationEmail,emailHtml,timestamp:new Date().toISOString()};
  $('#as').disabled=true;$('#as').innerHTML='<span class="btn-spin" aria-hidden="true"></span>Afspraak inplannen…';
  send(payload,`Type: ${label}\nDatum: ${when}\nTijd: ${st.slot}\nLocatie: ${loc}\nNaam: ${n}\nTelefoon: ${p}\nE-mail: ${m}\nOpmerkingen: ${no||'-'}`,`Afspraakaanvraag ${label} – ${n}`)
   .then(ok=>{if(!ok){showFail($('#as'),'Afspraak aanvragen',$('#af'));return}done(doneBox(`<table class="spec ap-sum"><tr><th>Type</th><td>${label}</td></tr><tr><th>Datum</th><td>${when}</td></tr><tr><th>Tijdstip</th><td>${st.slot}</td></tr><tr><th>Locatie</th><td>${loc}</td></tr></table>
   <p>Wij hebben uw afspraakaanvraag ontvangen en nemen telefonisch contact met u op om deze definitief te bevestigen.${send.viaApi||C.webhookUrl?` U ontvangt tevens een bevestiging op <b>${m}</b>.`:' <br><small class="ask">Er is een e-mail voor u klaargezet; verstuur die in uw mailprogramma om de aanvraag te voltooien.</small>'}</p>`))})};
}

export function openAfspraakModal(chair=''){
 document.querySelector('.ap-modal')?.remove();
 const m=document.createElement('div');m.className='ap-modal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-labelledby','apm-t');
 const slug=chair?(window.__slugFor?window.__slugFor(chair):''):'';
 m.innerHTML=`<div class="ap-mbox"><button class="ap-x" aria-label="Sluit venster">✕</button>
  <div class="ap-mh"><img src="icon-afspraak.svg" alt=""><div><h3 id="apm-t">Plan uw adviesafspraak</h3><p>Showroom Dordrecht · Persoonlijk advies</p></div></div>
  <div id="apm-body"><form id="mqf" novalidate>${chair?`<div class="ap-tag">Gekozen product: ${chair}</div>`:''}
  <p class="ask" style="margin:0 0 12px">Laat uw gegevens achter, dan bellen wij u om een afspraak in te plannen.</p>
  ${field('mqn','Uw naam','autocomplete="name"')}${field('mqp','Uw telefoonnummer','type="tel" autocomplete="tel" inputmode="tel"')}
  <button class="btn" id="mqs">Bel mij voor een afspraak</button>
  <p class="ask" style="margin:12px 0 0">Liever zelf een moment kiezen? <a href="#/afspraak${slug?'/'+slug:''}" id="mql">Plan in de agenda <i class="tic">${icons.arrow}</i></a></p>
  <p class="ask">Of bel direct: <a href="tel:${C.phone.replace(/\D/g,'')}">${C.phone}</a></p></form></div></div>`;
 document.body.append(m);document.body.style.overflow='hidden';
 const close=()=>{m.remove();document.body.style.overflow='';removeEventListener('keydown',esc)};const esc=e=>{if(e.key==='Escape')close()};addEventListener('keydown',esc);
 m.onclick=e=>{if(e.target===m||e.target.closest('.ap-x')||e.target.id==='mql')close()};
 setTimeout(()=>m.querySelector('#mqn').focus(),50);
 m.querySelector('#mqf').onsubmit=e=>{e.preventDefault();setErr('mqn');setErr('mqp');const n=m.querySelector('#mqn').value.trim(),p=m.querySelector('#mqp').value.trim();
  if(!n){setErr('mqn','Vul alstublieft uw naam in.');m.querySelector('#mqn').focus();return}
  if(p.replace(/\D/g,'').length<8){setErr('mqp','Vul alstublieft een geldig telefoonnummer in (minimaal 8 cijfers).');m.querySelector('#mqp').focus();return}
  const notes=chair?`Klant wil gebeld worden voor proefzitten. Gekozen product: ${chair}`:'Klant wil gebeld worden om een adviesafspraak in te plannen.';
  const payload={brand:C.brand,site:C.site,type:'quick_appointment_call_me',appointmentType:'showroom',name:n,phone:p,email:`belmij@${C.site}`,replyTo:C.replyTo,notificationEmail:C.notificationEmail,notes,source:'Afspraak-overlay (Bel mij)',pageUrl:location.href,timestamp:new Date().toISOString()};
  m.querySelector('#mqs').disabled=true;m.querySelector('#mqs').innerHTML='<span class="btn-spin" aria-hidden="true"></span>Versturen…';
  send(payload,`Naam: ${n}\nTelefoon: ${p}\n${notes}`,'Bel-mij verzoek adviesafspraak').then(ok=>{if(!ok){showFail(m.querySelector('#mqs'),'Bel mij voor een afspraak',m);return}m.querySelector('#apm-body').innerHTML=`<div class="ap-done" style="padding:10px 0"><div class="ico"><img class="gi" src="icons/bedankt.svg" alt=""></div><h3>Bedankt, ${n.split(' ')[0]}!</h3><p>Wij bellen u zo snel mogelijk op <b>${p}</b>.${send.viaApi||C.webhookUrl?'':'<br><small class="ask">Er is een e-mail klaargezet; verstuur die in uw mailprogramma om de aanvraag te voltooien.</small>'}</p><button class="btn" type="button" id="mqc">Sluiten</button></div>`;m.querySelector('#mqc').onclick=close})};
}
