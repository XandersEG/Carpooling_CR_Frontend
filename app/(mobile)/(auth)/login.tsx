import { router } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField } from '@/components/mobile/Form';
import { AuthButton, AuthLink } from '@/components/mobile/passenger/Auth';
import { authColors, colors, fonts, typography } from '@/src/constants/theme';
import { login } from '@/src/services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormErrors = {
  email?: string;
  password?: string;
};

function validate(email: string, password: string): FormErrors {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = 'Ingresa tu correo electrónico.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Ingresa un correo válido.';
  }

  if (!password) {
    errors.password = 'Ingresa tu contraseña.';
  }

  return errors;
}

/** "Inicio de sesión" (Figma 2081:3), reestilizado con los tokens de Punto 4–7 (D1/D2). */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const validationErrors = validate(email, password);
    setErrors(validationErrors);
    setFormError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      // TODO: guardar la sesión cuando el contrato de autenticación esté definido con Backend.
      router.replace('/inicio');
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Tuanis Carpooling"
            />

            <View style={styles.header}>
              <Text accessibilityRole="header" style={styles.title}>
                Bienvenido de nuevo
              </Text>
              <Text style={styles.subtitle}>Inicia sesión para continuar tu viaje.</Text>
            </View>

            <View style={styles.form}>
              <FormField
                label="Correo electrónico"
                placeholder="nombre@correo.com"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />
              <FormField
                label="Contraseña"
                placeholder="Tu contraseña"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                password
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password"
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <View style={styles.submit}>
              <AuthButton title="Iniciar sesión" onPress={handleLogin} loading={loading} />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tienes cuenta?</Text>
              <AuthLink label="Regístrate" onPress={() => router.push('/registro')} />
            </View>
          </View>
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
    flexGrow: 1,
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },
  logo: {
    alignSelf: 'center',
    width: 188,
    height: 186,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...typography.screenTitle,
    textAlign: 'center',
    color: colors.textTitle,
  },
  subtitle: {
    fontFamily: fonts.cairoRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.textSubtitle,
  },
  form: {
    marginTop: 32,
    gap: 20,
  },
  formError: {
    marginTop: 16,
    ...typography.textSecondary,
    color: authColors.error,
  },
  submit: {
    marginTop: 28,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 24,
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 15,
    color: colors.textPlaceholder,
  },
});
