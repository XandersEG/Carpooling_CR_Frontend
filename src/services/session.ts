/**
 * Sesión del usuario de la app móvil.
 *
 * Provisional: el token vive solo en memoria y se pierde al recargar o cerrar la
 * app, hasta que se defina dónde persistirlo.
 */
let sessionToken: string | null = null;

export function getSessionToken(): string | null {
  return sessionToken;
}

export function setSessionToken(token: string | null): void {
  sessionToken = token;
}
