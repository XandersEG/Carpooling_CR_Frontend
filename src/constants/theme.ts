import type { TextStyle, ViewStyle } from 'react-native';

/**
 * Tokens de diseño de Tuanis Carpooling.
 *
 * Fuente: archivo de Figma "Prototipo-Proyecto-Carpooling" (variables `Colores`,
 * `Radios`, `Espaciado`, estilos de texto `Carpooling/*` y estilos de efecto).
 * Detalle y valores observados: docs/design/design-system.md
 */

/** Paleta base (página Tokens → Colores). Preferir los tokens semánticos de `colors`. */
export const palette = {
  lime: '#75C217',
  limeMedium: '#A1D86E',
  limeLight: '#C9E5AE',
  sage: '#6C9744',
  sageMedium: '#A7C28E',
  sageLight: '#C9DAB9',
  terracotta: '#C57346',
  terracottaMedium: '#E1B69E',
  terracottaLight: '#EDD3C5',
  brownDark: '#3F3334',
  mauve: '#7F6769',
  mauveLight: '#AF9C9E',
  grey: '#C7C7C7',
  greyLight: '#E1E1E1',
  greyMedium: '#8C8C8C',
  greyDark: '#4D4D4D',
  nearBlack: '#1C1C1C',
  black: '#000000',
  white: '#FFFFFF',
  // "Colores (Variación Móvil 4)"
  sand: '#E4DDD5',
  taupe: '#6E6262',
} as const;

/** Tokens semánticos de la app móvil (colección de variables `Colores`). */
export const colors = {
  background: palette.white,
  primary: palette.lime, // color/accion/primario
  onPrimary: palette.white,
  accentGreen: palette.sage, // color/acento/verde
  surfaceGreenLight: palette.limeLight, // color/superficie/verde-claro
  surfaceGreenSoft: palette.limeMedium, // color/superficie/verde-suave
  surfaceOrangeLight: palette.terracottaLight, // color/superficie/naranja-claro
  // color/superficie/input es un alias sin resolver en Figma; en pantalla se ve #E1E1E1.
  surfaceInput: palette.greyLight,
  borderInput: palette.sand, // color/borde/input
  borderCard: palette.greyLight, // color/borde/tarjeta
  borderSearch: palette.greyMedium, // color/borde/busqueda
  textTitle: palette.black, // color/texto/titulo
  textPrimary: palette.nearBlack, // color/texto/principal
  textDark: palette.brownDark, // color/texto/oscuro
  textSecondary: palette.mauve, // color/texto/secundario
  textPlaceholder: palette.taupe, // color/texto/placeholder
  // color/texto/subtitulo es un alias sin resolver en Figma; en pantalla se ve #7F6769.
  textSubtitle: palette.mauve,
  routeLine: palette.grey, // color/linea/ruta
  tabInactive: '#727272',
  buttonDark: palette.brownDark,
  danger: palette.terracotta,
  // Chips de estado
  statusApproved: palette.limeLight,
  statusPending: palette.sageLight,
  statusCancelled: palette.terracottaLight,
  // No definido en Figma: color de error para validaciones de formularios.
  error: '#B3261E',
  scrim: 'rgba(0, 0, 0, 0.45)',
} as const;

/**
 * Paleta de Inicio de sesión / Registro (Móvil Punto 1).
 * Decisión D2: el botón principal de autenticación se mantiene café oscuro.
 */
export const authColors = {
  background: palette.white,
  text: '#413333',
  textMuted: palette.taupe,
  inputBackground: '#F7F4F0',
  inputBorder: palette.sand,
  button: '#413333',
  onButton: palette.white,
  // No definido en Figma: color de foco y subrayado de enlaces de la pantalla actual.
  accent: '#D26E3C',
  error: colors.error,
} as const;

/** Tokens del portal web administrativo (valores observados, sin variables en Figma). */
export const webColors = {
  pageBackground: '#444444',
  sidebar: palette.brownDark,
  sidebarText: palette.greyLight,
  sidebarActive: palette.mauve,
  sidebarActiveBorder: palette.lime,
  header: palette.white,
  headerText: palette.brownDark,
  contentBackground: palette.sageLight,
  card: palette.white,
  primary: palette.lime,
  secondary: palette.terracotta,
  tertiary: palette.brownDark,
  resend: palette.mauve,
  statusActive: palette.limeMedium,
  highlightRow: palette.terracottaLight,
  errorBanner: palette.terracottaLight,
  modalHeader: palette.brownDark,
  tableBorder: palette.grey,
  label: palette.greyMedium,
} as const;

