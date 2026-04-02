'use client'

import BackButton from '@/components/ui/backButton'
import { Trash2 } from "lucide-react"
import { useMqtt } from '@/hooks/use-mqtt'
import { Suspense, useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Channel, SensorConfig, CarConfig, CarsConfig, CarFormState } from '@/types/carConfigTypes'
import  ChannelCard  from '@/components/ui/channelCard'
import FormField from '@/components/ui/formField'

export const defaultFormState: CarFormState = {
  active: true,
  theme: "default",
  weight: "30",
  powerPlant: "gasoline",
  selectedDriver: "",
  selectedRace: "Indy 500",
};

function ConfigContent() {
  const [allCarsConfig, setAllCarsConfig] = useState<CarsConfig>({});
  const [formState, setFormState] = useState<CarFormState>(defaultFormState);
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

  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedCar = searchParams.get('car') || 'karch';

  const mqttOptions = useMemo(() => ({
    username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
    password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
  }), []);

  const { publish, isConnected, lastMessage } = useMqtt({
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    topic: `cars/config`,
    options: mqttOptions
  });

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const parsed = JSON.parse(lastMessage.message) as { cars?: CarsConfig };
      const cars: CarsConfig = parsed.cars ?? (parsed as CarsConfig);
      const carConfig = cars[selectedCar];

      if (!carConfig) return;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setFormState({
        active: carConfig.active ?? true,
        theme: carConfig.theme ?? "default",
        selectedDriver: carConfig.selected_driver ?? "",
        selectedRace: "Indy 500",
        weight: String(carConfig.metadata?.weight ?? "0"),
        powerPlant: carConfig.metadata?.power_plant ?? "gasoline",
      });

      if (carConfig.sensors) {
        setChannels(
          Object.values(carConfig.sensors).map((ch, i) => ({
            id: i + 1,
            name: ch.name ?? "",
            unit: ch.unit ?? "",
            conversionFactor: String(ch.conversion_factor ?? "0"),
            inputType: ch.input_type ?? "analog",
            min: String(ch.limits?.min ?? "0"),
            max: String(ch.limits?.max ?? "0"),
          }))
        );
      }

      setAllCarsConfig(cars);
    } catch (err) {
      console.error("Failed to parse config:", err);
    }
  }, [lastMessage, selectedCar]);

  const updateChannel = (index: number, field: keyof Channel, value: string) => {
    setChannels(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = () => {
    const sensorsConfig: Record<string, SensorConfig> = {};
    channels.forEach((channel, index) => {
      sensorsConfig[`channel${index + 1}`] = {
        name: channel.name,
        unit: channel.unit,
        conversion_factor: parseFloat(channel.conversionFactor) || 0,
        input_type: channel.inputType,
        limits: {
          min: parseFloat(channel.min) || 0,
          max: parseFloat(channel.max) || 0,
        },
      };
    });

    const updatedCar: CarConfig = {
      active: formState.active,
      theme: formState.theme,
      selected_driver: formState.selectedDriver,
      metadata: {
        weight: parseFloat(formState.weight),
        power_plant: formState.powerPlant,
      },
      sensors: sensorsConfig,
    };

    const updatedAllCars: CarsConfig = {
      ...allCarsConfig,
      [selectedCar]: updatedCar,
    };

    publish(`cars/config`, JSON.stringify({ cars: updatedAllCars }), {
      retain: true,
      qos: 1
    });

    setAllCarsConfig(updatedAllCars);
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
            <h1 className="text-lg font-bold text-white">Configuration Editor</h1>
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
                <FormField
                  label="Active"
                  type="select"
                  value={formState.active ? "true" : "false"}
                  onChange={(val) =>
                    setFormState(prev => ({ ...prev, active: val === "true" }))
                  }
                  options={[
                    { label: "true", value: "true" },
                    { label: "false", value: "false" }
                  ]}
                />
                <FormField
                  label="Theme"
                  type="select"
                  value={formState.theme}
                  onChange={(val) =>
                    setFormState(prev => ({ ...prev, theme: val }))
                  }
                  options={[
                    { label: "Default", value: "default" },
                    { label: "Colorblind", value: "colorblind" }
                  ]}
                />
                <FormField
                  label="Driver"
                  value={formState.selectedDriver}
                  onChange={(val) =>
                    setFormState(prev => ({ ...prev, selectedDriver: val }))
                  }
                />
                <FormField
                  label="Race"
                  value={formState.selectedRace}
                  onChange={(val) =>
                    setFormState(prev => ({ ...prev, selectedRace: val }))
                  }
                />
            </div>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
              <h3 className="text-sm font-bold text-white mb-4">Metadata</h3>
              <div className="space-y-3">
              <FormField
                label="Weight"
                type="number"
                value={formState.weight}
                onChange={(val) =>
                  setFormState(prev => ({ ...prev, weight: val }))
                }
              />
              <FormField
                label="Power Plant"
                type="select"
                value={formState.powerPlant}
                onChange={(val) =>
                  setFormState(prev => ({ ...prev, powerPlant: val }))
                }
                options={[
                  { label: "Gasoline", value: "gasoline" },
                  { label: "Electric", value: "electric" }
                ]}
              />
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
                    min: "0",
                    max: "0"
                  }])}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
                >
                  Add Channel
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {channels.map((channel, index) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    index={index}
                    onUpdate={updateChannel}
                    onDelete={(i: number) =>
                      setChannels(prev => prev.filter((_, idx) => idx !== i))
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfigPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading config...</div>}>
      <ConfigContent />
    </Suspense>
  );
}