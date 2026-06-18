import { NextResponse } from 'next/server';
import { getBusyIntervals, convertSlotToISOTime, createGoogleCalendarEvent } from '@/lib/googleCalendar';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

// Interface definition for TypeScript
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

// ─── Local Filesystem Helpers ───

async function getLocalBookings(): Promise<Booking[]> {
  try {
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      fs.writeFileSync(dbPath, '[]');
      return [];
    }
    const content = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (e) {
    console.error("Local DB read error in create route:", e);
    return [];
  }
}

async function saveLocalBookings(bookings: Booking[]): Promise<void> {
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(bookings, null, 2));
  } catch (e) {
    console.error("Local DB write error in create route:", e);
  }
}

// ─── Upstash Redis Helpers ───

async function redisCommand(command: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error('Redis credentials not set.');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Redis command error: ${err}`);
  }

  const data = await response.json();
  return data.result;
}

async function getRedisBookings(): Promise<Booking[]> {
  const result = await redisCommand(['GET', 'bookings']);
  if (!result) return [];
  try {
    return typeof result === 'string' ? JSON.parse(result) : (result as Booking[]);
  } catch {
    return [];
  }
}

async function saveRedisBookings(bookings: Booking[]): Promise<void> {
  await redisCommand(['SET', 'bookings', JSON.stringify(bookings)]);
}

// ─── Universal Booking Fetcher ───

async function getAllBookings(): Promise<Booking[]> {
  // 1. Try Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Booking[];
    } catch (e) {
      console.error('Supabase read failed, falling back:', e);
    }
  }

  // 2. Try Redis
  try {
    return await getRedisBookings();
  } catch (e) {
    console.error('Redis read failed, falling back to local file:', e);
  }

  // 3. Fallback to Local file
  return await getLocalBookings();
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

    // 2. Concurrency Validation
    let busyIntervals: { start: string; end: string }[] = [];
    try {
      busyIntervals = await getBusyIntervals(branchId, date);
    } catch {
      console.warn('Freebusy check failed. Proceeding with database check.');
    }

    const localBookings = await getAllBookings();
    
    const dashboardBranchMap: Record<string, string> = {
      'jaripatka-main': 'jaripatka',
      'sadar-suite': 'sadar',
      'indora-laser': 'indora',
    };
    const mappedBranch = dashboardBranchMap[branchId] || branchId;

    const localBusyIntervals = localBookings
      .filter((b: Booking) => (b.branch === branchId || b.branch === mappedBranch) && b.date === date && b.status !== 'Cancelled')
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

    // 4. Save Booking with Fallbacks
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      branch: mappedBranch,
      service: 'general', 
      doctor: 'any', 
      date,
      time,
      name,
      phone,
      email: email || '',
      complaint: sanitizedComplaint,
      googleEventId,
      status: 'Pending',
    };

    let saved = false;

    // A. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .insert([newBooking]);
        if (!error) saved = true;
      } catch (e) {
        console.error('Supabase write failed, falling back:', e);
      }
    }

    // B. Try Upstash Redis
    if (!saved) {
      try {
        const bookings = await getRedisBookings();
        bookings.unshift(newBooking);
        await saveRedisBookings(bookings);
        saved = true;
      } catch (e) {
        console.error('Redis write failed, falling back to local file:', e);
      }
    }

    // C. Fallback to Local file
    if (!saved) {
      const bookings = await getLocalBookings();
      bookings.unshift(newBooking);
      await saveLocalBookings(bookings);
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    const err = error as Error;
    console.error('Error in appointment creation endpoint:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
