import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

type Props = TextInputProps & {
  // sin etiqueta, el campo debe traer su accessibilityLabel
  label?: string;
  // marca el campo en color de error
  conError?: boolean;
};

// campo de texto con su etiqueta
export function Field({ label, conError = false, style, ...input }: Props) {
  const { angosta } = useLayout();

  return (
    <View style={styles.campo}>
      {label ? <Text style={styles.etiqueta}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={color.textoSuave}
        style={[
          styles.entrada,
          angosta ? styles.entradaTactil : null,
          conError ? styles.entradaConError : null,
          style,
        ]}
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
  // con letra de 16 px el navegador del celular no amplía la página al enfocar el campo
  entradaTactil: {
    minHeight: 44,
    fontSize: 16,
  },
  entradaConError: {
    borderColor: color.terracota,
  },
});
