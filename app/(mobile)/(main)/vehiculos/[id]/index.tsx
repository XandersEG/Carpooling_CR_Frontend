import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { vehicleName } from '@/components/mobile/driver/format';
import { IconImagen } from '@/components/mobile/driver/icons';
import { clearPhotoDraft, getPhotoDraft, setPhotoDraft } from '@/components/mobile/driver/vehiclePhotoDraft';
import { getVehiclePhoto } from '@/components/mobile/driver/vehiclePhotos';
import { FieldWrapper, FormField, SelectField, Stepper, type SelectOption } from '@/components/mobile/Form';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Button } from '@/components/shared/Button';
import { colors, fonts, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { createVehicle, getVehicle, updateVehicle } from '@/src/services/vehicleService';
import type { Vehicle, VehicleInput } from '@/src/types/vehicle';

/** Id de ruta para crear un vehículo: `/vehiculos/nuevo`. */
const NEW_ID = 'nuevo';

/**
 * Opciones de "Color del vehículo". El diseño no define la lista (solo
 * "Todos los colores"); se usan colores comunes, incluidos los de los datos de ejemplo.
 */
const COLOR_NAMES = ['Blanco', 'Negro', 'Gris', 'Plateado', 'Rojo', 'Azul', 'Verde', 'Otro'];

/**
 * Capacidad máxima del contador. El diseño no la define; se usa la mayor
 * capacidad de los tipos de vehículo activos del catálogo (SUV: 6).
 */
const MAX_VEHICLE_CAPACITY = 6;

type FormState = { model: string; brand: string; plate: string; color: string | null; capacity: number };
type FormErrors = Partial<Record<'model' | 'brand' | 'plate' | 'color', string>>;

const REQUIRED = 'Campo requerido';

/** "Datos del vehículo" (Figma 2389:2635). Edita un vehículo o crea uno nuevo (`nuevo`). */
export default function VehicleFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === NEW_ID;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [form, setForm] = useState<FormState>({ model: '', brand: '', plate: '', color: null, capacity: 4 });
  const [photos, setPhotos] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    clearPhotoDraft();
    if (isNew) return;
    let active = true;
    getVehicle(id).then((data) => {
      if (!active) return;
      setVehicle(data);
      setForm({ model: data.model, brand: data.brand, plate: data.plate, color: data.color, capacity: data.capacity });
      setPhotos(data.photoUrls);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, isNew]);

  // Al volver de "Modificar fotografías" se toman las fotos editadas.
  useFocusEffect(
    useCallback(() => {
      const draft = getPhotoDraft(id);
      if (draft) setPhotos(draft);
    }, [id]),
  );

  const colorOptions: SelectOption<string>[] = (
    form.color && !COLOR_NAMES.includes(form.color) ? [...COLOR_NAMES, form.color] : COLOR_NAMES
  ).map((name) => ({ value: name, label: name }));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/vehiculos'));

  const save = async () => {
    const nextErrors: FormErrors = {
      model: form.model.trim() ? undefined : REQUIRED,
      brand: form.brand.trim() ? undefined : REQUIRED,
      plate: form.plate.trim() ? undefined : REQUIRED,
      color: form.color ? undefined : REQUIRED,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !form.color) return;

    const input: VehicleInput = {
      model: form.model.trim(),
      brand: form.brand.trim(),
      plate: form.plate.trim().toUpperCase(),
      color: form.color,
      capacity: form.capacity,
      photoUrls: photos,
    };
    setSaving(true);
    try {
      if (isNew) await createVehicle(input);
      else await updateVehicle(id, input);
      clearPhotoDraft();
      goBack();
    } finally {
      setSaving(false);
    }
  };

  const openPhotos = () => {
    setPhotoDraft(id, photos);
    router.push(`/vehiculos/${id}/fotos`);
  };

  const preview = getVehiclePhoto({ id: vehicle?.id ?? NEW_ID, photoUrls: photos });
  const title = vehicleName({ brand: form.brand, model: form.model });

  return (
    <Screen
      scroll
      header={<ScreenHeader title="Datos del vehículo" style={styles.header} />}
      contentStyle={styles.content}
      footer={
        <View style={styles.footer}>
          <Button title="Guardar datos" loading={saving} onPress={save} style={styles.footerButton} />
          <Button title="Cancelar" variant="soft" disabled={saving} onPress={goBack} style={styles.footerButton} />
        </View>
      }
    >
      <Text style={styles.subtitle}>Edita la información del vehículo</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <View style={styles.formCard}>
          <View style={styles.photoCard}>
            <View style={styles.photoBox}>
              {preview ? (
                <Image source={preview.source} style={styles.photo} resizeMode="contain" accessibilityIgnoresInvertColors />
              ) : (
                <IconImagen width={33.5} height={33.5} color={colors.textPlaceholder} />
              )}
            </View>
            <View style={styles.photoDivider} />
            <View style={styles.photoInfo}>
              {title ? (
                <Text style={styles.vehicleTitle} numberOfLines={2}>
                  {title}
                </Text>
              ) : null}
              <Pressable
                accessibilityRole="button"
                onPress={openPhotos}
                style={({ pressed }) => [styles.changePhoto, pressed ? styles.pressed : null]}
              >
                <Text style={styles.changePhotoText}>Cambiar imagen</Text>
              </Pressable>
            </View>
          </View>

          <FormField
            label="Nombre del modelo"
            placeholder="Modelo del vehículo"
            value={form.model}
            onChangeText={(text) => update('model', text)}
            error={errors.model}
          />
          <FormField
            label="Marca de vehículo"
            placeholder="Nombre de marca"
            value={form.brand}
            onChangeText={(text) => update('brand', text)}
            error={errors.brand}
          />
          <FormField
            label="Placa del vehículo"
            placeholder="Número de placa"
            autoCapitalize="characters"
            value={form.plate}
            onChangeText={(text) => update('plate', text)}
            error={errors.plate}
          />
          <SelectField
            label="Color del vehículo"
            placeholder="Todos los colores"
            value={form.color}
            options={colorOptions}
            onChange={(value) => update('color', value)}
            error={errors.color}
          />
          <FieldWrapper label="Capacidad de pasajeros">
            <Stepper
              value={form.capacity}
              min={1}
              max={MAX_VEHICLE_CAPACITY}
              onChange={(value) => update('capacity', value)}
            />
          </FieldWrapper>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 0,
  },
  content: {
    gap: spacing.m,
    paddingTop: 2,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSubtitle,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
  formCard: {
    gap: spacing.l,
    padding: spacing.m,
    paddingBottom: spacing.xl,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    ...shadows.card,
  },
  photoCard: {
    minHeight: 110,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surfaceGreenLight,
    borderRadius: radius.input,
  },
  photoBox: {
    width: 139,
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 139,
    height: 98,
  },
  photoDivider: {
    width: 1,
    alignSelf: 'stretch',
    marginVertical: spacing.xxs,
    backgroundColor: colors.borderCard,
  },
  photoInfo: {
    flex: 1,
    gap: spacing.s,
  },
  vehicleTitle: {
    fontFamily: fonts.black,
    fontSize: 20,
    color: colors.textPrimary,
  },
  changePhoto: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.m,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.accentGreen,
    borderRadius: radius.chip,
  },
  changePhotoText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.accentGreen,
  },
  pressed: {
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  footerButton: {
    flex: 1,
  },
});
