import type { LoginCredentials, LoginResponse } from '@/src/types/auth';
import type { IsoDate } from '@/src/types/common';
import type { Role } from '@/src/types/user';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { delay } from './mock/utils';
import { setSessionToken } from './session';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/** Datos del formulario "Registro" (app móvil). */
export type RegisterInput = {
  fullName: string;
  email: string;
  /** Opción del catálogo "Opciones de Género". */
  gender: string;
  roles: Role[];
  birthDate: IsoDate;
  password: string;
};

function requireApiUrl(): string {
  if (!API_URL) {
    throw new Error('Falta configurar EXPO_PUBLIC_API_URL en el archivo .env.');
  }
  return API_URL;
}

/**
 * Inicia sesión contra el Backend y guarda el token de la sesión.
 *
 * Con datos simulados responde con un token ficticio después de una breve
 * espera.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (USE_MOCK_DATA) {
    await delay(600);
    return { token: 'mock-token' };
  }

  const session = await apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: credentials });
  setSessionToken(session.token);
  return session;
}

/**
 * Crea la cuenta de un usuario de la app móvil.
 *
 * Con datos simulados solo espera y responde con un token ficticio.
 * Provisional: la ruta `/auth/register` y la respuesta deben coordinarse con
 * el equipo de Backend.
 */
export async function register(input: RegisterInput): Promise<LoginResponse> {
  if (USE_MOCK_DATA) {
    await delay(600);
    return { token: 'mock-token' };
  }

  const response = await fetch(`${requireApiUrl()}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('No se pudo completar el registro.');
  }

  return (await response.json()) as LoginResponse;
}
