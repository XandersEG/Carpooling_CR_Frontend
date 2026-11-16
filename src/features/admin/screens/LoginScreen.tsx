import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AccessButton,
  AccessField,
  AccessLink,
  AccessNotice,
  AccessScreen,
  PasswordField,
} from '@/components/admin/AccessScreen';

import { ApiError, iniciarSesion, mensajesDe } from '../api';
import { INICIO_DEL_PORTAL, guardarSesion } from '../session';
import { color, fuente } from '../theme';

const REVISA_TUS_DATOS = 'Revisa tu correo y contraseña para continuar.';
const SESION_VENCIDA = 'Tu sesión venció. Inicia sesión de nuevo.';
const CONTRASENA_CAMBIADA = 'Tu contraseña se cambió. Inicia sesión con la nueva.';

// mensaje para mostrar cuando el inicio de sesión falla
function mensajeDeFallo(error: unknown): string {
  if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
    return REVISA_TUS_DATOS;
  }
  return mensajesDe(error)[0];
}

// inicio de sesión del portal administrativo
export function LoginScreen() {
  const router = useRouter();
  // llega con "vencida" cuando el portal sacó al administrador porque su sesión ya no servía,
  // y con "restablecida" después de cambiar la contraseña desde el enlace del correo
  const { vencida, restablecida } = useLocalSearchParams<{
    vencida?: string;
    restablecida?: string;
  }>();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordar, setRecordar] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(
    vencida ? SESION_VENCIDA : restablecida ? CONTRASENA_CAMBIADA : null,
  );

  // con datos incorrectos los campos se pintan en color de error
  const conError = aviso === REVISA_TUS_DATOS;

  async function entrar() {
    if (entrando) return;
    if (!correo.trim() || !contrasena) {
      setAviso(REVISA_TUS_DATOS);
      return;
    }
    setEntrando(true);
    setAviso(null);
    try {
      const sesion = await iniciarSesion(correo.trim(), contrasena, recordar);
      guardarSesion(sesion, recordar);
      router.replace(INICIO_DEL_PORTAL);
    } catch (error) {
      setAviso(mensajeDeFallo(error));
      setEntrando(false);
    }
  }

  return (
    <AccessScreen
      title={conError ? 'Bienvenido de nuevo' : 'Bienvenido'}
      subtitle="Inicia sesión para administrar Tuanis."
    >
      <AccessField
        label="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        placeholder="Ingrese su correo"
        autoCapitalize="none"
        autoComplete="email"
        inputMode="email"
        conError={conError}
        onSubmitEditing={() => void entrar()}
      />
      <PasswordField
        label="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        placeholder="Ingrese su contraseña"
        autoComplete="current-password"
        conError={conError}
        onSubmitEditing={() => void entrar()}
      />

      {aviso ? <AccessNotice message={aviso} /> : null}

      <AccessButton label="Iniciar sesión" onPress={() => void entrar()} busy={entrando} />

      <View style={styles.opciones}>
        <Pressable
          onPress={() => setRecordar(!recordar)}
          accessibilityRole="checkbox"
          aria-checked={recordar}
          style={styles.recordar}
        >
          <View style={[styles.casilla, recordar ? styles.casillaMarcada : null]}>
            {recordar ? <Ionicons name="checkmark" size={11} color={color.blanco} /> : null}
          </View>
          <Text style={styles.textoOpcion}>Recordarme</Text>
        </Pressable>
        <AccessLink
          label="¿Olvidaste tu contraseña?"
          onPress={() => router.push('/admin/recuperar')}
        />
      </View>
    </AccessScreen>
  );
}

const styles = StyleSheet.create({
  opciones: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  recordar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  casilla: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: color.malva,
    borderRadius: 3,
  },
  casillaMarcada: {
    backgroundColor: color.verde,
    borderColor: color.verde,
  },
  textoOpcion: {
    fontFamily: fuente.normal,
    fontSize: 11,
    color: color.malva,
  },
});
