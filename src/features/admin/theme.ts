// colores y tipografía del portal administrativo, tomados del prototipo web
export const color = {
  oscuro: '#3F3334',
  fondo: '#C9DAB9',
  fondoLogin: '#D9E3CF',
  blanco: '#FFFFFF',
  verde: '#75C217',
  verdeSuave: '#A1D86E',
  verdeClaro: '#C9E5AE',
  lima: '#B2D258',
  terracota: '#C57346',
  malva: '#7F6769',
  malvaSuave: '#AF9C9E',
  durazno: '#EDD3C5',
  gris: '#CFCFCF',
  grisChip: '#E1E1E1',
  grisCampo: '#F3F3F3',
  grisOscuro: '#4D4D4D',
  banda: '#F3F6F0',
  linea: '#D9D9D9',
  texto: '#1C1C1C',
  textoSuave: '#5F5F5F',
  velo: 'rgba(30, 24, 25, 0.45)',
} as const;

export const fuente = {
  normal: 'Cairo_400Regular',
  media: 'Cairo_600SemiBold',
  negrita: 'Cairo_700Bold',
} as const;

// ancho desde el que la barra lateral queda fija; por debajo se guarda en un cajón
export const ANCHO_BARRA_COMPLETA = 900;

// ancho bajo el que las tablas se muestran como tarjetas, pensado para celular
export const ANCHO_TABLAS = 700;
