"use client";

import BackButton from "@/components/ui/backButton"
import { clearAuthToken, getAuthToken } from "@/lib/auth"
import { useMqtt } from "@/hooks/use-mqtt"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { pyRuntimeConnect, pyRunSimulation, pyRuntimeDisconnect } from "../../lib/runPython";
import { SimulationDataForm } from "@/types/carConfigTypes";

const LOGIN_EXPIRED_PATH = '/login?reason=session-expired'

function DashboardContent({ authToken, onAuthFailure }: { authToken: string; onAuthFailure: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [runtimeConnected, setRuntimeConnected] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [estFuelCost, setEstFuelCost] = useState(0);
  const selectedCar = searchParams.get('car') || 'karch'

  // TODO: the problem is probably not here, but with how the backend auth server returns. Probably not what the mosquitto broker plugin expects.
  const mqttOptions = useMemo(() => ({
    username: authToken,
    password: 'empty'
  }), [authToken])

  const { publish, isConnected, lastMessage } = useMqtt({
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

  async function runSimulation(){
    console.log("Running Simulation.")
    setSimRunning(true)
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
      setSimRunning(false)
      console.log("Simulation Finished.");
      setEstFuelCost(result[0]);
      console.log("After Fuel: ", estFuelCost);
      const simData = result[1];
      // simData is a list of lists of dictionaries. Each item in simData is a burn/coast strategy for a lap of the race
      sendSimData(simData[0]); // sends only the first lap to the car to display
      console.log("Data: " + simData[0]);
    } else {
      // run default simulation for testing
      console.log("Before Fuel: ", estFuelCost);
      const defaultResult = await pyRunSimulation("simulation_data", "Gold Lightning II", "Ima Placeholder", "indy", 
                                                  70, 14.6957, 0, 0, estFuelCost, 0, 1);
      setSimRunning(false)
      setEstFuelCost(defaultResult[0]);
      console.log("After Fuel: ", defaultResult[0]);
      const simData = defaultResult[1];
      sendSimData(simData[0]); // sends only first lap of data
    }
  };

  const sendSimData = (simData: SimulationDataForm) => {
    publish(`cars/${selectedCar}/sim`, JSON.stringify({ simData: simData }), {
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

  async function handleBack(){
    if (runtimeConnected) {
      await disconnectRuntime();
    }
    router.push('/pit');
  };

  return (
    <div style={{ padding: '2rem', position: 'relative'}}>
      <BackButton onClick={handleBack}/>
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
        disabled={!runtimeConnected || simRunning}
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
  const router = useRouter()
  const [authToken] = useState<string | null>(() => getAuthToken())

  const handleAuthFailure = useCallback(() => {
    clearAuthToken()
    router.replace(LOGIN_EXPIRED_PATH)
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