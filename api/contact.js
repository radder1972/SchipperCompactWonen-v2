import fs from 'node:fs';
import path from 'node:path';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

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

function parseAppointmentDates(datumInput, tijdInput) {
  let raw = String(datumInput || '').trim();
  if (!raw) {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    tomorrow.setHours(10, 0, 0, 0);
    return {
      start: tomorrow.toISOString(),
      end: new Date(tomorrow.getTime() + 60 * 60 * 1000).toISOString(),
    };
  }
  // Als alleen YYYY-MM-DD is meegegeven zonder tijd, voeg standaard 10:00 toe (of gebruik tijdInput)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const timeMatch = String(tijdInput || '').match(/(\d{2}:\d{2})/);
    const timePart = timeMatch ? timeMatch[1] : '10:00';
    raw = `${raw}T${timePart}:00`;
  }
  const startDate = new Date(raw);
  const validStart = Number.isNaN(startDate.getTime()) ? new Date(Date.now() + 24 * 60 * 60 * 1000) : startDate;
  const endDate = new Date(validStart.getTime() + 60 * 60 * 1000); // +1 uur
  return {
    start: validStart.toISOString(),
    end: endDate.toISOString(),
  };
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const {
      voornaam = 'heer/mevrouw',
      email,
      datum,
      tijd,
      type = 'checklist',
      telefoon = '',
      locatie = 'Showroom Dordrecht (Merwedestraat 239)',
      opmerkingen = '',
    } = body;

    if (!email && type === 'checklist') {
      return res.status(400).json({ success: false, error: 'E-mailadres ontbreekt.' });
    }

    const hasMailCreds = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    const hasCalendarCreds = Boolean(
      process.env.GOOGLE_CLIENT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID
    );

    if (!hasMailCreds && !hasCalendarCreds) {
      return res.status(503).json({
        success: false,
        code: 'ENV_NOT_CONFIGURED',
        error: 'Server-omgevingsvariabelen (GMAIL_USER / GOOGLE_CALENDAR_ID) zijn nog niet ingesteld in Vercel.',
      });
    }

    // 1. Mail Configuratie via eigen Google Workspace Account
    if (hasMailCreds && email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const isChecklist = type === 'checklist';
      const pdfPath = resolveChecklistPdfPath();

      const textBody = isChecklist
        ? `Beste ${voornaam},\n\nBedankt voor uw interesse in Schipper Compact Wonen. In de bijlage vindt u de Gratis Zithouding Checklist (PDF) van bewegingstechnoloog Geertjan Schipper.\n\nWilt u de verschillen zelf voelen in onze showroom aan de Merwedestraat 239 in Dordrecht? U bent van harte welkom.\n\nMet vriendelijke groet,\nGeertjan Schipper\nSchipper Compact Wonen\nMerwedestraat 239, Dordrecht — 078 613 8038`
        : `Beste ${voornaam},\n\nHartelijk dank voor uw aanvraag voor een vrijblijvende adviesafspraak bij Schipper Compact Wonen.\n\nOverzicht van uw aanvraag:\n- Naam: ${voornaam}\n- Locatie: ${locatie}\n- Gewenste datum: ${datum || 'In overleg'}${tijd ? ` (${tijd})` : ''}\n${telefoon ? `- Telefoon: ${telefoon}\n` : ''}${opmerkingen ? `- Opmerkingen: ${opmerkingen}\n` : ''}\nGeertjan neemt binnen 1 werkdag contact met u op om het exacte tijdstip definitief te bevestigen.\n\nMet vriendelijke groet,\nGeertjan Schipper\nSchipper Compact Wonen\nMerwedestraat 239, Dordrecht — 078 613 8038`;

      const mailOptions = {
        from: `"Schipper Compact Wonen" <${process.env.GMAIL_USER}>`,
        to: email,
        bcc: process.env.GMAIL_USER,
        subject: isChecklist
          ? 'Uw Gratis Zithouding Checklist — Schipper Compact Wonen'
          : 'Bevestiging Adviesafspraak — Schipper Compact Wonen',
        text: textBody,
        attachments: isChecklist && fs.existsSync(pdfPath)
          ? [
              {
                filename: 'Schipper-Zithouding-Checklist.pdf',
                path: pdfPath,
              },
            ]
          : [],
      };

      await transporter.sendMail(mailOptions);
    }

    // 2. Agenda Configuratie (Alleen bij showroom/thuis afspraak)
    if (type === 'afspraak' && hasCalendarCreds) {
      const auth = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        undefined,
        process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/calendar.events']
      );

      const calendar = google.calendar({ version: 'v3', auth });
      const { start, end } = parseAppointmentDates(datum, tijd);

      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: {
          summary: `Adviesafspraak: ${voornaam}`,
          location: locatie,
          description: [
            `Naam: ${voornaam}`,
            email ? `E-mail: ${email}` : '',
            telefoon ? `Telefoon: ${telefoon}` : '',
            `Locatie: ${locatie}`,
            tijd ? `Voorkeurstijd: ${tijd}` : '',
            opmerkingen ? `Toelichting: ${opmerkingen}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
          start: { dateTime: start, timeZone: 'Europe/Amsterdam' },
          end: { dateTime: end, timeZone: 'Europe/Amsterdam' },
        },
      });
    }

    return res.status(200).json({ success: true, message: 'Verwerkt en verzonden.' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ success: false, error: 'Interne serverfout' });
  }
}
