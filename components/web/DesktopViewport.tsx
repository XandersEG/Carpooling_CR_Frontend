import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { layout, webColors } from '@/src/constants/theme';

type DesktopViewportProps = {
  children: ReactNode;
};

/**
 * Lienzo de escritorio del portal (decisión D6): ocupa toda la ventana con un
 * ancho mínimo de 1280 px; si la ventana es más angosta aparece un scroll
 * horizontal en lugar de comprimir el diseño.
 */
export function DesktopViewport({ children }: DesktopViewportProps) {
  const { width } = useWindowDimensions();
  const canvasWidth = Math.max(width, layout.webMinWidth);

  return (
    <ScrollView
      horizontal
      style={styles.root}
      contentContainerStyle={styles.content}
      scrollEnabled={width < layout.webMinWidth}
    >
      <View style={[styles.canvas, { width: canvasWidth }]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: webColors.pageBackground,
  },
  content: {
    flexGrow: 1,
    height: '100%',
  },
  canvas: {
    height: '100%',
  },
});
