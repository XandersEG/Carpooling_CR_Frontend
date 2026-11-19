import type { LoginCredentials, LoginResponse } from '@/src/types/auth';
import type { IsoDate } from '@/src/types/common';
import type { Role } from '@/src/types/user';

import { apiRequest } from './apiClient';
import { USE_MOCK_DATA } from './config';
import { delay } from './mock/utils';
import { setSessionToken } from './session';



/** Datos del formulario "Registro" (app móvil). */
export type RegisterInput = {
  fullName: string;
  email: string;
  /** Opción del catálogo "Opciones de Género". */
  gender: string;
  roles: Role[];
  birthDate: IsoDate;
  password: string;
  acceptedTerms: boolean;
};


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
type RegisterResponse = {
  message: string;
  user: {
    id: number;
    email: string;
  };
  emailVerified: boolean;
};

export async function register(input: RegisterInput): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: input,
  });
}
