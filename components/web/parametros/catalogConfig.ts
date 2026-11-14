/**
 * Configuración de los 5 catálogos de "Gestión de Parámetros" (sección 7:440):
 * columnas de la tabla, campos del formulario y textos de los modales.
 */
import type {
  AgeRangeItem,
  CatalogItem,
  CatalogItemInput,
  CatalogKey,
  GenderOptionItem,
  PaymentMethodItem,
  RuleItem,
  VehicleTypeItem,
} from '@/src/types/admin';
import { catalogLabels } from '@/src/services/admin/catalogService';
import { formatColones } from '@/src/utils/format';

export const CATALOG_KEYS: CatalogKey[] = [
  'metodos-pago',
  'tipos-vehiculo',
  'rangos-edad',
  'opciones-genero',
  'reglas-tarifas',
];

export function isCatalogKey(value: string | undefined): value is CatalogKey {
  return CATALOG_KEYS.includes(value as CatalogKey);
}

export type CatalogColumn = {
  label: string;
  /** Proporción del ancho de la fila. */
  flex: number;
  value: (item: CatalogItem) => string;
  bold?: boolean;
};

export type CatalogFormField = {
  key: string;
  label: string;
  placeholder: string;
  numeric?: boolean;
  /** Campo a media columna (p. ej. "Valor" y "Unidad"). */
  half?: boolean;
};

/** Valores del formulario como texto; `toInput` los convierte al tipo del catálogo. */
export type CatalogFormValues = Record<string, string>;

export type CatalogConfig = {
  /** Etiqueta de la pestaña en dos líneas. */
  tabLabel: string;
  columns: CatalogColumn[];
  fields: CatalogFormField[];
  newTitle: string;
  editTitle: (name: string) => string;
  deleteTitle: string;
  toForm: (item: CatalogItem | null) => CatalogFormValues;
  /** Devuelve `null` si faltan datos obligatorios. */
  toInput: (values: CatalogFormValues, active: boolean) => CatalogItemInput<CatalogKey> | null;
};

/** Texto recortado de un campo del formulario (vacío si no existe). */
const text = (value: string | undefined): string => (value ?? '').trim();

const toNumber = (value: string): number | null => {
  const parsed = Number(value.replace(/\s/g, ''));
  return value.trim() !== '' && Number.isFinite(parsed) ? parsed : null;
};

/** "₡150 por km", "₡3 000" o "30 minutos". */
export function formatRuleValue(item: RuleItem): string {
  if (item.unit.startsWith('₡')) {
    const rest = item.unit.slice(1).trim();
    return `${formatColones(item.value)}${rest ? ` ${rest}` : ''}`;
  }
  return `${item.value} ${item.unit}`;
}

