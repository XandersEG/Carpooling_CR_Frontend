import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, fuente } from '@/src/features/admin/theme';

const DURACION_MS = 4000;

// mensaje breve que se quita solo; devuelve el mensaje actual y cómo mostrar uno nuevo
export function useToast(): [string | null, (mensaje: string) => void] {
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    if (mensaje === null) return;
    const reloj = setTimeout(() => setMensaje(null), DURACION_MS);
    return () => clearTimeout(reloj);
  }, [mensaje]);

  return [mensaje, setMensaje];
}

// aviso de que una acción salió bien, abajo y al centro
export function Toast({ mensaje }: { mensaje: string | null }) {
  if (mensaje === null) return null;

  return (
    <View style={styles.zona} pointerEvents="none">
      <View style={styles.aviso} accessibilityRole="alert">
        <View style={styles.punto} />
        <Text style={styles.texto}>{mensaje}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  zona: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  aviso: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: color.verdeSuave,
    borderWidth: 1,
    borderColor: color.verde,
    borderRadius: 999,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: color.verde,
  },
  texto: {
    flexShrink: 1,
    fontFamily: fuente.normal,
    fontSize: 13,
    color: color.texto,
  },
});
