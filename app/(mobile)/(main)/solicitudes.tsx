import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { RequestCard } from '@/components/mobile/driver/RequestCard';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Button } from '@/components/shared/Button';
import { colors, spacing, typography } from '@/src/constants/theme';
import { getIncomingRequests, respondToRequest } from '@/src/services/driverService';
import type { IncomingRequest } from '@/src/types/trip';

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * "Solicitudes" del conductor (Figma 2726:6159, 6456, 6289, 6647, 6805, 6996).
 * Una tarjeta por pasajero. Rechazar quita la tarjeta de la lista; aceptar la
 * pinta de verde y muestra "Ir al viaje".
 */
export default function RequestsScreen() {
  const [requests, setRequests] = useState<IncomingRequest[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getIncomingRequests()
      .then((list) => {
        if (active) setRequests(list.filter((request) => request.status !== 'rechazada'));
      })
      .catch((error: unknown) => {
        if (active) setLoadError(messageOf(error, 'No se pudieron cargar las solicitudes.'));
      });
    return () => {
      active = false;
    };
  }, []);

  const respond = async (request: IncomingRequest, decision: 'aceptada' | 'rechazada') => {
    setBusyId(request.id);
    setActionError(null);
    try {
      const status = await respondToRequest(request.id, decision);
      setRequests((current) =>
        status === 'rechazada'
          ? (current?.filter((item) => item.id !== request.id) ?? null)
          : (current?.map((item) => (item.id === request.id ? { ...item, status } : item)) ?? null),
      );
    } catch (error) {
      setActionError(messageOf(error, 'No se pudo responder la solicitud.'));
    } finally {
      setBusyId(null);
    }
  };

  // Viaje de la primera solicitud aceptada.
  const tripId = requests?.find((request) => request.status === 'aceptada')?.tripId;

  return (
    <Screen
      scroll
      header={<ScreenHeader title="Solicitudes" />}
      contentStyle={styles.content}
      footer={
        tripId ? (
          <Button title="Ir al viaje" fullWidth onPress={() => router.push(`/viaje-conductor/${tripId}`)} />
        ) : undefined
      }
    >
      {requests === null ? (
        <LoadState loading={!loadError} error={loadError} style={styles.state} />
      ) : (
        <>
          {actionError ? <Text style={styles.error}>{actionError}</Text> : null}
          {requests.length === 0 ? (
            <Text style={styles.empty}>No tienes solicitudes por ahora.</Text>
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
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl + 4,
    paddingTop: spacing.m,
  },
  state: {
    marginTop: spacing.xl * 2,
  },
  error: {
    ...typography.textSecondary,
    color: colors.error,
    textAlign: 'center',
  },
  empty: {
    ...typography.textSecondary,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl * 2,
  },
});