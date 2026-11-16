import { useWindowDimensions } from 'react-native';

import { ANCHO_BARRA_COMPLETA, ANCHO_TABLAS } from './theme';

// tamaño de la ventana: "angosta" guarda el menú en un cajón y agranda lo que se toca; "celular" cambia las tablas por tarjetas
export function useLayout() {
  const { width } = useWindowDimensions();
  return { angosta: width < ANCHO_BARRA_COMPLETA, celular: width < ANCHO_TABLAS };
}
