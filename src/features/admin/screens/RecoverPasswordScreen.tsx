import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AccessButton,
  AccessField,
  AccessLink,
  AccessNotice,
  AccessScreen,
  accessStyles,
} from '@/components/admin/AccessScreen';

import { mensajesDe, pedirRestablecimiento } from '../api';

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// primer paso para recuperar la contraseña: pide el correo y el back end envía el enlace
export function RecoverPasswordScreen() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  // el prototipo no tiene mensaje para un correo mal escrito: solo se resalta el campo
  const [conError, setConError] = useState(false);
  // fallos del servidor: sin conexión o demasiados intentos
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function pedir() {
    if (enviando) return;
    if (!CORREO_VALIDO.test(correo.trim())) {
      setConError(true);
      return;
    }
    setEnviando(true);
    setAviso(null);
    try {
      await pedirRestablecimiento(correo.trim());
      router.push('/admin/recuperar/enviado');
    } catch (error) {
      setAviso(mensajesDe(error)[0]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <AccessScreen
      title="Recuperar contraseña"
      subtitle="Ingrese su correo electrónico para recuperar la contraseña."
    >
      <AccessField
        label="Correo electrónico"
        value={correo}
        onChangeText={(texto) => {
          setCorreo(texto);
          setConError(false);
        }}
        placeholder="Ingrese su correo"
        autoCapitalize="none"
        autoComplete="email"
        inputMode="email"
        conError={conError}
        onSubmitEditing={() => void pedir()}
      />
      <View style={accessStyles.izquierda}>
        <AccessLink
          label="¿Recordaste tu contraseña?"
          onPress={() => router.replace('/admin/login')}
        />
      </View>
      {aviso ? <AccessNotice message={aviso} /> : null}
      <AccessButton label="Confirmar" onPress={() => void pedir()} busy={enviando} />
    </AccessScreen>
  );
}
