/**
 * Perfil del usuario autenticado y lugares frecuentes.
 *
 * Provisional: implementación simulada con datos de ejemplo.
 */
import type { SavedPlace, UserProfile } from '@/src/types/user';

import { db } from './mock/db';
import { respond } from './mock/utils';

/** Campos editables en "Mi Perfil" (el correo institucional es de solo lectura). */
export type ProfileUpdate = Partial<Pick<UserProfile, 'fullName' | 'gender' | 'birthDate' | 'roles'>>;

export async function getProfile(): Promise<UserProfile> {
  return respond(db.currentUser);
}

export async function updateProfile(update: ProfileUpdate): Promise<UserProfile> {
  Object.assign(db.currentUser, update);
  return respond(db.currentUser);
}

export async function getSavedPlaces(): Promise<SavedPlace[]> {
  return respond(db.savedPlaces);
}
