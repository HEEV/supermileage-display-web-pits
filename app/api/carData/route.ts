import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const car_id = searchParams.get('car_id');

  if (!car_id) {
    return NextResponse.json({ error: 'Car ID is required' }, { status: 400 });
  }

  try {
    const carData = await prisma.car_data.findFirst({
      where: {
        car_id: Number(car_id),
      },
      select: {
        voltage: true,
        speed: true,
        engine_temp: true,
        wind_speed: true,
        distance_traveled: true,
      },
    });
    return NextResponse.json(carData);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching car data: ${error}` }, { status: 500 });
  }
}