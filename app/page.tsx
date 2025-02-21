"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import TrackView from "@/components/trackView";
import DataCard from "@/components/dataCard";


interface car_data {
  voltage:           number | null;
  speed:             number | null;
  engine_temp:       number | null;
  wind_speed:        number | null;
  distance_traveled: number | null;
}
interface Car {
  car_name: string | null;
  car_id: number | null;
}

export default function Home() {

  const [carData, setCarData] = useState<car_data>({
    voltage: 0,
    speed: 0,
    engine_temp: 0,
    wind_speed: 0,
    distance_traveled: 0,
  });
  
  const [cars, setCars] = useState<Car[]>([{car_name: "no cars", car_id: 0}]);

  const [carSelected, setCarSelected] = useState<number>(0);

  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch("/api/cars");
      const carsData = await response.json();
      setCars(carsData);
    }

    fetchCars();
  }, []);

  useEffect(() => {
    const fetchCarData = async () => {
      const response = await fetch(`/api/carData/?car_id=${carSelected}`);
      const data = await response.json();
      if (data) {
        setCarData(data);
      }
    }

    fetchCarData();

    const interval = setInterval(fetchCarData, 5000);

    return () => clearInterval(interval);
  }, [carSelected]);


  return (
    <div className="w-full">
      <Tabs defaultValue="Cars" onValueChange={(value) => setCarSelected(Number(value))} className="w-full">
        <TabsList>
          {cars.map((car) => {
            return (
              <TabsTrigger value={String(car.car_id) ?? 0} key={car.car_name}>{car.car_name}</TabsTrigger>
            )
          })} 
        </TabsList>
        {cars.map((car) => {
          return (
            <TabsContent value={String(car.car_id) ?? 0} key={car.car_name}>
              <h1 className="m-5 text-2xl font-bold">{car.car_name}</h1>
              <Card className="w-full grid grid-cols-3 grid-rows-3 justify-items-center items-center">
                <DataCard dataValue={carData.voltage ?? 0} dataName="Volts" />
                <DataCard dataValue={carData.speed ?? 0} dataName="mph" />
                <DataCard dataValue={carData.engine_temp ?? 0} dataName="°F" />
                <DataCard dataValue={carData.distance_traveled ?? 0} dataName="ft" />
                <Card className="w-100 p-5">
                  <TrackView trackName={"ShellTrackFixed"} distanceTraveled={carData.distance_traveled ?? 0} scale={80} />
                </Card>
                <DataCard dataValue={carData.wind_speed ?? 0} dataName="mph" />
                
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  );
}
