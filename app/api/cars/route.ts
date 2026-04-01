import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching cars: ${error}` }, { status: 500 });
  }
}

export const runtime = 'edge';