import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname, useRouter, type Href } from 'expo-router';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Logo from '@/assets/images/admin/logo.svg';
import Tuanis from '@/assets/images/admin/tuanis.svg';
import { cerrarSesionEnServidor } from '@/src/features/admin/api';
import { cerrarSesion, iniciales, useNombreDeSesion } from '@/src/features/admin/session';
import { color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

type Entrada = {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  // sin ruta es un botón, como el de cerrar sesión
  href?: Href;
};

const GRUPOS: { titulo: string; entradas: Entrada[] }[] = [
  {
    titulo: 'Análisis',
    entradas: [
      // las dos secciones de análisis son de otro grupo; aquí solo se enlazan
      { label: 'Consultas generales', icon: 'search-outline', href: '/admin/consultas' },
      { label: 'Estadísticas', icon: 'bar-chart-outline', href: '/admin/estadisticas' },
    ],
  },
  {
    titulo: 'Gestión',
    entradas: [
      { label: 'Instituciones', icon: 'home-outline', href: '/admin/instituciones' },
      { label: 'Usuarios', icon: 'person-outline', href: '/admin/usuarios' },
      { label: 'Parámetros', icon: 'options-outline', href: '/admin/parametros' },
    ],
  },
];

const ANCHO_CAJON = 288;

// abre el menú en pantallas angostas; lo define el marco del portal
export const MenuContext = createContext<() => void>(() => undefined);

// botón con el logo que abre el menú; va en el encabezado de las pantallas angostas
export function MenuButton() {
  const abrir = useContext(MenuContext);

  return (
    <Pressable
      onPress={abrir}
      accessibilityRole="button"
      accessibilityLabel="Abrir menú"
      style={[styles.botonLogo, styles.botonMenu]}
    >
      <Logo width={42} height={36} />
      <View style={styles.marcaMenu}>
        <Ionicons name="menu" size={12} color={color.blanco} />
      </View>
    </Pressable>
  );
}

type OpcionProps = Entrada & {
  // es la sección que se está viendo
  actual?: boolean;
  // más alta, para tocarla con el dedo
  tactil?: boolean;
  onPress?: () => void;
};

// opción del menú: cambia de color con el cursor encima y mientras se mantiene pulsada.
function Opcion({ label, icon, href, actual = false, tactil = false, onPress }: OpcionProps) {
  const [encima, setEncima] = useState(false);
  const [pulsada, setPulsada] = useState(false);

  // la sección actual conserva su borde verde; las demás siguen al cursor
  const estado = actual
    ? styles.opcionActual
    : pulsada
      ? styles.opcionPulsada
      : encima
        ? styles.opcionEncima
        : null;
  const tinta = !actual && pulsada ? color.grisOscuro : color.blanco;

  const boton = (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setEncima(true)}
      onHoverOut={() => setEncima(false)}
      onPressIn={() => setPulsada(true)}
      onPressOut={() => setPulsada(false)}
      accessibilityRole={href === undefined ? 'button' : 'link'}
      accessibilityLabel={label}
      // link con aschild no acepta una lista de estilos
      style={StyleSheet.flatten([styles.opcion, tactil ? styles.opcionTactil : null, estado])}
    >
      <Ionicons name={icon} size={tactil ? 20 : 18} color={tinta} />
      <Text
        style={[styles.textoOpcion, tactil ? styles.textoOpcionTactil : null, { color: tinta }]}
      >
        {label}
      </Text>
    </Pressable>
  );

  return href === undefined ? (
    boton
  ) : (
    <Link href={href} asChild>
      {boton}
    </Link>
  );
}

type CajonProps = { celular: boolean; children: ReactNode };

