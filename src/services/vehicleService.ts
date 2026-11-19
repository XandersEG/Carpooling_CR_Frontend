/**
 * Vehículos del conductor ("Mis vehículos", "Datos del vehículo").
 *
 * Usa el Backend (`/driver/vehicles`): solo devuelve los vehículos del usuario
 * con la sesión iniciada.
 *
 * El Backend no guarda `year` ni `photoUrls` todavía: no se envían y los
 * vehículos vuelven sin fotos.
 */
import type { Id } from '@/src/types/common';
import type { Vehicle, VehicleInput } from '@/src/types/vehicle';

import { apiRequest } from './apiClient';

/** Vehicle as returned by `/driver/vehicles`. */
type VehicleResponse = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  capacidadPasajeros: number;
  activo: boolean;
};

/** Body accepted by POST and PATCH `/driver/vehicles`. */
type VehicleRequest = {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  capacidadPasajeros: number;
};

const BASE_PATH = '/driver/vehicles';

function toVehicle(response: VehicleResponse): Vehicle {
  return {
    id: String(response.id),
    brand: response.marca,
    model: response.modelo,
    plate: response.placa,
    color: response.color,
    capacity: response.capacidadPasajeros,
    photoUrls: [],
    active: response.activo,
  };
}

function toRequest(input: VehicleInput): VehicleRequest {
  return {
    placa: input.plate,
    marca: input.brand,
    modelo: input.model,
    color: input.color,
    capacidadPasajeros: input.capacity,
  };
}

function vehiclePath(id: Id): string {
  return `${BASE_PATH}/${encodeURIComponent(id)}`;
}

/** Vehículos del usuario con la sesión iniciada; el activo aparece primero. */
export async function listMyVehicles(): Promise<Vehicle[]> {
  const response = await apiRequest<VehicleResponse[]>(BASE_PATH);
  return response.map(toVehicle).sort((a, b) => Number(b.active) - Number(a.active));
}

export async function getVehicle(id: Id): Promise<Vehicle> {
  return toVehicle(await apiRequest<VehicleResponse>(vehiclePath(id)));
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  const response = await apiRequest<VehicleResponse>(BASE_PATH, { method: 'POST', body: toRequest(input) });
  return toVehicle(response);
}

export async function updateVehicle(id: Id, input: VehicleInput): Promise<Vehicle> {
  const response = await apiRequest<VehicleResponse>(vehiclePath(id), { method: 'PATCH', body: toRequest(input) });
  return toVehicle(response);
}

export async function deleteVehicle(id: Id): Promise<void> {
  await apiRequest<void>(vehiclePath(id), { method: 'DELETE' });
}

/** "¿Activar vehículo?": solo un vehículo puede estar activo. Returns the updated list. */
export async function activateVehicle(id: Id): Promise<Vehicle[]> {
  await apiRequest<VehicleResponse>(`${vehiclePath(id)}/activate`, { method: 'PATCH' });
  // the Backend deactivates the other vehicles, so the whole list is reloaded
  return listMyVehicles();
}
