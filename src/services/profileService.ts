/**
 * Perfil del usuario autenticado ("Mi Perfil") y sus lugares frecuentes
 * (pantalla de inicio). Todo viene del Backend: `/me/profile` y
 * `/me/frequent-places`.
 */
import type { Role, SavedPlace, UserProfile } from '@/src/types/user';

import { apiRequest } from './apiClient';

/** Campos editables en "Mi Perfil" (el correo institucional es de solo lectura). */
export type ProfileUpdate = Partial<Pick<UserProfile, 'fullName' | 'gender' | 'birthDate' | 'roles' | 'phone'>>;

/** Respuesta de `GET /me/profile` y `PATCH /me/profile`. */
type ProfileResponse = {
  id: number;
  nombre: string;
  apellidos: string;
  nombreCompleto: string;
  correo: string;
  telefono: string | null;
  fotoUrl: string | null;
  fechaNacimiento: string;
  genero: string;
  institucion: string;
  esConductor: boolean;
  roles: Role[];
  correoVerificado: boolean;
  miembroDesde: string;
};

/** Cuerpo de `PATCH /me/profile`. */
type ProfileRequest = {
  nombreCompleto?: string;
  genero?: string;
  fechaNacimiento?: string;
  roles?: Role[];
  telefono?: string | null;
};

type FrequentPlaceResponse = { id: number; nombre: string; lat: number; lng: number; veces: number };

function toProfile(response: ProfileResponse): UserProfile {
  return {
    id: String(response.id),
    fullName: response.nombreCompleto,
    displayName: response.nombre,
    email: response.correo,
    gender: response.genero,
    birthDate: response.fechaNacimiento,
    roles: response.roles,
    institutionName: response.institucion,
    avatarUrl: response.fotoUrl ?? undefined,
    phone: response.telefono ?? undefined,
    memberSince: response.miembroDesde,
  };
}

export async function getProfile(): Promise<UserProfile> {
  return toProfile(await apiRequest<ProfileResponse>('/me/profile'));
}

export async function updateProfile(update: ProfileUpdate): Promise<UserProfile> {
  const body: ProfileRequest = {
    nombreCompleto: update.fullName,
    genero: update.gender,
    fechaNacimiento: update.birthDate,
    roles: update.roles,
    telefono: update.phone === undefined ? undefined : update.phone || null,
  };
  return toProfile(await apiRequest<ProfileResponse>('/me/profile', { method: 'PATCH', body }));
}

/** Nombre corto para saludos ("Hola, Ana"): el primer nombre del usuario. */
export async function getGreetingName(): Promise<string> {
  const profile = await getProfile();
  return profile.displayName.trim().split(/\s+/)[0] ?? '';
}

/** Lugares que más aparecen en los viajes del usuario (origen o destino). */
export async function getSavedPlaces(): Promise<SavedPlace[]> {
  const response = await apiRequest<FrequentPlaceResponse[]>('/me/frequent-places');
  return response.map((place) => ({
    id: String(place.id),
    name: place.nombre,
    detail: place.veces === 1 ? '1 viaje' : `${place.veces} viajes`,
    point: { lat: place.lat, lng: place.lng },
  }));
}
