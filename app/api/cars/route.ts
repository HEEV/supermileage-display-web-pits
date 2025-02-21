import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      select: {
        car_name: true,
        car_id: true,
      },
    });
    return NextResponse.json(cars);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching cars: ${error}` }, { status: 500 });
  }
}

export const runtime = 'edge';