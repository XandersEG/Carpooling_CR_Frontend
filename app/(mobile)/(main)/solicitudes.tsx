import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { RequestCard } from '@/components/mobile/driver/RequestCard';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Button } from '@/components/shared/Button';
import { colors, spacing } from '@/src/constants/theme';
import { getDriverTrips, getIncomingRequests, respondToRequest } from '@/src/services/driverService';
import type { IncomingRequest } from '@/src/types/trip';

/**
 * "Solicitudes" del conductor (Figma 2726:6159, 6456, 6289, 6647, 6805, 6996).
 * Rechazar quita la tarjeta de la lista (Solicitudes3); aceptar la pinta de verde
 * y muestra "Ir al viaje".
 */
export default function RequestsScreen() {
  const [requests, setRequests] = useState<IncomingRequest[] | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [fallbackTripId, setFallbackTripId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getIncomingRequests(), getDriverTrips()]).then(([list, trips]) => {
      if (!active) return;
      setRequests(list.filter((request) => request.status !== 'rechazada'));
      setFallbackTripId(trips[0]?.id ?? null);
    });
    return () => {
      active = false;
    };
  }, []);

  const respond = async (request: IncomingRequest, decision: 'aceptada' | 'rechazada') => {
    setBusyId(request.id);
    try {
      const updated = await respondToRequest(request.id, decision);
      setRequests((current) =>
        decision === 'rechazada'
          ? (current?.filter((item) => item.id !== request.id) ?? null)
          : (current?.map((item) => (item.id === request.id ? updated : item)) ?? null),
      );
    } finally {
      setBusyId(null);
    }
  };

  const accepted = requests?.filter((request) => request.status === 'aceptada') ?? [];
  // Viaje del primer aceptado con viaje asociado; si ninguno lo tiene, el viaje más reciente del conductor.
  const tripId = accepted.find((request) => request.tripId)?.tripId ?? fallbackTripId;

  return (
    <Screen
      scroll
      header={<ScreenHeader title="Solicitudes" />}
      contentStyle={styles.content}
      footer={
        accepted.length > 0 && tripId ? (
          <Button title="Ir al viaje" fullWidth onPress={() => router.push(`/viaje-conductor/${tripId}`)} />
        ) : undefined
      }
    >
      {requests === null ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        requests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            expanded={expandedId === request.id}
            busy={busyId === request.id}
            onToggle={() => setExpandedId((current) => (current === request.id ? null : request.id))}
            onAccept={() => respond(request, 'aceptada')}
            onReject={() => respond(request, 'rechazada')}
          />
        ))
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl + 4,
    paddingTop: spacing.m,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
});
