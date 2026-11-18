import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DetailDivider, DetailRow } from '@/components/mobile/Detail';
import { DestinationSquare, OriginDot, RouteVertical } from '@/components/mobile/Route';
import { colors, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import type { IncomingRequest } from '@/src/types/trip';
import { formatCost, formatDayMonth, formatTime } from '@/src/utils/format';

import { IconAceptar, IconRechazar } from './icons';

type RequestCardProps = {
  request: IncomingRequest;
  expanded: boolean;
  busy?: boolean;
  onToggle: () => void;
  onAccept: () => void;
  onReject: () => void;
};

/**
 * Tarjeta de "Solicitudes" (2726:6159…6996): un pasajero que pide unirse a un
 * viaje. Contraída muestra el pasajero, la mini ruta y los botones ✕ / ✓;
 * expandida agrega fecha, hora, punto de recogida y aporte. Aceptada se rellena
 * de verde y solo conserva ✕.
 */
export function RequestCard({ request, expanded, busy = false, onToggle, onAccept, onReject }: RequestCardProps) {
  const accepted = request.status === 'aceptada';
  const route = `${request.origin.name} a ${request.destination.name}`;
  const label = `Solicitud de ${request.passenger.fullName}, ${route}`;

  const actions = (
    <View style={styles.actions}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Rechazar ${label}`}
        disabled={busy}
        hitSlop={6}
        onPress={onReject}
        style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
        <IconRechazar width={36} height={36} />
      </Pressable>
      {!accepted ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Aceptar ${label}`}
          disabled={busy}
          hitSlop={6}
          onPress={onAccept}
          style={({ pressed }) => (pressed ? styles.pressed : null)}
        >
          <IconAceptar width={36} height={36} />
        </Pressable>
      ) : null}
    </View>
  );

  // Los botones ✕ / ✓ quedan fuera de las zonas que abren y cierran la tarjeta: en web
  // un <button> dentro de otro <button> es HTML inválido.
  return (
    <View style={[expanded ? styles.expandedCard : styles.card, accepted ? styles.accepted : null]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          accessibilityLabel={`${label}${accepted ? ', aceptada' : ''}`}
          onPress={onToggle}
          style={styles.summary}
        >
          <Text style={styles.passenger} numberOfLines={1}>
            {request.passenger.fullName}
          </Text>
          {expanded ? (
            <RouteVertical origin={request.origin.name} destination={request.destination.name} />
          ) : (
            <MiniRoute origin={request.origin.name} destination={request.destination.name} />
          )}
        </Pressable>
        {actions}
      </View>

      {expanded ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Ocultar detalle" onPress={onToggle} style={styles.details}>
          <DetailDivider />
          <DetailRow label="Fecha" value={formatDayMonth(request.departureAt)} />
          <DetailRow label="Hora de salida" value={formatTime(request.departureAt)} />
          <DetailRow label="Punto de recogida" value={request.pickupPoint.name} />
          <DetailRow label="Aporte" value={formatCost(request.amount)} />
        </Pressable>
      ) : null}
    </View>
  );
}

/** Ruta compacta: nombres arriba y "● —— ■" debajo ("Origen-Destino"). */
function MiniRoute({ origin, destination }: { origin: string; destination: string }) {
  return (
    <View style={styles.mini}>
      <View style={styles.miniNames}>
        <Text style={styles.miniText} numberOfLines={1}>
          {origin}
        </Text>
        <Text style={[styles.miniText, styles.miniDestination]} numberOfLines={1}>
          {destination}
        </Text>
      </View>
      <View style={styles.miniLine}>
        <OriginDot size={10} />
        <View style={styles.line} />
        <DestinationSquare size={10} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 75,
    justifyContent: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.mauveLight,
    borderRadius: radius.input,
  },
  expandedCard: {
    gap: spacing.xxs,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    ...shadows.card,
  },
  accepted: {
    backgroundColor: colors.surfaceGreenLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  summary: {
    flex: 1,
    gap: spacing.xs,
  },
  passenger: {
    ...typography.nameCard,
    color: colors.textTitle,
  },
  details: {
    gap: spacing.xxs,
  },
  actions: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
  },
  pressed: {
    opacity: 0.6,
  },
  mini: {
    maxWidth: 200,
    gap: 4,
  },
  miniNames: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  miniText: {
    ...typography.textStrong,
    flexShrink: 1,
    color: colors.textPrimary,
  },
  miniDestination: {
    textAlign: 'right',
  },
  miniLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 32,
    paddingRight: spacing.xl,
  },
  line: {
    flex: 1,
    height: 2,
    marginHorizontal: spacing.s,
    backgroundColor: colors.routeLine,
  },
});