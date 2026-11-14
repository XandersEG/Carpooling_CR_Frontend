import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { vehicleName } from '@/components/mobile/driver/format';
import { IconImagen } from '@/components/mobile/driver/icons';
import { getPhotoDraft, setPhotoDraft } from '@/components/mobile/driver/vehiclePhotoDraft';
import { getVehiclePhoto } from '@/components/mobile/driver/vehiclePhotos';
import { IconPlus } from '@/components/mobile/icons';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { Button } from '@/components/shared/Button';
import { colors, fonts, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { getVehicle, updateVehicle } from '@/src/services/vehicleService';
import type { Vehicle } from '@/src/types/vehicle';

const NEW_ID = 'nuevo';
const THUMB_SIZE = 72;

/**
 * "Modificar fotografías del vehículo" (Figma 2389:3214). Al editar un vehículo
 * existente, "Guardar imagen" guarda las fotos; al crear uno nuevo las deja en el
 * borrador para que "Guardar datos" las incluya.
 */
export default function VehiclePhotosScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === NEW_ID;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [photos, setPhotos] = useState<string[]>(() => getPhotoDraft(id) ?? []);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let active = true;
    getVehicle(id).then((data) => {
      if (!active) return;
      setVehicle(data);
      if (getPhotoDraft(id) === null) setPhotos(data.photoUrls);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [id, isNew]);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace(`/vehiculos/${id}`));

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (result.canceled) return;
    setPhotos((current) => [...current, ...result.assets.map((asset) => asset.uri)]);
  };

  const save = async () => {
    setSaving(true);
    try {
      if (vehicle) {
        const { brand, model, plate, color, capacity, year } = vehicle;
        await updateVehicle(vehicle.id, { brand, model, plate, color, capacity, year, photoUrls: photos });
      }
      setPhotoDraft(id, photos);
      goBack();
    } finally {
      setSaving(false);
    }
  };

  const preview = vehicle ? getVehiclePhoto({ id: vehicle.id, photoUrls: photos }) : getVehiclePhoto({ id, photoUrls: photos });

  return (
    <Screen
      scroll
      header={<ScreenHeader title="" />}
      contentStyle={styles.content}
      footer={
        <View style={styles.footer}>
          <Button title="Guardar imagen" loading={saving} onPress={save} style={styles.footerButton} />
          <Button title="Cancelar" variant="soft" disabled={saving} onPress={goBack} style={styles.footerButton} />
        </View>
      }
    >
      <View style={styles.titleBlock}>
        <Text accessibilityRole="header" style={styles.title}>
          Agregar vehículo
        </Text>
        <Text style={styles.subtitle}>Agrega fotografías del vehículo</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loading} />
      ) : (
        <>
          {preview || vehicle ? (
            <View style={styles.vehicleRow}>
              <View style={styles.previewBox}>
                {preview ? (
                  <Image source={preview.source} style={styles.preview} resizeMode="contain" accessibilityIgnoresInvertColors />
                ) : null}
              </View>
              {vehicle ? (
                <>
                  <View style={styles.vehicleDivider} />
                  <Text style={styles.vehicleName} numberOfLines={2}>
                    {vehicleName(vehicle)}
                  </Text>
                </>
              ) : null}
            </View>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Agregar imagen"
            onPress={addImage}
            style={({ pressed }) => [styles.uploadBox, pressed ? styles.pressed : null]}
          >
            <Text style={styles.uploadTitle}>Agregar imagen</Text>
            <Text style={styles.uploadHint}>Selecciona una imagen JPG, PNG, o SVG</Text>
            <View style={styles.plusCircle}>
              <IconPlus width={24} height={24} color={colors.textPrimary} />
            </View>
          </Pressable>

          <View style={styles.gallery}>
            <Text style={styles.galleryTitle}>Imágenes del vehículo</Text>
            <View style={styles.thumbs}>
              {photos.length === 0 ? (
                <View style={styles.thumb}>
                  <IconImagen width={33.5} height={33.5} color={colors.textPrimary} />
                </View>
              ) : (
                photos.map((uri, index) => (
                  <View key={`${uri}-${index}`} style={styles.thumbWrapper}>
                    <View style={styles.thumb}>
                      <Image source={{ uri }} style={styles.thumbImage} resizeMode="cover" />
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Quitar imagen ${index + 1}`}
                      hitSlop={8}
                      onPress={() => setPhotos((current) => current.filter((_, i) => i !== index))}
                      style={styles.remove}
                    >
                      <Text style={styles.removeText}>X</Text>
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
  },
  titleBlock: {
    alignItems: 'center',
    gap: 4,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textTitle,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSubtitle,
  },
  loading: {
    marginTop: spacing.xl * 2,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.l,
  },
  previewBox: {
    width: 122,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: 122,
    height: 90,
  },
  vehicleDivider: {
    width: 1,
    height: 55,
    backgroundColor: colors.borderCard,
  },
  vehicleName: {
    flexShrink: 1,
    fontFamily: fonts.black,
    fontSize: 20,
    color: colors.textPrimary,
  },
  uploadBox: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.xl,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.8,
  },
  uploadTitle: {
    fontFamily: fonts.cairoMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  uploadHint: {
    ...typography.subtitle,
    textAlign: 'center',
    color: colors.textSubtitle,
  },
  plusCircle: {
    width: 33,
    height: 33,
    marginTop: spacing.xs,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceInput,
  },
  gallery: {
    gap: spacing.m,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.xl,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.card,
    ...shadows.card,
  },
  galleryTitle: {
    fontFamily: fonts.cairoMedium,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  thumbs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xl + 4,
  },
  thumbWrapper: {
    paddingTop: 6,
    paddingRight: 10,
  },
  thumb: {
    width: THUMB_SIZE,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surfaceInput,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.input,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  remove: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceOrangeLight,
  },
  removeText: {
    fontFamily: fonts.black,
    fontSize: 11,
    color: colors.danger,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.xl,
  },
  footerButton: {
    flex: 1,
  },
});
