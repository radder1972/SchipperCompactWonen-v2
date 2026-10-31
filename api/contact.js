import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const TIMEZONE = 'Europe/Amsterdam';

const ALL_SLOTS = [
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

function resolveChecklistPdfPath() {
  const candidates = [
    path.join(process.cwd(), 'assets', 'zithouding-checklist.pdf'),
    path.join(process.cwd(), 'public', 'assets', 'zithouding-checklist.pdf'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Bepaalt het tijdzone-offset (bijv. "+01:00" of "+02:00") voor Europe/Amsterdam op een specifieke datum.
 */
function getAmsterdamOffset(dateStr) {
  try {
    const probe = new Date(`${dateStr}T12:00:00Z`);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      timeZoneName: 'longOffset',
    }).formatToParts(probe);
    const tzPart = parts.find((p) => p.type === 'timeZoneName')?.value || '';
    const match = tzPart.match(/GMT([+-]\d{2}:\d{2})/);
    return match ? match[1] : '+01:00';
  } catch {
    return '+01:00';
  }
}

/**
 * Zet een datum (YYYY-MM-DD of ISO) + tijdslot ("10:00 - 12:00") of startISO/endISO
 * om naar exacte ISO-timestamps met Europe/Amsterdam offset.
 */
function parseAppointmentDates({ datum, tijd, startISO, endISO }) {
  if (startISO && endISO) {
    const s = new Date(startISO);
    const e = new Date(endISO);
    if (!Number.isNaN(s.getTime()) && !Number.isNaN(e.getTime()) && e > s) {
      return { start: s.toISOString(), end: e.toISOString() };
    }
  }

  const rawDate = String(datum || '').trim();
  const ymdMatch = rawDate.match(/^(\d{4}-\d{2}-\d{2})/);

  if (ymdMatch) {
    const datePart = ymdMatch[1];
    const offset = getAmsterdamOffset(datePart);
    const slotMatch = String(tijd || '').match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
    if (slotMatch) {
      return {
        start: new Date(`${datePart}T${slotMatch[1]}:00${offset}`).toISOString(),
        end: new Date(`${datePart}T${slotMatch[2]}:00${offset}`).toISOString(),
      };
    }
    const singleTimeMatch = String(tijd || '').match(/(\d{2}:\d{2})/);
    const startTime = singleTimeMatch ? singleTimeMatch[1] : '10:00';
    const startDt = new Date(`${datePart}T${startTime}:00${offset}`);
    const endDt = new Date(startDt.getTime() + 2 * 60 * 60 * 1000);
    return {
      start: startDt.toISOString(),
      end: endDt.toISOString(),
    };
  }

  const parsed = rawDate ? new Date(rawDate) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const validStart = Number.isNaN(parsed.getTime())
    ? new Date(Date.now() + 24 * 60 * 60 * 1000)
    : parsed;
  const endDt = new Date(validStart.getTime() + 60 * 60 * 1000);
  return {
    start: validStart.toISOString(),
    end: endDt.toISOString(),
  };
}

function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!clientEmail || !privateKey || !calendarId) return null;

  const auth = new google.auth.JWT(
    clientEmail,
    undefined,
    privateKey,
    ['https://www.googleapis.com/auth/calendar']
  );
  return {
    calendar: google.calendar({ version: 'v3', auth }),
    calendarId,
  };
}

/**
 * Haalt bezette tijdsloten op voor een specifieke datum (YYYY-MM-DD) in Europe/Amsterdam.
 */
