import { Ionicons } from '@expo/vector-icons';
import { Link, usePathname, useRouter, type Href } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import Logo from '@/assets/images/admin/logo.svg';
import Tuanis from '@/assets/images/admin/tuanis.svg';
import { cerrarSesionEnServidor } from '@/src/features/admin/api';
import { cerrarSesion } from '@/src/features/admin/session';
import { ANCHO_BARRA_COMPLETA, color, fuente } from '@/src/features/admin/theme';

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

type OpcionProps = Entrada & {
  // es la sección que se está viendo
  actual?: boolean;
  // muestra el texto además del icono
  completa: boolean;
  onPress?: () => void;
};

// opción del menú: cambia de color con el cursor encima y mientras se mantiene pulsada.  
function Opcion({ label, icon, href, actual = false, completa, onPress }: OpcionProps) {
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
      style={StyleSheet.flatten([styles.opcion, estado])}
    >
      <Ionicons name={icon} size={18} color={tinta} />
      {completa ? <Text style={[styles.textoOpcion, { color: tinta }]}>{label}</Text> : null}
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

// barra lateral del portal: secciones y cerrar sesión.  
export function Sidebar() {
  const ruta = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  // en pantallas angostas quedan solo los iconos
  const completa = width >= ANCHO_BARRA_COMPLETA;

  function salir() {
    // no se espera al servidor: aunque no responda, la sesión se borra de este navegador
    void cerrarSesionEnServidor().catch(() => undefined);
    cerrarSesion();
    router.replace('/admin/login');
  }

  return (
    <View style={[styles.barra, completa ? null : styles.barraAngosta]}>
      <View style={styles.marca}>
        {/* el logo y el nombre guardan las proporciones del prototipo (61 x 52 y 99 x 28) */}
        <Logo width={42} height={36} accessibilityLabel="Logo de Tuanis Carpooling" />
        {completa ? (
          <View style={styles.nombre}>
            <Tuanis width={68} height={19} accessibilityLabel="Tuanis" />
            <Text style={styles.carpooling}>Carpooling</Text>
          </View>
        ) : null}
      </View>
      {completa ? <Text style={styles.portal}>Portal administrativo</Text> : null}

      <View style={styles.grupos} accessibilityRole="menu">
        {GRUPOS.map((grupo) => (
          <View key={grupo.titulo} style={styles.grupo}>
            {completa ? <Text style={styles.titulo}>{grupo.titulo}</Text> : null}
            {grupo.entradas.map((entrada) => (
              <Opcion
                key={entrada.label}
                {...entrada}
                actual={
                  entrada.href !== undefined &&
                  (ruta === entrada.href || ruta.startsWith(`${String(entrada.href)}/`))
                }
                completa={completa}
              />
            ))}
          </View>
        ))}
      </View>

      <Opcion label="Cerrar sesión" icon="log-out-outline" completa={completa} onPress={salir} />
    </View>
  );
}

const styles = StyleSheet.create({
  barra: {
    width: 250,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: color.oscuro,
  },
  barraAngosta: {
    width: 68,
    paddingHorizontal: 10,
    alignItems: 'center',
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
});
