const s=p=>`<svg class="svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const im=n=>`<img class="gi" src="icons/${n}.svg" alt="">`;
export const icons={
 // 1e-orde 3D-iconen voor hoofdkaarten
 doctor:im('advies'),
 ruler:im('opmaat'),
 home:im('thuis'),
 shield:im('garantie'),
 recycle:im('occasion'),
 check:im('bedankt'),
 // 2e-orde platte custom huisstijl-iconen (groen + amber accent)
 mail:s('<rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="rgba(31,157,63,.14)" stroke="#1f9d3f"/><path d="M3.5 6.5L12 13l8.5-6.5" stroke="#f59e0b" stroke-width="2.2"/>'),
 phone:s('<path d="M5 3.5h3.2l1.6 4.2-2 1.4a11.5 11.5 0 0 0 6.6 6.6l1.4-2 4.2 1.6v3.2a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 3 5.7 2 2 0 0 1 5 3.5z" fill="rgba(31,157,63,.14)" stroke="#1f9d3f"/><path d="M14.5 4.5a5 5 0 0 1 5 5M14.5 8a1.8 1.8 0 0 1 1.8 1.8" stroke="#f59e0b"/>'),
 pin:s('<path d="M12 21.5s-6.5-5.8-6.5-11a6.5 6.5 0 1 1 13 0c0 5.2-6.5 11-6.5 11z" fill="rgba(31,157,63,.14)" stroke="#1f9d3f"/><circle cx="12" cy="10.5" r="2.5" fill="#f59e0b" stroke="#f59e0b"/>'),
 clock:s('<circle cx="12" cy="12" r="9" fill="rgba(31,157,63,.14)" stroke="#1f9d3f"/><path d="M12 7.5V12l3.2 2" stroke="#f59e0b" stroke-width="2.3"/>'),
 download:s('<path d="M4 16.5v2.2A2.3 2.3 0 0 0 6.3 21h11.4a2.3 2.3 0 0 0 2.3-2.3v-2.2" stroke="currentColor"/><path d="M12 3.5v11m0 0l-4-4m4 4l4-4" stroke="#ffc247" stroke-width="2.4"/>'),
 lock:s('<rect x="4.5" y="10.5" width="15" height="10" rx="2.5" fill="rgba(31,157,63,.14)" stroke="#1f9d3f"/><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" stroke="#1f9d3f"/><circle cx="12" cy="15.5" r="1.4" fill="#f59e0b" stroke="#f59e0b"/>'),
 shield2:s('<path d="M12 2.8l7.5 3v5.7c0 4.7-3.2 8.3-7.5 9.7-4.3-1.4-7.5-5-7.5-9.7V5.8z" fill="rgba(95,214,122,.18)" stroke="#5fd67a"/><path d="M8.5 12.2l2.4 2.4 4.8-5" stroke="#ffc247" stroke-width="2.4"/>'),
 steth:s('<path d="M6 4v5a5 5 0 0 0 10 0V4M4 4h4M14 4h4" stroke="#5fd67a"/><path d="M11 14v2.5a4.5 4.5 0 0 0 9 0V14" stroke="#5fd67a"/><circle cx="20" cy="12.5" r="2" fill="#ffc247" stroke="#ffc247"/>'),
 calendar:s('<rect x="3" y="4.5" width="18" height="16" rx="2.5" fill="rgba(31,157,63,.14)" stroke="currentColor"/><path d="M3 9.5h18M8 2.8v3.4M16 2.8v3.4" stroke="currentColor"/><path d="M8.5 14.8l2.2 2.2 4.8-4.8" stroke="#ffc247" stroke-width="2.3"/>'),
 store:s('<path d="M4 4.5h16l1.5 5H2.5z" fill="rgba(245,158,11,.2)" stroke="#f59e0b"/><path d="M4.5 9.5V20h15V9.5M9.5 20v-5.5h5V20" stroke="#1f9d3f"/>'),
 camera:s('<rect x="3" y="6.5" width="18" height="13" rx="2.5" fill="rgba(95,214,122,.18)" stroke="#5fd67a"/><path d="M8.5 6.5l1.4-2.2h4.2l1.4 2.2" stroke="#5fd67a"/><circle cx="12" cy="13" r="3.2" stroke="#ffc247" stroke-width="2.2"/>'),
 route:s('<path d="M19.5 4.5l-15 6.3 6.2 2.3 2.3 6.2z" fill="rgba(31,157,63,.14)" stroke="currentColor"/><path d="M10.7 13.1l4.3-4.3" stroke="#f59e0b" stroke-width="2.2"/>'),
 check2:s('<circle cx="12" cy="12" r="9" fill="rgba(31,157,63,.16)" stroke="#1f9d3f"/><path d="M8.2 12.3l2.5 2.5 5.2-5.4" stroke="#f59e0b" stroke-width="2.4"/>'),
 search:s('<circle cx="11" cy="11" r="6.5" fill="rgba(31,157,63,.14)" stroke="#1f9d3f" stroke-width="2.1"/><path d="M16 16l4.5 4.5" stroke="#f59e0b" stroke-width="2.4"/>'),
 arrow:s('<path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" stroke-width="2.2"/>'),
 ext:s('<path d="M7 17L17 7m0 0H9m8 0v8" stroke="currentColor" stroke-width="2.2"/>'),
 star:s('<path d="M12 2.8l2.8 5.7 6.3.9-4.55 4.45 1.07 6.25L12 17.15 6.38 20.1l1.07-6.25L2.9 9.4l6.3-.9z" fill="#f59e0b" stroke="#f59e0b"/>')
};
