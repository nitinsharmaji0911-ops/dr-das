import { NextResponse } from 'next/server';
import { getBusyIntervals, convertSlotToISOTime, createGoogleCalendarEvent } from '@/lib/googleCalendar';

// Helper to write to Upstash Redis
interface Booking {
  id: string;
  created_at: string;
  branch: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  complaint?: string;
  googleEventId?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

// Helper to write to Upstash Redis
async function getRedisBookings(): Promise<Booking[]> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return [];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', 'bookings']),
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    const result = data.result;
    return typeof result === 'string' ? JSON.parse(result) : result || [];
  } catch (error) {
    console.error('Error reading bookings from Redis:', error);
    return [];
  }
}

async function saveRedisBookings(bookings: Booking[]): Promise<void> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', 'bookings', JSON.stringify(bookings)]),
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Failed to save bookings to Redis');
  }
}

// Convert ISO time string like "2026-06-22T14:30:00+05:30" to "02:30 PM"
function convertISOToSlotTime(isoString: string): string {
  const match = isoString.match(/T(\d{2}):(\d{2})/);
  if (!match) throw new Error('Invalid ISO string timestamp');
  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { branchId, dateTimeSlot, name, phone, email, complaint } = body;

    // 1. Telemetry input validation
    if (!branchId || !dateTimeSlot || !name || !phone) {
      return NextResponse.json({ error: 'Missing mandatory fields' }, { status: 400 });
    }

    // Name: Alpha-spaces only, length >= 2
    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(name.trim())) {
      return NextResponse.json({ error: 'Name must contain only alphabets and spaces, and be at least 2 characters long.' }, { status: 400 });
    }

    // Phone: Indian numeric/tel format
    // Standard Indian phone numbers are 10 digits, optionally starting with +91 or 91
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json({ error: 'Invalid Indian phone number format. Provide a valid 10-digit number.' }, { status: 400 });
    }

    // Email: RFC 5322 regex validation (if email provided)
    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email address format.' }, { status: 400 });
      }
    }

    // Parse date and time from ISO timestamp
    const date = dateTimeSlot.split('T')[0];
    const time = convertISOToSlotTime(dateTimeSlot);

    // Sanitize chief complaint (optional) - strip html tags
    const sanitizedComplaint = complaint ? complaint.replace(/<[^>]*>/g, '').trim() : '';

    // 2. Concurrency Validation (double-booking check immediately prior to insert)
    let busyIntervals: { start: string; end: string }[] = [];
    try {
      busyIntervals = await getBusyIntervals(branchId, date);
    } catch {
      console.warn('Freebusy check failed. Proceeding with database check.');
    }

    const localBookings = await getRedisBookings();
    const localBusyIntervals = localBookings
      .filter((b: Booking) => b.branch === branchId && b.date === date && b.status !== 'Cancelled')
      .map((b: Booking) => {
        try {
          return convertSlotToISOTime(b.date, b.time);
        } catch {
          return null;
        }
      })
      .filter((interval): interval is { start: string; end: string } => interval !== null);

    const allBusyIntervals = [...busyIntervals, ...localBusyIntervals];

    const { start: targetStartStr, end: targetEndStr } = convertSlotToISOTime(date, time);
    const targetStart = new Date(targetStartStr).getTime();
    const targetEnd = new Date(targetEndStr).getTime();

    const isSlotTaken = allBusyIntervals.some((busy) => {
      const busyStart = new Date(busy.start).getTime();
      const busyEnd = new Date(busy.end).getTime();
      return targetStart < busyEnd && targetEnd > busyStart;
    });

    if (isSlotTaken) {
      return NextResponse.json({ error: 'This time slot is no longer available. Please select another slot.' }, { status: 409 });
    }

    // 3. Create Google Calendar Event
    let googleEventId = '';
    try {
      googleEventId = await createGoogleCalendarEvent(branchId, {
        name,
        phone,
        email,
        date,
        time,
        complaint: sanitizedComplaint,
      });
    } catch (err) {
      console.error('Could not insert event into Google Calendar:', err);
    }

    // 4. Save to Upstash Redis database (compatible with Dashboard)
    // Map branchId back to the simple string for dashboard compatibility
    const dashboardBranchMap: Record<string, string> = {
      'jaripatka-main': 'jaripatka',
      'sadar-suite': 'sadar',
      'indora-laser': 'indora',
    };
    const mappedBranch = dashboardBranchMap[branchId] || branchId;

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      branch: mappedBranch,
      service: 'general', // Default compatible service
      doctor: 'any', // Default compatible doctor
      date,
      time,
      name,
      phone,
      email: email || '',
      complaint: sanitizedComplaint,
      googleEventId,
      status: 'Pending',
    };

    const bookings = await getRedisBookings();
    bookings.unshift(newBooking);
    await saveRedisBookings(bookings);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    const err = error as Error;
    console.error('Error in appointment creation endpoint:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
