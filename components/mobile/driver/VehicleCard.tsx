import { Image, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { IconChevronAbajo } from '@/components/mobile/icons';
import { colors, fonts, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { formatPassengers } from '@/src/utils/format';
import type { Vehicle } from '@/src/types/vehicle';

import { vehicleName } from './format';
import { imgBasurero, imgLapiz, imgPersonas } from './icons';
import { getVehiclePhoto } from './vehiclePhotos';

const HEADER_HEIGHT = 60;

type VehicleCardProps = {
  vehicle: Vehicle;
  /** Capacidad a mostrar si difiere de la del vehículo (cupos publicados en "Confirmación"). */
  capacity?: number;
  /** Muestra el chevron ">" (lista "Mis vehículos"). */
  showChevron?: boolean;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tarjeta de vehículo de "Mis vehículos" (2295:4283) y del paso "Vehículo" de
 * "Publicar Viaje" (2390:1976). Encabezado verde si el vehículo está activo y
 * gris si no; reestilizada con los tokens de Punto 4–7 (decisión D1).
 */
export function VehicleCard({
  vehicle,
  capacity = vehicle.capacity,
  showChevron = false,
  onPress,
  onEdit,
  onDelete,
  style,
}: VehicleCardProps) {
  const photo = getVehiclePhoto(vehicle);
  const name = vehicleName(vehicle);

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${name} ${vehicle.plate}${vehicle.active ? ', activo' : ''}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.pressed : null, style]}
    >
      <View style={[styles.header, vehicle.active ? styles.headerActive : styles.headerInactive]}>
        <View style={styles.photoSlot}>
          {photo ? (
            <Image
              source={photo.source}
              resizeMode="contain"
              style={{ position: 'absolute', top: photo.box.top, width: photo.box.width, height: photo.box.height }}
              accessibilityIgnoresInvertColors
            />
          ) : null}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {vehicle.active ? (
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Activo</Text>
            </View>
          ) : null}
        </View>
        {showChevron ? (
          <IconChevronAbajo width={13.5} height={8.7} color={colors.textPrimary} style={styles.chevron} />
        ) : null}
      </View>

      <View style={styles.specs}>
        <View style={styles.column}>
          <Spec label="Placa" value={vehicle.plate} />
          <Spec label="Marca" value={vehicle.brand} />
          <Spec label="Modelo" value={vehicle.model} />
        </View>
        <View style={styles.divider} />
        <View style={styles.column}>
          <Spec label="Color" value={vehicle.color} />
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Capacidad</Text>
            <View style={styles.capacity}>
              <Image source={imgPersonas} style={styles.peopleIcon} resizeMode="contain" />
              <Text style={styles.specValue}>{formatPassengers(capacity)}</Text>
            </View>
          </View>
        </View>
      </View>

      {onEdit || onDelete ? (
        <View style={styles.actions}>
          {onEdit ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Editar ${name}`}
              onPress={onEdit}
              style={({ pressed }) => [styles.action, styles.editAction, pressed ? styles.pressed : null]}
            >
              <Image source={imgLapiz} style={styles.pencil} resizeMode="contain" />
              <Text style={[styles.actionText, styles.editText]}>Editar</Text>
            </Pressable>
          ) : null}
          {onDelete ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Eliminar ${name}`}
              onPress={onDelete}
              style={({ pressed }) => [styles.action, styles.deleteAction, pressed ? styles.pressed : null]}
            >
              <Image source={imgBasurero} style={styles.trash} resizeMode="contain" />
              <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.specRow}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    paddingRight: spacing.xl,
    borderTopLeftRadius: radius.card - 1,
    borderTopRightRadius: radius.card - 1,
  },
  headerActive: {
    backgroundColor: colors.surfaceGreenLight,
  },
  headerInactive: {
    backgroundColor: palette.grey,
  },
  photoSlot: {
    width: 89,
    height: HEADER_HEIGHT,
    marginLeft: spacing.xl,
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  name: {
    ...typography.nameCard,
    color: colors.textPrimary,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    backgroundColor: colors.surfaceGreenSoft,
    borderRadius: radius.chip,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGreen,
  },
  badgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.textDark,
  },
  chevron: {
    transform: [{ rotate: '-90deg' }],
  },
  specs: {
    flexDirection: 'row',
    gap: spacing.m,
    paddingHorizontal: spacing.xl + 8,
    paddingTop: spacing.xs,
    paddingBottom: spacing.m,
  },
  column: {
    flex: 1,
  },
  divider: {
    width: 1,
    marginVertical: 2,
    backgroundColor: colors.borderCard,
  },
  specRow: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  specLabel: {
    ...typography.textSmall,
    width: 62,
    color: colors.textSecondary,
  },
  specValue: {
    ...typography.textSmall,
    flexShrink: 1,
    color: colors.textPrimary,
  },
  capacity: {
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  peopleIcon: {
    width: 25,
    height: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.l,
    paddingHorizontal: spacing.m,
    paddingBottom: spacing.m,
  },
  action: {
    flex: 1,
    height: 33,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.chip,
  },
  editAction: {
    backgroundColor: colors.surfaceGreenLight,
  },
  deleteAction: {
    backgroundColor: colors.surfaceOrangeLight,
  },
  pencil: {
    width: 22,
    height: 20,
  },
  trash: {
    width: 18,
    height: 23,
  },
  actionText: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  editText: {
    color: colors.textDark,
  },
  deleteText: {
    color: colors.danger,
  },
});
