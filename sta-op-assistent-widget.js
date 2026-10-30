/**
 * Sta-Op Stoel Interactieve Assistent Avatar & Launcher (voor staopstoelen.nl)
 * -----------------------------------------------------------------------------
 * Zelfstandige, herbruikbare module zonder externe afhankelijkheden.
 * Bevat 3 animatie-standen voor de interactieve assistent:
 *   - 'idle'    : Rustige voorwaartse sta-op beweging
 *   - 'talking' : Vriendelijk meeknikkend nekkussen + pulserende handbediening
 *   - 'dance'   : Vrolijke dans met heupwieg, vering en muzieknootjes (zonder 360°-draai)
 *
 * Gebruik in staopstoelen.nl:
 *   1. Als losse avatar in je bestaande assistent-header of chatballon:
 *      const avatar = createStaOpAssistantAvatar({ size: 64 });
 *      container.appendChild(avatar.el);
 *      avatar.dance();   // Laat de stoel dansen (bijv. bij advies-match of dubbelklik)
 *      avatar.talk(true); // Laat de stoel meeknikken tijdens typen/antwoorden
 *
 *   2. Of direct als zwevende assistent-knop rechtsonder:
 *      mountStaOpAssistantLauncher({ onOpen: () => openJouwAssistent() });
 */

export function getStaOpChairSVG(uid = 'soa') {
  return `<svg class="soa-chair-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 250" aria-hidden="true">
  <defs>
   <linearGradient id="${uid}-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fd67a"/><stop offset=".55" stop-color="#1f9d3f"/><stop offset="1" stop-color="#0d5a26"/></linearGradient>
   <linearGradient id="${uid}-a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#48cc68"/><stop offset="1" stop-color="#0e6b2e"/></linearGradient>
   <linearGradient id="${uid}-a2" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#0e6b2e"/><stop offset="1" stop-color="#48cc68"/></linearGradient>
   <linearGradient id="${uid}-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#96f2ab"/><stop offset=".45" stop-color="#48cc68"/><stop offset="1" stop-color="#147a32"/></linearGradient>
   <linearGradient id="${uid}-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#157a36"/><stop offset="1" stop-color="#063b17"/></linearGradient>
   <linearGradient id="${uid}-sw" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#e58a00"/><stop offset=".55" stop-color="#f59e0b"/><stop offset="1" stop-color="#ffd25a"/></linearGradient>
   <radialGradient id="${uid}-sh"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
   <clipPath id="${uid}-c"><path d="M68 38C68 18 88 10 120 10s52 8 52 28l6 116H62z"/></clipPath>
  </defs>
  <ellipse class="soa-shadow" cx="120" cy="239" rx="102" ry="9" fill="url(#${uid}-sh)"/>
  <g class="soa-base">
   <rect x="44" y="218" width="152" height="12" rx="6" fill="#063b17"/>
   <rect x="58" y="226" width="22" height="9" rx="4" fill="#04260e"/>
   <rect x="160" y="226" width="22" height="9" rx="4" fill="#04260e"/>
  </g>
  <g class="soa-wedge">
   <path d="M52 218L58 176L182 176L188 218Z" fill="url(#${uid}-f)"/>
   <path d="M66 208L174 208M68 194L172 194" stroke="#5fd67a" stroke-opacity=".38" stroke-width="2.5" stroke-linecap="round"/>
  </g>
  <g class="soa-back">
   <path d="M68 38C68 18 88 10 120 10s52 8 52 28l6 116H62z" fill="url(#${uid}-b)"/>
   <g clip-path="url(#${uid}-c)" stroke="#fff" stroke-opacity=".32" stroke-width="2.2" fill="none">
    <path d="M-50 14L50 140M50 14L-50 140"/><path d="M-30 14L70 140M70 14L-30 140"/><path d="M-10 14L90 140M90 14L-10 140"/>
    <path d="M10 14L110 140M110 14L10 140"/><path d="M30 14L130 140M130 14L30 140"/><path d="M50 14L150 140M150 14L50 140"/>
    <path d="M70 14L170 140M170 14L70 140"/><path d="M90 14L190 140M190 14L90 140"/><path d="M110 14L210 140M210 14L110 140"/>
    <path d="M130 14L230 140M230 14L130 140"/><path d="M150 14L250 140M250 14L150 140"/><path d="M170 14L270 140M270 14L170 140"/>
   </g>
   <g clip-path="url(#${uid}-c)" fill="#fff" fill-opacity=".85">
    <circle cx="100" cy="62" r="2.8"/><circle cx="140" cy="62" r="2.8"/><circle cx="120" cy="86" r="2.8"/>
    <circle cx="100" cy="110" r="2.8"/><circle cx="140" cy="110" r="2.8"/><circle cx="120" cy="132" r="2.8"/>
   </g>
   <g class="soa-head">
    <rect x="78" y="18" width="84" height="30" rx="14" fill="url(#${uid}-s)" stroke="#0d5a26" stroke-width="2"/>
    <path d="M88 24h64" stroke="#fff" stroke-opacity=".68" stroke-width="2.5" stroke-linecap="round"/>
   </g>
  </g>
  <g class="soa-seat">
   <path d="M60 138Q120 120 180 138L188 172H52z" fill="url(#${uid}-s)"/>
   <path d="M60 140Q120 124 180 140" fill="none" stroke="#fff" stroke-opacity=".72" stroke-width="3" stroke-linecap="round"/>
  </g>
  <g class="soa-frame">
   <rect x="24" y="92" width="44" height="114" rx="18" fill="url(#${uid}-a)"/>
   <rect x="172" y="92" width="44" height="114" rx="18" fill="url(#${uid}-a2)"/>
   <rect x="28" y="95" width="36" height="14" rx="7" fill="#fff" fill-opacity=".35"/>
   <rect x="176" y="95" width="36" height="14" rx="7" fill="#fff" fill-opacity=".28"/>
   <rect x="52" y="164" width="136" height="42" rx="14" fill="url(#${uid}-b)"/>
   <rect x="64" y="171" width="112" height="26" rx="9" fill="url(#${uid}-f)" fill-opacity=".45"/>
   <path d="M29 148h32v38a8 8 0 0 1-8 8H37a8 8 0 0 1-8-8z" fill="#0b4f21" fill-opacity=".55" stroke="#fff" stroke-opacity=".3" stroke-width="1.5"/>
   <rect x="36" y="132" width="18" height="28" rx="6" fill="#073816" stroke="#fff" stroke-width="1.8"/>
   <circle class="soa-btn1" cx="45" cy="141" r="2.8" fill="#ffc247"/>
   <circle class="soa-btn2" cx="45" cy="150" r="2.8" fill="#5fd67a"/>
  </g>
  <g class="soa-arrow">
   <path d="M48 184C98 198 164 168 198 86L211 92L205 54L173 75L185 80C154 146 96 172 48 184Z" fill="#000" opacity=".18" transform="translate(0 5)"/>
   <path d="M48 184C98 198 164 168 198 86L211 92L205 54L173 75L185 80C154 146 96 172 48 184Z" fill="url(#${uid}-sw)" stroke="#fff" stroke-width="3" stroke-linejoin="round" paint-order="stroke"/>
  </g>
  <g class="soa-notes">
   <g class="soa-n1">
    <circle cx="6" cy="18" r="5" fill="#f59e0b" stroke="#fff" stroke-width="1.5"/>
    <path d="M10 18V2l10 3v5l-10-3" fill="#f59e0b" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
   </g>
   <g class="soa-n2">
    <circle cx="5" cy="18" r="4.5" fill="#34c759" stroke="#fff" stroke-width="1.5"/>
    <circle cx="19" cy="15" r="4.5" fill="#34c759" stroke="#fff" stroke-width="1.5"/>
    <path d="M9 18V3l14-3v15" fill="none" stroke="#34c759" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
   </g>
  </g>
 </svg>`;
}

