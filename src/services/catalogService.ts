/**
 * Catálogos públicos que usa la app móvil (no piden sesión).
 */
import { apiRequest } from './apiClient';

/** Opción de `GET /catalogs/genders` (solo las activas). */
type GenderResponse = { id: number; nombre: string };

/** Nombres de las opciones de género activas, para "Registro" y "Mi Perfil". */
export async function listGenders(): Promise<string[]> {
  const response = await apiRequest<GenderResponse[]>('/catalogs/genders');
  return response.map((option) => option.nombre);
}
