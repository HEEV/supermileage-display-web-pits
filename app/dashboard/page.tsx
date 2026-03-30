"use client";

import BackButton from "@/components/ui/backButton";
import {useMqtt} from "@/hooks/use-mqtt";
import {useMemo} from "react";
import {useSearchParams, useRouter} from "next/navigation";  

export default function DashboardPage() {


  const searchParams = useSearchParams()
  const router = useRouter()
  
  const selectedCar = searchParams.get('car') || 'karch'

  const mqttOptions = useMemo(() => ({
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
  }), []);

  const { isConnected, lastMessage } = useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    topic: `cars/${selectedCar}/data`,
    options: mqttOptions
  });

  const carData = useMemo(() => {
    if (!lastMessage) return null;
  
    try {
      const sanitized = lastMessage.message.replace(/'/g, '"');
      return JSON.parse(sanitized);
    } catch (_error) {
      console.error("MQTT Parse Error. Raw message was:", lastMessage.message);
      return null;
    }
  }, [lastMessage]);

  return (
    <div style={{ padding: '2rem', position: 'relative'}}>
      <BackButton />
      <select 
        value={selectedCar} 
        onChange={(e) => router.push(`?car=${e.target.value}`)}
        className="mb-4 p-2 border rounded text-white"
      >
        <option value="karch">Karcharius</option>
        <option value="sting">Sting</option>
      </select>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <p>
        Speed: {carData ? carData.speed : "--"} mph
      </p>
      <p>
        Air Speed: {carData ? carData.airspeed : "--"} mph
      </p>
      <p>
        Engine Temp: {carData ? carData.engine_temp : "--"} °F
      </p>
      <p>
        Rad Temp: {carData ? carData.rad_temp : "--"} °F
      </p>
      <p>
        Distance Traveled: {carData ? carData.distance_traveled : "--"}
      </p>  
      <p>
        Time: {carData ? carData.time : "--"} 
      </p>
    </div>
  );
}
