'use client'

import BackButton from '@/components/ui/backButton'
import { Trash2 } from "lucide-react";
import { useMqtt } from '@/hooks/use-mqtt'
import { useState, useMemo } from 'react'

interface Channel {
  id: number;
  name: string;
  unit: string;
  conversionFactor: string;
  inputType: string;
  min?: string;
  max?: string;
}

export default function ConfigPage() {

  const [selectedCar, setSelectedCar] = useState<string>("karch");
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
      unit: "MPH ",
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
      min: "",
      max: "",
    },
  ]);

  const mqttOptions = useMemo(() => ({
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
  }), []);

  const {publish, isConnected } = useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    topic: `cars/${selectedCar}/config`,
    options: mqttOptions
  })

  const handleCarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCar(e.target.value);
  }

  const updateChannel = (
    index: number,
    field: keyof Channel,
    value: string
  ) => {
    setChannels((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  const deleteChannel = (index: number) => {
    setChannels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sensorsConfig: Record<string, any> = {};
    channels.forEach((channel, index) => {
      sensorsConfig[`channel${index + 1}`] = {
        name: channel.name,
        unit: channel.unit,
        conversion_factor:
          parseFloat(channel.conversionFactor) || 0,
        input_type: channel.inputType,
        limits: {
          min: parseFloat(channel.min ?? "0") || 0,
          max: parseFloat(channel.max ?? "0") || 0,
        },
      };
    });

    const cars = {
      [selectedCar]: {
        active: active,
        theme: theme,
        selected_driver: selectedDriver,
        metadata: {
          weight: parseFloat(weight),
          power_plant: powerPlant,
        },
        sensors: sensorsConfig,
      },
    };
    const payload = JSON.stringify(cars);
    publish(`cars/${selectedCar}/config`, payload, { 
      retain: true, 
      qos: 1 
    });
  };

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
      <button 
        onClick={handleSave}
        disabled={!isConnected}
        className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
        >
        Push Changes
      </button>
      <div className="space-y-4 mb-6">
        <div>
          <label>Active</label>
          <select
            value={active ? "true" : "false"}
            onChange={(e) => setActive(e.target.value === "true")}
            className="ml-2 p-2 rounded bg-slate-800"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        </div>
        <div>
          <label>Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="ml-2 p-2 rounded bg-slate-800"
          >
            <option value="default">Default</option>
            <option value="color-blind">Color Blind</option>
          </select>
        </div>
        <div>
          <label>Driver</label>
          <input
            type="text"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="ml-2 p-2 rounded bg-slate-800"
          />
        </div>
        <div>
          <label>Race</label>
          <input
            type="text"
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            className="ml-2 p-2 rounded bg-slate-800"
          />
        </div>
        <div>
          <label>Weight</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="ml-2 p-2 rounded bg-slate-800"
          />
        </div>
        <div>
          <label>Power Plant</label>
          <select
            value={powerPlant}
            onChange={(e) => setPowerPlant(e.target.value)}
            className="ml-2 p-2 rounded bg-slate-800"
          >
            <option value="gasoline">Gasoline</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Channels</h2>

          {channels.map((channel, index) => (
            <div key={channel.id} className="relative border p-4 rounded bg-slate-900">
              <button
                onClick={() => deleteChannel(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
              >
                <Trash2 size={18} />
              </button>

              <h3 className="mb-2">Channel {index + 1}</h3>
              <input
                type="text"
                value={channel.name}
                placeholder="Name"
                onChange={(e) =>
                  updateChannel(index, "name", e.target.value)
                }
                className="p-2 mr-2 mb-2 bg-slate-800 rounded"
              />
              <input
                type="text"
                value={channel.unit}
                placeholder="Unit"
                onChange={(e) =>
                  updateChannel(index, "unit", e.target.value)
                }
                className="p-2 mr-2 mb-2 bg-slate-800 rounded"
              />
              <input
                type="number"
                value={channel.conversionFactor}
                placeholder="Conversion"
                onChange={(e) =>
                  updateChannel(index, "conversionFactor", e.target.value)
                }
                className="p-2 mr-2 mb-2 bg-slate-800 rounded"
              />
              <select
                value={channel.inputType}
                onChange={(e) =>
                  updateChannel(index, "inputType", e.target.value)
                }
                className="p-2 mr-2 mb-2 bg-slate-800 rounded"
              >
                <option value="analog">Analog</option>
                <option value="digital">Digital</option>
              </select>
              <input
                type="number"
                value={channel.min}
                placeholder="Min"
                onChange={(e) =>
                  updateChannel(index, "min", e.target.value)
                }
                className="p-2 mr-2 mb-2 bg-slate-800 rounded"
              />
              <input
                type="number"
                value={channel.max}
                placeholder="Max"
                onChange={(e) =>
                  updateChannel(index, "max", e.target.value)
                }
                className="p-2 mr-2 mb-2 bg-slate-800 rounded"
              />
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() =>
          setChannels((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              name: "",
              unit: "",
              conversionFactor: "0",
              inputType: "analog",
              min: "",
              max: "",
            },
          ])
        }
        className="bg-green-600 px-3 py-1 rounded mt-4"
      >
        Add Channel
      </button>
    </div>
  )
}