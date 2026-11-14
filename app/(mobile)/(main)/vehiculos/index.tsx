import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text } from 'react-native';

import { ConfirmDialog } from '@/components/mobile/driver/ConfirmDialog';
import { vehicleName } from '@/components/mobile/driver/format';
import { imgBasurero } from '@/components/mobile/driver/icons';
import { VehicleCard } from '@/components/mobile/driver/VehicleCard';
import { IconPlus } from '@/components/mobile/icons';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Button } from '@/components/shared/Button';
import { colors, palette, spacing, typography } from '@/src/constants/theme';
import { deleteVehicle, listMyVehicles } from '@/src/services/vehicleService';
import type { Vehicle } from '@/src/types/vehicle';

/** "Mis vehículos" (Figma 2295:4283) + diálogo "¿Eliminar vehículo?" (2295:4571). */
export default function VehiclesScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[] | null>(null);
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listMyVehicles().then((list) => {
        if (active) setVehicles(list);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteVehicle(toDelete.id);
      setVehicles((current) => current?.filter((item) => item.id !== toDelete.id) ?? null);
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Screen
      scroll
      header={<ScreenHeader title="Mis vehículos" style={styles.header} />}
      contentStyle={styles.content}
      footer={
        <Button
          title="Agregar vehículo"
          icon={<IconPlus width={24} height={24} color={palette.white} />}
          iconPosition="left"
          fullWidth
          onPress={() => router.push('/vehiculos/nuevo')}
        />
      }
    >
      <Text style={styles.subtitle}>Gestiona los vehículos que utilizas para publicar viajes</Text>
      {vehicles === null ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            showChevron
            onPress={() => router.push(`/vehiculos/${vehicle.id}`)}
            onEdit={() => router.push(`/vehiculos/${vehicle.id}`)}
            onDelete={() => setToDelete(vehicle)}
          />
        ))
      )}

      <ConfirmDialog
        visible={toDelete !== null}
        icon={<Image source={imgBasurero} style={styles.dialogIcon} resizeMode="contain" />}
        title="¿Eliminar vehículo?"
        message={
          toDelete ? `¿Seguro que deseas eliminar el ${vehicleName(toDelete)} ${toDelete.plate}?` : ''
        }
        note="Esta acción no se puede deshacer"
        cancelLabel="Cancelar"
        confirmLabel="Eliminar"
        loading={deleting}
        onCancel={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0,
  },
  content: {
    gap: spacing.s,
    paddingTop: 2,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSubtitle,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
  dialogIcon: {
    width: 28,
    height: 35,
  },
});
