import { useEffect, useSyncExternalStore } from 'react';

import { getSessionToken, isSessionLoaded, loadSession, subscribeSession } from '@/src/services/session';

type SessionState = {
  /** Ya se leyó la sesión guardada en el teléfono. */
  ready: boolean;
  /** Hay un usuario con sesión iniciada. */
  signedIn: boolean;
};

let snapshot: SessionState = { ready: isSessionLoaded(), signedIn: getSessionToken() !== null };

function getSnapshot(): SessionState {
  const ready = isSessionLoaded();
  const signedIn = getSessionToken() !== null;
  // Mismo objeto si nada cambió, como exige useSyncExternalStore.
  if (snapshot.ready !== ready || snapshot.signedIn !== signedIn) snapshot = { ready, signedIn };
  return snapshot;
}

/**
 * Estado de la sesión del usuario de la app. Se actualiza solo al iniciar o
 * cerrar sesión, o cuando el Backend responde 401 (sesión vencida).
 */
export function useSession(): SessionState {
  const state = useSyncExternalStore(subscribeSession, getSnapshot, getSnapshot);

  useEffect(() => {
    void loadSession();
  }, []);

  return state;
}
