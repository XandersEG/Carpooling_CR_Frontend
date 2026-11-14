import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { ConfirmDialog } from '@/components/mobile/driver/ConfirmDialog';
import { IconBandera, IconCancelar, IconEnviar } from '@/components/mobile/driver/icons';
import { DriverTripMap } from '@/components/mobile/driver/RouteMaps';
import { PassengerRow, StopsTimeline } from '@/components/mobile/driver/TripSheetParts';
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
/** Alto máximo de la lista de pasajeros/paradas dentro de la hoja inferior. */
const SHEET_LIST_MAX_HEIGHT = 190;

type Tab = 'pasajeros' | 'paradas';

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
  const [trip, setTrip] = useState<DriverTrip | null>(null);
  const [tab, setTab] = useState<Tab>('pasajeros');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [busy, setBusy] = useState<'start' | 'finish' | 'cancel' | null>(null);

  useEffect(() => {
    let active = true;
    getDriverTrip(id).then((data) => {
      if (!active) return;
      if (data.status === 'finalizado') router.replace(`/viaje-conductor/${id}/finalizado`);
      else if (data.status === 'cancelado') router.replace(`/viaje-conductor/${id}/cancelado`);
      else setTrip(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  const start = async () => {
    setBusy('start');
    try {
      setTrip(await startTrip(id));
    } finally {
      setBusy(null);
    }
  };

  const finish = async () => {
    setBusy('finish');
    try {
      await finishTrip(id);
      router.replace(`/viaje-conductor/${id}/finalizado`);
    } finally {
      setBusy(null);
    }
  };

  const cancel = async () => {
    setBusy('cancel');
    try {
      await cancelTrip(id);
      setConfirmCancel(false);
      router.replace(`/viaje-conductor/${id}/cancelado`);
    } finally {
      setBusy(null);
    }
  };

  if (!trip) {
    return (
      <Screen header={<ScreenHeader title="Viaje programado" />}>
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      </Screen>
    );
  }

  const inProgress = trip.status === 'en_curso';

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
          <View style={styles.actionBar}>
            <Button
              title="Cancelar"
              variant="outline"
              disabled={busy !== null}
              onPress={() => setConfirmCancel(true)}
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
                icon={<IconEnviar width={19} height={19} color={palette.white} />}
                onPress={start}
                style={[styles.actionButton, styles.mainButton]}
                textStyle={styles.actionText}
              />
            )}
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
        onCancel={() => setConfirmCancel(false)}
        onConfirm={cancel}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: spacing.xl * 2,
  },
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
  actionBar: {
    flexDirection: 'row',
    gap: 9,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.xl,
    paddingBottom: spacing.m,
    backgroundColor: ACTION_BAR_BACKGROUND,
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
  actionText: {
    fontFamily: fonts.cairoBold,
    fontSize: 15.5,
  },
});
