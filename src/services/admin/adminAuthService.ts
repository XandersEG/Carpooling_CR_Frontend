/**
 * Autenticación del portal administrativo.
 *
 * Provisional: implementación simulada, como en el prototipo de Figma (que
 * valida con variables `correoIngresado` / `contraseñaIngresada`). Un correo
 * con formato válido y una contraseña no vacía inician sesión. La sesión vive
 * en memoria y en `sessionStorage` (solo web) para sobrevivir a recargas.
 */
import { respond } from '../mock/utils';

export type AdminSession = {
  email: string;
  fullName: string;
  /** Nombre corto del encabezado ("Diego Araya"). */
  displayName: string;
  role: string;
};

/** Administrador de los diseños (chip "DA · Diego Araya · Administrador"). */
const MOCK_ADMIN: Omit<AdminSession, 'email'> = {
  fullName: 'Diego Jose Araya Cordero',
  displayName: 'Diego Araya',
  role: 'Administrador',
};

const STORAGE_KEY = 'tuanis.admin.session';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

let session: AdminSession | null = null;

function storage(): Storage | null {
  try {
    return typeof globalThis.sessionStorage === 'undefined' ? null : globalThis.sessionStorage;
  } catch {
    return null;
  }
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function getAdminSession(): AdminSession | null {
  if (session) return session;
  try {
    const stored = storage()?.getItem(STORAGE_KEY);
    session = stored ? (JSON.parse(stored) as AdminSession) : null;
  } catch {
    session = null;
  }
  return session;
}

export async function loginAdmin(email: string, password: string): Promise<AdminSession> {
  const valid = isValidEmail(email) && password.length > 0;
  await respond(null);
  if (!valid) throw new Error('Revisa tu correo y contraseña para continuar.');
  session = { ...MOCK_ADMIN, email: email.trim() };
  try {
    storage()?.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Sin almacenamiento disponible: la sesión queda solo en memoria.
  }
  return session;
}

export function logoutAdmin(): void {
  session = null;
  try {
    storage()?.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar: no hay almacenamiento.
  }
}

/** "Recuperar contraseña": el envío del correo es simulado. */
export async function requestPasswordReset(email: string): Promise<void> {
  if (!isValidEmail(email)) throw new Error('Correo inválido');
  await respond(null);
}

/** "Cambiar contraseña": simulado. */
export async function resetPassword(password: string, confirmation: string): Promise<void> {
  if (!password || password !== confirmation) throw new Error('Las contraseñas no coinciden');
  await respond(null);
}
