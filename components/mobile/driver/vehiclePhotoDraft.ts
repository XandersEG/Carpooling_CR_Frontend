/**
 * Fotos en edición compartidas entre "Datos del vehículo" y "Modificar
 * fotografías" (Expo Router no devuelve resultados entre pantallas). La clave es
 * el id de la ruta (`nuevo` al crear un vehículo).
 */
let draft: { key: string; photos: string[] } | null = null;

export function setPhotoDraft(key: string, photos: string[]): void {
  draft = { key, photos: [...photos] };
}

/** Fotos en edición para la clave, o `null` si no hay borrador. */
export function getPhotoDraft(key: string): string[] | null {
  return draft && draft.key === key ? [...draft.photos] : null;
}

export function clearPhotoDraft(): void {
  draft = null;
}
