// Instellingen voor de afspraakmodule (Schipper Compact Wonen)
export const config = {
  brand: 'schippercompactwonen',
  site: 'schippercompactwonen.nl',
  senderName: 'Schipper Compact Wonen',
  replyTo: 'info@schippercompactwonen.nl',
  notificationEmail: 'info@schippercompactwonen.nl',
  phone: '078 - 631 4858',
  showroom: 'Merwedestraat 239, 3313 GT Dordrecht',
  // Webhook (bijv. Google Apps Script) die afspraken opslaat/mailt en bezette tijden teruggeeft
  // (GET ?date=YYYY-MM-DD -> {busySlots:["10:00 - 12:00"]}). Hier: het bestaande script van staopstoelen.nl
  // (zelfde eigenaar). Leeg = geen webhook: dan wordt
  // de aanvraag als e-mail (mailto:) voorbereid en worden alle tijden als vrij getoond.
  webhookUrl: 'https://script.google.com/macros/s/AKfycbwyRN-iLM83LFZ4hZ08jzwpMdeHI6o5kU5fr0Bz2KpmOuG3XP5y_4zbyE2cO45WCdNN/exec',
  // Tijdsloten en openingsregels (zelfde logica als staopstoelen.nl)
  slots: { showroom: ['10:00 - 12:00', '12:00 - 14:00', '14:00 - 16:00'], home: ['16:00 - 18:00', '18:00 - 20:00'] },
  closedWeekdays: [0, 1],        // zondag en maandag gesloten
  minDaysAhead: 2,               // vroegste afspraak: vandaag + 2 dagen
  saturdayOpenSlots: { showroom: 2, home: 1 } // aantal sloten dat op zaterdag beschikbaar is
};
