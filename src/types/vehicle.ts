import type { Id } from '@/src/types/common';

/** Vehículo registrado por un conductor. */
export type Vehicle = {
  id: Id;
  brand: string;
  model: string;
  plate: string;
  color: string;
  /** Espacios para pasajeros, sin contar al conductor. */
  capacity: number;
  year?: number;
  photoUrls: string[];
  /** Vehículo con el que el conductor publica viajes. Solo uno puede estar activo. */
  active: boolean;
};

/** Datos editables de un vehículo (pantalla "Datos del vehículo"). */
export type VehicleInput = Pick<Vehicle, 'brand' | 'model' | 'plate' | 'color' | 'capacity'> & {
  year?: number;
  photoUrls?: string[];
};

/** Datos del vehículo que se muestran dentro de un viaje. */
export type TripVehicle = {
  brand: string;
  model: string;
  color: string;
  plate?: string;
  capacity?: number;
};
