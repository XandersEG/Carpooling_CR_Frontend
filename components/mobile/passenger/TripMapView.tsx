import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { MapLabel, MapView } from '@/components/mobile/MapView';
import { TripCard, type TripCardProps } from '@/components/mobile/TripCard';
import { colors, layout, radius, spacing } from '@/src/constants/theme';

import { RutaResultados } from './icons';
import { MapCanvas, MapTag, OriginPin, SquarePin } from './MapCanvas';

export type TripMapItem = {
  key: string;
  card: Omit<TripCardProps, 'onPress' | 'style'>;
  onPress: () => void;
};

type TripMapViewProps = {
  items: TripMapItem[];
};

// Coordenadas de "Resultados mapa" (Figma 2448:2302) relativas al borde
// superior del mapa (y = 248 en el frame).
const ROUTE = { left: 60, top: 60 };
const CANVAS_HEIGHT = 350;

/**
 * Vista "Mapa" de "Resultados" y "Mis Viajes": ruta sobre el mapa estático,
 * contador "1 de 3 viajes" y la tarjeta del viaje actual. Las tarjetas se
 * deslizan horizontalmente para cambiar de viaje.
 */
export function TripMapView({ items }: TripMapViewProps) {
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const current = items[Math.min(index, items.length - 1)];

  function handleScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!pageWidth) return;
    setIndex(Math.round(event.nativeEvent.contentOffset.x / pageWidth));
  }

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFill} />
      <View style={styles.canvasArea}>
        {current ? (
          <MapCanvas height={CANVAS_HEIGHT}>
            <View pointerEvents="none" style={[styles.route, ROUTE]}>
              <RutaResultados width={260} height={280} />
            </View>
            <OriginPin x={90} y={320} />
            <SquarePin variant="destino" left={295} top={70} />
            <MapTag text={current.card.origin} left={108} top={308} />
            <MapTag text={current.card.destination} right={layout.mobileDesignWidth - 285} top={68} />
          </MapCanvas>
        ) : null}
      </View>
      {items.length > 0 ? (
        <View style={styles.bottom}>
          <View style={styles.counterRow}>
            <MapLabel
              text={`${Math.min(index, items.length - 1) + 1} de ${items.length} viajes`}
              style={styles.counter}
            />
          </View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
            onMomentumScrollEnd={handleScrollEnd}
            onScrollEndDrag={handleScrollEnd}
          >
            {items.map((item) => (
              <View key={item.key} style={[styles.page, pageWidth ? { width: pageWidth } : null]}>
                <TripCard {...item.card} onPress={item.onPress} />
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  canvasArea: {
    flex: 1,
  },
  route: {
    position: 'absolute',
  },
  bottom: {
    paddingBottom: 44,
    gap: spacing.xxs,
  },
  counterRow: {
    height: 32,
    paddingHorizontal: spacing.screen,
  },
  counter: {
    right: spacing.screen,
    top: 0,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.borderCard,
    borderRadius: radius.chip,
  },
  page: {
    paddingHorizontal: spacing.screen,
    paddingVertical: 2,
  },
});
