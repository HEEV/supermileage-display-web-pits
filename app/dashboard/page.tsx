"use client";

import BackButton from "@/components/ui/backButton"
import { useMqtt } from "@/hooks/use-mqtt"
import { Suspense, useMemo, useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Speedometer from "@/components/ui/speedometer";
import TrackView from "@/components/trackView";
import WindSpeedometer from "@/components/ui/windSpeedometer";
import TempGauge from "@/components/ui/tempGauge";

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [startNewRace, setStartNewRace] = useState(false);
  const prevDistance = useRef<number | null>(null);
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

  useEffect(() => {
    if (carData?.distance_traveled !== undefined) {
      if (
        prevDistance.current !== null &&
        carData.distance_traveled < prevDistance.current
      ) {
        // reset detected
        setStartNewRace(true);
        setTimeout(() => setStartNewRace(false), 100);
      }

      prevDistance.current = carData.distance_traveled;
    }
  }, [carData?.distance_traveled]);

  return (
    <div style={{ padding: '2rem', position: 'relative'}}>
      <BackButton />
      {/* <select 
        value={selectedCar} 
        onChange={(e) => router.push(`?car=${e.target.value}`)}
        className="mb-4 p-2 border rounded text-white"
      >
        <option value="karch">Karcharius</option>
        <option value="sting">Sting</option>
      </select> */}
      <h1 className="text-4xl font-bold mb-6">
        {selectedCar === 'karch' ? 'Karcharius' : 'Sting'} Dashboard
      </h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      <Speedometer
        value={carData?.speed || 0}
        min={0}
        max={100}
        unit="MPH"
        burnCountdownTime={10000}
        coastCountdownTime={5000}
        animate={true}
      />
      <WindSpeedometer
        windSpeed={Math.trunc(carData?.airspeed * 10) / 10 || 0}
        relativeSpeed={Math.trunc((carData?.speed - carData?.airspeed) * 10) / 10 || 0}
        speedType={'real'}
        noBackground
        windDir={180}
        displayUnits={true}
      />
      <TempGauge label="Engine Temp" value={carData?.engine_temp || 0} max={300} />
      <TempGauge label="Rad Temp" value={carData?.rad_temp || 0} max={250} />
      <TrackView
        trackName='ShellTrackFixed'
        distanceTraveled={carData?.distance_traveled || 0}
        scale={100}
        resetTriggered={startNewRace}
      />  
      <button
        onClick={() => {
          setStartNewRace(true);
          setTimeout(() => setStartNewRace(false), 100);
        }}
        className="bg-red-600 px-3 py-1 rounded"
      >
        Reset Track
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}