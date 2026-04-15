"use client";

import { useState } from "react"
import { pyRuntimeConnect, pyRunSimulation, pyRuntimeDisconnect } from "../lib/runPython";
import { SimulationDataForm } from "@/types/carConfigTypes";
import { HistoryData } from "@/lib/dynamicTelemetry";

export default function SimulationController(props: {
  carData: HistoryData | null;
  publishSim: ((simData:SimulationDataForm)=>void);
}) {
  const [runtimeConnected, setRuntimeConnected] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [estFuelCost, setEstFuelCost] = useState(0);
  const [relativeTime, setRelativeTime] = useState(0);

  if (props.carData && props.carData.time) {
    // set the initial time for when the simulation is run, so we can accurately calculate relativeTime
    setRelativeTime(props.carData.time.getTime());
  }
  
  async function runSimulation(){
    console.log("Running Simulation.")
    setSimRunning(true)
    // console.log(carData.temp, carData.pressure);
    // console.log(carData.speed, carData.distance_traveled, carData.time, carData.selectedCar, carData.fuel, carData.burnsUsed, carData);
    if(props.carData){ // carData needs to exist
      // track length for Shell: 2.39072566 * 5280 ft (4 laps total)
      //TODO - what units is distance_traveled? does this calculation need to be adjusted (track length in ft)
      console.log("Before Fuel: ", estFuelCost);
      console.log("Before Distance: ", props.carData.distance_traveled);
      const lapNum = Math.ceil(props.carData.distance_traveled / (2.39072566 * 5280)); //hardcoded for Shell Track
      console.log("Lap Number: ", lapNum);
      if(props.carData.time){
        setRelativeTime(props.carData.time.getTime() - relativeTime)
      }
      const result = await pyRunSimulation("simulation_data", "Gold Lightning II", "Ima Placeholder", "indy", 
                                           70, 14.6957, props.carData.speed, relativeTime, estFuelCost, 0, lapNum);
      setSimRunning(false)
      console.log("Simulation Finished.");
      setEstFuelCost(result[0]);
      console.log("After Fuel: ", estFuelCost);
      const simData = result[1];
      // simData is a list of lists of dictionaries. Each item in simData is a burn/coast strategy for a lap of the race
      props.publishSim(simData[0]); // sends only the first lap to the car to display
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
      props.publishSim(simData[0]); // sends only first lap of data
    }
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