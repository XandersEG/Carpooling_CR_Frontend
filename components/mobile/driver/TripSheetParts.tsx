import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/shared/Avatar';
import { Card } from '@/components/shared/Card';
import { Chip } from '@/components/shared/Chip';
import { colors, fonts, palette, spacing, typography } from '@/src/constants/theme';
import type { JoinRequest, TripStop } from '@/src/types/trip';
import { formatTime } from '@/src/utils/format';

import { IconParadaOrigen, IconParadaRecogida } from './icons';

/** grey/700 de Figma para el detalle de cada parada; no hay token semántico equivalente. */
const STOP_DETAIL_COLOR = '#727272';

/** Fila "Pasajero" (2642:3982): avatar de 44 px, nombre y chip "Recogida: …". */
export function PassengerRow({ request }: { request: JoinRequest }) {
  return (
    <Card gap={0} style={styles.passenger}>
      <Avatar name={request.passenger.fullName} size={44} />
      <View style={styles.passengerText}>
        <Text style={styles.passengerName} numberOfLines={1}>
          {request.passenger.fullName}
        </Text>
        {request.pickupPoint ? <Chip label={`Recogida: ${request.pickupPoint.name}`} style={styles.chip} /> : null}
      </View>
    </Card>
  );
}

function stopDetail(stop: TripStop): string {
  if (stop.kind === 'origen') return 'Origen · sale el conductor';
  if (stop.kind === 'recogida') return `${stop.passengerName ?? 'Pasajero'} · recogida`;
  return `Destino · ${stop.place.detail ?? stop.place.name}`;
}

/** Línea de tiempo de "Paradas" (2642:3754). */
export function StopsTimeline({ stops }: { stops: TripStop[] }) {
  return (
    <View style={styles.timeline}>
      <View style={styles.timelineLine} />
      {stops.map((stop, index) => (
        <View key={`${stop.place.name}-${index}`} style={styles.stop}>
          <View style={styles.marker}>
            {stop.kind === 'origen' ? <IconParadaOrigen width={14} height={14} /> : null}
            {stop.kind === 'recogida' ? <IconParadaRecogida width={14} height={14} /> : null}
            {stop.kind === 'destino' ? <View style={styles.destinationMarker} /> : null}
          </View>
          <View style={styles.stopText}>
            <Text style={styles.stopName} numberOfLines={1}>
              {stop.place.name}
            </Text>
            <Text style={styles.stopDetail} numberOfLines={1}>
              {stopDetail(stop)}
            </Text>
          </View>
          <Text style={styles.stopTime}>{formatTime(stop.time)}</Text>
        </View>
      ))}
    </View>
  );
}

const STOP_GAP = 12;

const styles = StyleSheet.create({
  passenger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  passengerText: {
    flex: 1,
    gap: 4,
  },
  passengerName: {
    ...typography.nameHighlight,
    color: colors.textPrimary,
  },
  chip: {
    paddingVertical: 3,
  },
  timeline: {
    gap: STOP_GAP,
  },
  timelineLine: {
    position: 'absolute',
    left: 6,
    top: 10,
    bottom: 22,
    width: 2,
    backgroundColor: colors.primary,
  },
  stop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  marker: {
    width: 14,
    height: 14,
    marginTop: 3,
  },
  destinationMarker: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: palette.white,
    backgroundColor: colors.textPrimary,
  },
  stopText: {
    flex: 1,
    gap: 1,
  },
  stopName: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  stopDetail: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: STOP_DETAIL_COLOR,
  },
  stopTime: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.textPrimary,
  },
});
