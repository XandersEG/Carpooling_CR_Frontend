import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { iniciales, leerSesion } from '@/src/features/admin/session';
import { color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

import { MenuButton } from './Sidebar';
import { Toast } from './Toast';

type Props = {
  title: string;
  subtitle: string;
  // botón principal de la pantalla, junto al usuario
  action?: ReactNode;
  // mensaje de que una acción salió bien
  toast?: string | null;
  // el contenido trae sus propios márgenes
  sinRelleno?: boolean;
  children: ReactNode;
};

// pantalla del portal: encabezado con título y usuario, y el botón del menú si es angosta.
export function Screen({
  title,
  subtitle,
  action,
  toast = null,
  sinRelleno = false,
  children,
}: Props) {
  const sesion = leerSesion();
  const { angosta, celular } = useLayout();

  return (
    <View style={styles.pantalla}>
      <View
        style={[
          styles.encabezado,
          angosta ? styles.encabezadoAngosto : null,
          celular ? styles.encabezadoCelular : null,
        ]}
      >
        {angosta ? <MenuButton /> : null}
        <View style={[styles.titulos, angosta ? styles.titulosAngostos : null]}>
          <Text
            style={[styles.titulo, celular ? styles.tituloCelular : null]}
            accessibilityRole="header"
          >
            {title}
          </Text>
          {celular ? null : <Text style={styles.subtitulo}>{subtitle}</Text>}
        </View>
        {celular ? null : action}
        {sesion ? (
          angosta ? (
            // el nombre y el rol se ven en el menú; aquí solo cabe el avatar
            <View style={styles.avatar} accessibilityLabel={sesion.nombre}>
              <Text style={styles.iniciales}>{iniciales(sesion.nombre)}</Text>
            </View>
          ) : (
            <View style={styles.usuario}>
              <View style={styles.avatar}>
                <Text style={styles.iniciales}>{iniciales(sesion.nombre)}</Text>
              </View>
              <View>
                <Text style={styles.nombre}>{sesion.nombre}</Text>
                <Text style={styles.rol}>Administrador</Text>
              </View>
            </View>
          )
        ) : null}
        {/* en celular el subtítulo ocupa su propia fila, a todo el ancho */}
        {celular && subtitle ? (
          <Text style={[styles.subtitulo, styles.subtituloCelular]}>{subtitle}</Text>
        ) : null}
      </View>

      <ScrollView
        style={styles.fondo}
        contentContainerStyle={
          sinRelleno
            ? styles.contenidoLibre
            : [styles.contenido, celular ? styles.contenidoCelular : null]
        }
      >
        {/* en celular el botón principal baja al inicio del contenido */}
        {celular && action ? (
          <View style={sinRelleno ? styles.accionSuelta : null}>{action}</View>
        ) : null}
        {children}
      </ScrollView>
      <Toast mensaje={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
  },
  encabezado: {
    minHeight: 84,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: color.blanco,
  },
  encabezadoAngosto: {
    minHeight: 0,
    columnGap: 14,
    paddingHorizontal: 24,
  },
  encabezadoCelular: {
    columnGap: 10,
    rowGap: 6,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  titulos: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 240,
  },
  // sin ancho base, el título se ajusta al espacio que queda y nada baja de fila
  titulosAngostos: {
    flexBasis: 0,
    minWidth: 0,
  },
  titulo: {
    fontFamily: fuente.negrita,
    fontSize: 22,
    color: color.oscuro,
  },
  tituloCelular: {
    fontSize: 18,
    lineHeight: 24,
  },
  subtitulo: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  subtituloCelular: {
    flexBasis: '100%',
  },
  campana: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: color.terracota,
    borderRadius: 17,
  },
  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  nombre: {
    fontFamily: fuente.negrita,
    fontSize: 12,
    color: color.texto,
  },
  rol: {
    fontFamily: fuente.normal,
    fontSize: 11,
    color: color.texto,
  },
  fondo: {
    flex: 1,
    backgroundColor: color.fondo,
  },
  contenido: {
    gap: 14,
    paddingVertical: 18,
    paddingHorizontal: 28,
  },
  contenidoCelular: {
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  contenidoLibre: {
    flexGrow: 1,
  },
  accionSuelta: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
});
