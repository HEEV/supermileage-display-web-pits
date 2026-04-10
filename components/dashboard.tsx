'use client'

import { useMemo, useState } from "react"
import BackButton from "./backButton"
import IndicatorIcon from "./iconWidget"
import { useMqtt } from "@/hooks/use-mqtt"

import Speedometer from "@/components/speedometer"
import TrackView from "@/components/trackView"
import WindSpeedometer from "@/components/windSpeedometer"
import TempGauge from "@/components/tempGauge"

import {
  buildHistoryPacket,
  getOptionalNumberValue,
  isTruthyStatus,
} from "@/lib/dynamicTelemetry"

type DashboardMode = "public" | "single"

interface DashboardProps {
  mode: DashboardMode
  carId?: "karch" | "sting"
  authToken?: string
  onAuthFailure?: () => void
}

function parseMessage(msg?: string) {
  if (!msg) return null
  try {
    return buildHistoryPacket(JSON.parse(msg.replace(/'/g, '"')))
  } catch {
    return null
  }
}

export default function Dashboard({
  mode,
  carId,
  authToken,
  onAuthFailure,
}: DashboardProps) {

  const mqttOptions = useMemo(() => {
    if (mode === "single") {
      return {
        username: authToken as string,
        password: "empty",
      }
    }

    return {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME as string,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD as string,
    }
  }, [mode, authToken])

  const baseConfig = {
    uri: process.env.NEXT_PUBLIC_MQTT_URL as string,
    options: mqttOptions,
  }

  const karch = useMqtt({
    ...baseConfig,
    topic: "cars/karch/data",
    enabled: mode === "public",
  })

  const sting = useMqtt({
    ...baseConfig,
    topic: "cars/sting/data",
    enabled: mode === "public",
  })

  const single = useMqtt({
    ...baseConfig,
    topic: `cars/${carId}/data`,
    enabled: mode === "single",
    onAuthFailure,
  })

  const karchData = parseMessage(karch.lastMessage?.message)
  const stingData = parseMessage(sting.lastMessage?.message)
  const singleData = parseMessage(single.lastMessage?.message)

  const availableCars =
    mode === "public"
      ? ([
          karch.isConnected && karchData ? "karch" : null,
          sting.isConnected && stingData ? "sting" : null,
        ].filter(Boolean) as ("karch" | "sting")[])
      : []

  const [manualSelection, setManualSelection] =
    useState<"karch" | "sting" | null>(null)

  const activeCar =
    mode === "public"
      ? manualSelection ?? availableCars[0] ?? null
      : carId ?? null

  const carData =
    mode === "public"
      ? activeCar === "karch"
        ? karchData
        : activeCar === "sting"
        ? stingData
        : null
      : singleData

      if (!activeCar || !carData) {
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
            
            {mode === "single" && (
              <div className="absolute top-4 left-4">
                <BackButton />
              </div>
            )}
      
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">No Car Connected</h1>
              <p className="text-zinc-400">Waiting for telemetry...</p>
            </div>
          </div>
        )
      }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="grid grid-cols-3 items-center mb-6">
        <div className="flex items-center">
          {mode === "single" && <BackButton />}
        </div>

        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-center">
            {activeCar === "karch"
              ? "Karcharius Dashboard"
              : "Sting Dashboard"}
          </h1>
        </div>
        <div className="flex justify-end">
          {mode === "public" && availableCars.length === 2 && (
            <select
              value={manualSelection ?? ""}
              onChange={(e) =>
                setManualSelection(e.target.value as "karch" | "sting")
              }
              className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded"
            >
              <option value="karch">Karcharius</option>
              <option value="sting">Sting</option>
            </select>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[250px_1fr_250px] gap-6">
        <div className="flex flex-col gap-4">

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <TrackView
              trackName="ShellTrackFixed"
              distanceTraveled={carData.distance_traveled || 0}
              scale={100}
              resetTriggered={isTruthyStatus(carData.timer_reset_button)}
            />
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <h2 className="text-cyan-400 text-xs font-bold tracking-wider">
              VEHICLE TEMPS
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <TempGauge label="Engine" value={carData.engine_temp || 0} />
              <TempGauge label="Radiator" value={carData.rad_temp || 0} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <h2 className="text-cyan-400 text-xs font-bold tracking-wider">
              VOLTAGE
            </h2>
            <div className="text-3xl font-bold flex justify-center">
              {getOptionalNumberValue(carData.voltage) !== undefined
                ? `${carData.voltage} v`
                : "--"}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-6">
          <Speedometer
            value={carData.speed || 0}
            min={0}
            max={100}
            unit="MPH"
            animate
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3">
            <WindSpeedometer
              windSpeed={Math.trunc(carData.airspeed * 10) / 10 || 0}
              relativeSpeed={
                Math.trunc((carData.speed - carData.airspeed) * 10) / 10 || 0
              }
              speedType="real"
              noBackground
              windDir={180}
              displayUnits
            />
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 space-y-3">
            <h2 className="text-cyan-400 text-xs font-bold tracking-wider">
              ENGINE STATUS
            </h2>
            <div className="grid grid-rows-2 gap-2">
              <IndicatorIcon
                on={isTruthyStatus(carData.engine_armed)}
                text="Armed"
              />
              <IndicatorIcon
                on={isTruthyStatus(carData.engine_on)}
                text="Running"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}