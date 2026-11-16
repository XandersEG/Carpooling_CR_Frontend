import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';

type Props = {
  title: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  // se llama con la tecla escape
  onClose: () => void;
  children: ReactNode;
  // botones de acción, alineados a la derecha
  footer: ReactNode;
  // mensajes de error del servidor; el diálogo queda abierto con lo escrito
  errores?: string[];
};

// diálogo del portal: encabezado oscuro, contenido que se desplaza si no cabe y botones.  
export function Dialog({
  title,
  icon = 'options-outline',
  onClose,
  children,
  footer,
  errores = [],
}: Props) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.velo}>
        <View style={styles.tarjeta}>
          <View style={styles.encabezado}>
            <Ionicons name={icon} size={18} color={color.verde} />
            <Text style={styles.titulo} accessibilityRole="header">
              {title}
            </Text>
          </View>
          <ScrollView contentContainerStyle={styles.cuerpo}>
            {errores.length > 0 ? (
              <View style={styles.error}>
                {errores.map((mensaje) => (
                  <Text key={mensaje} style={styles.textoError}>
                    {mensaje}
                  </Text>
                ))}
              </View>
            ) : null}
            {children}
          </ScrollView>
          <View style={styles.pie}>{footer}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  velo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: color.velo,
  },
  tarjeta: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '100%',
    backgroundColor: color.blanco,
    borderRadius: 22,
    overflow: 'hidden',
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 22,
    backgroundColor: color.oscuro,
  },
  titulo: {
    flex: 1,
    fontFamily: fuente.media,
    fontSize: 15,
    color: color.blanco,
  },
  cuerpo: {
    gap: 12,
    padding: 22,
  },
  error: {
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: color.durazno,
    borderRadius: 8,
  },
  textoError: {
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
  },
  pie: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
});
