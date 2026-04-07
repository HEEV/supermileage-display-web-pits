"use client";

import BackButton from "@/components/ui/backButton"
import { clearAuthToken, getAuthToken } from "@/lib/auth"
import { useMqtt } from "@/hooks/use-mqtt"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function DashboardContent({ authToken, onAuthFailure }: { authToken: string; onAuthFailure: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedCar = searchParams.get('car') || 'karch'

  // TODO: the problem is probably not here, but with how the backend auth server returns. Probably not what the mosquitto broker plugin expects.
  const mqttOptions = useMemo(() => ({
    username: authToken,
    password: 'empty'
  }), [authToken])

  const { isConnected, lastMessage } = useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    topic: `cars/${selectedCar}/data`,
    options: mqttOptions,
    onAuthFailure
  })

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

export default function DashboardPage() {
  const router = useRouter()
  const [authToken, setAuthToken] = useState<string | null>(() => getAuthToken())

  const handleAuthFailure = useCallback(() => {
    clearAuthToken()
    setAuthToken(null)
    router.replace('/login')
  }, [router])

  useEffect(() => {
    if (!authToken) {
      router.replace('/login')
    }
  }, [authToken, router])

  if (!authToken) {
    return <div style={{ padding: '2rem' }}>Loading dashboard...</div>
  }

  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading dashboard...</div>}>
      <DashboardContent authToken={authToken} onAuthFailure={handleAuthFailure} />
    </Suspense>
  )
}