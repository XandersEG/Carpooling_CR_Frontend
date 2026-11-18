/**
 * Sesión del usuario de la app móvil.
 *
 * Provisional: el token vive en memoria hasta que el inicio de sesión lo guarde
 * con `setSessionToken` y se defina dónde persistirlo.
 */
let sessionToken: string | null = null;

export function getSessionToken(): string | null {
  return sessionToken;
}

export function setSessionToken(token: string | null): void {
  sessionToken = token;
}
