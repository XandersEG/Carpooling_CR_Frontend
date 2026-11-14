import type { ImageSourcePropType } from 'react-native';

/**
 * Íconos de las pantallas del conductor exportados desde Figma
 * (assets/icons/mobile/driver). Los que tienen `currentColor` se tiñen con la
 * prop `color`. Se renderizan con el ancho y alto nativos del SVG.
 */
export { default as IconAceptar } from '@/assets/icons/mobile/driver/aceptar.svg'; // 36 × 36
export { default as IconRechazar } from '@/assets/icons/mobile/driver/rechazar.svg'; // 36 × 36
export { default as IconCancelar } from '@/assets/icons/mobile/driver/cancelar.svg'; // 36 × 36, currentColor
export { default as IconResultadoCheck } from '@/assets/icons/mobile/driver/resultado-check.svg'; // 36 × 36, currentColor
export { default as IconEnviar } from '@/assets/icons/mobile/driver/enviar.svg'; // 19 × 19, currentColor
export { default as IconBandera } from '@/assets/icons/mobile/driver/bandera.svg'; // 19 × 19, currentColor
export { default as IconInfo } from '@/assets/icons/mobile/driver/info.svg'; // 40 × 40
export { default as IconImagen } from '@/assets/icons/mobile/driver/imagen.svg'; // 33.5 × 33.5, currentColor
export { default as IconParadaOrigen } from '@/assets/icons/mobile/driver/parada-origen.svg'; // 14 × 14
export { default as IconParadaRecogida } from '@/assets/icons/mobile/driver/parada-recogida.svg'; // 14 × 14
export { default as IconPinParada } from '@/assets/icons/mobile/driver/pin-parada.svg'; // 32 × 32 (incluye sombra)
export { default as IconRutaPublicarBorde } from '@/assets/icons/mobile/driver/ruta-publicar-borde.svg'; // 227 × 252
export { default as IconRutaPublicarLinea } from '@/assets/icons/mobile/driver/ruta-publicar-linea.svg'; // 221 × 246
export { default as IconRutaViaje } from '@/assets/icons/mobile/driver/ruta-viaje.svg'; // 367 × 602

/**
 * Íconos que en Figma son imágenes rasterizadas (no hay versión vectorial en
 * el diseño): lápiz (22 × 20), basurero (18 × 23) y personas (25 × 18).
 */
export const imgLapiz: ImageSourcePropType = require('@/assets/icons/mobile/driver/lapiz.png');
export const imgBasurero: ImageSourcePropType = require('@/assets/icons/mobile/driver/basurero.png');
export const imgPersonas: ImageSourcePropType = require('@/assets/icons/mobile/driver/personas.png');
