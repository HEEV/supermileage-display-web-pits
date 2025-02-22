import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

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
      orderBy: {
        time: 'desc',
      },
      select: {
        voltage: true,
        speed: true,
        engine_temp: true,
        wind_speed: true,
        distance_traveled: true,
        time: true,
      },
    });

    const serializedCarData = {
      ...carData,
      time: carData?.time ? carData.time.toString() : null
    }

    return NextResponse.json(serializedCarData);
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

    await prisma.car_data.create({
      data: {
        car_id: Number(car_id),
        voltage: Number(voltage),
        speed: Number(speed),
        engine_temp: Number(engine_temp),
        wind_speed: Number(wind_speed),
        distance_traveled: Number(distance_traveled),
        time: BigInt(time),
      },
    });

    return NextResponse.json("Success", { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: `Error inserting car data: ${error}` }, { status: 500 });
  }
}

export const runtime = 'edge';