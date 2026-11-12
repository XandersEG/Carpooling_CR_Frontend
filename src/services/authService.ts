import type { LoginCredentials, LoginResponse } from '@/src/types/auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Inicia sesión contra el Backend.
 *
 * Provisional: la ruta `/auth/login` y la respuesta deben coordinarse con el
 * equipo de Backend antes de integrarse.
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  if (!API_URL) {
    throw new Error('Falta configurar EXPO_PUBLIC_API_URL en el archivo .env.');
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Correo o contraseña incorrectos.');
  }

  return (await response.json()) as LoginResponse;
}
