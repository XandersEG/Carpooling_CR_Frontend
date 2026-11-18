import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConfirmDialog } from '@/components/mobile/driver/ConfirmDialog';
import { IconBandera, IconCancelar, IconEnviar } from '@/components/mobile/driver/icons';
import { DriverTripMap } from '@/components/mobile/driver/RouteMaps';
import { PassengerRow, StopsTimeline } from '@/components/mobile/driver/TripSheetParts';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { SegmentedControl } from '@/components/mobile/SegmentedControl';
import { Button } from '@/components/shared/Button';
import { Chip } from '@/components/shared/Chip';
import { colors, fonts, palette, radius, shadows, spacing } from '@/src/constants/theme';
import { cancelTrip, finishTrip, getDriverTrip, startTrip } from '@/src/services/driverService';
import type { DriverTrip } from '@/src/types/trip';

/** Fondo de la barra de botones del viaje ("Botones viaje" 2642:3974); sin token en Figma. */
const ACTION_BAR_BACKGROUND = '#FBFAF8';
/** Colores de "Iniciar viaje" en la barra de botones; sin token en Figma. */
const START_BUTTON_BACKGROUND = '#B2D258';
const START_BUTTON_TEXT = '#2D3A14';
/** Alto máximo de la lista de pasajeros/paradas dentro de la hoja inferior. */
const SHEET_LIST_MAX_HEIGHT = 190;

type Tab = 'pasajeros' | 'paradas';
type TripAction = 'start' | 'finish' | 'cancel';

function cancelMessage(passengers: number): string {
  if (passengers === 0) return 'El viaje se cerrará. Esta acción no se puede deshacer.';
  if (passengers === 1) return 'Se avisará al pasajero aceptado y el viaje se cerrará. Esta acción no se puede deshacer.';
  return `Se avisará a los ${passengers} pasajeros aceptados y el viaje se cerrará. Esta acción no se puede deshacer.`;
}

/**
 * "Viaje programado" (2642:3781 / 3670) y "Viaje en curso" (2642:3832 / 3725),
 * con el diálogo "¿Cancelar viaje?" (2642:3953).
 */
