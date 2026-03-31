import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

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