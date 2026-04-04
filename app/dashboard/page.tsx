"use client";

import BackButton from "@/components/ui/backButton"
import { useMqtt } from "@/hooks/use-mqtt"
import { Suspense, useMemo, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { pyRuntimeConnect, pyRunSimulation, pyRuntimeDisconnect } from "./runPython";
import { SimulationDataForm } from "@/types/carConfigTypes";

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [runtimeConnected, setRuntimeConnected] = useState(false);
  const [estFuelCost, setEstFuelCost] = useState(0);
  const selectedCar = searchParams.get('car') || 'karch'

  const mqttOptions = useMemo(() => ({
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
  }), []);

  const { publish, isConnected, lastMessage } = useMqtt({
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

  async function runSimulation(){
    console.log("Running Simulation.")
    // console.log(carData.temp, carData.pressure);
    // console.log(carData.speed, carData.distance_traveled, carData.time, carData.selectedCar, carData.fuel, carData.burnsUsed, carData);
    if(carData){ // carData needs to exist
      // track length for Shell: 2.39072566 * 5280 ft (4 laps total)
      //TODO - what units is distance_traveled? does this calculation need to be adjusted (track length in ft)
      console.log("Before Fuel: ", estFuelCost);
      console.log("Before Distance: ", carData.distance_traveled);
      const lapNum = Math.ceil(carData.distance_traveled / (2.39072566 * 5280)); //hardcoded for Shell Track
      console.log("Lap Number: ", lapNum);
      const result = await pyRunSimulation("simulation_data", "Gold Lightning II", "Ima Placeholder", "indy", 
                                           70, 14.6957, carData.speed, carData.time, estFuelCost, 0, lapNum);
      console.log("Simulation Finished.");
      setEstFuelCost(result[0]);
      console.log("After Fuel: ", estFuelCost);
      const simData = result[1];
      sendSimData(simData);
      console.log("Data: " + simData[0]);
    }
  };

  const sendSimData = (simData: SimulationDataForm) => {
    publish(`cars/${selectedCar}/sim`, JSON.stringify({ simData: simData }), {
      retain: true,
      qos: 1
    });
  };

  async function connectRuntime(){
    const connected = await pyRuntimeConnect();
    setRuntimeConnected(connected);
    console.log("Connection Result: " + connected); 
  };

  async function disconnectRuntime(){
    const connected = await pyRuntimeDisconnect();
    setRuntimeConnected(connected);
    console.log("Connection Result: " + connected); 
  };

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
      <button
        disabled={runtimeConnected}
        onClick={ connectRuntime }
        className="w-full bg-red-600 hover:bg-red-600/90 disabled:opacity-50 py-3 rounded-lg font-semibold"
      >
        Connect to MATLAB Runtime
      </button>
      <button
        onClick={ runSimulation }
        disabled={!runtimeConnected}
        className="w-full bg-red-600 hover:bg-red-600/90 disabled:opacity-50 py-3 rounded-lg font-semibold"
      >
        Run Simulation
      </button>
      <button
        disabled={!runtimeConnected}
        onClick={ disconnectRuntime }
        className="w-full bg-red-600 hover:bg-red-600/90 disabled:opacity-50 py-3 rounded-lg font-semibold"
      >
        Disconnect MATLAB Runtime
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