// panel del menú en pantallas angostas: entra deslizándose desde la izquierda
function Cajon({ celular, children }: CajonProps) {
  const posicion = useRef(new Animated.Value(-ANCHO_CAJON)).current;

  useEffect(() => {
    Animated.timing(posicion, { toValue: 0, duration: 180, useNativeDriver: false }).start();
  }, [posicion]);

  return (
    <Animated.View style={[styles.cajon, { transform: [{ translateX: posicion }] }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contenidoCajon, celular ? styles.contenidoCelular : null]}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

type Props = {
  // en pantallas angostas la barra es un cajón que se abre sobre el contenido
  abierto: boolean;
  onClose: () => void;
};

// barra lateral del portal: secciones y cerrar sesión. en pantallas angostas es un cajón.
export function Sidebar({ abierto, onClose }: Props) {
  const ruta = usePathname();
  const router = useRouter();
  const { angosta, celular } = useLayout();
  const nombre = useNombreDeSesion();

  function salir() {
    // no se espera al servidor: aunque no responda, la sesión se borra de este navegador
    void cerrarSesionEnServidor().catch(() => undefined);
    cerrarSesion();
    router.replace('/admin/login');
  }

  const secciones = (
    <>
      <Text style={styles.portal}>Portal administrativo</Text>

      <View style={styles.grupos} accessibilityRole="menu">
        {GRUPOS.map((grupo) => (
          <View key={grupo.titulo} style={styles.grupo}>
            <Text style={styles.titulo}>{grupo.titulo}</Text>
            {grupo.entradas.map((entrada) => (
              <Opcion
                key={entrada.label}
                {...entrada}
                actual={
                  entrada.href !== undefined &&
                  (ruta === entrada.href || ruta.startsWith(`${String(entrada.href)}/`))
                }
                tactil={angosta}
                // al elegir una sección el cajón se cierra
                onPress={angosta ? onClose : undefined}
              />
            ))}
          </View>
        ))}
      </View>
    </>
  );

  if (!angosta) {
    return (
      <View style={styles.barra}>
        <View style={styles.marca}>
          {/* el logo y el nombre guardan las proporciones del prototipo (61 x 52 y 99 x 28) */}
          <Logo width={42} height={36} accessibilityLabel="Logo de Tuanis Carpooling" />
          <View style={styles.nombre}>
            <Tuanis width={68} height={19} accessibilityLabel="Tuanis" />
            <Text style={styles.carpooling}>Carpooling</Text>
          </View>
        </View>
        {secciones}
        <Opcion label="Cerrar sesión" icon="log-out-outline" onPress={salir} />
      </View>
    );
  }

  return (
    <Modal visible={abierto} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.velo}>
        <Cajon celular={celular}>
          <View style={styles.marcaCajon}>
            {/* el logo queda donde el botón del encabezado: abre y cierra en el mismo lugar */}
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar menú"
              style={styles.botonLogo}
            >
              <Logo width={42} height={36} />
            </Pressable>
            <View style={styles.nombreCajon}>
              <Tuanis width={68} height={19} accessibilityLabel="Tuanis" />
              <Text style={[styles.carpooling, styles.carpoolingCajon]}>Carpooling</Text>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar menú"
              style={styles.cerrar}
            >
              <Ionicons name="close" size={22} color={color.blanco} />
            </Pressable>
          </View>
          {secciones}
          {nombre ? (
            <View style={styles.usuario}>
              <View style={styles.avatar}>
                <Text style={styles.iniciales}>{iniciales(nombre)}</Text>
              </View>
              <View style={styles.datosUsuario}>
                <Text style={styles.nombreUsuario}>{nombre}</Text>
                <Text style={styles.rol}>Administrador</Text>
              </View>
            </View>
          ) : null}
          <Opcion label="Cerrar sesión" icon="log-out-outline" tactil onPress={salir} />
        </Cajon>
        {/* tocar fuera del cajón también lo cierra */}
        <Pressable onPress={onClose} aria-hidden tabIndex={-1} style={styles.fuera} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  barra: {
    width: 250,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: color.oscuro,
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
  },
  nombre: {
    marginTop: 6,
  },
  carpooling: {
    fontFamily: fuente.normal,
    fontSize: 9,
    lineHeight: 12,
    color: color.blanco,
  },
  portal: {
    marginTop: 28,
    fontFamily: fuente.media,
    fontSize: 17,
    color: color.blanco,
  },
  grupos: {
    flex: 1,
    gap: 18,
    marginTop: 24,
  },
  grupo: {
    gap: 4,
  },
  titulo: {
    marginBottom: 4,
    fontFamily: fuente.media,
    fontSize: 14,
    color: color.blanco,
  },
  opcion: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: 12,
  },
  opcionTactil: {
    minHeight: 48,
  },
  opcionEncima: {
    backgroundColor: color.malva,
  },
  opcionPulsada: {
    backgroundColor: color.malvaSuave,
  },
  opcionActual: {
    backgroundColor: color.malva,
    borderColor: color.verde,
  },
  textoOpcion: {
    fontFamily: fuente.media,
    fontSize: 14,
  },
  textoOpcionTactil: {
    fontSize: 15,
  },
  botonLogo: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // arriba de su fila, para quedar donde está el logo del cajón
  botonMenu: {
    alignSelf: 'flex-start',
  },
  marcaMenu: {
    position: 'absolute',
    right: -4,
    bottom: 0,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.oscuro,
    borderRadius: 9,
  },
  velo: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: color.velo,
  },
  cajon: {
    width: ANCHO_CAJON,
    maxWidth: '85%',
    backgroundColor: color.oscuro,
  },
  // los mismos márgenes que el encabezado, para que el logo no cambie de lugar
  contenidoCajon: {
    flexGrow: 1,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  contenidoCelular: {
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  fuera: {
    flex: 1,
  },
  marcaCajon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nombreCajon: {
    flex: 1,
  },
  carpoolingCajon: {
    fontSize: 12,
    lineHeight: 14,
  },
  cerrar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: color.malva,
  },
  avatar: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.durazno,
    borderRadius: 19,
  },
  iniciales: {
    fontFamily: fuente.negrita,
    fontSize: 15,
    color: color.oscuro,
  },
  datosUsuario: {
    flex: 1,
  },
  nombreUsuario: {
    fontFamily: fuente.negrita,
    fontSize: 13,
    color: color.blanco,
  },
  rol: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.blanco,
  },
});
