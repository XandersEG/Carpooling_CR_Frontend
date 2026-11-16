import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';
import { useLayout } from '@/src/features/admin/useLayout';

type Tono = 'verde' | 'oscuro' | 'terracota' | 'gris' | 'malva';

type Props = {
  label: string;
  onPress: () => void;
  tono?: Tono;
  icon?: ComponentProps<typeof Ionicons>['name'];
  grande?: boolean;
  // más bajo, para las filas de una tabla
  pequeno?: boolean;
  // en celular se reparte el ancho con los botones vecinos
  expandido?: boolean;
  disabled?: boolean;
  // muestra un indicador y bloquea el botón mientras se guarda
  ocupado?: boolean;
};

const FONDO: Record<Tono, string> = {
  verde: color.verde,
  oscuro: color.oscuro,
  terracota: color.terracota,
  gris: color.gris,
  malva: color.malvaSuave,
};

const TEXTO_CLARO: Tono[] = ['oscuro', 'terracota'];

// botón en forma de píldora, como los del prototipo web
export function PillButton({
  label,
  onPress,
  tono = 'verde',
  icon,
  grande = false,
  pequeno = false,
  expandido = false,
  disabled = false,
  ocupado = false,
}: Props) {
  const { angosta, celular } = useLayout();
  const colorTexto = TEXTO_CLARO.includes(tono) ? color.blanco : color.texto;
  const bloqueado = disabled || ocupado;
  // en pantallas angostas el botón crece para tocarlo con el dedo; el grande ya mide lo suficiente
  const tactil = angosta && !grande;

  const contenido = (
    <>
      {ocupado ? (
        <ActivityIndicator size="small" color={colorTexto} />
      ) : icon ? (
        <Ionicons name={icon} size={grande ? 20 : 16} color={colorTexto} />
      ) : null}
      <Text
        numberOfLines={1}
        style={[
          styles.texto,
          grande ? styles.textoGrande : null,
          pequeno ? styles.textoPequeno : null,
          tactil ? (pequeno ? styles.textoPequenoTactil : styles.textoTactil) : null,
          { color: colorTexto },
        ]}
      >
        {label}
      </Text>
    </>
  );

  // el botón de tabla se sigue viendo bajo, pero se toca en una zona de 44 px
  if (pequeno && angosta) {
    return (
      <Pressable
        onPress={onPress}
        disabled={bloqueado}
        accessibilityRole="button"
        style={styles.zona}
      >
        <View
          style={[
            styles.boton,
            styles.pequenoTactil,
            { backgroundColor: FONDO[tono] },
            bloqueado ? styles.bloqueado : null,
          ]}
        >
          {contenido}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      style={[
        styles.boton,
        grande ? styles.grande : null,
        pequeno ? styles.pequeno : null,
        tactil ? styles.tactil : null,
        expandido && celular ? styles.expandido : null,
        { backgroundColor: FONDO[tono] },
        bloqueado ? styles.bloqueado : null,
      ]}
    >
      {contenido}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  grande: {
    minHeight: 46,
    paddingHorizontal: 22,
  },
  pequeno: {
    minHeight: 22,
    paddingHorizontal: 16,
  },
  tactil: {
    minHeight: 44,
  },
  pequenoTactil: {
    minHeight: 28,
    paddingHorizontal: 16,
  },
  zona: {
    minHeight: 44,
    justifyContent: 'center',
  },
  expandido: {
    flex: 1,
  },
  bloqueado: {
    opacity: 0.5,
  },
  texto: {
    fontFamily: fuente.media,
    fontSize: 13,
  },
  textoGrande: {
    fontSize: 15,
  },
  textoPequeno: {
    fontSize: 11,
  },
  textoTactil: {
    fontSize: 14,
  },
  textoPequenoTactil: {
    fontSize: 12,
  },
});
