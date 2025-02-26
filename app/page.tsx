"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import TrackView from "@/components/trackView";
import DataCard from "@/components/dataCard";
import { useToast } from "@/hooks/use-toast";


interface CarData {
  voltage:           number | null;
  speed:             number | null;
  engine_temp:       number | null;
  wind_speed:        number | null;
  distance_traveled: number | null;
  timestamp:         string | null;
}

interface Car {
  car_name: string | null;
  car_id: number | null;
}

export default function Home() {
  const isMobile = /Mobi|Android/i.test(navigator?.userAgent);

  const { toast } = useToast();

  const defaultCarData: CarData = {
    voltage: 0,
    speed: 0,
    engine_temp: 0,
    wind_speed: 0,
    distance_traveled: 0,
    timestamp: "0"
  };
  const [carData, setCarData] = useState<CarData>(defaultCarData);
  
  const [cars, setCars] = useState<Car[]>([{car_name: "no cars", car_id: 0}]);

  const [carSelected, setCarSelected] = useState<number>(0);

  // retreive the cars from the db
  useEffect(() => {
    const fetchCars = async () => {
      const response = await fetch("/api/cars");
      const carsData = await response.json();
      setCars(carsData);
    }

    fetchCars();
  }, []);

  // retreive data from the selected car from the db, on a 5 second interval
  useEffect(() => {
    const fetchCarData = async () => {
      const response = await fetch(`/api/carData/?car_id=${carSelected}`);
      const data = await response.json();
      if (data) {
        setCarData(data);

        // If the data is old (>10sec), display a warning, or zero out the data if ancient (>60sec)
        const currTime = Date.now();
        const timeDifference = Number(currTime) - Number(data.time);
        if (data.time && timeDifference > 60000) {
          setCarData(defaultCarData);
          toast({
            title: "Message",
            description: "No recent data to display",
            duration: 2500
          });
          
        }
        else if (data.time && timeDifference > 10000) {
          toast({
            title: "Warning",
            description: "Data is more than 10 seconds old, car may be disconnected",
            variant: "destructive",
            duration: 10000
          });
        }
      }
      else {
        setCarData(defaultCarData);
      }
    }

    fetchCarData();

    const interval = setInterval(fetchCarData, 5000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carSelected]);

  // function dummyDataCreate() {
  //   const dummyData = {
  //     car_id: 1,
  //     voltage: Math.round(Math.random() * 12 * 10) / 10,
  //     speed: Math.round(Math.random() * 100 * 10) / 10,
  //     engine_temp: Math.round(Math.random() * 200 * 10) / 10,
  //     wind_speed: Math.round(Math.random() * 50 * 10) / 10,
  //     distance_traveled: Math.round(Math.random() * 10000),
  //     time: Date.now()
  //   }

  //   fetch("/api/carData", {
  //     method: "POST",
  //     body: JSON.stringify(dummyData),
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   });
  // }

  return (
    <div className="w-full flex flex-col">
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
              <Card className={`w-90% min-w-[830px] m-5 p-2 grid ${isMobile ? "grid-cols-1" : "grid-cols-3"} justify-items-center items-center`}>
                <DataCard dataValue={carData.voltage ?? 0} dataName="Volts" cardTitle="Car Voltage" />
                <DataCard dataValue={carData.speed ?? 0} dataName="mph" cardTitle="Vehicle Speed" />
                <DataCard dataValue={carData.engine_temp ?? 0} dataName="°F" cardTitle="Engine Temp" />
                <DataCard dataValue={carData.distance_traveled ?? 0} dataName="ft" cardTitle="Distance Traveled" />
                <Card className="w-7/8 h-7/8 p-5">
                  <TrackView trackName={"ShellTrackFixed"} distanceTraveled={carData.distance_traveled ?? 0} scale={85} />
                </Card>
                <DataCard dataValue={carData.wind_speed ?? 0} dataName="mph" cardTitle="Relative Windspeed" />
                
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  );
}
