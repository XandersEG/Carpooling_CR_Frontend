import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';

type Props = TextInputProps & {
  label: string;
  // marca el campo en color de error
  conError?: boolean;
};

// campo de texto con su etiqueta
export function Field({ label, conError = false, style, ...input }: Props) {
  return (
    <View style={styles.campo}>
      <Text style={styles.etiqueta}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={color.textoSuave}
        style={[styles.entrada, conError ? styles.entradaConError : null, style]}
        {...input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  campo: {
    gap: 4,
  },
  etiqueta: {
    fontFamily: fuente.negrita,
    fontSize: 12,
    color: color.texto,
  },
  entrada: {
    minHeight: 34,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
    backgroundColor: color.grisCampo,
    borderWidth: 1,
    borderColor: color.linea,
    borderRadius: 8,
  },
  entradaConError: {
    borderColor: color.terracota,
  },
});
