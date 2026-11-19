/**
 * Perfil del usuario autenticado y lugares frecuentes.
 *
 * Provisional: implementación simulada con datos de ejemplo.
 */
import type { SavedPlace, UserProfile } from '@/src/types/user';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { db } from './mock/db';
import { respond } from './mock/utils';

/** Campos editables en "Mi Perfil" (el correo institucional es de solo lectura). */
export type ProfileUpdate = Partial<Pick<UserProfile, 'fullName' | 'gender' | 'birthDate' | 'roles'>>;

export async function getProfile(): Promise<UserProfile> {
  return respond(db.currentUser);
}

/** Part of `GET /auth/me` used by the greeting. */
type MeResponse = { nombre: string };

/**
 * Short name for greetings ("Hola, Ana"): the first given name of the logged-in user.
 * The full profile (Mi Perfil) stays simulated until the Backend can save changes.
 */
export async function getGreetingName(): Promise<string> {
  if (!USE_MOCK_DATA) {
    const me = await apiRequest<MeResponse>('/auth/me');
    return me.nombre.trim().split(/\s+/)[0] ?? '';
  }
  return respond(db.currentUser.displayName);
}

export async function updateProfile(update: ProfileUpdate): Promise<UserProfile> {
  Object.assign(db.currentUser, update);
  return respond(db.currentUser);
}

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  return respond(db.savedPlaces);
}
