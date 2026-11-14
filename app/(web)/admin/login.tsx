import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AuthButton,
  AuthCard,
  AuthErrorBanner,
  AuthField,
  AuthFootnote,
  AuthLayout,
  AuthLink,
  AuthTitle,
  authTextStyles,
} from '@/components/web/auth';
import { Checkbox } from '@/components/web/controls';
import { getAdminSession, loginAdmin } from '@/src/services/admin/adminAuthService';

const ERROR_MESSAGE = 'Revisa tu correo y contraseña para continuar.';

/**
 * Inicio de sesión del portal (277:600) con sus estados: correo escrito
 * (2349:3642), contraseña oculta/visible (319:1269 / 2961:8917) y error de
 * acceso (319:1327).
 */
export default function AdminLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // "Recordarme" no tiene comportamiento diseñado: solo es visual.
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  if (getAdminSession()) {
    return <Redirect href="/admin/consultas/top-conductores" />;
  }

  const submit = async () => {
    setLoading(true);
    try {
      await loginAdmin(email, password);
      router.replace('/admin/consultas/top-conductores');
    } catch {
      setError(true);
      setLoading(false);
    }
  };

  const options = (
    <View style={styles.options}>
      <Checkbox checked={remember} onChange={setRemember} label="Recordarme" labelStyle={authTextStyles.muted} />
      <AuthLink label="¿Olvidaste tu contraseña?" onPress={() => router.push('/admin/recuperar')} />
    </View>
  );

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle
          title={error ? 'Bienvenido de nuevo' : 'Bienvenido'}
          subtitle="Inicia sesión para administrar Tuanis."
        />
        <View style={styles.form}>
          <AuthField
            label="Correo electrónico"
            placeholder="Ingrese su correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            error={error}
            onSubmitEditing={submit}
          />
          <AuthField
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            value={password}
            onChangeText={setPassword}
            autoComplete="current-password"
            password
            error={error}
            onSubmitEditing={submit}
          />
          {error ? (
            <>
              {options}
              <AuthErrorBanner message={ERROR_MESSAGE} />
              <AuthButton label="Iniciar sesión" onPress={submit} loading={loading} />
            </>
          ) : (
            <>
              <AuthButton label="Iniciar sesión" onPress={submit} loading={loading} />
              {options}
            </>
          )}
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
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 22,
  },
  footnote: {
    marginTop: 7,
  },
});
