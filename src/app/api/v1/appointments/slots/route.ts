import { NextResponse } from 'next/server';
import { getBusyIntervals, convertSlotToISOTime } from '@/lib/googleCalendar';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

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
    console.error("Local DB read error in slots:", e);
    return [];
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
      console.error('Supabase read failed in slots, falling back:', e);
    }
  }

  // 2. Try Redis
  try {
    return await getRedisBookings();
  } catch (e) {
    console.error('Redis read failed in slots, falling back to local file:', e);
  }

  // 3. Fallback to Local file
  return await getLocalBookings();
}

// Generate the operational slots based on selected date (day of week)
function generateOperationalSlots(dateStr: string): string[] {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // If Sunday: 11:00 AM to 2:00 PM
  if (day === 0) {
    return [
      '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'
    ];
  }

  // Monday through Saturday: 10:00 AM to 8:00 PM
  return [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM',
    '07:00 PM', '07:30 PM'
  ];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branchId');
    const date = searchParams.get('date');

    if (!branchId || !date) {
      return NextResponse.json({ error: 'branchId and date parameters are required' }, { status: 400 });
    }

    // 1. Fetch busy intervals from Google Calendar
    let busyIntervals: { start: string; end: string }[] = [];
    try {
      busyIntervals = await getBusyIntervals(branchId, date);
    } catch (error) {
      console.warn('Google Calendar freebusy query failed. Proceeding with database fallback.', error);
    }

    // 2. Fetch busy intervals from local Redis DB (fallback and dashboard alignment)
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

    // Merge both sources of busy slots
    const allBusyIntervals = [...busyIntervals, ...localBusyIntervals];

    // 3. Generate candidate operational slots
    const candidateSlots = generateOperationalSlots(date);

    // 4. Filter availability status for each slot
    const slots = candidateSlots.map((timeStr) => {
      try {
        const { start: slotStartStr, end: slotEndStr } = convertSlotToISOTime(date, timeStr);
        const slotStart = new Date(slotStartStr).getTime();
        const slotEnd = new Date(slotEndStr).getTime();

        const isBusy = allBusyIntervals.some((busy) => {
          const busyStart = new Date(busy.start).getTime();
          const busyEnd = new Date(busy.end).getTime();
          // Overlap check: slotStart < busyEnd && slotEnd > busyStart
          return slotStart < busyEnd && slotEnd > busyStart;
        });

        return {
          time: timeStr,
          available: !isBusy,
        };
      } catch {
        return {
          time: timeStr,
          available: false,
        };
      }
    });

    return NextResponse.json({ slots });
  } catch (error) {
    const err = error as Error;
    console.error('Error inside slots API endpoint:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
