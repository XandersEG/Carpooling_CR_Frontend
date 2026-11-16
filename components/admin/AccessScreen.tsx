import { Ionicons } from '@expo/vector-icons';
import { createElement, useState, type ComponentProps, type ReactNode } from 'react';
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

import { ANCHO_BARRA_COMPLETA, color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

import { Field } from './Field';

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

type Props = {
  title: string;
  subtitle?: string;
  // la tarjeta de "revisa tu correo" no lleva la nota de acceso exclusivo
  sinNota?: boolean;
  children: ReactNode;
};

// marco de las pantallas de acceso al portal: el panel con el lema y la tarjeta con el logo
export function AccessScreen({ title, subtitle, sinNota = false, children }: Props) {
  const { width } = useWindowDimensions();
  const { angosta, celular } = useLayout();
  // en pantallas angostas ningún texto baja de 12 px
  const legible = angosta ? styles.textoLegible : null;

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

      <ScrollView
        style={styles.fondo}
        contentContainerStyle={[styles.contenido, celular ? styles.contenidoCelular : null]}
      >
        <View style={styles.centro}>
          <View style={[styles.tarjeta, celular ? styles.tarjetaCelular : null]}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Tuanis Carpooling"
            />
            <Text style={[styles.portal, legible]}>PORTAL ADMINISTRATIVO</Text>

            <Text style={styles.titulo} accessibilityRole="header">
              {title}
            </Text>
            {subtitle ? <Text style={styles.subtitulo}>{subtitle}</Text> : null}

            {children}

            {sinNota ? null : (
              <Text style={[styles.exclusivo, legible]}>
                Acceso exclusivo para personal autorizado
              </Text>
            )}
          </View>
        </View>
        <Text style={[styles.pie, legible]}>Tuanis Carpooling - Portal administrativo</Text>
      </ScrollView>
    </View>
  );
}

type FieldProps = ComponentProps<typeof Field>;

// campo de la tarjeta: más alto que el del portal y con fondo blanco
export function AccessField({ style, ...campo }: FieldProps) {
  const { angosta } = useLayout();

  return (
    <Field style={[styles.entrada, angosta ? styles.entradaTactil : null, style]} {...campo} />
  );
}

// campo de contraseña, con el botón del ojo para mostrarla
export function PasswordField(campo: Omit<FieldProps, 'secureTextEntry' | 'style'>) {
  const [visible, setVisible] = useState(false);
  const { angosta } = useLayout();

  return (
    <View>
      <AccessField
        secureTextEntry={!visible}
        autoCapitalize="none"
        style={[styles.entradaConOjo, angosta ? styles.entradaConOjoTactil : null]}
        {...campo}
      />
      <Pressable
        onPress={() => setVisible(!visible)}
        accessibilityRole="button"
        accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        style={[styles.ojo, angosta ? styles.ojoTactil : null]}
      >
        <Ionicons
          name={visible ? 'eye-off-outline' : 'eye-outline'}
          size={18}
          color={color.grisOscuro}
        />
      </Pressable>
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  // mientras espera al servidor no se puede volver a pulsar
  busy?: boolean;
};

// botón principal de la tarjeta
export function AccessButton({ label, onPress, busy = false }: ButtonProps) {
  const { angosta } = useLayout();

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      style={[styles.boton, angosta ? styles.botonTactil : null, busy ? styles.botonOcupado : null]}
    >
      {busy ? <ActivityIndicator size="small" color={color.texto} /> : null}
      <Text style={[styles.textoBoton, angosta ? styles.textoBotonTactil : null]}>{label}</Text>
    </Pressable>
  );
}

// aviso dentro de la tarjeta: un error o un mensaje para quien llega
export function AccessNotice({ message }: { message: string }) {
  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <Text style={styles.textoAviso}>{message}</Text>
    </View>
  );
}

// enlace de texto de la tarjeta
export function AccessLink({ label, onPress }: { label: string; onPress: () => void }) {
  const { angosta } = useLayout();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={angosta ? accessStyles.zonaTactil : undefined}
    >
      <Text style={[styles.enlace, angosta ? styles.enlaceTactil : null]}>{label}</Text>
    </Pressable>
  );
}

// textos sueltos de la tarjeta, para las pantallas que los necesitan
export const accessStyles = StyleSheet.create({
  texto: {
    fontFamily: fuente.normal,
    fontSize: 13,
    lineHeight: 19,
    color: color.texto,
  },
  nota: {
    fontFamily: fuente.normal,
    fontSize: 11,
    color: color.malva,
  },
  // deja un enlace pegado a la izquierda en vez de ocupar todo el ancho
  izquierda: {
    alignItems: 'flex-start',
  },
  // en pantallas angostas la nota no baja de 12 px
  notaLegible: {
    fontSize: 12,
  },
  // zona de 44 px para tocar con el dedo un enlace o una casilla
  zonaTactil: {
    minHeight: 44,
    justifyContent: 'center',
  },
});

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
  enlace: {
    fontFamily: fuente.negrita,
    fontSize: 11,
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
  textoLegible: {
    fontSize: 12,
  },
  contenidoCelular: {
    padding: 16,
  },
  tarjetaCelular: {
    paddingHorizontal: 24,
  },
  entradaTactil: {
    minHeight: 44,
  },
  entradaConOjoTactil: {
    paddingRight: 48,
  },
  ojoTactil: {
    right: 0,
    bottom: 0,
    width: 44,
    height: 44,
  },
  botonTactil: {
    minHeight: 48,
  },
  textoBotonTactil: {
    fontSize: 15,
  },
  enlaceTactil: {
    fontSize: 13,
  },
});
