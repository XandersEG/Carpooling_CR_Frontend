import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AuthButton, AuthCard, AuthLayout, AuthTitle, authTextStyles } from '@/components/web/auth';

/**
 * "Solicitud enviada para recuperar contraseña" (277:1090). En el flujo real
 * el paso siguiente llegaría por el enlace del correo; aquí el botón lleva
 * directamente a "Cambiar contraseña", como en el prototipo.
 */
export default function RecoverPasswordSentScreen() {
  const router = useRouter();

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle title="Revisa tu correo" />
        <View style={styles.content}>
          <Text style={authTextStyles.body}>
            Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
          </Text>
          <Text style={[authTextStyles.muted, styles.note]}>En este prototipo el envío es simulado.</Text>
          <AuthButton label="Cambiar la contraseña" onPress={() => router.push('/admin/restablecer')} />
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 20,
    gap: 12,
  },
  note: {
    fontSize: 10,
    marginBottom: 4,
  },
});