export const catalogConfigs: Record<CatalogKey, CatalogConfig> = {
  'metodos-pago': {
    tabLabel: 'Métodos\nde Pago',
    columns: [
      { label: 'MÉTODO DE PAGO', flex: 339, bold: true, value: (item) => item.name },
      { label: 'DESCRIPCIÓN', flex: 630, value: (item) => (item as PaymentMethodItem).description },
    ],
    fields: [
      { key: 'name', label: 'Nombre', placeholder: 'Ej: SINPE Móvil' },
      { key: 'description', label: 'Descripción', placeholder: 'Ej: Pago en colones directamente al conductor' },
    ],
    newTitle: 'Nuevo método de pago',
    editTitle: (name) => `Editar método de pago: ${name}`,
    deleteTitle: 'Eliminar método de pago',
    toForm: (item) => ({
      name: item?.name ?? '',
      description: (item as PaymentMethodItem | null)?.description ?? '',
    }),
    toInput: (values, active) =>
      text(values.name) ? { name: text(values.name), description: text(values.description), active } : null,
  },
  'tipos-vehiculo': {
    tabLabel: 'Tipos de\nVehículo',
    columns: [
      { label: 'TIPO DE VEHÍCULO', flex: 260, bold: true, value: (item) => item.name },
      {
        label: 'CAPACIDAD MÁXIMA',
        flex: 230,
        value: (item) => String((item as VehicleTypeItem).maxCapacity),
      },
      { label: 'DESCRIPCIÓN', flex: 479, value: (item) => (item as VehicleTypeItem).description },
    ],
    fields: [
      { key: 'name', label: 'Nombre', placeholder: 'Ej: Sedán' },
      { key: 'maxCapacity', label: 'Capacidad máxima', placeholder: 'Ej: 4', numeric: true },
      { key: 'description', label: 'Descripción', placeholder: 'Ej: Automóvil de cuatro puertas con maletero' },
    ],
    newTitle: 'Nuevo tipo de vehículo',
    editTitle: (name) => `Editar tipo de vehículo: ${name}`,
    deleteTitle: 'Eliminar tipo de vehículo',
    toForm: (item) => {
      const vehicle = item as VehicleTypeItem | null;
      return {
        name: vehicle?.name ?? '',
        maxCapacity: vehicle ? String(vehicle.maxCapacity) : '',
        description: vehicle?.description ?? '',
      };
    },
    toInput: (values, active) => {
      const maxCapacity = toNumber(values.maxCapacity ?? '');
      if (!text(values.name) || maxCapacity === null) return null;
      return { name: text(values.name), maxCapacity, description: text(values.description), active };
    },
  },
  'rangos-edad': {
    tabLabel: 'Rangos\nde Edad',
    columns: [
      { label: 'RANGO DE EDAD', flex: 339, bold: true, value: (item) => item.name },
      { label: 'EDAD MÍNIMA', flex: 315, value: (item) => String((item as AgeRangeItem).minAge) },
      {
        label: 'EDAD MÁXIMA',
        flex: 315,
        value: (item) => {
          const { maxAge } = item as AgeRangeItem;
          return maxAge === null ? 'Sin límite' : String(maxAge);
        },
      },
    ],
    fields: [
      { key: 'name', label: 'Nombre del rango', placeholder: 'Ej: 18 a 24 años' },
      { key: 'minAge', label: 'Edad mínima', placeholder: 'Ej: 18', numeric: true, half: true },
      { key: 'maxAge', label: 'Edad máxima', placeholder: 'Ej: 24', numeric: true, half: true },
    ],
    newTitle: 'Nuevo rango de edad',
    editTitle: (name) => `Editar rango de edad: ${name}`,
    deleteTitle: 'Eliminar rango de edad',
    toForm: (item) => {
      const range = item as AgeRangeItem | null;
      return {
        name: range?.name ?? '',
        minAge: range ? String(range.minAge) : '',
        maxAge: range && range.maxAge !== null ? String(range.maxAge) : '',
      };
    },
    toInput: (values, active) => {
      const minAge = toNumber(values.minAge ?? '');
      if (!text(values.name) || minAge === null) return null;
      // Edad máxima vacía = "Sin límite".
      return { name: text(values.name), minAge, maxAge: toNumber(values.maxAge ?? ''), active };
    },
  },
  'opciones-genero': {
    tabLabel: 'Opciones\nde Género',
    columns: [{ label: 'OPCIÓN', flex: 969, bold: true, value: (item) => item.name }],
    fields: [{ key: 'name', label: 'Nombre de la opción', placeholder: 'Ej: No binario' }],
    newTitle: 'Nueva opción de género',
    editTitle: (name) => `Editar opción de género: ${name}`,
    deleteTitle: 'Eliminar opción de género',
    toForm: (item) => ({ name: item?.name ?? '' }),
    toInput: (values, active) => {
      if (!text(values.name)) return null;
      const input: Omit<GenderOptionItem, 'id'> = { name: text(values.name), active };
      return input;
    },
  },
  'reglas-tarifas': {
    tabLabel: 'Reglas y\nTarifas',
    columns: [
      { label: 'REGLA', flex: 339, bold: true, value: (item) => item.name },
      { label: 'VALOR', flex: 200, value: (item) => formatRuleValue(item as RuleItem) },
      { label: 'DESCRIPCIÓN', flex: 430, value: (item) => (item as RuleItem).description },
    ],
    fields: [
      { key: 'name', label: 'Nombre de la regla', placeholder: 'Ej: Aporte máximo por viaje' },
      { key: 'value', label: 'Valor', placeholder: 'Ej: 3000', numeric: true, half: true },
      { key: 'unit', label: 'Unidad', placeholder: 'Ej: minutos', half: true },
    ],
    newTitle: 'Nueva regla',
    editTitle: (name) => `Editar regla: ${name}`,
    deleteTitle: 'Eliminar regla',
    toForm: (item) => {
      const rule = item as RuleItem | null;
      return {
        name: rule?.name ?? '',
        value: rule ? String(rule.value) : '',
        unit: rule?.unit ?? '',
        description: rule?.description ?? '',
      };
    },
    toInput: (values, active) => {
      const value = toNumber(values.value ?? '');
      if (!text(values.name) || value === null || !text(values.unit)) return null;
      // El formulario no tiene campo "Descripción"; se conserva la existente al editar.
      return { name: text(values.name), value, unit: text(values.unit), description: text(values.description), active };
    },
  },
};

export { catalogLabels };
