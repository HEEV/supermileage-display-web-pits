import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const car_id = searchParams.get('car_id');

  if (!car_id) {
    return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
  }

  try {

    // return NextResponse.json(serializedCarData);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching car data: ${error}` }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { car_id, voltage, speed, engine_temp, wind_speed, distance_traveled, time } = body;

    if (!car_id || !voltage || !speed || !engine_temp || !wind_speed || !distance_traveled || !time) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    // Does nothing useful currently, used to push to a db

    return NextResponse.json("Success", { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Error inserting car data: ${error}` }, { status: 500 });
  }
}

export const runtime = 'edge';