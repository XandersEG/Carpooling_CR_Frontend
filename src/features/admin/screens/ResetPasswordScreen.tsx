import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import {
  AccessButton,
  AccessLink,
  AccessNotice,
  AccessScreen,
  PasswordField,
  accessStyles,
} from '@/components/admin/AccessScreen';

import { mensajesDe, restablecerContrasena } from '../api';
import { useLayout } from '../useLayout';

const ENLACE_INVALIDO = 'El enlace no es válido o ya venció. Solicita uno nuevo.';
const MINIMO = 8;

// segundo paso para recuperar la contraseña: se abre desde el enlace del correo
export function ResetPasswordScreen() {
  const router = useRouter();
  // el token viene en el enlace del correo
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [conError, setConError] = useState(false);
  const [aviso, setAviso] = useState<string | null>(token ? null : ENLACE_INVALIDO);
  const [guardando, setGuardando] = useState(false);
  const { celular } = useLayout();

  function rechazar(mensaje: string) {
    setConError(true);
    setAviso(mensaje);
  }

  async function cambiar() {
    if (guardando || !token) return;
    if (contrasena.length < MINIMO) {
      rechazar(`La contraseña debe tener al menos ${MINIMO} caracteres.`);
      return;
    }
    if (contrasena !== confirmacion) {
      rechazar('Las contraseñas no coinciden.');
      return;
    }
    setGuardando(true);
    setAviso(null);
    try {
      await restablecerContrasena(token, contrasena);
      router.replace('/admin/login?restablecida=1');
    } catch (error) {
      setAviso(mensajesDe(error)[0]);
      setGuardando(false);
    }
  }

  // al escribir se quita el color de error de los campos
  const alEscribir = (guardar: (texto: string) => void) => (texto: string) => {
    guardar(texto);
    setConError(false);
  };

  return (
    <AccessScreen title="Cambiar contraseña" subtitle="Escriba su nueva contraseña.">
      <PasswordField
        label="Nueva contraseña"
        value={contrasena}
        onChangeText={alEscribir(setContrasena)}
        placeholder="Ingrese su contraseña"
        autoComplete="new-password"
        conError={conError}
      />
      {/* en el prototipo el segundo campo no lleva etiqueta */}
      <PasswordField
        accessibilityLabel="Confirmar nueva contraseña"
        value={confirmacion}
        onChangeText={alEscribir(setConfirmacion)}
        // en celular el texto de ejemplo completo no cabe en el campo
        placeholder={
          celular ? 'Repita su nueva contraseña' : 'Ingrese nuevamente su nueva contraseña'
        }
        autoComplete="new-password"
        conError={conError}
        onSubmitEditing={() => void cambiar()}
      />
      {aviso ? <AccessNotice message={aviso} /> : null}
      <AccessButton label="Confirmar" onPress={() => void cambiar()} busy={guardando} />
      <View style={accessStyles.izquierda}>
        <AccessLink
          label="Solicitar otro enlace"
          onPress={() => router.replace('/admin/recuperar')}
        />
      </View>
    </AccessScreen>
  );
}
