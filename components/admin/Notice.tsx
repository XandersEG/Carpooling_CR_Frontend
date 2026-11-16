import { StyleSheet, Text, View } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';

import { PillButton } from './PillButton';

type Props = {
  mensajes: string[];
  // si se indica, muestra un botón para volver a intentar
  onRetry?: () => void;
};

// aviso de error dentro de una pantalla, con opción de reintentar
export function Notice({ mensajes, onRetry }: Props) {
  if (mensajes.length === 0) return null;

  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <View style={styles.textos}>
        {mensajes.map((mensaje) => (
          <Text key={mensaje} style={styles.texto}>
            {mensaje}
          </Text>
        ))}
      </View>
      {onRetry ? <PillButton label="Reintentar" tono="oscuro" onPress={onRetry} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: color.durazno,
    borderRadius: 12,
  },
  textos: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 200,
    gap: 2,
  },
  texto: {
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
  },
});
