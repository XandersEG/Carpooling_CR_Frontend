import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Avatar } from '@/components/shared/Avatar';
import { Card } from '@/components/shared/Card';
import { Chip, type ChipTone } from '@/components/shared/Chip';
import { colors, spacing, typography } from '@/src/constants/theme';

import { RouteInline } from './Route';

export type TripCardChip = {
  label: string;
  tone?: ChipTone;
};

export type TripCardProps = {
  /** Nombre de la persona (para el avatar y el título). */
  name: string;
  /** Texto del avatar si no son las iniciales (p. ej. "+2"). */
  avatarLabel?: string;
  /** "Toyota Corolla · Blanco" */
  vehicle: string;
  /** "₡1 500" o "Gratis" */
  cost: string;
  origin: string;
  destination: string;
  /** Chips inferiores (hora, cupos, pago, estado…). */
  chips: TripCardChip[];
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Componente "Card viaje" (Figma 2446:2231). */
export function TripCard({
  name,
  avatarLabel,
  vehicle,
  cost,
  origin,
  destination,
  chips,
  onPress,
  style,
}: TripCardProps) {
  return (
    <Card
      gap={spacing.s}
      onPress={onPress}
      accessibilityLabel={`Viaje con ${name}, de ${origin} a ${destination}`}
      style={style}
    >
      <View style={styles.header}>
        <Avatar name={name} label={avatarLabel} />
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.vehicle} numberOfLines={1}>
            {vehicle}
          </Text>
        </View>
        <Text style={styles.cost}>{cost}</Text>
      </View>
      <RouteInline origin={origin} destination={destination} />
      <View style={styles.chips}>
        {chips.map((chip) => (
          <Chip key={chip.label} label={chip.label} tone={chip.tone} />
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.nameCard,
    color: colors.textPrimary,
  },
  vehicle: {
    ...typography.textSmall,
    color: colors.textSecondary,
  },
  cost: {
    ...typography.buttonCost,
    color: colors.textDark,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
