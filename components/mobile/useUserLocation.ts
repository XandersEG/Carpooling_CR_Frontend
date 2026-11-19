import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';

import type { GeoPoint } from '@/src/types/common';

/** Asked once per app session; every map shares the answer. */
let permission: Promise<boolean> | null = null;

/** Foreground location permission (iOS and Android show their own system dialog). */
function requestPermission(): Promise<boolean> {
  if (!permission) {
    permission = Location.requestForegroundPermissionsAsync()
      .then((result) => result.granted)
      .catch(() => false);
  }
  return permission;
}

/** Last known position if it is recent, otherwise a fresh (balanced accuracy) reading. */
async function readPosition(): Promise<GeoPoint | null> {
  const position =
    (await Location.getLastKnownPositionAsync({ maxAge: 60_000 })) ??
    (await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }));
  if (!position) return null;
  return {
    lat: Number(position.coords.latitude.toFixed(6)),
    lng: Number(position.coords.longitude.toFixed(6)),
  };
}

/** Fresh position for the "my location" button (asks for permission if needed). */
export async function locateUser(): Promise<GeoPoint | null> {
  if (!(await requestPermission())) return null;
  try {
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    return {
      lat: Number(position.coords.latitude.toFixed(6)),
      lng: Number(position.coords.longitude.toFixed(6)),
    };
  } catch {
    // no fresh reading (e.g. indoors): fall back to the last known one
    return readPosition().catch(() => null);
  }
}

/**
 * Real-time location for a map: whether the "you are here" dot can be shown, and one
 * report of the user's position when the map opens (used as the default location:
 * center the map there, prefill the origin or the pickup point).
 */
export function useUserLocation(onFirstFix?: (point: GeoPoint) => void) {
  const [granted, setGranted] = useState(false);
  // the position arrives later; call the latest callback so it sees the current screen state
  const callback = useRef(onFirstFix);
  callback.current = onFirstFix;

  useEffect(() => {
    let active = true;
    requestPermission()
      .then(async (allowed) => {
        if (!active) return;
        setGranted(allowed);
        if (!allowed) return;
        const point = await readPosition();
        if (active && point) callback.current?.(point);
      })
      .catch(() => {
        // without a position the map keeps its default view
      });
    return () => {
      active = false;
    };
  }, []);

  return { granted };
}
