'use client'

import BackButton from '@/components/ui/backButton'
import { Trash2 } from "lucide-react"
import { useMqtt } from '@/hooks/use-mqtt'
import { Suspense, useState, useMemo, useEffect } from 'react'
import {useSearchParams, useRouter} from 'next/navigation'

interface Channel {
  id: number;
  name: string;
  unit: string;
  conversionFactor: string;
  inputType: string;
  min: string;
  max: string;
}
interface SensorConfig {
  name?: string;
  unit?: string;
  conversion_factor?: number;
  input_type?: string;
  limits?: {
    min?: number;
    max?: number;
  };
}

interface CarConfig {
  active?: boolean;
  theme?: string;
  selected_driver?: string;
  metadata?: {
    weight?: number;
    power_plant?: string;
  };
  sensors?: Record<string, SensorConfig>;
}
 
type CarsConfig = Record<string, CarConfig>;

const labelMap: Record<string, string> = {
  name: 'Name',
  unit: 'Unit',
  conversionFactor: 'Conversion Factor',
  inputType: 'Input Type',
  min: 'Min Limit',
  max: 'Max Limit'
};

const fields: (keyof Channel)[] = [
  'name',
  'unit',
  'conversionFactor',
  'inputType',
  'min',
  'max'
];

function ConfigContent() {

  const [allCarsConfig, setAllCarsConfig] = useState<CarsConfig>({});
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCar = searchParams.get('car') || 'karch';
  const [active, setActive] = useState(true);
  const [theme, setTheme] = useState("default");
  const [weight, setWeight] = useState("30");
  const [powerPlant, setPowerPlant] = useState("gasoline");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [selectedRace, setSelectedRace] = useState("Indy 500");
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 1,
      name: "Speed",
      unit: "MPH",
      conversionFactor: "50",
      inputType: "analog",
      min: "0",
      max: "300"
    },
    {
      id: 2,
      name: "button",
      unit: "",
      conversionFactor: "0.0",
      inputType: "digital",
      min: "0",
      max: "0"
    },
  ]);

  const mqttOptions = useMemo(() => ({
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
  }), []);

  const { publish, isConnected, lastMessage } = useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    topic: `cars/config`,
    options: mqttOptions
  })

  const updateChannel = (index: number, field: keyof Channel, value: string) => {
    setChannels(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = () => {
    const sensorsConfig: Record<string, unknown> = {};
    channels.forEach((channel, index) => {
      sensorsConfig[`channel${index + 1}`] = {
        name: channel.name,
        unit: channel.unit,
        conversion_factor: parseFloat(channel.conversionFactor) || 0,
        input_type: channel.inputType,
        limits: {
          min: parseFloat(channel.min ?? "0") || 0,
          max: parseFloat(channel.max ?? "0") || 0,
        },
      };
    });

    const updatedCar: CarConfig = {
      active,
      theme,
      selected_driver: selectedDriver,
      metadata: {
        weight: parseFloat(weight),
        power_plant: powerPlant,
      },
      sensors: sensorsConfig as Record<string, SensorConfig>,
    };
  
    const updatedAllCars: CarsConfig = {
      ...allCarsConfig,
      [selectedCar]: updatedCar,
    };

    publish(`cars/config`, JSON.stringify({"cars": updatedAllCars}), {
      retain: true,
      qos: 1
    });
  
    setAllCarsConfig(updatedAllCars);
  };

  useEffect(() => {
    if (!lastMessage) return;
  
    try {
      const parsed = JSON.parse(lastMessage.message) as {cars?: CarsConfig};
      const cars: CarsConfig = 'cars' in parsed ? parsed.cars ?? {} : parsed;
      const carConfig = cars[selectedCar];
  
      if (!carConfig) return;
  
      const newChannels: Channel[] = carConfig.sensors
      ? Object.values(carConfig.sensors).map((ch, i) => ({
          id: i + 1,
          name: ch.name ?? "",
          unit: ch.unit ?? "",
          conversionFactor: String(ch.conversion_factor ?? "0"),
          inputType: ch.input_type ?? "analog",
          min: String(ch.limits?.min ?? "0"),
          max: String(ch.limits?.max ?? "0"),
        }))
      : [];
      setActive(carConfig.active ?? true);
      setTheme(carConfig.theme ?? "default");
      setSelectedDriver(carConfig.selected_driver ?? "");
      setWeight(String(carConfig.metadata?.weight ?? "0"));
      setPowerPlant(carConfig.metadata?.power_plant ?? "gasoline");
      setChannels(newChannels);
      setAllCarsConfig(cars);
    } catch (err) {
      console.error("Failed to parse config:", err);
    }
  }, [lastMessage, selectedCar]);

  return (
    <div className="h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BackButton />
            <div className="w-40">
              <select
                value={selectedCar}
                onChange={(e) => router.push(`?car=${e.target.value}`)}
                className="bg-zinc-800 border border-zinc-700 text-white h-10 rounded w-full px-2"
              >
                <option value="karch">Karcharius</option>
                <option value="sting">Sting</option>
              </select>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Configuration Editor</h1>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={!isConnected}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Push Changes
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-4">General Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Active</label>
                  <select
                    value={active ? "true" : "false"}
                    onChange={(e) => setActive(e.target.value === "true")}
                    className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                  >
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Theme</label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                  >
                    <option value="default">Default</option>
                    <option value="color-blind">Color Blind</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Driver</label>
                  <input
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Race</label>
                  <input
                    value={selectedRace}
                    onChange={(e) => setSelectedRace(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                  />
                </div>
              </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-4">Metadata</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Weight</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Power Plant</label>
                  <select
                    value={powerPlant}
                    onChange={(e) => setPowerPlant(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                  >
                    <option value="gasoline">gasoline</option>
                    <option value="electric">electric</option>
                  </select>
                </div>

              </div>
            </div>
            <div className="col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Sensors</h3>
                <button
                  onClick={() => setChannels(prev => [...prev, {
                    id: prev.length + 1,
                    name: "",
                    unit: "",
                    conversionFactor: "0",
                    inputType: "analog",
                    min: "",
                    max: ""
                  }])}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
                >
                  Add Channel
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {channels.map((channel, index) => (
                  <div key={channel.id} className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3 relative">

                    <div className="flex justify-between mb-3">
                      <h4 className="text-xs font-bold text-cyan-400">CHANNEL {index + 1}</h4>
                      <button onClick={() => setChannels(prev => prev.filter((_, i) => i !== index))}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    <div className="space-y-3">
                    {fields.map((field) => (
                        <div key={field}>
                          <label className="text-xs text-zinc-400 mb-1 block">
                            {labelMap[field]}
                          </label>
                          {field === 'inputType' ? (
                            <select
                              value={channel[field as keyof Channel]}
                              onChange={(e) => updateChannel(index, field as keyof Channel, e.target.value)}
                              className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                            >
                              <option value="analog">analog</option>
                              <option value="digital">digital</option>
                            </select>
                          ) : (
                            <input
                              value={channel[field as keyof Channel]}
                              onChange={(e) => updateChannel(index, field as keyof Channel, e.target.value)}
                              className="bg-zinc-800 border border-zinc-700 text-white w-full p-2 rounded"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConfigPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading config...</div>}>
      <ConfigContent />
    </Suspense>
  )
}