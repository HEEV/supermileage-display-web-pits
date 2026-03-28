import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    url: process.env.MQTT_URL,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  });
}