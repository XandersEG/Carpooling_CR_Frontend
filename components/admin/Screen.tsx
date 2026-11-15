import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { iniciales, leerSesion } from '@/src/features/admin/session';
import { color, fuente } from '@/src/features/admin/theme';

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

// pantalla del portal: encabezado con título y usuario.  
export function Screen({
  title,
  subtitle,
  action,
  toast = null,
  sinRelleno = false,
  children,
}: Props) {
  const sesion = leerSesion();

  return (
    <View style={styles.pantalla}>
      <View style={styles.encabezado}>
        <View style={styles.titulos}>
          <Text style={styles.titulo} accessibilityRole="header">
            {title}
          </Text>
          <Text style={styles.subtitulo}>{subtitle}</Text>
        </View>
        {action}
        <View style={styles.campana}>
          <Ionicons name="notifications-outline" size={18} color={color.terracota} />
        </View>
        {sesion ? (
          <View style={styles.usuario}>
            <View style={styles.avatar}>
              <Text style={styles.iniciales}>{iniciales(sesion.nombre)}</Text>
            </View>
            <View>
              <Text style={styles.nombre}>{sesion.nombre}</Text>
              <Text style={styles.rol}>Administrador</Text>
            </View>
          </View>
        ) : null}
      </View>

      <ScrollView
        style={styles.fondo}
        contentContainerStyle={sinRelleno ? styles.contenidoLibre : styles.contenido}
      >
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
  titulos: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 240,
  },
  titulo: {
    fontFamily: fuente.negrita,
    fontSize: 22,
    color: color.oscuro,
  },
  subtitulo: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
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
  contenidoLibre: {
    flexGrow: 1,
  },
});
