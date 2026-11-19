/**
 * Sesión del usuario de la app móvil.
 *
 * El token se guarda cifrado en el teléfono con expo-secure-store (Keychain en
 * iOS, Keystore en Android), así la sesión sobrevive al cerrar la app. En la
 * vista previa web se usa localStorage. Siempre hay una copia en memoria, que
 * es la que leen las peticiones.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEY = 'tuanis.session';

let sessionToken: string | null = null;
let loaded = false;
let loading: Promise<string | null> | null = null;
const listeners = new Set<() => void>();

function webStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

async function readStored(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return webStorage()?.getItem(STORAGE_KEY) ?? null;
    return await SecureStore.getItemAsync(STORAGE_KEY);
  } catch {
    // Almacén bloqueado o dañado: se empieza sin sesión.
    return null;
  }
}

async function writeStored(token: string | null): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      const storage = webStorage();
      if (token) storage?.setItem(STORAGE_KEY, token);
      else storage?.removeItem(STORAGE_KEY);
      return;
    }
    if (token) await SecureStore.setItemAsync(STORAGE_KEY, token);
    else await SecureStore.deleteItemAsync(STORAGE_KEY);
  } catch {
    // Si no se puede guardar, la sesión dura mientras la app esté abierta.
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getSessionToken(): string | null {
  return sessionToken;
}

/** Guarda (o borra, con `null`) el token y avisa a las pantallas que lo observan. */
export function setSessionToken(token: string | null): void {
  sessionToken = token;
  loaded = true;
  void writeStored(token);
  notify();
}

/** Lee la sesión guardada en el teléfono. Se llama una vez al abrir la app. */
export function loadSession(): Promise<string | null> {
  if (loaded) return Promise.resolve(sessionToken);
  loading ??= readStored().then((stored) => {
    // Si mientras tanto se inició sesión, esa sesión gana.
    if (!loaded) {
      sessionToken = stored;
      loaded = true;
      notify();
    }
    return sessionToken;
  });
  return loading;
}

export function isSessionLoaded(): boolean {
  return loaded;
}

/** Suscripción a los cambios de sesión (para `useSyncExternalStore`). */
export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
