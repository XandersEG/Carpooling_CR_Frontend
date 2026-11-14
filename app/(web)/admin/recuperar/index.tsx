import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthButton, AuthCard, AuthField, AuthFootnote, AuthLayout, AuthLink, AuthTitle } from '@/components/web/auth';
import { requestPasswordReset } from '@/src/services/admin/adminAuthService';

/** "Recuperar contraseña parte 1" (281:650). */
export default function RecoverPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  // No hay estado de error diseñado: un correo inválido solo resalta el campo.
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await requestPasswordReset(email);
      router.push('/admin/recuperar/enviado');
    } catch {
      setInvalid(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle
          title="Recuperar contraseña"
          subtitle="Ingrese su correo electrónico para recuperar la contraseña."
        />
        <View style={styles.form}>
          <AuthField
            label="Correo electrónico"
            placeholder="Ingrese su correo"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setInvalid(false);
            }}
            keyboardType="email-address"
            autoComplete="email"
            error={invalid}
            onSubmitEditing={submit}
          />
          <View style={styles.link}>
            <AuthLink label="¿Recordaste tu contraseña?" onPress={() => router.replace('/admin/login')} />
          </View>
          <AuthButton label="Confirmar" onPress={submit} loading={loading} />
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
    paddingTop: 28,
    gap: 16,
  },
  link: {
    alignItems: 'flex-start',
    paddingTop: 8,
  },
  footnote: {
    marginTop: 12,
  },
});
