import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthButton, AuthLink } from '@/components/mobile/passenger/Auth';
import { authColors, colors, fonts, typography } from '@/src/constants/theme';
import { resendVerification } from '@/src/services/authService';

/**
 * "Verifica tu correo": aparece después del registro. La cuenta no puede
 * iniciar sesión hasta abrir el enlace que el Backend envió al correo
 * institucional.
 */
export default function VerificarCorreoScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleResend() {
    if (!email || sending) return;
    setSending(true);
    setMessage(null);
    try {
      await resendVerification(email);
      setMessage('Te enviamos un enlace nuevo. Puede tardar unos minutos en llegar.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo reenviar el enlace.');
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Tuanis Carpooling"
        />
        <Text accessibilityRole="header" style={styles.title}>
          Verifica tu correo
        </Text>
        <Text style={styles.text}>
          Creamos tu cuenta. Enviamos un enlace de verificación a{' '}
          <Text style={styles.email}>{email ?? 'tu correo institucional'}</Text>. Ábrelo para activar la cuenta y
          luego inicia sesión.
        </Text>
        <Text style={styles.hint}>¿No lo ves? Revisa la carpeta de correo no deseado.</Text>

        <View style={styles.actions}>
          <AuthButton title="Ir a iniciar sesión" onPress={() => router.replace('/login')} />
          {email ? (
            <View style={styles.resend}>
              <AuthLink label={sending ? 'Enviando…' : 'Reenviar enlace'} onPress={handleResend} />
            </View>
          ) : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 28,
    paddingTop: 48,
    paddingBottom: 36,
    gap: 16,
  },
  logo: {
    alignSelf: 'center',
    width: 120,
    height: 118,
  },
  title: {
    ...typography.screenTitle,
    textAlign: 'center',
    color: colors.textTitle,
  },
  text: {
    fontFamily: fonts.cairoRegular,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: colors.textSubtitle,
  },
  email: {
    fontFamily: fonts.cairoBold,
    color: authColors.text,
  },
  hint: {
    ...typography.textSecondary,
    textAlign: 'center',
    color: authColors.textMuted,
  },
  actions: {
    marginTop: 16,
    gap: 16,
  },
  resend: {
    alignItems: 'center',
  },
  message: {
    ...typography.textSecondary,
    textAlign: 'center',
    color: colors.textSubtitle,
  },
});
