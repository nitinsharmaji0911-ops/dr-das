import { NextResponse } from 'next/server';
import { getBusyIntervals, convertSlotToISOTime } from '@/lib/googleCalendar';

// Helper to fetch bookings from Redis for local fallback
async function getRedisBookings(): Promise<any[]> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    console.warn('Redis credentials not found.');
    return [];
  }

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

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const result = data.result;
    return typeof result === 'string' ? JSON.parse(result) : result || [];
  } catch (error) {
    console.error('Error reading bookings from Redis:', error);
    return [];
  }
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
    let busyIntervals: any[] = [];
    try {
      busyIntervals = await getBusyIntervals(branchId, date);
    } catch (error) {
      console.warn('Google Calendar freebusy query failed. Proceeding with database fallback.', error);
    }

    // 2. Fetch busy intervals from local Redis DB (fallback and dashboard alignment)
    const localBookings = await getRedisBookings();
    const localBusyIntervals = localBookings
      .filter((b: any) => b.branch === branchId && b.date === date && b.status !== 'Cancelled')
      .map((b: any) => {
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
      } catch (err) {
        return {
          time: timeStr,
          available: false,
        };
      }
    });

    return NextResponse.json({ slots });
  } catch (error: any) {
    console.error('Error inside slots API endpoint:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