async function getBusySlotsForDate(dateYmd) {
  const cal = getCalendarClient();
  if (!cal) return { configured: false, busySlots: [] };

  const offset = getAmsterdamOffset(dateYmd);
  const dayStart = new Date(`${dateYmd}T00:00:00${offset}`);
  const dayEnd = new Date(`${dateYmd}T23:59:59${offset}`);

  const response = await cal.calendar.events.list({
    calendarId: cal.calendarId,
    timeMin: dayStart.toISOString(),
    timeMax: dayEnd.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = (response.data.items || []).filter(
    (ev) => ev.status !== 'cancelled' && ev.transparency !== 'transparent'
  );

  const busySlots = [];
  for (const slot of ALL_SLOTS) {
    const [slotStartHm, slotEndHm] = slot.split(' - ');
    const slotStart = new Date(`${dateYmd}T${slotStartHm}:00${offset}`).getTime();
    const slotEnd = new Date(`${dateYmd}T${slotEndHm}:00${offset}`).getTime();

    const overlaps = events.some((ev) => {
      if (ev.start?.date && !ev.start?.dateTime) {
        // Hele-dag-evenement blokkeert de dag
        return true;
      }
      const evStart = new Date(ev.start?.dateTime).getTime();
      const evEnd = new Date(ev.end?.dateTime).getTime();
      return evStart < slotEnd && evEnd > slotStart;
    });

    if (overlaps) busySlots.push(slot);
  }

  return { configured: true, busySlots };
}

/**
 * Controleert of een specifiek start/end interval al bezet is in Google Calendar.
 */
async function isIntervalBusy(startIso, endIso) {
  const cal = getCalendarClient();
  if (!cal) return false;

  const response = await cal.calendar.events.list({
    calendarId: cal.calendarId,
    timeMin: startIso,
    timeMax: endIso,
    singleEvents: true,
  });

  const startMs = new Date(startIso).getTime();
  const endMs = new Date(endIso).getTime();

  return (response.data.items || []).some((ev) => {
    if (ev.status === 'cancelled' || ev.transparency === 'transparent') return false;
    if (ev.start?.date && !ev.start?.dateTime) return true;
    const evStart = new Date(ev.start?.dateTime).getTime();
    const evEnd = new Date(ev.end?.dateTime).getTime();
    return evStart < endMs && evEnd > startMs;
  });
}

function buildChecklistEmailHtml({ voornaam }) {
  const safeName = escapeHtml(voornaam || 'heer/mevrouw');
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Uw Gratis Zithouding Checklist — Schipper Compact Wonen</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f3;font-family:Arial,Helvetica,sans-serif;color:#1d2024;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7f3;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dce8d7;box-shadow:0 6px 24px rgba(18,43,7,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#122b07 0%,#1f9d3f 100%);padding:28px 32px;color:#ffffff;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ffd25a;margin-bottom:6px;">Schipper Compact Wonen · Ergonomisch Zorgadvies</div>
              <h1 style="margin:0;font-size:24px;line-height:1.25;color:#ffffff;">Uw Gratis Zithouding Checklist</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:30px 32px;font-size:16px;line-height:1.65;color:#222823;">
              <p style="margin:0 0 16px;">Beste <strong>${safeName}</strong>,</p>
              <p style="margin:0 0 18px;">Hartelijk dank voor uw aanvraag. In de bijlage van deze e-mail vindt u direct de <strong>Ergonomische Zithouding Checklist (PDF)</strong>, samengesteld door onze bewegingstechnologen.</p>

              <!-- 4 Controlepunten Box -->
              <div style="background-color:#f6faf5;border:1.5px solid #cfe3c8;border-radius:12px;padding:20px 22px;margin:22px 0;">
                <div style="font-size:15px;font-weight:700;color:#122b07;margin-bottom:12px;">De 4 belangrijkste aandachtspunten tijdens uw 3-minuten check:</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size:15px;line-height:1.55;color:#2c352d;">
                  <tr>
                    <td style="padding:4px 0;">✓ <strong>Zithoogte:</strong> Rusten uw voeten plat op de vloer zonder druk in de knieholte?</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">✓ <strong>Zitdiepte:</strong> Past er een vlakke hand of vuist tussen uw knieholte en de zitting?</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">✓ <strong>Lendensteun:</strong> Wordt uw onderrug voelbaar ondersteund zonder dat u onderuitzakt?</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">✓ <strong>Opstaan:</strong> Kunt u opstaan zonder uzelf met kracht uit de armleuningen te duwen?</td>
                  </tr>
                </table>
              </div>

              <p style="margin:0 0 18px;">Merkt u bij één of meer punten dat uw huidige stoel niet optimaal aansluit? In onze showroom aan de <strong>Merwedestraat 239 in Dordrecht</strong> meten wij uw exacte lichaamsmaten gratis en vrijblijvend voor u in. Ook een passing bij u thuis is mogelijk.</p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="border-radius:999px;background-color:#1f9d3f;">
                    <a href="https://schippercompactwonen.nl/#/afspraak" target="_blank" style="display:inline-block;padding:14px 28px;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px;">Plan vrijblijvend een zitmeting &rarr;</a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:15px;color:#475569;">
                Heeft u direct een vraag? Bel ons gerust op <a href="tel:+31786314858" style="color:#1f9d3f;font-weight:700;text-decoration:none;">078 - 631 4858</a> of beantwoord deze e-mail.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f8faf7;border-top:1px solid #e4ece1;padding:20px 32px;font-size:13px;line-height:1.5;color:#5e6368;">
              <strong>Schipper Compact Wonen</strong> · Specialist in sta-op stoelen, hoog-laag bedden &amp; zorghulpmiddelen<br>
              Merwedestraat 239, 3313 GT Dordrecht · Gratis parkeren voor de deur · <a href="https://schippercompactwonen.nl" style="color:#1f9d3f;text-decoration:none;">schippercompactwonen.nl</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildAppointmentEmailHtml({ voornaam, locatie, datumLabel, tijd, telefoon, opmerkingen, chair, isCallback }) {
  const safeName = escapeHtml(voornaam || 'heer/mevrouw');
  const safeLoc = escapeHtml(locatie || 'Showroom Dordrecht (Merwedestraat 239)');
  const safeDate = escapeHtml(datumLabel || 'In overleg');
  const safeTime = escapeHtml(tijd || 'In overleg');
  const safePhone = escapeHtml(telefoon || '-');
  const safeNotes = escapeHtml(opmerkingen || '');
  const safeChair = escapeHtml(chair || '');

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bevestiging Adviesafspraak — Schipper Compact Wonen</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f7f3;font-family:Arial,Helvetica,sans-serif;color:#1d2024;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f7f3;padding:28px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #dce8d7;box-shadow:0 6px 24px rgba(18,43,7,0.06);">
          <tr>
            <td style="background:linear-gradient(135deg,#122b07 0%,#1f9d3f 100%);padding:26px 32px;color:#ffffff;">
              <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#ffd25a;margin-bottom:6px;">Schipper Compact Wonen · Dordrecht</div>
              <h1 style="margin:0;font-size:23px;line-height:1.25;color:#ffffff;">${isCallback ? 'Wij bellen u spoedig terug' : 'Bevestiging van uw afspraakaanvraag'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:16px;line-height:1.65;color:#222823;">
              <p style="margin:0 0 16px;">Beste <strong>${safeName}</strong>,</p>
              <p style="margin:0 0 18px;">${
                isCallback
                  ? 'Hartelijk dank voor uw terugbelverzoek. Onze bewegingstechnoloog neemt zo spoedig mogelijk telefonisch contact met u op om uw vragen te beantwoorden of een afspraak in te plannen.'
                  : 'Hartelijk dank voor uw aanvraag voor een vrijblijvende adviesafspraak. Wij hebben het volgende moment voor u genoteerd:'
              }</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f6faf5;border:1.5px solid #cfe3c8;border-radius:12px;padding:18px 20px;margin:20px 0;font-size:15px;">
                ${!isCallback ? `<tr><td style="padding:6px 0;color:#5e6368;width:140px;">Datum:</td><td style="padding:6px 0;font-weight:700;color:#122b07;">${safeDate}</td></tr>` : ''}
                ${!isCallback && safeTime ? `<tr><td style="padding:6px 0;color:#5e6368;">Tijdstip:</td><td style="padding:6px 0;font-weight:700;color:#122b07;">${safeTime}</td></tr>` : ''}
                <tr><td style="padding:6px 0;color:#5e6368;">Locatie:</td><td style="padding:6px 0;font-weight:700;color:#122b07;">${safeLoc}</td></tr>
                <tr><td style="padding:6px 0;color:#5e6368;">Telefoonnummer:</td><td style="padding:6px 0;font-weight:700;color:#122b07;">${safePhone}</td></tr>
                ${safeChair ? `<tr><td style="padding:6px 0;color:#5e6368;">Gekozen model:</td><td style="padding:6px 0;font-weight:700;color:#1f9d3f;">${safeChair}</td></tr>` : ''}
                ${safeNotes && safeNotes !== '-' ? `<tr><td style="padding:6px 0;color:#5e6368;">Opmerkingen:</td><td style="padding:6px 0;color:#222823;">${safeNotes}</td></tr>` : ''}
              </table>

              <p style="margin:0 0 14px;">Wij nemen altijd nog even telefonisch contact met u op om de afspraak definitief te bevestigen. Bij onze showroom aan de <strong>Merwedestraat 239 in Dordrecht</strong> kunt u gratis direct voor de deur parkeren en staat de koffie voor u klaar.</p>
              <p style="margin:18px 0 0;font-size:15px;color:#475569;">Met vriendelijke groet,<br><strong>Geertjan Schipper</strong><br>Schipper Compact Wonen · <a href="tel:+31786314858" style="color:#1f9d3f;font-weight:700;text-decoration:none;">078 - 631 4858</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // -------------------------------------------------------------------------
  // GET /api/contact?date=YYYY-MM-DD -> Realtime bezette tijdsloten uit Google Agenda
  // -------------------------------------------------------------------------
  if (req.method === 'GET') {
    const dateParam = String(req.query?.date || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return res.status(400).json({
        success: false,
        error: 'Geef een geldige datum mee in het formaat ?date=YYYY-MM-DD',
      });
    }

    try {
      const { configured, busySlots } = await getBusySlotsForDate(dateParam);
      if (!configured) {
        return res.status(503).json({
          success: false,
          code: 'CALENDAR_NOT_CONFIGURED',
          busySlots: [],
        });
      }
      return res.status(200).json({
        success: true,
        date: dateParam,
        busySlots,
      });
    } catch (err) {
      console.error('Google Calendar GET error:', err);
      return res.status(500).json({
        success: false,
        error: 'Kon beschikbaarheid niet ophalen uit Google Agenda.',
        busySlots: [],
      });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // -------------------------------------------------------------------------
  // POST /api/contact -> Checklist PDF e-mailflow OF Afspraak + Google Agenda
  // -------------------------------------------------------------------------
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      voornaam = 'heer/mevrouw',
      email = '',
      datum = '',
      datumLabel = '',
      tijd = '',
      startISO = '',
      endISO = '',
      type = 'checklist', // 'checklist' | 'afspraak' | 'callback'
      appointmentType = 'showroom', // 'showroom' | 'home'
      telefoon = '',
      locatie = 'Showroom Dordrecht (Merwedestraat 239)',
      opmerkingen = '',
      chair = '',
    } = body;

    const cleanEmail = String(email || '').trim();
    const isRealCustomerEmail = Boolean(
      cleanEmail && cleanEmail.includes('@') && !cleanEmail.startsWith('belmij@')
    );

    if (type === 'checklist' && !isRealCustomerEmail) {
      return res.status(400).json({ success: false, error: 'Geldig e-mailadres ontbreekt.' });
    }

    const hasMailCreds = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    const calClient = getCalendarClient();
    const hasCalendarCreds = Boolean(calClient);

    if (!hasMailCreds && !hasCalendarCreds) {
      return res.status(503).json({
        success: false,
        code: 'ENV_NOT_CONFIGURED',
        error: 'Server-omgevingsvariabelen (GMAIL_USER / GOOGLE_CALENDAR_ID) zijn nog niet ingesteld in Vercel.',
      });
    }

    const isChecklist = type === 'checklist';
    const isCallback = type === 'callback';
    let calendarEventId = null;

    // 1. Google Agenda-koppeling (voor ingeplande afspraken en bel-mij verzoeken)
    if ((type === 'afspraak' || isCallback) && hasCalendarCreds) {
      const { start, end } = parseAppointmentDates({ datum, tijd, startISO, endISO });

      // Controleer op dubbele boeking bij een reguliere tijdslot-afspraak
      if (type === 'afspraak' && (tijd || startISO)) {
        const alreadyBusy = await isIntervalBusy(start, end);
        if (alreadyBusy) {
          return res.status(409).json({
            success: false,
            code: 'SLOT_TAKEN',
            error: 'Dit tijdstip is zojuist gereserveerd. Kies alstublieft een ander tijdslot.',
          });
        }
      }

      const typePrefix = isCallback
        ? '📞 Bel-mij verzoek'
        : appointmentType === 'home'
        ? '🏠 Passing aan huis'
        : '🪑 Showroombezoek';

      const eventRes = await calClient.calendar.events.insert({
        calendarId: calClient.calendarId,
        requestBody: {
          summary: `${typePrefix}: ${voornaam}${chair ? ` (${chair})` : ''}`,
          location: locatie,
          transparency: isCallback ? 'transparent' : 'opaque',
          description: [
            `Type: ${typePrefix}`,
            `Naam: ${voornaam}`,
            telefoon ? `Telefoon: ${telefoon}` : '',
            isRealCustomerEmail ? `E-mail: ${cleanEmail}` : '',
            `Locatie: ${locatie}`,
            tijd ? `Tijdslot: ${tijd}` : '',
            chair ? `Gekozen model: ${chair}` : '',
            opmerkingen ? `Toelichting: ${opmerkingen}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          start: { dateTime: start, timeZone: TIMEZONE },
          end: { dateTime: end, timeZone: TIMEZONE },
        },
      });

      calendarEventId = eventRes?.data?.id || null;
    }

    // 2. Geautomatiseerde E-mailflow via Google Workspace SMTP (Nodemailer)
    if (hasMailCreds) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const notifyRecipient = process.env.NOTIFICATION_EMAIL || process.env.GMAIL_USER;

      if (isChecklist) {
        const pdfPath = resolveChecklistPdfPath();
        const hasPdf = fs.existsSync(pdfPath);

        // 2a. Stuur de opgemaakte HTML-mail + PDF-bijlage naar de aanvrager
        await transporter.sendMail({
          from: `"Schipper Compact Wonen" <${process.env.GMAIL_USER}>`,
          to: cleanEmail,
          replyTo: process.env.GMAIL_USER,
          subject: 'Uw Gratis Zithouding Checklist (PDF) — Schipper Compact Wonen',
          text: `Beste ${voornaam},\n\nHartelijk dank voor uw aanvraag. In de bijlage vindt u de Gratis Zithouding Checklist (PDF) van Schipper Compact Wonen.\n\nDe 4 aandachtspunten:\n1. Zithoogte: Rusten uw voeten plat op de vloer zonder druk in de knieholte?\n2. Zitdiepte: Past er een vuist tussen uw knieholte en de voorzijde van de zitting?\n3. Lendensteun: Wordt uw onderrug actief ondersteund?\n4. Opstaan: Kunt u zelfstandig opstaan zonder kracht te zetten uit uw schouders of knieën?\n\nWilt u het verschil zelf ervaren in onze showroom aan de Merwedestraat 239 in Dordrecht? Plan vrijblijvend een zitmeting via https://schippercompactwonen.nl/#/afspraak of bel 078 - 631 4858.\n\nMet vriendelijke groet,\nGeertjan Schipper\nSchipper Compact Wonen`,
          html: buildChecklistEmailHtml({ voornaam }),
          attachments: hasPdf
            ? [
                {
                  filename: 'Schipper-Zithouding-Checklist.pdf',
                  path: pdfPath,
                  contentType: 'application/pdf',
                },
              ]
            : [],
        });

        // 2b. Interne notificatie voor Geertjan
        await transporter.sendMail({
          from: `"Website Lead — Schipper Compact Wonen" <${process.env.GMAIL_USER}>`,
          to: notifyRecipient,
          replyTo: cleanEmail,
          subject: `📥 Checklist gedownload door ${voornaam} (${cleanEmail})`,
          text: `Nieuwe aanvraag voor de Gratis Zithouding Checklist:\n\n- Voornaam: ${voornaam}\n- E-mailadres: ${cleanEmail}\n- Tijdstip: ${new Date().toLocaleString('nl-NL', { timeZone: TIMEZONE })}`,
        });
      } else {
        // 2c. Bevestigingsmail naar de klant (als de klant een e-mailadres heeft ingevuld)
        if (isRealCustomerEmail) {
          await transporter.sendMail({
            from: `"Schipper Compact Wonen" <${process.env.GMAIL_USER}>`,
            to: cleanEmail,
            replyTo: process.env.GMAIL_USER,
            subject: isCallback
              ? 'Wij hebben uw terugbelverzoek ontvangen — Schipper Compact Wonen'
              : 'Bevestiging van uw afspraakaanvraag — Schipper Compact Wonen',
            text: `Beste ${voornaam},\n\nHartelijk dank voor uw aanvraag bij Schipper Compact Wonen.\n\n- Locatie: ${locatie}\n- Datum: ${datumLabel || datum || 'In overleg'}${tijd ? ` (${tijd})` : ''}\n${telefoon ? `- Telefoon: ${telefoon}\n` : ''}${chair ? `- Gekozen model: ${chair}\n` : ''}${opmerkingen ? `- Opmerkingen: ${opmerkingen}\n` : ''}\nWij nemen telefonisch contact met u op om de afspraak te bevestigen.\n\nMet vriendelijke groet,\nGeertjan Schipper\nSchipper Compact Wonen\nMerwedestraat 239, Dordrecht — 078 - 631 4858`,
            html: buildAppointmentEmailHtml({
              voornaam,
              locatie,
              datumLabel: datumLabel || datum,
              tijd,
              telefoon,
              opmerkingen,
              chair,
              isCallback,
            }),
          });
        }

        // 2d. Interne notificatie voor Geertjan (altijd, ook bij Bel-mij verzoeken zonder e-mailadres)
        await transporter.sendMail({
          from: `"Afspraakmodule — Schipper Compact Wonen" <${process.env.GMAIL_USER}>`,
          to: notifyRecipient,
          replyTo: isRealCustomerEmail ? cleanEmail : process.env.GMAIL_USER,
          subject: isCallback
            ? `📞 Bel-mij verzoek: ${voornaam} (${telefoon})`
            : `📅 Nieuwe afspraakaanvraag: ${voornaam} — ${datumLabel || datum} (${tijd || 'in overleg'})`,
          text: [
            isCallback ? 'Nieuw terugbelverzoek via de website:' : 'Nieuwe afspraakaanvraag via de website:',
            '',
            `- Naam: ${voornaam}`,
            `- Telefoon: ${telefoon || '-'}`,
            `- E-mail: ${isRealCustomerEmail ? cleanEmail : 'Niet opgegeven (Bel-mij)'}`,
            `- Locatie: ${locatie}`,
            !isCallback ? `- Datum: ${datumLabel || datum}` : '',
            !isCallback && tijd ? `- Tijdstip: ${tijd}` : '',
            chair ? `- Gekozen product: ${chair}` : '',
            opmerkingen ? `- Opmerkingen: ${opmerkingen}` : '',
            calendarEventId ? `- Google Agenda: Automatisch ingepland (ID: ${calendarEventId})` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        });
      }
    }

    return res.status(200).json({
      success: true,
      calendarEventId,
      message: 'Verwerkt en verzonden.',
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Interne serverfout' });
  }
}
