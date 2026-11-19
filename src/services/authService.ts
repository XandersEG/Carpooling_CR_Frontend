/**
 * Autenticación de los usuarios de la app móvil: registro, verificación del
 * correo institucional, inicio y cierre de sesión.
 */
import type { LoginCredentials, LoginResponse, RegisterResponse } from '@/src/types/auth';
import type { IsoDate } from '@/src/types/common';
import type { Role } from '@/src/types/user';

import { apiRequest } from './apiClient';
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
  /** El usuario marcó "Acepto los términos y condiciones". */
  acceptedTerms: boolean;
};

/** Largo mínimo de la contraseña que exige el Backend. */
export const MIN_PASSWORD_LENGTH = 12;

/** Inicia sesión contra el Backend y guarda el token en el teléfono. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const session = await apiRequest<LoginResponse>('/auth/login', { method: 'POST', body: credentials });
  setSessionToken(session.token);
  return session;
}

/**
 * Crea la cuenta. El Backend envía un enlace al correo institucional y la
 * cuenta no puede iniciar sesión hasta abrirlo.
 */
export function register(input: RegisterInput): Promise<RegisterResponse> {
  return apiRequest<RegisterResponse>('/auth/register', { method: 'POST', body: input });
}

/** Pide otro enlace de verificación. El Backend responde igual exista o no la cuenta. */
export async function resendVerification(email: string): Promise<void> {
  await apiRequest<void>('/auth/resend-verification', { method: 'POST', body: { correo: email.trim() } });
}

/**
 * Cierra la sesión en el Backend y borra el token del teléfono. Aunque el
 * Backend no responda, el teléfono queda sin sesión.
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest<void>('/auth/logout', { method: 'POST' });
  } catch {
    // El token se borra igual: sin él, nadie puede usar la sesión desde este teléfono.
  } finally {
    setSessionToken(null);
  }
}
