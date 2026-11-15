import { StyleSheet, Text, View } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';

type Props = {
  activo: boolean;
  // color lleno, como en el listado de usuarios
  lleno?: boolean;
};

// etiqueta de estado: activo o inactivo
export function StatusPill({ activo, lleno = false }: Props) {
  const fondo = lleno
    ? activo
      ? color.verde
      : color.terracota
    : activo
      ? color.verdeSuave
      : color.grisChip;

  return (
    <View style={[styles.pildora, { backgroundColor: fondo }]}>
      {lleno ? null : (
        <View
          style={[styles.punto, { backgroundColor: activo ? color.verde : color.textoSuave }]}
        />
      )}
      <Text
        style={[
          styles.texto,
          lleno ? styles.textoLleno : null,
          lleno && !activo ? styles.textoClaro : null,
        ]}
      >
        {activo ? 'Activo' : 'Inactivo'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pildora: {
    minWidth: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 3,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  texto: {
    fontFamily: fuente.normal,
    fontSize: 12,
    color: color.texto,
  },
  textoLleno: {
    fontFamily: fuente.negrita,
    lineHeight: 16,
  },
  textoClaro: {
    color: color.blanco,
  },
});
