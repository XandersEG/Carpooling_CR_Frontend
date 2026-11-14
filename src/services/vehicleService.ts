/**
 * Vehículos del conductor ("Mis vehículos", "Datos del vehículo").
 *
 * Provisional: implementación simulada con datos de ejemplo.
 */
import type { Id } from '@/src/types/common';
import type { Vehicle, VehicleInput } from '@/src/types/vehicle';

import { db } from './mock/db';
import { createId, notFound, respond } from './mock/utils';

function findVehicle(id: Id): Vehicle {
  const vehicle = db.vehicles.find((item) => item.id === id);
  if (!vehicle) throw notFound('Vehículo', id);
  return vehicle;
}

export async function listMyVehicles(): Promise<Vehicle[]> {
  return respond(db.vehicles);
}

export async function getVehicle(id: Id): Promise<Vehicle> {
  return respond(findVehicle(id));
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
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
  const vehicle = findVehicle(id);
  Object.assign(vehicle, input);
  return respond(vehicle);
}

export async function deleteVehicle(id: Id): Promise<void> {
  findVehicle(id);
  db.vehicles = db.vehicles.filter((item) => item.id !== id);
  await respond(undefined);
}

/** "¿Activar vehículo?": solo un vehículo puede estar activo. */
export async function activateVehicle(id: Id): Promise<Vehicle[]> {
  findVehicle(id);
  db.vehicles.forEach((item) => {
    item.active = item.id === id;
  });
  return respond(db.vehicles);
}
