import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LocationPickerMap } from '@/components/mobile/driver/LocationPickerMap';
import { LOOKING_UP_ADDRESS, useAddressLookup } from '@/components/mobile/useAddressLookup';
import { Button } from '@/components/shared/Button';
import type { GeoPoint } from '@/src/types/common';
import { PlaceRow } from '@/components/mobile/PlaceRow';
import { Screen } from '@/components/mobile/Screen';
import { ShortcutTile } from '@/components/mobile/ShortcutTile';
import { IconBuscar, IconCar, IconList, IconPlus, IconReloj } from '@/components/mobile/icons';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { colors, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { getGreetingName, getSavedPlaces } from '@/src/services/profileService';

/** "Menu Home" (Figma 2467:2462). */
export default function InicioScreen() {
  // real name of the logged-in user (GET /auth/me)
  const greetingName = useServiceData(getGreetingName, []);
  const places = useServiceData(getSavedPlaces, []);
  // destination marked on the map ("¿A dónde vas?" with a tap instead of typing)
  const [destination, setDestination] = useState<{ name: string; point: GeoPoint } | null>(null);
  // top of the visible map strip, so the zoom buttons sit inside it
  const [mapTop, setMapTop] = useState(0);
  // height of the bottom panel, so the "my location" button sits just above it
  const [sheetHeight, setSheetHeight] = useState(0);
  const { lookup } = useAddressLookup();

  function pickDestination(point: GeoPoint) {
    lookup('destino', point, (name) => setDestination({ name, point }));
  }

  function searchToDestination() {
    if (!destination) return;
    router.push({
      pathname: '/buscar',
      params: {
        destination: destination.name,
        destinationLat: String(destination.point.lat),
        destinationLng: String(destination.point.lng),
      },
    });
  }

  return (
    <Screen>
      {/* real map behind the content; the strip between the search bar and the panel can be
          zoomed and tapped to mark a destination */}
      <LocationPickerMap
        style={StyleSheet.absoluteFill}
        origin={null}
        destination={destination?.point ?? null}
        target="destino"
        onPick={(_, point) => pickDestination(point)}
        destinationLabel={destination?.name}
        topInset={mapTop}
        // the panel, plus the "Buscar viajes a…" button when a destination is marked
        bottomInset={sheetHeight + (destination ? 70 : 0)}
        followPoints={false}
        pinOnLocate={false}
      />

      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Tuanis Carpooling"
        />
        <Text accessibilityRole="header" style={styles.greeting} numberOfLines={1}>
          {greetingName.data ? `Hola, ${greetingName.data}` : 'Hola'}
        </Text>
        <Text style={styles.subtitle}>¿A dónde quieres ir hoy?</Text>
      </View>

      {/* El buscador queda mitad sobre el encabezado blanco y mitad sobre el mapa. */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBackdrop} />
        <Pressable
          accessibilityRole="search"
          accessibilityLabel="¿A dónde vas?"
          onPress={() => router.push('/buscar')}
          style={({ pressed }) => [styles.searchBar, pressed ? styles.pressed : null]}
        >
          <IconBuscar width={22} height={22} color={colors.textPrimary} />
          <Text style={styles.searchPlaceholder} numberOfLines={1}>
            ¿A dónde vas?
          </Text>
          <View style={styles.nowChip}>
            <IconReloj width={16} height={16} color={colors.textPrimary} />
            <Text style={styles.nowText}>Ahora</Text>
          </View>
        </Pressable>
      </View>

      {/* box-none: taps on the empty strip reach the map underneath */}
      <View
        style={styles.mapGap}
        pointerEvents="box-none"
        onLayout={(event) => setMapTop(event.nativeEvent.layout.y)}
      >
        {destination ? (
          <Button
            title={
              destination.name === LOOKING_UP_ADDRESS ? LOOKING_UP_ADDRESS : `Buscar viajes a ${destination.name}`
            }
            onPress={searchToDestination}
            disabled={destination.name === LOOKING_UP_ADDRESS}
            fullWidth
          />
        ) : null}
      </View>

      <View style={styles.sheet} onLayout={(event) => setSheetHeight(event.nativeEvent.layout.height)}>
        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false} bounces={false}>
          <View style={styles.shortcuts}>
            <ShortcutTile label="Buscar viaje" Icon={IconCar} onPress={() => router.push('/buscar')} />
            <ShortcutTile label="Publicar viaje" Icon={IconPlus} onPress={() => router.push('/publicar')} />
            <ShortcutTile label="Mis viajes" Icon={IconList} onPress={() => router.push('/mis-viajes')} />
          </View>
          <Text style={styles.sectionTitle}>Lugares frecuentes</Text>
          <View>
            {(places.data ?? []).map((place) => (
              <PlaceRow
                key={place.id}
                name={place.name}
                detail={place.detail}
                onPress={() => router.push({ pathname: '/buscar', params: { destination: place.name } })}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

// Alto del buscador "¿A dónde vas?" (Figma 2467:2470).
const SEARCH_HEIGHT = 52;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 26,
    paddingHorizontal: spacing.screen,
    paddingBottom: 15,
    backgroundColor: colors.background,
  },
  logo: {
    width: 64.9,
    height: 64,
  },
  greeting: {
    ...typography.screenTitle,
    marginTop: 20,
    textAlign: 'center',
    color: colors.textTitle,
  },
  subtitle: {
    ...typography.subtitle,
    marginTop: 3,
    textAlign: 'center',
    color: colors.textSubtitle,
  },
  searchWrapper: {
    paddingHorizontal: spacing.screen,
  },
  searchBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SEARCH_HEIGHT / 2,
    backgroundColor: colors.background,
  },
  searchBar: {
    height: SEARCH_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingLeft: spacing.l,
    paddingRight: spacing.s,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: radius.segment,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.9,
  },
  searchPlaceholder: {
    ...typography.nameCard,
    flex: 1,
    color: colors.textPlaceholder,
  },
  nowChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
    backgroundColor: colors.surfaceGreenLight,
    borderRadius: radius.chip,
  },
  nowText: {
    ...typography.textStrong,
    color: colors.textPrimary,
  },
  mapGap: {
    flex: 1,
    minHeight: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.m,
  },
  sheet: {
    flexShrink: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...shadows.card,
  },
  sheetContent: {
    gap: spacing.l,
    paddingTop: 24,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.screen,
  },
  shortcuts: {
    flexDirection: 'row',
    gap: 11,
  },
  sectionTitle: {
    ...typography.textStrong,
    color: colors.textPrimary,
  },
});
