import type { ImageSourcePropType } from 'react-native';

import type { Vehicle } from '@/src/types/vehicle';

/**
 * Fotos de ejemplo de los vehículos del diseño (solo datos simulados). Los
 * vehículos de los datos de ejemplo no traen `photoUrls`, así que se asocian por
 * id. `box` es el tamaño de la imagen en la tarjeta de Figma (2295:4283).
 */
type SamplePhoto = {
  source: ImageSourcePropType;
  box: { width: number; height: number; top: number };
};

const samplePhotos: Record<string, SamplePhoto> = {
  'v-corolla': {
    source: require('@/assets/images/vehicles/toyota-corolla.png'),
    box: { width: 89, height: 91, top: -14 },
  },
  'v-tucson': {
    source: require('@/assets/images/vehicles/hyundai-tucson.png'),
    box: { width: 84, height: 63, top: -2 },
  },
  'v-versa': {
    source: require('@/assets/images/vehicles/nissan-versa.png'),
    box: { width: 91, height: 54, top: 4 },
  },
};

/** Tamaño por defecto para fotos subidas por el usuario. */
const DEFAULT_BOX = { width: 89, height: 56, top: 2 };

export type VehiclePhoto = SamplePhoto;

/** Foto principal: la primera foto subida o, si no hay, la foto de ejemplo. */
export function getVehiclePhoto(vehicle: Pick<Vehicle, 'id' | 'photoUrls'>): VehiclePhoto | null {
  const uploaded = vehicle.photoUrls[0];
  if (uploaded) return { source: { uri: uploaded }, box: DEFAULT_BOX };
  return samplePhotos[vehicle.id] ?? null;
}
