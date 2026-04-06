export interface Channel {
  id: number;
  name: string;
  unit: string;
  conversionFactor: string;
  inputType: string;
  min: string;
  max: string;
}

export interface SensorConfig {
  name?: string;
  unit?: string;
  conversion_factor?: number;
  input_type?: string;
  limits?: {
    min?: number;
    max?: number;
  };
}

export interface CarConfig {
  active?: boolean;
  theme?: string;
  selected_driver?: string;
  metadata?: {
    weight?: number;
    power_plant?: string;
  };
  sensors?: Record<string, SensorConfig>;
}

export type CarsConfig = Record<string, CarConfig>;

export interface CarFormState {
  active: boolean;
  theme: string;
  weight: string;
  powerPlant: string;
  selectedDriver: string;
  selectedRace: string;
}

export interface SimulationDict {
  time: number;
  distance: number;
  segmentType: number;
}
export interface SimulationDataForm {
  burnCoastStrat: SimulationDict[];
}

export const DefaultFormState: CarFormState = {
  active: true,
  theme: "default",
  weight: "30",
  powerPlant: "gasoline",
  selectedDriver: "",
  selectedRace: "Indy 500",
};
