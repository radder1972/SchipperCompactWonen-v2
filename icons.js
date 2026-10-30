const s=(p)=>`<svg class="svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const im=n=>`<img class="gi" src="icons/${n}.svg" alt="">`;
export const icons={
 doctor:im('advies'),
 ruler:im('opmaat'),
 home:im('thuis'),
 shield:im('garantie'),
 recycle:im('occasion'),
 check:im('bedankt'),
 mail:im('mail'),
 phone:im('phone'),
 pin:im('locatie'),
 chair:s('<path d="M14 20V10a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v10"/><path d="M10 22a4 4 0 0 1 4 4v4h20v-4a4 4 0 0 1 8 0v8a3 3 0 0 1-3 3H13a3 3 0 0 1-3-3z" /><path d="M14 38v5M34 38v5"/><path d="M24 12v8M20 16l4-4 4 4" stroke="var(--acc)"/>'),
 bed:s('<path d="M5 38V12M5 30h38v8M43 30v-6a5 5 0 0 0-5-5H21v11"/><circle cx="13" cy="24" r="4"/><path d="M5 38h38" /><path d="M30 8v6M27 11h6" stroke="var(--acc)"/>'),
 walk:s('<path d="M18 6v10M18 16l8 3M26 19v10M18 16v4"/><circle cx="31" cy="9" r="3.5"/><path d="M31 14l-5 5 3 9-4 12M29 28l7 5 3 9"/><path d="M12 42l5-26" stroke="var(--acc)"/>')
};
