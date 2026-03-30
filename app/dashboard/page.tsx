"use client";

import BackButton from "@/components/ui/backButton";
import {useMqtt} from "@/hooks/use-mqtt";
import {useState, useMemo} from "react";
import { useCarData } from "@/hooks/useCarData";
import {useSearchParams, useRouter} from "next/navigation";  

export default function DashboardPage() {


  const searchParams = useSearchParams()
  const router = useRouter()
  
  const selectedCar = searchParams.get('car') || 'karch'

  const { data: carData, isConnected } = useCarData(selectedCar);

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
