import { router } from 'expo-router';
import { useEffect } from 'react';

import { ResultScreen } from '@/components/mobile/driver/ResultScreen';

/** Tiempo antes de volver al inicio (el prototipo avanza solo con un temporizador). */
const AUTO_ADVANCE_MS = 2000;

/** "Confirmado" (Figma 2649:3473): "Tu viaje ha sido publicado" y vuelve al inicio. */
export default function TripPublishedScreen() {
  useEffect(() => {
    const timer = setTimeout(() => router.replace('/inicio'), AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, []);

  return <ResultScreen kind="success" title="Tu viaje ha sido publicado" />;
}
