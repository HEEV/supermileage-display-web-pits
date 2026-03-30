import { NextResponse } from "next/server";
import { getMqttClient } from "@/lib/mqtt";

export async function GET(req: Request) {
  const { latestMessages } = getMqttClient();

  const { searchParams } = new URL(req.url);
  const car = searchParams.get("car") || "karch";

  const topic = `cars/${car}/data`;

  return NextResponse.json({
    data: latestMessages[topic] || null,
  });
}

export const runtime = "nodejs";