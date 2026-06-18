import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
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
      // Ensure directory exists
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

// ─── Upstash Redis Helpers ───

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

// ─── POST endpoint: create a new booking ───

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { branch, service, doctor, date, time, name, phone, email } = body;

    // Validation
    if (!branch || !service || !doctor || !date || !time || !name || !phone) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    const newBooking: Booking = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      branch,
      service,
      doctor,
      date,
      time,
      name,
      phone,
      email: email || '',
      status: 'Pending',
    };

    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('bookings')
          .insert([newBooking]);
        
        if (error) throw error;
        return NextResponse.json({ success: true, booking: newBooking });
      } catch (supabaseError) {
        console.error('Supabase write failed, falling back:', supabaseError);
      }
    }

    // 2. Try Upstash Redis
    try {
      const bookings = await getBookings();
      bookings.unshift(newBooking); // newest first
      await saveBookings(bookings);
      return NextResponse.json({ success: true, booking: newBooking });
    } catch (redisError) {
      console.error('Redis write failed, falling back to local file:', redisError);
      
      // 3. Fallback to Local JSON file
      const bookings = await getLocalBookings();
      bookings.unshift(newBooking);
      await saveLocalBookings(bookings);
      return NextResponse.json({ success: true, booking: newBooking });
    }
  } catch (error) {
    const err = error as Error;
    console.error('API POST error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// ─── GET endpoint: list all bookings ───

export async function GET() {
  try {
    // 1. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
      } catch (supabaseError) {
        console.error('Supabase read failed, falling back:', supabaseError);
      }
    }

    // 2. Try Upstash Redis
    try {
      const bookings = await getBookings();
      return NextResponse.json(bookings);
    } catch (redisError) {
      console.error('Redis read failed, falling back to local file:', redisError);
      
      // 3. Fallback to Local JSON file
      const bookings = await getLocalBookings();
      return NextResponse.json(bookings);
    }
  } catch (error) {
    const err = error as Error;
    console.error('API GET error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
