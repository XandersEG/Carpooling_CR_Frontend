import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FieldWrapper, FormField, SelectField, type SelectOption } from '@/components/mobile/Form';
import { Screen } from '@/components/mobile/Screen';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { DateField, displayToIsoDate, isoToDisplayDate } from '@/components/mobile/passenger/DateField';
import { IconFotoPerfil, IconVehiculosCarro, IconVehiculosCarroPequeno } from '@/components/mobile/passenger/icons';
import { LoadState } from '@/components/mobile/passenger/LoadState';
import { RoleToggle } from '@/components/mobile/passenger/RoleToggle';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { Avatar } from '@/components/shared/Avatar';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { colors, fonts, palette, radius, spacing, typography } from '@/src/constants/theme';
import { listCatalog } from '@/src/services/admin/catalogService';
import { getProfile, updateProfile } from '@/src/services/profileService';
import type { Role, UserProfile } from '@/src/types/user';
import { now } from '@/src/utils/clock';
import { toIsoDate } from '@/src/utils/format';

type FormValues = {
  fullName: string;
  gender: string | null;
  birthDate: string;
  roles: Role[];
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function toForm(profile: UserProfile): FormValues {
  return {
    fullName: profile.fullName,
    gender: profile.gender || null,
    birthDate: isoToDisplayDate(profile.birthDate),
    roles: profile.roles,
  };
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = 'Ingresa tu nombre completo.';
  if (!values.gender) errors.gender = 'Selecciona una opción.';
  const birthDate = displayToIsoDate(values.birthDate);
  if (!birthDate || birthDate > toIsoDate(now())) errors.birthDate = 'Ingresa una fecha válida.';
  if (values.roles.length === 0) errors.roles = 'Selecciona al menos un rol.';
  return errors;
}

/**
 * "Mi Perfil": Conductor (Figma 2519:8506), Pasajero (2519:8588) y Ambos
 * (2519:8693) son una sola pantalla; la variante depende de los roles
 * seleccionados. Reestilizada con los tokens de Punto 4–7 (D1).
 */
export default function PerfilScreen() {
  const profile = useServiceData(getProfile, []);
  const genders = useServiceData(() => listCatalog('opciones-genero'), []);
  const [values, setValues] = useState<FormValues | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile.data) setValues(toForm(profile.data));
  }, [profile.data]);

  const genderOptions: SelectOption<string>[] = (genders.data ?? [])
    .filter((item) => item.active)
    .map((item) => ({ value: item.name, label: item.name }));

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => (current ? { ...current, [key]: value } : current));
    setMessage(null);
  }

  async function handleSave() {
    if (!values) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    setMessage(null);
    try {
      const updated = await updateProfile({
        fullName: values.fullName.trim(),
        gender: values.gender ?? undefined,
        birthDate: displayToIsoDate(values.birthDate) ?? undefined,
        roles: values.roles,
      });
      setValues(toForm(updated));
      setMessage('Cambios guardados.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  }

  const user = profile.data;
  const isDriver = values?.roles.includes('conductor') ?? false;

  return (
    <Screen header={<ScreenHeader title="Mi Perfil" showBack={false} centered />} scroll={Boolean(user && values)}>
      {user && values ? (
        <>
          <View style={styles.identity}>
            <View>
              <Avatar
                name={user.fullName}
                imageUrl={user.avatarUrl}
                size={AVATAR_SIZE}
                backgroundColor={palette.mauveLight}
              />
              {/* Insignia de foto: sin flujo diseñado, no es interactiva. */}
              <View style={styles.photoBadge}>
                <IconFotoPerfil width={21.5} height={21.5} color={colors.textDark} />
              </View>
            </View>
            <Text style={styles.displayName}>{user.displayName}</Text>
            <Text style={styles.institution}>{user.institutionName}</Text>
          </View>

          <Card gap={spacing.l} style={styles.formCard}>
            <FormField
              label="Nombre completo"
              value={values.fullName}
              onChangeText={(text) => set('fullName', text)}
              error={errors.fullName}
              autoComplete="name"
              textContentType="name"
            />
            <FormField label="Correo Institucional" value={user.email} editable={false} />
            <SelectField
              label="Género"
              value={values.gender}
              options={genderOptions}
              onChange={(gender) => set('gender', gender)}
              placeholder="Selecciona tu género"
              error={errors.gender}
            />
            <DateField
              label="Edad"
              value={values.birthDate}
              onChange={(text) => set('birthDate', text)}
              error={errors.birthDate}
              containerStyle={styles.dateField}
            />
            <FieldWrapper label="Rol" error={errors.roles}>
              <RoleToggle value={values.roles} onChange={(roles) => set('roles', roles)} tone="app" />
            </FieldWrapper>
          </Card>

          <View style={styles.actions}>
            <Button title="Guardar Cambios" onPress={handleSave} loading={saving} style={styles.saveButton} />
            {isDriver ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Mis Vehículos"
                onPress={() => router.push('/vehiculos')}
                style={({ pressed }) => [styles.vehiclesButton, pressed ? styles.pressed : null]}
              >
                <View style={styles.vehiclesCircle}>
                  <View style={styles.carBack}>
                    <IconVehiculosCarro width={24} height={24} color={colors.textPrimary} />
                  </View>
                  <View style={styles.carFront}>
                    <IconVehiculosCarroPequeno width={21} height={21} color={colors.textPrimary} />
                  </View>
                </View>
                <Text style={styles.vehiclesLabel}>Mis Vehículos</Text>
              </Pressable>
            ) : null}
          </View>
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </>
      ) : (
        <LoadState loading={profile.loading} error={profile.error} />
      )}
    </Screen>
  );
}

const AVATAR_SIZE = 119;

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
  },
  photoBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 29,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.mauveLight,
    borderWidth: 1,
    borderColor: colors.textDark,
    borderRadius: 8,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  displayName: {
    marginTop: spacing.xxs,
    fontFamily: fonts.cairoMedium,
    fontSize: 20,
    color: colors.textTitle,
  },
  institution: {
    ...typography.textSecondary,
    fontSize: 14,
    color: colors.textSecondary,
  },
  formCard: {
    marginTop: spacing.xl,
    paddingVertical: spacing.xl,
  },
  dateField: {
    width: 170,
  },
  actions: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.l,
  },
  saveButton: {
    flex: 1,
    maxWidth: 260,
  },
  vehiclesButton: {
    alignItems: 'center',
    gap: 2,
  },
  pressed: {
    opacity: 0.8,
  },
  vehiclesCircle: {
    width: 44,
    height: 41,
    backgroundColor: palette.mauveLight,
    borderWidth: 1,
    borderColor: palette.black,
    borderRadius: radius.pill,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  // Posiciones de los dos íconos lucide/car dentro del círculo (Figma 2519:9503 y 2519:9518).
  carBack: {
    position: 'absolute',
    left: 5,
    top: 11,
  },
  carFront: {
    position: 'absolute',
    left: 19,
    top: 5,
  },
  vehiclesLabel: {
    fontFamily: fonts.cairoRegular,
    fontSize: 10,
    color: colors.textPrimary,
  },
  message: {
    ...typography.textSmall,
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