export default function DriverTripScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error } = useServiceData(() => getDriverTrip(id), [id]);
  const [updatedTrip, setUpdatedTrip] = useState<DriverTrip | null>(null);
  const [tab, setTab] = useState<Tab>('pasajeros');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState<TripAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const trip = updatedTrip?.id === id ? updatedTrip : data;

  const runAction = async (action: TripAction, task: () => Promise<void>) => {
    setBusy(action);
    setActionError(null);
    try {
      await task();
    } catch (reason) {
      setActionError(reason instanceof Error ? reason.message : 'No se pudo completar la acción.');
      // El viaje pudo cambiar en otro dispositivo: se muestra su estado actual.
      // Se espera aquí para que un reintento no compita con esta consulta.
      await getDriverTrip(id).then(setUpdatedTrip, () => undefined);
    } finally {
      setBusy(null);
    }
  };

  const start = () =>
    runAction('start', async () => {
      setUpdatedTrip(await startTrip(id));
    });

  const finish = () =>
    runAction('finish', async () => {
      await finishTrip(id);
      router.replace(`/viaje-conductor/${id}/finalizado`);
    });

  const cancel = () =>
    runAction('cancel', async () => {
      await cancelTrip(id);
      setConfirmCancel(false);
      router.replace(`/viaje-conductor/${id}/cancelado`);
    });

  const openCancelDialog = () => {
    setActionError(null);
    setConfirmCancel(true);
  };

  const closeCancelDialog = () => {
    if (busy === 'cancel') return;
    setActionError(null);
    setConfirmCancel(false);
  };

  if (trip?.status === 'finalizado') return <Redirect href={`/viaje-conductor/${id}/finalizado`} />;
  if (trip?.status === 'cancelado') return <Redirect href={`/viaje-conductor/${id}/cancelado`} />;

  if (!trip) {
    return (
      <Screen header={<ScreenHeader title="Viaje programado" />}>
        <LoadState loading={loading} error={error} />
      </Screen>
    );
  }

  const inProgress = trip.status === 'en_curso';
  const startEnabled = busy === null;

  return (
    <Screen
      header={
        <ScreenHeader title={inProgress ? 'Viaje en curso' : 'Viaje programado'}>
          <Chip label={inProgress ? 'En curso' : 'Por iniciar'} style={styles.statusChip} />
        </ScreenHeader>
      }
    >
      <View style={styles.body}>
        <DriverTripMap stops={trip.stops} style={StyleSheet.absoluteFill} />
        <View style={styles.flex} />
        <View style={styles.sheet}>
          <SegmentedControl
            value={tab}
            onChange={setTab}
            options={[
              { value: 'pasajeros', label: `Pasajeros (${trip.passengers.length})` },
              { value: 'paradas', label: `Paradas (${trip.stops.length})` },
            ]}
            style={styles.segmented}
          />
          <ScrollView style={styles.sheetList} contentContainerStyle={styles.sheetListContent}>
            {tab === 'pasajeros' ? (
              trip.passengers.map((request) => <PassengerRow key={request.id} request={request} />)
            ) : (
              <StopsTimeline stops={trip.stops} />
            )}
          </ScrollView>
          <View style={styles.actionArea}>
            {actionError && !confirmCancel ? (
              <Text accessibilityLiveRegion="polite" style={styles.actionError}>
                {actionError}
              </Text>
            ) : null}
            <View style={styles.actionBar}>
              <Button
                title="Cancelar"
                variant="outline"
                disabled={busy !== null}
                onPress={openCancelDialog}
                style={[styles.actionButton, styles.cancelButton]}
                textStyle={styles.actionText}
              />
              {inProgress ? (
                <Button
                  title="Finalizar viaje"
                  variant="tertiary"
                  loading={busy === 'finish'}
                  disabled={busy !== null}
                  icon={<IconBandera width={19} height={19} color={palette.white} />}
                  onPress={finish}
                  style={[styles.actionButton, styles.mainButton]}
                  textStyle={styles.actionText}
                />
              ) : (
                <Button
                  title="Iniciar viaje"
                  loading={busy === 'start'}
                  disabled={busy !== null}
                  icon={<IconEnviar width={19} height={19} color={START_BUTTON_TEXT} />}
                  onPress={start}
                  style={[styles.actionButton, styles.mainButton, startEnabled ? styles.startButton : null]}
                  textStyle={[styles.actionText, startEnabled ? styles.startText : null]}
                />
              )}
            </View>
          </View>
        </View>
      </View>

      <ConfirmDialog
        visible={confirmCancel}
        icon={<IconCancelar width={36} height={36} color={colors.textDark} />}
        title="¿Cancelar viaje?"
        message={cancelMessage(trip.passengers.length)}
        cancelLabel="Volver"
        confirmLabel="Sí, cancelar"
        loading={busy === 'cancel'}
        error={actionError}
        onCancel={closeCancelDialog}
        onConfirm={cancel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusChip: {
    paddingVertical: 3,
  },
  body: {
    flex: 1,
    overflow: 'hidden',
  },
  flex: {
    flex: 1,
    minHeight: 120,
  },
  sheet: {
    paddingTop: spacing.s,
    backgroundColor: palette.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.bottomPanel,
  },
  segmented: {
    marginHorizontal: spacing.screen,
  },
  sheetList: {
    maxHeight: SHEET_LIST_MAX_HEIGHT,
    marginTop: spacing.xs,
  },
  sheetListContent: {
    gap: spacing.s,
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.xs,
  },
  actionArea: {
    gap: spacing.s,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
    backgroundColor: ACTION_BAR_BACKGROUND,
  },
  actionError: {
    fontFamily: fonts.regular,
    fontSize: 13,
    textAlign: 'center',
    color: colors.error,
  },
  actionBar: {
    flexDirection: 'row',
    gap: 9,
  },
  actionButton: {
    minHeight: 52,
    paddingHorizontal: spacing.s,
    borderRadius: radius.segment,
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.borderInput,
  },
  mainButton: {
    flex: 1.6,
  },
  startButton: {
    backgroundColor: START_BUTTON_BACKGROUND,
  },
  actionText: {
    fontFamily: fonts.cairoBold,
    fontSize: 15.5,
  },
  startText: {
    color: START_BUTTON_TEXT,
  },
});