let stylesInjected = false;
export function injectStaOpAssistantStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  stylesInjected = true;
  const style = document.createElement('style');
  style.id = 'sta-op-assistant-styles';
  style.textContent = `
   .soa-avatar { display:inline-flex; align-items:center; justify-content:center; cursor:pointer; user-select:none; -webkit-user-select:none; position:relative; transform-origin:50% 80%; }
   .soa-avatar svg { width:100%; height:100%; display:block; overflow:visible; }
   .soa-wedge { transform-origin:120px 218px; animation:soaIdleWedge 5s cubic-bezier(.45,.05,.25,1) infinite; }
   .soa-frame { transform-origin:120px 180px; animation:soaIdleFrame 5s cubic-bezier(.45,.05,.25,1) infinite; }
   .soa-seat  { transform-origin:120px 172px; animation:soaIdleSeat 5s cubic-bezier(.45,.05,.25,1) infinite; }
   .soa-back  { transform-origin:120px 148px; animation:soaIdleBack 5s cubic-bezier(.45,.05,.25,1) infinite; }
   .soa-head  { transform-origin:120px 36px;  animation:soaIdleHead 5s cubic-bezier(.45,.05,.25,1) infinite; }
   .soa-arrow { transform-origin:120px 140px; animation:soaIdleArrow 5s cubic-bezier(.45,.05,.25,1) infinite; }
   .soa-notes { opacity:0; pointer-events:none; }

   /* Stand 1: Rustige voorwaartse Sta-Op beweging (Idle) */
   @keyframes soaIdleWedge { 0%,16%,92%,100%{transform:scaleY(.38)} 48%,68%{transform:scaleY(1.12)} }
   @keyframes soaIdleFrame { 0%,16%,92%,100%{transform:translateY(6px)} 48%,68%{transform:translateY(-12px)} }
   @keyframes soaIdleSeat  { 0%,16%,92%,100%{transform:translateY(6px) scaleY(.78)} 48%,68%{transform:translateY(-14px) scaleY(1.65)} }
   @keyframes soaIdleBack  { 0%,16%,92%,100%{transform:translateY(6px) scale(1,1)} 48%,68%{transform:translateY(-19px) scale(1.04,.86)} }
   @keyframes soaIdleHead  { 0%,16%,92%,100%{transform:translateY(0) scale(1)} 48%,68%{transform:translateY(5px) scale(1.05,1.08)} }
   @keyframes soaIdleArrow { 0%,16%,92%,100%{transform:translateY(4px) scale(.97)} 48%,68%{transform:translateY(-8px) scale(1.02)} }

   /* Stand 2: Spreek- / Advies-modus (Talking) */
   .soa-avatar.is-talking .soa-head { animation:soaTalkHead .55s ease-in-out infinite alternate; }
   .soa-avatar.is-talking .soa-btn1 { animation:soaDisco 0.4s steps(2,end) infinite; }
   @keyframes soaTalkHead { 0%{transform:translateY(0) scale(1)} 100%{transform:translateY(5px) scale(1.06,1.1)} }

   /* Stand 3: Dans-modus (zonder 360 draai, puur ritmisch dansen) */
   .soa-avatar.is-dancing { animation:soaBoogieOuter 3.2s cubic-bezier(.36,.07,.19,.97) both; }
   .soa-avatar.is-dancing .soa-wedge { animation:soaDanceWedge 3.2s cubic-bezier(.36,.07,.19,.97) infinite; }
   .soa-avatar.is-dancing .soa-frame { animation:soaDanceFrame 3.2s cubic-bezier(.36,.07,.19,.97) infinite; }
   .soa-avatar.is-dancing .soa-seat  { animation:soaDanceSeat  3.2s cubic-bezier(.36,.07,.19,.97) infinite; }
   .soa-avatar.is-dancing .soa-back  { animation:soaDanceBack  3.2s cubic-bezier(.36,.07,.19,.97) infinite; }
   .soa-avatar.is-dancing .soa-head  { animation:soaDanceHead  3.2s cubic-bezier(.36,.07,.19,.97) infinite; }
   .soa-avatar.is-dancing .soa-arrow { animation:soaDanceArrow 3.2s cubic-bezier(.36,.07,.19,.97) infinite; }
   .soa-avatar.is-dancing .soa-btn1  { animation:soaDisco 0.4s steps(2,end) infinite; }
   .soa-avatar.is-dancing .soa-notes { opacity:1; }
   .soa-avatar.is-dancing .soa-n1    { animation:soaNote1 1.6s ease-out infinite; }
   .soa-avatar.is-dancing .soa-n2    { animation:soaNote2 1.6s ease-out .45s infinite; }

   @keyframes soaBoogieOuter {
    0%,100%{transform:translate(0,0) scale(1,1)}
    10%{transform:translate(-5px,-6px) rotate(-6deg) scale(1.06,.95)}
    18%{transform:translate(0,3px) rotate(0deg) scale(1.08,.92)}
    28%{transform:translate(5px,-6px) rotate(6deg) scale(1.06,.95)}
    36%{transform:translate(0,3px) rotate(0deg) scale(1.08,.92)}
    48%{transform:translate(-4px,-11px) rotate(-5deg) scale(.96,1.08)}
    56%{transform:translate(0,4px) rotate(0deg) scale(1.1,.9)}
    68%{transform:translate(4px,-11px) rotate(5deg) scale(.96,1.08)}
    78%{transform:translate(0,4px) rotate(0deg) scale(1.1,.9)}
    88%{transform:translate(0,-9px) rotate(0deg) scale(1.05,1.05)}
   }
   @keyframes soaDanceWedge {
    0%,100%{transform:scaleY(.55) skewX(0deg)}
    10%,30%{transform:scaleY(.95) skewX(-10deg)}
    15%,35%{transform:scaleY(.35) skewX(0deg)}
    20%,40%{transform:scaleY(.95) skewX(10deg)}
    50%,66%{transform:scaleY(1.25) skewX(0deg)}
    76%{transform:scaleY(.32)}
    86%{transform:scaleY(1.12)}
   }
   @keyframes soaDanceFrame {
    0%,100%{transform:translate(0,0) rotate(0deg) scale(1,1)}
    10%,30%{transform:translate(-10px,-10px) rotate(-9deg) scale(1.06,.95)}
    15%,35%{transform:translate(0,6px) rotate(0deg) scale(1.08,.9)}
    20%,40%{transform:translate(10px,-10px) rotate(9deg) scale(1.06,.95)}
    52%{transform:translate(-6px,-22px) rotate(-10deg) scale(.94,1.08)}
    64%{transform:translate(6px,-24px) rotate(10deg) scale(.94,1.08)}
    76%{transform:translate(0,8px) scale(1.1,.88)}
    86%{transform:translate(0,-14px) scale(1.03,1.02)}
   }
   @keyframes soaDanceSeat {
    0%,100%{transform:translate(0,0) rotate(0deg) scaleY(1)}
    10%,30%{transform:translate(-10px,-12px) rotate(-8deg) scaleY(1.35)}
    15%,35%{transform:translate(0,6px) rotate(0deg) scaleY(.75)}
    20%,40%{transform:translate(10px,-12px) rotate(8deg) scaleY(1.35)}
    52%,64%{transform:translate(0,-24px) scaleY(1.55)}
    76%{transform:translate(0,8px) scaleY(.72)}
    86%{transform:translate(0,-16px) scaleY(1.75)}
   }
   @keyframes soaDanceBack {
    0%,100%{transform:translate(0,0) rotate(0deg) scale(1,1)}
    10%,30%{transform:translate(-12px,-14px) rotate(-11deg) scale(1.05,.94)}
    15%,35%{transform:translate(0,6px) rotate(0deg) scale(1.06,.92)}
    20%,40%{transform:translate(12px,-14px) rotate(11deg) scale(1.05,.94)}
    52%{transform:translate(-8px,-26px) rotate(-12deg) scale(.92,1.06)}
    64%{transform:translate(8px,-26px) rotate(12deg) scale(.92,1.06)}
    76%{transform:translate(0,8px) scale(1.08,.88)}
    86%{transform:translate(0,-20px) scale(1.06,.82)}
   }
   @keyframes soaDanceHead {
    0%,100%{transform:translate(0,0) rotate(0deg) scale(1)}
    10%,30%{transform:translate(10px,3px) rotate(14deg) scale(1.08)}
    15%,35%{transform:translate(0,-3px) rotate(0deg) scale(.96)}
    20%,40%{transform:translate(-10px,3px) rotate(-14deg) scale(1.08)}
    52%{transform:translate(8px,-4px) rotate(16deg) scale(1.1)}
    64%{transform:translate(-8px,-4px) rotate(-16deg) scale(1.1)}
    86%{transform:translate(0,8px) scale(1.1,1.14)}
   }
   @keyframes soaDanceArrow {
    0%,100%{transform:translate(0,0) rotate(0deg) scale(1)}
    10%,30%{transform:translate(-6px,-10px) rotate(-8deg) scale(1.06)}
    20%,40%{transform:translate(6px,-10px) rotate(8deg) scale(1.06)}
    58%{transform:translate(0,-18px) rotate(-10deg) scale(1.12)}
    86%{transform:translate(0,-10px) scale(1.08)}
   }
   @keyframes soaDisco { 0%{fill:#ffc247;r:4px} 50%{fill:#fff;r:2.5px} }
   @keyframes soaNote1 { 0%{transform:translate(32px,75px) scale(.5);opacity:0} 25%{opacity:1} 100%{transform:translate(12px,14px) scale(1.15);opacity:0} }
   @keyframes soaNote2 { 0%{transform:translate(188px,68px) scale(.5);opacity:0} 25%{opacity:1} 100%{transform:translate(210px,10px) scale(1.15);opacity:0} }
  `;
  document.head.appendChild(style);
}

let seq = 0;
export function createStaOpAssistantAvatar({ size = 68, danceOnDoubleClick = true } = {}) {
  injectStaOpAssistantStyles();
  const uid = `soa-${++seq}`;
  const el = document.createElement('div');
  el.className = 'soa-avatar';
  el.style.width = `${size}px`;
  el.style.height = `${Math.round(size * 1.04)}px`;
  el.innerHTML = getStaOpChairSVG(uid);

  let timer = null;
  const dance = (durationMs = 3200) => {
    el.classList.remove('is-dancing');
    void el.offsetWidth;
    el.classList.add('is-dancing');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('is-dancing'), durationMs);
  };
  const talk = (active = true) => {
    el.classList.toggle('is-talking', Boolean(active));
  };

  if (danceOnDoubleClick) {
    el.addEventListener('dblclick', (e) => {
      e.preventDefault();
      dance();
    });
  }

  return { el, dance, talk };
}
