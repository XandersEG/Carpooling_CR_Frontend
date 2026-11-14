import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthButton, AuthCard, AuthField, AuthFootnote, AuthLayout, AuthTitle } from '@/components/web/auth';
import { resetPassword } from '@/src/services/admin/adminAuthService';

/** "Recuperar contraseña parte 2" (281:717): al confirmar vuelve al inicio de sesión. */
export default function ResetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  // Sin estado de error diseñado: si están vacías o no coinciden se resaltan los campos.
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await resetPassword(password, confirmation);
      router.replace('/admin/login');
    } catch {
      setInvalid(true);
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle title="Cambiar contraseña" subtitle="Escriba su nueva contraseña." />
        <View style={styles.form}>
          <AuthField
            label="Nueva contraseña"
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setInvalid(false);
            }}
            autoComplete="new-password"
            password
            error={invalid}
          />
          <AuthField
            placeholder="Ingrese nuevamente su nueva contraseña"
            accessibilityLabel="Confirmar nueva contraseña"
            value={confirmation}
            onChangeText={(text) => {
              setConfirmation(text);
              setInvalid(false);
            }}
            autoComplete="new-password"
            password
            error={invalid}
            onSubmitEditing={submit}
          />
          <View style={styles.button}>
            <AuthButton label="Confirmar" onPress={submit} loading={loading} />
          </View>
        </View>
        <View style={styles.footnote}>
          <AuthFootnote />
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingTop: 20,
    gap: 16,
  },
  button: {
    marginTop: 12,
  },
  footnote: {
    marginTop: 12,
  },
});
