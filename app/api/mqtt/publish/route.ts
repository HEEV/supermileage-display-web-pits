import { NextRequest, NextResponse } from "next/server";
import { getMqttClient } from "@/lib/mqtt";

export async function POST(req: NextRequest) {
  try {
    const { topic, message, options } = await req.json();

    const { client } = getMqttClient();

    client.publish(
      topic,
      typeof message === "string" ? message : JSON.stringify(message),
      options || {},
      (err) => {
        if (err) console.error("Publish error:", err);
      }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Publish failed" }, { status: 500 });
  }
}

export const runtime = "nodejs";