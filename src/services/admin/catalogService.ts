/**
 * Gestión de Parámetros: catálogos de opciones que se muestran en la app móvil
 * y el portal web.
 *
 * Provisional: implementación simulada con datos de ejemplo.
 */
import type { CatalogItemInput, CatalogItemMap, CatalogKey } from '@/src/types/admin';
import type { Id } from '@/src/types/common';

import { db } from '../mock/db';
import { createId, notFound, respond } from '../mock/utils';

/** Nombres de los catálogos tal como aparecen en el portal. */
export const catalogLabels: Record<CatalogKey, string> = {
  'metodos-pago': 'Métodos de Pago',
  'tipos-vehiculo': 'Tipos de Vehículo',
  'rangos-edad': 'Rangos de Edad',
  'opciones-genero': 'Opciones de Género',
  'reglas-tarifas': 'Reglas y Tarifas',
};

function items<K extends CatalogKey>(key: K): CatalogItemMap[K][] {
  return db.catalogs[key] as CatalogItemMap[K][];
}

export async function listCatalog<K extends CatalogKey>(key: K): Promise<CatalogItemMap[K][]> {
  return respond(items(key));
}

/** Cantidad de elementos por catálogo (contadores de las pestañas). */
export async function getCatalogCounts(): Promise<Record<CatalogKey, number>> {
  const keys = Object.keys(db.catalogs) as CatalogKey[];
  return respond(
    Object.fromEntries(keys.map((key) => [key, items(key).length])) as Record<CatalogKey, number>,
  );
}

export async function createCatalogItem<K extends CatalogKey>(
  key: K,
  input: CatalogItemInput<K>,
): Promise<CatalogItemMap[K]> {
  const item = { ...input, id: createId(key) } as CatalogItemMap[K];
  items(key).push(item);
  return respond(item);
}

export async function updateCatalogItem<K extends CatalogKey>(
  key: K,
  id: Id,
  input: CatalogItemInput<K>,
): Promise<CatalogItemMap[K]> {
  const item = items(key).find((entry) => entry.id === id);
  if (!item) throw notFound(catalogLabels[key], id);
  Object.assign(item, input);
  return respond(item);
}

export async function deleteCatalogItem(key: CatalogKey, id: Id): Promise<void> {
  const list = items(key);
  const index = list.findIndex((entry) => entry.id === id);
  if (index === -1) throw notFound(catalogLabels[key], id);
  list.splice(index, 1);
  await respond(undefined);
}
