import mqtt, { MqttClient } from "mqtt";

let client: MqttClient | null = null;

const latestMessages: Record<string, unknown> = {};

export function getMqttClient() {
    
  if (!client) {
    client = mqtt.connect(process.env.MQTT_URL as string, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    });

    client.on("connect", () => {
      client!.subscribe("cars/+/data");
      client!.subscribe("cars/+/config");
    });

    client.on("message", (topic, payload) => {
      try {
        const parsed = JSON.parse(payload.toString().replace(/'/g, '"'));
        latestMessages[topic] = parsed;
        //console.log('RECEIVED:', topic, parsed.toString());
      } catch {
        latestMessages[topic] = payload.toString();
      }
    });

    client.on("error", (err) => {
      console.error("MQTT error:", err);
    });
  }

  return { client, latestMessages };
}