/** Nombres de familia registrados en app/_layout.tsx (useFonts). */
export const fonts = {
  // DM Sans: títulos, nombres y botones en móvil
  regular: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semiBold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
  black: 'DMSans_900Black',
  // Cairo: texto secundario en móvil y fuente principal del portal web
  cairoRegular: 'Cairo_400Regular',
  cairoMedium: 'Cairo_500Medium',
  cairoSemiBold: 'Cairo_600SemiBold',
  cairoBold: 'Cairo_700Bold',
  cairoExtraBold: 'Cairo_800ExtraBold',
  cairoBlack: 'Cairo_900Black',
} as const;

/** Estilos de texto `Carpooling/*` (móvil). */
export const typography = {
  screenTitle: { fontFamily: fonts.bold, fontSize: 28 }, // Carpooling/Titulo pantalla
  subtitle: { fontFamily: fonts.regular, fontSize: 13 }, // Carpooling/Subtitulo
  nameHighlight: { fontFamily: fonts.bold, fontSize: 17 }, // Carpooling/Nombre destacado
  nameCard: { fontFamily: fonts.bold, fontSize: 15 }, // Carpooling/Nombre tarjeta
  textStrong: { fontFamily: fonts.bold, fontSize: 14 }, // Carpooling/Texto fuerte
  buttonCost: { fontFamily: fonts.black, fontSize: 16 }, // Carpooling/Boton y costo
  toggleActive: { fontFamily: fonts.black, fontSize: 14 }, // Carpooling/Toggle activo
  textSecondary: { fontFamily: fonts.cairoRegular, fontSize: 13 }, // Carpooling/Texto secundario
  textSmall: { fontFamily: fonts.cairoRegular, fontSize: 12 }, // Carpooling/Texto pequeno
  tabLabel: { fontFamily: fonts.medium, fontSize: 12 },
} as const satisfies Record<string, TextStyle>;

/** Escala tipográfica observada en el portal web (Cairo). */
export const webTypography = {
  pageTitle: { fontFamily: fonts.cairoBold, fontSize: 32 },
  pageSubtitle: { fontFamily: fonts.cairoRegular, fontSize: 15 },
  cardTitle: { fontFamily: fonts.cairoBold, fontSize: 20 },
  sidebarItem: { fontFamily: fonts.cairoSemiBold, fontSize: 16 },
  sidebarSection: { fontFamily: fonts.cairoBold, fontSize: 16 },
  body: { fontFamily: fonts.cairoMedium, fontSize: 15 },
  label: { fontFamily: fonts.cairoSemiBold, fontSize: 13 },
  caption: { fontFamily: fonts.cairoRegular, fontSize: 12 },
} as const satisfies Record<string, TextStyle>;

/** Colección de variables `Espaciado`. */
export const spacing = {
  screen: 22, // espacio/margen-pantalla
  xxs: 6,
  xs: 8,
  s: 10,
  m: 12,
  l: 14,
  xl: 16,
} as const;

export const iconSize = 16; // tamano/icono

/** Colección de variables `Radios` y radios observados. */
export const radius = {
  chip: 12, // radio/chip
  input: 14, // radio/input
  card: 15, // radio/tarjeta
  segment: 16, // radio/segmento
  button: 20, // radio/boton
  field: 14, // campos de Inicio de sesión (igual a radio/input)
  pill: 999,
  webControl: 16,
  webCard: 23,
} as const;

/** Estilos de efecto `Carpooling/*` y sombras observadas. */
export const shadows = {
  card: { boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)' }, // Carpooling/Sombra tarjeta
  mapLabel: { boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.18)' }, // Carpooling/Sombra etiqueta mapa
  bottomPanel: { boxShadow: '0px -4px 16px rgba(0, 0, 0, 0.12)' },
  dialog: { boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)' },
  webCard: { boxShadow: '0px 8px 28px rgba(0, 0, 0, 0.07)' },
} as const satisfies Record<string, ViewStyle>;

/** Medidas de layout (ver design-system.md §3). */
export const layout = {
  mobileDesignWidth: 402,
  webSidebarWidth: 366,
  webHeaderHeight: 126,
  webMinWidth: 1280, // decisión D6
} as const;
