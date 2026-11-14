import { Fragment } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { DetailDivider, DetailRow } from '@/components/mobile/Detail';
import { Avatar } from '@/components/shared/Avatar';
import { Card } from '@/components/shared/Card';
import { colors, spacing, typography } from '@/src/constants/theme';
import type { JoinRequest } from '@/src/types/trip';
import { formatColones } from '@/src/utils/format';

type PassengersEarningsCardProps = {
  passengers: JoinRequest[];
  /** Ganancia total. Por defecto, la suma de los montos de los pasajeros. */
  total?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bloque "Pasajeros / Ganancia total" con cada pasajero, su monto y método de
 * pago. Aparece en "Solicitudes" expandida (2726:6537) y en "Historial viaje
 * conductor" (2518:3512).
 */
export function PassengersEarningsCard({ passengers, total, style }: PassengersEarningsCardProps) {
  const earnings = total ?? passengers.reduce((sum, passenger) => sum + passenger.amount, 0);

  return (
    <Card gap={spacing.xxs} style={style}>
      <DetailRow label="Pasajeros" value={String(passengers.length)} />
      <DetailRow label="Ganancia total" value={formatColones(earnings)} />
      {passengers.map((request) => (
        <Fragment key={request.id}>
          <DetailDivider />
          <View style={styles.person}>
            <Avatar name={request.passenger.fullName} />
            <Text style={styles.name} numberOfLines={1}>
              {request.passenger.fullName}
            </Text>
            <Text style={styles.amount}>{formatColones(request.amount)}</Text>
          </View>
          <DetailRow label="Método de pago" value={request.paymentMethod.name} />
        </Fragment>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  name: {
    ...typography.nameCard,
    flex: 1,
    color: colors.textPrimary,
  },
  amount: {
    ...typography.textStrong,
    color: colors.textPrimary,
  },
});
