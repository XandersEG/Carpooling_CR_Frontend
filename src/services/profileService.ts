/**
 * Perfil del usuario autenticado y lugares frecuentes.
 *
 * Con el Backend usa `GET` y `PATCH /profile` y `GET /catalogs/genders`.
 * Los lugares frecuentes siguen simulados.
 */
import type { Role, SavedPlace, UserProfile } from '@/src/types/user';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { respond } from './mock/utils';

/** Campos editables en "Mi Perfil" (el correo institucional es de solo lectura). */
export type ProfileUpdate = Partial<Pick<UserProfile, 'fullName' | 'gender' | 'birthDate' | 'roles'>>;

/** Respuesta de `GET` y `PATCH /profile`. */
type ProfileResponse = {
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  fotoUrl: string | null;
  fechaNacimiento: string;
  institucion: string;
  genero: string;
  roles: Role[];
};

function toUserProfile(perfil: ProfileResponse): UserProfile {
  return {
    id: String(perfil.id),
    fullName: [perfil.nombre, perfil.apellidos].filter(Boolean).join(' '),
    displayName: perfil.nombre,
    email: perfil.correo,
    gender: perfil.genero,
    birthDate: perfil.fechaNacimiento,
    roles: perfil.roles,
    institutionName: perfil.institucion,
    avatarUrl: perfil.fotoUrl ?? undefined,
  };
}

export async function getProfile(): Promise<UserProfile> {
  if (!USE_MOCK_DATA) {
    return toUserProfile(await apiRequest<ProfileResponse>('/profile'));
  }
  return respond(db.currentUser);
}

/** Opciones activas del catálogo "Opciones de Género" (registro y "Mi Perfil"). */
export async function listGenderOptions(): Promise<string[]> {
  if (!USE_MOCK_DATA) {
    const options = await apiRequest<{ id: number; nombre: string }[]>('/catalogs/genders');
    return options.map((option) => option.nombre);
  }
  return respond(db.catalogs['opciones-genero'].filter((item) => item.active).map((item) => item.name));
}

/** Part of `GET /auth/me` used by the greeting. */
type MeResponse = { nombre: string };

/**
 * Short name for greetings ("Hola, Ana"): the first given name of the logged-in user.
 */
export async function getGreetingName(): Promise<string> {
  if (!USE_MOCK_DATA) {
    const me = await apiRequest<MeResponse>('/auth/me');
    return me.nombre.trim().split(/\s+/)[0] ?? '';
  }
  return respond(db.currentUser.displayName);
}

/**
 * Guarda los cambios de "Mi Perfil". El Backend solo guarda si la persona es
 * conductora: todos pueden viajar como pasajeros, así que un conductor vuelve
 * con ambos roles.
 */
export async function updateProfile(update: ProfileUpdate): Promise<UserProfile> {
  if (!USE_MOCK_DATA) {
    return toUserProfile(await apiRequest<ProfileResponse>('/profile', { method: 'PATCH', body: update }));
  }
  Object.assign(db.currentUser, update);
  return respond(db.currentUser);
}

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  return respond(db.savedPlaces);
}