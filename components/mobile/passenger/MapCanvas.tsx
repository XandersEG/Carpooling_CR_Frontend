import { useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { MapLabel } from '@/components/mobile/MapView';
import { colors, layout, palette, radius, shadows, spacing } from '@/src/constants/theme';

import { PinOrigen } from './icons';

type MapCanvasProps = {
  /** Alto del lienzo en coordenadas del diseño (el ancho es el del frame, 402). */
  height: number;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Lienzo para dibujar rutas y marcadores sobre el mapa estático (D3) con las
 * coordenadas del frame de Figma. Se centra horizontalmente, se ancla arriba y
 * se reduce proporcionalmente si el espacio disponible es menor que el diseño.
 */
export function MapCanvas({ height, children, style }: MapCanvasProps) {
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const width = layout.mobileDesignWidth;
  const scale = size ? Math.min(1, size.width / width, size.height / height) : 1;

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, style]}
      onLayout={(event) => setSize(event.nativeEvent.layout)}
    >
      {size ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            width,
            height,
            left: (size.width - width) / 2,
            // La escala se aplica desde el centro: se compensa para anclar arriba.
            top: -(height * (1 - scale)) / 2,
            transform: [{ scale }],
          }}
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}

/** Marcador de origen (círculo verde con borde blanco) centrado en (x, y). */
export function OriginPin({ x, y }: { x: number; y: number }) {
  // El círculo del SVG (32 × 32) está centrado en (16, 14) por la sombra.
  return (
    <View pointerEvents="none" style={[styles.absolute, { left: x - 16, top: y - 14 }]}>
      <PinOrigen width={32} height={32} />
    </View>
  );
}

type SquarePinProps = {
  /** Esquina superior izquierda del marcador de 20 × 20. */
  left: number;
  top: number;
  variant: 'destino' | 'recogida' | 'recogida-disponible';
};

/** Marcador cuadrado: destino (negro) o punto de recogida (naranja claro). */
export function SquarePin({ left, top, variant }: SquarePinProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.absolute,
        styles.square,
        variant === 'destino' ? styles.squareDestination : null,
        variant === 'recogida' ? styles.squarePickup : null,
        variant === 'recogida-disponible' ? styles.squarePickupAvailable : null,
        { left, top },
      ]}
    />
  );
}

type MapTagProps = {
  text: string;
  left?: number;
  right?: number;
  top: number;
};

/** Etiqueta sobre el mapa con el estilo de Punto 4–5 ("Etiqueta origen/destino"). */
export function MapTag({ text, left, right, top }: MapTagProps) {
  return <MapLabel text={text} style={[styles.tag, { left, right, top }]} />;
}

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  square: {
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: palette.white,
    borderRadius: 5,
    ...shadows.mapLabel,
  },
  squareDestination: {
    backgroundColor: colors.textPrimary,
  },
  squarePickup: {
    backgroundColor: colors.surfaceOrangeLight,
  },
  // No diseñado: punto de recogida disponible aún sin seleccionar.
  squarePickupAvailable: {
    backgroundColor: palette.white,
    borderColor: colors.surfaceOrangeLight,
  },
  tag: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.chip,
  },
});
