import { getSessionToken, setSessionToken } from './session';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
/** Sin este límite, una conexión colgada dejaría la pantalla esperando para siempre. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Error de una petición, con un mensaje listo para mostrar. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

function defaultMessage(status: number): string {
  if (status === 401) return 'Tu sesión venció. Inicia sesión de nuevo.';
  if (status === 403) return 'No tienes permiso para hacer esto.';
  if (status === 404) return 'No se encontró lo que buscabas.';
  if (status === 429) return 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.';
  if (status >= 500) return 'Ocurrió un error en el servidor. Inténtalo de nuevo.';
  return 'No se pudo completar la acción.';
}

/** Solo se muestran los mensajes escritos por el Backend, nunca los de un error interno. */
async function readMessage(response: Response): Promise<string> {
  if (response.status < 500) {
    try {
      const body = (await response.json()) as { message?: unknown; error?: unknown };
      const message = Array.isArray(body.message) ? body.message[0] : body.message;
      const isOwnMessage = body.error !== undefined && typeof message === 'string' && !message.startsWith('Cannot ');
      if (isOwnMessage) return message;
    } catch {
      // El cuerpo no es JSON: se usa el mensaje por defecto.
    }
  }
  return defaultMessage(response.status);
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

/** Petición autenticada de la app móvil. */
export async function apiRequest<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, 'Falta configurar EXPO_PUBLIC_API_URL en el archivo .env.');
  }

  const token = getSessionToken();
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let response: Response;
    try {
      response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch {
      throw new ApiError(0, 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.');
    }

    if (!response.ok) {
      // Si mientras tanto se abrió otra sesión, esta respuesta no la invalida.
      if (response.status === 401 && getSessionToken() === token) setSessionToken(null);
      throw new ApiError(response.status, await readMessage(response));
    }

    // 204 No Content (e.g. after a DELETE) has no body to parse.
    if (response.status === 204) return undefined as T;

    try {
      return (await response.json()) as T;
    } catch {
      throw new ApiError(0, 'La respuesta del servidor no es válida. Revisa EXPO_PUBLIC_API_URL.');
    }
  } finally {
    clearTimeout(timeout);
  }
}
