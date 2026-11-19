import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

type Props = TextInputProps & {
  // sin etiqueta, el campo debe traer su accessibilityLabel
  label?: string;
  // marca el campo en color de error
  conError?: boolean;
  // campo de contraseña: la oculta y trae el botón del ojo para mostrarla
  contrasena?: boolean;
};

// campo de texto con su etiqueta
export function Field({ label, conError = false, contrasena = false, style, ...input }: Props) {
  const { angosta } = useLayout();
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.campo}>
      {label ? <Text style={styles.etiqueta}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={color.textoSuave}
        secureTextEntry={contrasena ? !visible : undefined}
        style={[
          styles.entrada,
          angosta ? styles.entradaTactil : null,
          conError ? styles.entradaConError : null,
          contrasena ? (angosta ? styles.entradaConOjoTactil : styles.entradaConOjo) : null,
          style,
        ]}
        {...input}
      />
      {contrasena ? (
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
      ) : null}
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
  // el texto no pasa por debajo del ojo
  entradaConOjo: {
    paddingRight: 38,
  },
  entradaConOjoTactil: {
    paddingRight: 46,
  },
  // el ojo queda dentro del campo, a la derecha
  ojo: {
    position: 'absolute',
    right: 2,
    bottom: 0,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ojoTactil: {
    right: 0,
    width: 44,
    height: 44,
  },
});
