import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../../lib/supabase';
import fs from 'fs';
import path from 'path';

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
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

const dbPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

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
    console.error("Local DB read error:", e);
    return [];
  }
}

async function saveLocalBookings(bookings: Booking[]): Promise<void> {
  try {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify(bookings, null, 2));
  } catch (e) {
    console.error("Local DB write error:", e);
  }
}

// ─── Upstash Redis Helper ───

async function redisCommand(command: string[]): Promise<unknown> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error('KV_REST_API_URL and KV_REST_API_TOKEN must be set');
  }

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

async function getBookings(): Promise<Booking[]> {
  const result = await redisCommand(['GET', 'bookings']);
  if (!result) return [];
  try {
    return typeof result === 'string' ? JSON.parse(result) : (result as Booking[]);
  } catch {
    return [];
  }
}

async function saveBookings(bookings: Booking[]): Promise<void> {
  await redisCommand(['SET', 'bookings', JSON.stringify(bookings)]);
}

// ─── PATCH handler: update booking status ───

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid or missing status field' },
        { status: 400 }
      );
    }

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', id)
          .select();

        if (error) throw error;
        if (data && data.length > 0) {
          return NextResponse.json({ success: true, booking: data[0] });
        }
      } catch (supabaseError) {
        console.error('Supabase patch failed, falling back:', supabaseError);
      }
    }

    // 2. Try Upstash Redis
    try {
      const bookings = await getBookings();
      const index = bookings.findIndex((b) => b.id === id);

      if (index !== -1) {
        bookings[index].status = status;
        await saveBookings(bookings);
        return NextResponse.json({ success: true, booking: bookings[index] });
      }
    } catch (redisError) {
      console.error('Redis patch failed, falling back to local file:', redisError);
    }

    // 3. Fallback to Local JSON file
    const bookings = await getLocalBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: 'Appointment booking not found' },
        { status: 404 }
      );
    }

    bookings[index].status = status;
    await saveLocalBookings(bookings);

    return NextResponse.json({ success: true, booking: bookings[index] });
  } catch (error) {
    const err = error as Error;
    console.error('API PATCH error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
