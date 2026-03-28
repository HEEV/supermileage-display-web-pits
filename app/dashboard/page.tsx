"use client";

import BackButton from "@/components/ui/backButton";
import {useMqtt} from "@/hooks/use-mqtt";
import {useState, useMemo} from "react";

export default function DashboardPage() {

  const [selectedCar, setSelectedCar] = useState<string>("karch");

  const { isConnected, lastMessage } = useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    topic: `cars/${selectedCar}/data`,
    options: {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
      clientId: `web-dashboard-${Math.random().toString(16).slice(2, 8)}`,
    }
  });

  const carData = useMemo(() => {
    if (!lastMessage) return null;
  
    try {
      // 2. SANITIZE: Replace single quotes with double quotes so it becomes valid JSON
      const sanitized = lastMessage.message.replace(/'/g, '"');
      return JSON.parse(sanitized);
    } catch (_error) {
      console.error("MQTT Parse Error. Raw message was:", lastMessage.message);
      return null;
    }
  }, [lastMessage]);

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
  }
  return (
    <div style={{ padding: '2rem', position: 'relative'}}>
      <BackButton />
      <select 
        value={selectedCar} 
        onChange={handleCarChange}
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
