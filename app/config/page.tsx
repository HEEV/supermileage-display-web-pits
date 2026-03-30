'use client'

import BackButton from '@/components/ui/backButton'
import { Trash2 } from "lucide-react";
import { usePublish } from '@/hooks/usePublish'
import { Suspense, useState } from 'react'
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

const labelMap: Record<string, string> = {
  name: 'Name',
  unit: 'Unit',
  conversionFactor: 'Conversion Factor',
  inputType: 'Input Type',
  min: 'Min Limit',
  max: 'Max Limit'
};

const fields = ['name','unit','conversionFactor','inputType','min','max'];

function ConfigContent() {

  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedCar = searchParams.get('car') || 'karch'
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

  const { publish } = usePublish();

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

    const cars = {
      [selectedCar]: {
        active,
        theme,
        selected_driver: selectedDriver,
        metadata: {
          weight: parseFloat(weight),
          power_plant: powerPlant,
        },
        sensors: sensorsConfig,
      },
    };

    publish(`cars/${selectedCar}/config`, cars, {
      retain: true,
      qos: 1
    });
  };

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