import { google, calendar_v3 } from 'googleapis';

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_PRIVATE_KEY;

export const isGoogleConfigured = !!(clientEmail && privateKey);

export const CALENDAR_IDS: Record<string, string> = {
  'jaripatka-main': 'das.jaripatka@gmail.com',
  'sadar-suite': 'dasdentalclinicsadar@gmail.com',
  'indora-laser': 'dasdentalclinicindora@gmail.com',
};

export const BRANCH_NAMES: Record<string, string> = {
  'jaripatka-main': 'Jaripatka',
  'sadar-suite': 'Sadar',
  'indora-laser': 'Indora',
};

export const BRANCH_LOCATIONS: Record<string, string> = {
  'jaripatka-main': 'Sai Vasanshah Chowk, Near Ganesh Mandir, Jaripatka Bazar, Nagpur - 440014',
  'sadar-suite': 'Shop No. 7, SJTI Complex, Below IDBI Bank, Sadar, Nagpur',
  'indora-laser': 'Dr. Ambedkar Road, Near Rajput Rest., Indora, Nagpur',
};

let googleCalendarClient: calendar_v3.Calendar | null = null;

if (isGoogleConfigured) {
  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar']
    });
    googleCalendarClient = google.calendar({ version: 'v3', auth });
  } catch (error) {
    console.error('Failed to initialize Google Calendar client:', error);
  }
}

export interface busyInterval {
  start: string;
  end: string;
}

// Check busy slot intervals for a target date
export async function getBusyIntervals(branchId: string, date: string): Promise<busyInterval[]> {
  const calendarId = CALENDAR_IDS[branchId];
  if (!calendarId) {
    throw new Error(`Invalid branch identifier: ${branchId}`);
  }

  if (!isGoogleConfigured || !googleCalendarClient) {
    console.warn('Google Calendar credentials not configured. Falling back to local/Redis database checks.');
    return [];
  }

  try {
    const timeMin = `${date}T00:00:00+05:30`;
    const timeMax = `${date}T23:59:59+05:30`;

    const response = await googleCalendarClient.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: 'Asia/Kolkata',
        items: [{ id: calendarId }],
      },
    });

    const busy = response.data.calendars?.[calendarId]?.busy || [];
    return busy.map((b: calendar_v3.Schema$TimePeriod) => ({
      start: b.start || '',
      end: b.end || '',
    }));
  } catch (error) {
    console.error('Error fetching freebusy data from Google Calendar:', error);
    throw error;
  }
}

// Convert slot time (e.g. "10:30 AM") to 24h ISO format
export function convertSlotToISOTime(date: string, timeSlot: string): { start: string; end: string } {
  // Parsing "10:30 AM" or "04:30 PM"
  const match = timeSlot.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) {
    throw new Error(`Invalid time slot format: ${timeSlot}`);
  }

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const ampm = match[3].toUpperCase();

  if (ampm === 'PM' && hour !== 12) {
    hour += 12;
  } else if (ampm === 'AM' && hour === 12) {
    hour = 0;
  }

  let endHour = hour;
  let endMinute = minute + 30;
  if (endMinute === 60) {
    endMinute = 0;
    endHour += 1;
  }

  const start = `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+05:30`;
  const end = `${date}T${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00+05:30`;

  return { start, end };
}

// Insert appointment event into Google Calendar
export async function createGoogleCalendarEvent(
  branchId: string,
  appointment: {
    name: string;
    phone: string;
    email: string;
    date: string;
    time: string;
    complaint?: string;
  }
): Promise<string> {
  const calendarId = CALENDAR_IDS[branchId];
  const branchName = BRANCH_NAMES[branchId] || branchId;
  const location = BRANCH_LOCATIONS[branchId] || '';

  if (!calendarId) {
    throw new Error(`Invalid branch identifier: ${branchId}`);
  }

  if (!isGoogleConfigured || !googleCalendarClient) {
    console.warn('Google Calendar credentials not configured. Event not inserted in remote calendar.');
    return 'mock-google-event-id';
  }

  const { start, end } = convertSlotToISOTime(appointment.date, appointment.time);

  // Exact description format matching the specification brief
  const description = `===============================================
PATIENT RESERVATION DATA DATA BRIEF
===============================================
Patient Full Name   : ${appointment.name}
Contact Phone No    : ${appointment.phone}
Email Address       : ${appointment.email || 'N/A'}

CHIEF COMPLAINT:
${appointment.complaint || 'None'}

===============================================
Telemetry Origin: Live Web App Booking Engine
===============================================`;

  try {
    const response = await googleCalendarClient.events.insert({
      calendarId,
      requestBody: {
        summary: `${appointment.name} — Dental Appointment (${branchName} Clinic)`,
        location,
        description,
        start: {
          dateTime: start,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: end,
          timeZone: 'Asia/Kolkata',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 30 },
            { method: 'email', minutes: 60 },
          ],
        },
      },
    });

    return response.data.id || '';
  } catch (error) {
    console.error('Error inserting event into Google Calendar:', error);
    throw error;
  }
}
