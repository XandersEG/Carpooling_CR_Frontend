/**
 * Configuración de los servicios.
 *
 * Mientras no existan los contratos de la API, los servicios usan datos
 * simulados (src/services/mock). Definir `EXPO_PUBLIC_USE_MOCKS=false` cuando
 * se integre el Backend.
 */
export const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCKS !== 'false';
