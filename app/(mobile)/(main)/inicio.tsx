import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MapView } from '@/components/mobile/MapView';
import { PlaceRow } from '@/components/mobile/PlaceRow';
import { Screen } from '@/components/mobile/Screen';
import { ShortcutTile } from '@/components/mobile/ShortcutTile';
import { IconBuscar, IconCar, IconList, IconPlus, IconReloj } from '@/components/mobile/icons';
import { useServiceData } from '@/components/mobile/passenger/useServiceData';
import { colors, palette, radius, shadows, spacing, typography } from '@/src/constants/theme';
import { getProfile, getSavedPlaces } from '@/src/services/profileService';

/** "Menu Home" (Figma 2467:2462). */
export default function InicioScreen() {
  const profile = useServiceData(getProfile, []);
  const places = useServiceData(getSavedPlaces, []);

  return (
    <Screen>
      <MapView style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Tuanis Carpooling"
        />
        <Text accessibilityRole="header" style={styles.greeting} numberOfLines={1}>
          {profile.data ? `Hola, ${profile.data.displayName}` : 'Hola'}
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

      <View style={styles.mapGap} />

      <View style={styles.sheet}>
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
