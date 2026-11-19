import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FieldWrapper, FormField, SelectField, type SelectOption } from '@/components/mobile/Form';
import { ScreenHeader } from '@/components/mobile/ScreenHeader';
import { AuthButton, AuthLink } from '@/components/mobile/passenger/Auth';
import { DateField, displayToIsoDate } from '@/components/mobile/passenger/DateField';
import { RoleToggle } from '@/components/mobile/passenger/RoleToggle';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { authColors, fonts, palette, spacing, typography } from '@/src/constants/theme';
import { MIN_PASSWORD_LENGTH, register } from '@/src/services/authService';
import { listGenders } from '@/src/services/catalogService';
import type { Role } from '@/src/types/user';
import { now } from '@/src/utils/clock';
import { toIsoDate } from '@/src/utils/format';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormValues = {
  fullName: string;
  email: string;
  gender: string | null;
  roles: Role[];
  birthDate: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.fullName.trim()) errors.fullName = 'Ingresa tu nombre completo.';

  if (!values.email.trim()) {
    errors.email = 'Ingresa tu correo electrónico.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Ingresa un correo válido.';
  }

  if (!values.gender) errors.gender = 'Selecciona una opción.';
  if (values.roles.length === 0) errors.roles = 'Selecciona al menos un rol.';

  const birthDate = displayToIsoDate(values.birthDate);
  if (!values.birthDate) {
    errors.birthDate = 'Ingresa tu fecha de nacimiento.';
  } else if (!birthDate || birthDate > toIsoDate(now())) {
    errors.birthDate = 'Ingresa una fecha válida.';
  }

  if (!values.password) {
    errors.password = 'Ingresa una contraseña.';
  } else if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (!values.acceptedTerms) errors.acceptedTerms = 'Debes aceptar los términos y condiciones.';

  return errors;
}

/** "Registro" (Figma 2102:1801), reestilizado con los tokens de Punto 4–7 (D1/D2). */
export default function RegistroScreen() {
  const [values, setValues] = useState<FormValues>({
    fullName: '',
    email: '',
    gender: null,
    roles: [],
    birthDate: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const genders = useServiceData(listGenders, []);
  const genderOptions: SelectOption<string>[] = (genders.data ?? []).map((name) => ({ value: name, label: name }));

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleRegister() {
    if (loading) return;
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setFormError(null);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        gender: values.gender ?? '',
        roles: values.roles,
        birthDate: displayToIsoDate(values.birthDate) ?? '',
        password: values.password,
        acceptedTerms: values.acceptedTerms,
      });
      // La cuenta queda pendiente hasta abrir el enlace que llega al correo institucional.
      router.replace({ pathname: '/verificar-correo', params: { email: values.email.trim().toLowerCase() } });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo completar el registro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Registro" onBack={() => (router.canGoBack() ? router.back() : router.replace('/login'))} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <FormField
            label="Nombre completo"
            placeholder="Tu nombre"
            value={values.fullName}
            onChangeText={(text) => set('fullName', text)}
            error={errors.fullName}
            autoComplete="name"
            textContentType="name"
          />
          <FormField
            label="Correo electrónico"
            placeholder="Tu correo"
            value={values.email}
            onChangeText={(text) => set('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
          <SelectField
            label="Género"
            value={values.gender}
            options={genderOptions}
            onChange={(gender) => set('gender', gender)}
            placeholder="Selecciona tu género"
            error={errors.gender ?? genders.error ?? undefined}
          />
          <FieldWrapper label="Rol" error={errors.roles}>
            <RoleToggle value={values.roles} onChange={(roles) => set('roles', roles)} tone="auth" />
          </FieldWrapper>
          <DateField
            label="Edad"
            value={values.birthDate}
            onChange={(text) => set('birthDate', text)}
            error={errors.birthDate}
            containerStyle={styles.dateField}
          />
          <FormField
            label="Contraseña"
            placeholder="Tu contraseña"
            value={values.password}
            onChangeText={(text) => set('password', text)}
            error={errors.password}
            password
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
          />
          <FormField
            label="Confirmar contraseña"
            placeholder="Tu contraseña"
            value={values.confirmPassword}
            onChangeText={(text) => set('confirmPassword', text)}
            error={errors.confirmPassword}
            password
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <View style={styles.terms}>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: values.acceptedTerms }}
              accessibilityLabel="Acepto los términos y condiciones"
              hitSlop={8}
              onPress={() => set('acceptedTerms', !values.acceptedTerms)}
              style={styles.checkRow}
            >
              <View style={[styles.checkbox, values.acceptedTerms ? styles.checkboxOn : null]}>
                {values.acceptedTerms ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
              <Text style={styles.checkLabel}>He leído y acepto los</Text>
            </Pressable>
            <AuthLink label="Términos y condiciones" onPress={() => router.push('/terminos')} />
          </View>
          {errors.acceptedTerms ? <Text style={styles.formError}>{errors.acceptedTerms}</Text> : null}

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <AuthButton title="Registrar" onPress={handleRegister} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  scrollContent: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: spacing.screen,
    paddingBottom: 36,
    gap: 20,
  },
  dateField: {
    width: 170,
  },
  terms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.s,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: authColors.text,
    borderRadius: 6,
    backgroundColor: authColors.inputBackground,
  },
  checkboxOn: {
    backgroundColor: authColors.button,
    borderColor: authColors.button,
  },
  checkMark: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 16,
    color: palette.white,
  },
  checkLabel: {
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: authColors.text,
  },
  formError: {
    ...typography.textSecondary,
    color: authColors.error,
  },
});
