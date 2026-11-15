import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { createElement, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { Field } from '@/components/admin/Field';

import { ApiError, iniciarSesion, mensajesDe } from '../api';
import { INICIO_DEL_PORTAL, guardarSesion } from '../session';
import { ANCHO_BARRA_COMPLETA, color, fuente } from '../theme';

const REVISA_TUS_DATOS = 'Revisa tu correo y contraseña para continuar.';
const SESION_VENCIDA = 'Tu sesión venció. Inicia sesión de nuevo.';

// mensaje para mostrar cuando el inicio de sesión falla
function mensajeDeFallo(error: unknown): string {
  if (error instanceof ApiError && (error.status === 400 || error.status === 401)) {
    return REVISA_TUS_DATOS;
  }
  return mensajesDe(error)[0];
}

// curva punteada del prototipo. el portal es solo web, así que se dibuja con svg
function Curva() {
  return createElement(
    'svg',
    { width: 330, height: 90, viewBox: '0 0 330 90', 'aria-hidden': true },
    createElement('path', {
      d: 'M8 80 C 60 30, 110 36, 165 50 S 270 60, 322 10',
      fill: 'none',
      stroke: color.lima,
      strokeWidth: 1.5,
      strokeDasharray: '7 7',
    }),
    createElement('circle', { cx: 8, cy: 80, r: 6, fill: color.verde }),
    createElement('circle', { cx: 322, cy: 10, r: 6, fill: color.verde }),
  );
}

// inicio de sesión del portal administrativo.  
export function LoginScreen() {
  const router = useRouter();
  // llega con "vencida" cuando el portal sacó al administrador porque su sesión ya no servía
  const { vencida } = useLocalSearchParams<{ vencida?: string }>();
  const { width } = useWindowDimensions();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [visible, setVisible] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(vencida ? SESION_VENCIDA : null);

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
    <View style={styles.pantalla}>
      {width >= ANCHO_BARRA_COMPLETA ? (
        <View style={styles.panel}>
          <Text style={styles.lema}>Viaja seguro,</Text>
          <Text style={[styles.lema, styles.lemaLima]}>ahorra en cada recorrido</Text>
          <Text style={styles.descripcion}>
            Un solo lugar para gestionar el servicio{'\n'}y acompañar a nuestra comunidad.
          </Text>
          <Curva />
        </View>
      ) : null}

      <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
        <View style={styles.centro}>
          <View style={styles.tarjeta}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Tuanis Carpooling"
            />
            <Text style={styles.portal}>PORTAL ADMINISTRATIVO</Text>

            <Text style={styles.titulo} accessibilityRole="header">
              {conError ? 'Bienvenido de nuevo' : 'Bienvenido'}
            </Text>
            <Text style={styles.subtitulo}>Inicia sesión para administrar Tuanis.</Text>

            <Field
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              placeholder="Ingrese su correo"
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              conError={conError}
              style={styles.entrada}
              onSubmitEditing={() => void entrar()}
            />
            <View>
              <Field
                label="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                placeholder="Ingrese su contraseña"
                secureTextEntry={!visible}
                autoCapitalize="none"
                autoComplete="current-password"
                conError={conError}
                style={[styles.entrada, styles.entradaConOjo]}
                onSubmitEditing={() => void entrar()}
              />
              <Pressable
                onPress={() => setVisible(!visible)}
                accessibilityRole="button"
                accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                style={styles.ojo}
              >
                <Ionicons
                  name={visible ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={color.grisOscuro}
                />
              </Pressable>
            </View>

            {aviso ? (
              <View style={styles.aviso} accessibilityRole="alert">
                <Text style={styles.textoAviso}>{aviso}</Text>
              </View>
            ) : null}

            <Pressable
              onPress={() => void entrar()}
              disabled={entrando}
              accessibilityRole="button"
              style={[styles.boton, entrando ? styles.botonOcupado : null]}
            >
              {entrando ? <ActivityIndicator size="small" color={color.texto} /> : null}
              <Text style={styles.textoBoton}>Iniciar sesión</Text>
            </Pressable>

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
              <Pressable
                onPress={() =>
                  setAviso('La recuperación de contraseña todavía no está disponible.')
                }
                accessibilityRole="button"
              >
                <Text style={[styles.textoOpcion, styles.enlace]}>¿Olvidaste tu contraseña?</Text>
              </Pressable>
            </View>

            <Text style={styles.exclusivo}>Acceso exclusivo para personal autorizado</Text>
          </View>
        </View>
        <Text style={styles.pie}>Tuanis Carpooling - Portal administrativo</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    width: '37%',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    backgroundColor: color.oscuro,
  },
  lema: {
    fontFamily: fuente.negrita,
    fontSize: 32,
    lineHeight: 46,
    color: color.blanco,
  },
  lemaLima: {
    color: color.lima,
  },
  descripcion: {
    marginTop: 14,
    marginBottom: 36,
    fontFamily: fuente.normal,
    fontSize: 13,
    lineHeight: 19,
    color: color.blanco,
  },
  fondo: {
    flex: 1,
    backgroundColor: color.fondoLogin,
  },
  contenido: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  centro: {
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarjeta: {
    width: '100%',
    maxWidth: 416,
    gap: 12,
    paddingVertical: 28,
    paddingHorizontal: 36,
    backgroundColor: color.blanco,
    borderRadius: 18,
  },
  logo: {
    width: 84,
    height: 84,
    alignSelf: 'center',
  },
  portal: {
    marginTop: -6,
    fontFamily: fuente.media,
    fontSize: 9,
    letterSpacing: 2,
    color: color.texto,
    textAlign: 'center',
  },
  titulo: {
    fontFamily: fuente.negrita,
    fontSize: 21,
    lineHeight: 28,
    color: color.oscuro,
  },
  subtitulo: {
    marginTop: -10,
    marginBottom: 4,
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.malva,
  },
  entrada: {
    minHeight: 40,
    paddingHorizontal: 12,
    backgroundColor: color.blanco,
  },
  entradaConOjo: {
    paddingRight: 40,
  },
  ojo: {
    position: 'absolute',
    right: 4,
    bottom: 3,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aviso: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: color.durazno,
    borderRadius: 6,
  },
  textoAviso: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  boton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    backgroundColor: color.lima,
    borderRadius: 8,
  },
  botonOcupado: {
    opacity: 0.6,
  },
  textoBoton: {
    fontFamily: fuente.negrita,
    fontSize: 13,
    color: color.texto,
  },
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
  enlace: {
    fontFamily: fuente.negrita,
    color: color.texto,
    textDecorationLine: 'underline',
  },
  exclusivo: {
    fontFamily: fuente.normal,
    fontSize: 11,
    color: color.malva,
    textAlign: 'center',
  },
  pie: {
    fontFamily: fuente.normal,
    fontSize: 11,
    color: color.malva,
  },
});
