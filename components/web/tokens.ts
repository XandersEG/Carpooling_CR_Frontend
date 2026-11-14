import type { TextStyle, ViewStyle } from 'react-native';

import { fonts, palette, webColors } from '@/src/constants/theme';

/**
 * Valores del portal web que no tienen token en `src/constants/theme.ts`.
 * Se observaron en los frames de Figma (página "Web"); ver docs/design/design-system.md §1.3.
 */
export const webExtra = {
  /** Variable `--lime` de los frames de autenticación (botón "Iniciar sesión"). */
  authLime: '#B2D258',
  /** Variable `--pale`: fondo del área de acceso y texto del panel de marca. */
  authPale: '#D9E3CF',
  /** Borde de los campos de autenticación. */
  authInputBorder: 'rgba(175, 156, 158, 0.45)',
  /** Borde de tablas, selects y campos de los modales de Parámetros. */
  border: '#CACACA',
  /** Fondo de los campos de los modales y del buscador de Parámetros. */
  fieldBackground: '#F3F3F3',
  fieldText: '#5F5F5F',
  /** Texto gris oscuro de pastillas y botones ("Activo", "Cancelar"). */
  textMuted: '#4C4C4C',
  /** Botón "Cancelar" de los modales. */
  cancel: '#CFCFCF',
  /** Franja de encabezado de las tablas (Parámetros, Consultas, Actividad). */
  tableHeader: '#F3F5F0',
  /** Fila alterna en Instituciones. */
  rowStripe: '#F3F5F0',
  /** Flechas del selector "Top N" e ícono de Estadísticas del menú. */
  lightGrey: '#D9D9D9',
  /** Fondo del chip de usuario en hover. */
  userChipHover: '#D9D9D9',
  /** Insignias de posición 4 y 5 en las consultas "Top N". */
  rank4: '#DCEFC9',
  rank5: '#EFEFEF',
  /** Verde de los gráficos de Estadísticas (Masculino, SINPE móvil). */
  chartGreen: '#7FA65D',
  /** Selección del calendario desplegable (`Dropdown calendar`, azul en el diseño). */
  calendarAccent: '#4361EE',
  calendarToday: '#F1F3F5',
  /** Fila expandida del "Listado de viajes" (`acc1` = on). */
  accordionHeader: '#DAE3D0',
  accordionBody: palette.sageLight,
  /** Velo de los modales del portal (gris translúcido). */
  scrim: 'rgba(40, 40, 40, 0.45)',
} as const;

/** Sombra de las tarjetas y pestañas de Consultas/Estadísticas. */
export const webShadow: ViewStyle = { boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)' };

/** Texto base del portal: Cairo con el color del encabezado. */
export const webText = (fontFamily: string, fontSize: number, color: string = webColors.headerText): TextStyle => ({
  fontFamily,
  fontSize,
  color,
});

export { fonts, palette, webColors };
