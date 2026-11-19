/**
 * Vehículos del conductor ("Mis vehículos", "Datos del vehículo").
 *
 * Uses the Backend (`/driver/vehicles`) when `EXPO_PUBLIC_USE_MOCKS=false`;
 * otherwise it uses the sample data in src/services/mock.
 *
 * The Backend does not store `year` or `photoUrls` yet: with the real API they
 * are not sent and vehicles come back without photos.
 */
import type { Id } from '@/src/types/common';
import type { Vehicle, VehicleInput } from '@/src/types/vehicle';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

import { uploadVehiclePhotos } from './vehiclePhotoStorage';

/** Vehicle as returned by `/driver/vehicles`. */
type VehicleResponse = {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  capacidadPasajeros: number;
  activo: boolean;
  fotos?: string[];
};

/** Body accepted by POST and PATCH `/driver/vehicles`. */
type VehicleRequest = {
  placa: string;
  marca: string;
  modelo: string;
  color: string;
  capacidadPasajeros: number;
  fotos?: string[];
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
    photoUrls: response.fotos ?? [],
    active: response.activo,
  };
}

// ahora es async porque sube las fotos
async function toRequest(input: VehicleInput): Promise<VehicleRequest> {
  return {
    placa: input.plate,
    marca: input.brand,
    modelo: input.model,
    color: input.color,
    capacidadPasajeros: input.capacity,
    fotos: input.photoUrls ? await uploadVehiclePhotos(input.photoUrls) : undefined,
  };
}

function vehiclePath(id: Id): string {
  return `${BASE_PATH}/${encodeURIComponent(id)}`;
}

function findVehicle(id: Id): Vehicle {
  const vehicle = db.vehicles.find((item) => item.id === id);
  if (!vehicle) throw notFound('Vehículo', id);
  return vehicle;
}

export async function listMyVehicles(): Promise<Vehicle[]> {
  if (!USE_MOCK_DATA) {
    const response = await apiRequest<VehicleResponse[]>(BASE_PATH);
    return response.map(toVehicle);
  }
  return respond(db.vehicles);
}

export async function getVehicle(id: Id): Promise<Vehicle> {
  if (!USE_MOCK_DATA) {
    return toVehicle(await apiRequest<VehicleResponse>(vehiclePath(id)));
  }
  return respond(findVehicle(id));
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  if (!USE_MOCK_DATA) {
    const response = await apiRequest<VehicleResponse>(BASE_PATH, { method: 'POST', body: toRequest(input) });
    return toVehicle(response);
  }

  const vehicle: Vehicle = {
    ...input,
    id: createId('v'),
    photoUrls: input.photoUrls ?? [],
    active: db.vehicles.length === 0,
  };
  db.vehicles.push(vehicle);
  return respond(vehicle);
}

export async function updateVehicle(id: Id, input: VehicleInput): Promise<Vehicle> {
  if (!USE_MOCK_DATA) {
    const response = await apiRequest<VehicleResponse>(vehiclePath(id), { method: 'PATCH', body: toRequest(input) });
    return toVehicle(response);
  }

  const vehicle = findVehicle(id);
  Object.assign(vehicle, input);
  return respond(vehicle);
}

export async function deleteVehicle(id: Id): Promise<void> {
  if (!USE_MOCK_DATA) {
    await apiRequest<void>(vehiclePath(id), { method: 'DELETE' });
    return;
  }

  findVehicle(id);
  db.vehicles = db.vehicles.filter((item) => item.id !== id);
  await respond(undefined);
}

/** "¿Activar vehículo?": solo un vehículo puede estar activo. Returns the updated list. */
export async function activateVehicle(id: Id): Promise<Vehicle[]> {
  if (!USE_MOCK_DATA) {
    await apiRequest<VehicleResponse>(`${vehiclePath(id)}/activate`, { method: 'PATCH' });
    // the Backend deactivates the other vehicles, so the whole list is reloaded
    return listMyVehicles();
  }

  findVehicle(id);
  db.vehicles.forEach((item) => {
    item.active = item.id === id;
  });
  return respond(db.vehicles);
}
