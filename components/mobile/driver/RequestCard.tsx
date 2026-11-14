import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DetailDivider, DetailRow } from '@/components/mobile/Detail';
import { DestinationSquare, OriginDot, RouteVertical } from '@/components/mobile/Route';
import { colors, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import type { IncomingRequest } from '@/src/types/trip';
import { formatDayMonth, formatTime } from '@/src/utils/format';

import { IconAceptar, IconRechazar } from './icons';
import { PassengersEarningsCard } from './PassengersEarningsCard';

type RequestCardProps = {
  request: IncomingRequest;
  expanded: boolean;
  busy?: boolean;
  onToggle: () => void;
  onAccept: () => void;
  onReject: () => void;
};

/**
 * Tarjeta de "Solicitudes" (2726:6159…6996). Contraída muestra la mini ruta y
 * los botones ✕ / ✓; expandida muestra fecha, horas y los pasajeros. Aceptada se
 * rellena de verde y solo conserva ✕.
 */
export function RequestCard({ request, expanded, busy = false, onToggle, onAccept, onReject }: RequestCardProps) {
  const accepted = request.status === 'aceptada';
  const hasDetail = Boolean(request.departureAt) || request.passengers.length > 0;
  const showExpanded = expanded && hasDetail;
  const route = `${request.origin.name} a ${request.destination.name}`;

  const actions = (
    <View style={styles.actions}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Rechazar solicitud de ${route}`}
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
          accessibilityLabel={`Aceptar solicitud de ${route}`}
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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded: showExpanded }}
      accessibilityLabel={`Solicitud de ${route}${accepted ? ', aceptada' : ''}`}
      disabled={!hasDetail}
      onPress={onToggle}
      style={[
        showExpanded ? styles.expandedCard : styles.card,
        accepted ? styles.accepted : null,
      ]}
    >
      {showExpanded ? (
        <>
          <View style={styles.row}>
            <RouteVertical origin={request.origin.name} destination={request.destination.name} style={styles.flex} />
            {actions}
          </View>
          <DetailDivider />
          {request.departureAt ? <DetailRow label="Fecha" value={formatDayMonth(request.departureAt)} /> : null}
          {request.departureAt ? <DetailRow label="Hora de salida" value={formatTime(request.departureAt)} /> : null}
          {request.arrivalAt ? <DetailRow label="Hora de llegada" value={formatTime(request.arrivalAt)} /> : null}
          {request.passengers.length > 0 ? <PassengersEarningsCard passengers={request.passengers} /> : null}
        </>
      ) : (
        <View style={styles.row}>
          <MiniRoute origin={request.origin.name} destination={request.destination.name} />
          {actions}
        </View>
      )}
    </Pressable>
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
  flex: {
    flex: 1,
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
    flex: 1,
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
