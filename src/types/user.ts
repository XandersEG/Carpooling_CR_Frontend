import type { Id, IsoDate, Place } from '@/src/types/common';

/** Un usuario puede tener uno o ambos roles. */
export type Role = 'conductor' | 'pasajero';

/** Perfil del usuario autenticado en la app móvil (pantalla "Mi Perfil"). */
export type UserProfile = {
  id: Id;
  fullName: string;
  /** Nombre corto para saludos ("Hola, Danny"). */
  displayName: string;
  /** Correo institucional (solo lectura en el perfil). */
  email: string;
  /** Opción del catálogo "Opciones de Género". */
  gender: string;
  birthDate: IsoDate;
  roles: Role[];
  institutionName: string;
  avatarUrl?: string;
};

/** Datos mínimos de una persona mostrados en tarjetas y detalles. */
export type PersonSummary = {
  id: Id;
  fullName: string;
  /** Institución con la que la persona está verificada (por ejemplo "TEC"). */
  verifiedInstitution?: string;
  /** Opción del catálogo "Opciones de Género"; define "Conductor"/"Conductora" en los textos. */
  gender?: string;
  avatarUrl?: string;
};

/** Lugar frecuente del usuario (pantalla de inicio). */
export type SavedPlace = Place & {
  id: Id;
};
