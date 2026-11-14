import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAdminHeader } from '@/components/web/PageHeader';
import { SelectField, StatusPill } from '@/components/web/controls';
import { IconPenSquare, IconPlusCircle, IconSearch, IconTrash, IconWallet } from '@/components/web/icons';
import { CatalogDeleteModal, CatalogFormModal } from '@/components/web/parametros/CatalogModals';
import {
  CATALOG_KEYS,
  catalogConfigs,
  catalogLabels,
  isCatalogKey,
} from '@/components/web/parametros/catalogConfig';
import { PillToast, useAutoDismiss } from '@/components/web/Toast';
import { webExtra } from '@/components/web/tokens';
import {
  createCatalogItem,
  deleteCatalogItem,
  getCatalogCounts,
  listCatalog,
  updateCatalogItem,
} from '@/src/services/admin/catalogService';
import type { CatalogItem, CatalogItemInput, CatalogKey } from '@/src/types/admin';
import { fonts, palette, radius, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

const STATE_OPTIONS = ['Todos los estados', 'Activo', 'Inactivo'];

/** Botón "Nuevo Parámetro" del encabezado (271:1483). */
function NewParameterButton({ onPress }: { onPress: () => void }) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      {...hoverProps}
      style={[styles.newButton, hovered && { backgroundColor: palette.limeMedium }]}
    >
      <IconPlusCircle color={palette.nearBlack} />
      <Text style={styles.newButtonText}>Nuevo Parámetro</Text>
    </Pressable>
  );
}

type CatalogTabProps = {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
};

/** Pestaña de catálogo con contador (componente `Button` 271:457). */
function CatalogTab({ label, count, active, onPress }: CatalogTabProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
    >
      <IconWallet color={active ? palette.black : palette.greyMedium} />
      <Text style={[styles.tabLabel, { color: active ? palette.nearBlack : webExtra.textMuted }]}>{label}</Text>
      <View style={[styles.tabCount, { backgroundColor: active ? palette.nearBlack : webExtra.textMuted }]}>
        <Text style={styles.tabCountText}>{count ?? '–'}</Text>
      </View>
    </Pressable>
  );
}

/** Gestión de Parámetros: una pantalla configurable para los 5 catálogos. */
export default function ParametersScreen() {
  const { catalogo } = useLocalSearchParams<{ catalogo: string }>();
  const router = useRouter();
  const catalog: CatalogKey = isCatalogKey(catalogo) ? catalogo : 'metodos-pago';
  const config = catalogConfigs[catalog];

  const [items, setItems] = useState<CatalogItem[] | null>(null);
  const [counts, setCounts] = useState<Partial<Record<CatalogKey, number>>>({});
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState(STATE_OPTIONS[0]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [deleting, setDeleting] = useState<CatalogItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const hideToast = useCallback(() => setToast(null), []);
  useAutoDismiss(toast !== null, hideToast);

  const load = useCallback(async (key: CatalogKey) => {
    const [list, catalogCounts] = await Promise.all([listCatalog(key), getCatalogCounts()]);
    setItems(list as CatalogItem[]);
    setCounts(catalogCounts);
  }, []);

  useEffect(() => {
    setItems(null);
    setSearch('');
    setStateFilter(STATE_OPTIONS[0]);
    load(catalog);
  }, [catalog, load]);

  const openNew = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const headerActions = useMemo(() => <NewParameterButton onPress={openNew} />, [openNew]);
  useAdminHeader({
    title: 'Gestión de Parámetros',
    subtitle: 'Administra los catálogos de opciones que se muestran en la app móvil y el portal web.',
    actions: headerActions,
  });

  const visibleItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (items ?? []).filter((item) => {
      if (stateFilter === 'Activo' && !item.active) return false;
      if (stateFilter === 'Inactivo' && item.active) return false;
      if (!term) return true;
      return config.columns.some((column) => column.value(item).toLowerCase().includes(term));
    });
  }, [items, search, stateFilter, config]);

  if (!isCatalogKey(catalogo)) {
    return <Redirect href="/admin/parametros/metodos-pago" />;
  }

  const submitForm = async (target: CatalogKey, input: CatalogItemInput<CatalogKey>) => {
    setBusy(true);
    try {
      if (editing) await updateCatalogItem(target, editing.id, input);
      else await createCatalogItem(target, input);
      setFormOpen(false);
      if (target !== catalog) router.push(`/admin/parametros/${target}`);
      else await load(catalog);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    try {
      await deleteCatalogItem(catalog, deleting.id);
      setToast(`«${deleting.name}» se eliminó correctamente`);
      setDeleting(null);
      await load(catalog);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.page}>
      <View style={[styles.card, styles.selectorCard]}>
        <View style={styles.tabs}>
          {CATALOG_KEYS.map((key) => (
            <CatalogTab
              key={key}
              label={catalogConfigs[key].tabLabel}
              count={counts[key]}
              active={key === catalog}
              onPress={() => router.push(`/admin/parametros/${key}`)}
            />
          ))}
        </View>
        <View style={styles.search}>
          <IconSearch color={webExtra.border} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar parámetro..."
            placeholderTextColor={webExtra.border}
            accessibilityLabel="Buscar parámetro"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={[styles.card, styles.tableCard]}>
        <View style={styles.tableTitleRow}>
          <View style={styles.titleDot} />
          <Text style={styles.tableTitle}>Catálogo de {catalogLabels[catalog]}</Text>
          <SelectField
            variant="pill"
            value={stateFilter}
            options={STATE_OPTIONS}
            onChange={setStateFilter}
            width={248}
            accessibilityLabel="Filtrar por estado"
          />
        </View>

        <View style={styles.headerRow}>
          {config.columns.map((column) => (
            <Text key={column.label} style={[styles.headerText, { flex: column.flex }]}>
              {column.label}
            </Text>
          ))}
          <Text style={[styles.headerText, styles.stateColumn, styles.centered]}>ESTADO</Text>
          <Text style={[styles.headerText, styles.actionsColumn, styles.centered]}>ACCIONES</Text>
        </View>

        {items === null ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : (
          visibleItems.map((item) => (
            <View key={item.id} style={styles.row}>
              {config.columns.map((column) => (
                <Text
                  key={column.label}
                  style={[styles.cellText, column.bold && styles.cellBold, { flex: column.flex }]}
                  numberOfLines={2}
                >
                  {column.value(item)}
                </Text>
              ))}
              <View style={[styles.stateColumn, styles.centeredCell]}>
                <StatusPill active={item.active} />
              </View>
              <View style={[styles.actionsColumn, styles.actions]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Editar ${item.name}`}
                  onPress={() => {
                    setEditing(item);
                    setFormOpen(true);
                  }}
                >
                  <IconPenSquare color={palette.black} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Eliminar ${item.name}`}
                  onPress={() => setDeleting(item)}
                >
                  <IconTrash color={palette.black} />
                </Pressable>
              </View>
            </View>
          ))
        )}

        <View style={styles.toastSlot} pointerEvents="none">
          <PillToast visible={toast !== null} message={toast ?? ''} />
        </View>
      </View>

      <CatalogFormModal
        visible={formOpen}
        catalog={catalog}
        item={editing}
        saving={busy}
        onCancel={() => setFormOpen(false)}
        onSubmit={submitForm}
      />
      <CatalogDeleteModal
        visible={deleting !== null}
        catalog={catalog}
        item={deleting}
        deleting={busy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: '7.5%',
    gap: 17,
  },
  card: {
    backgroundColor: webColors.card,
    borderRadius: radius.webCard,
  },
  selectorCard: {
    minHeight: 155,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingLeft: 39,
    paddingRight: 17,
    paddingVertical: 20,
    gap: 13,
    zIndex: 1,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
  },
  tab: {
    height: 79,
    borderRadius: 166,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 14,
    gap: 6,
  },
  tabActive: {
    backgroundColor: palette.lime,
  },
  tabInactive: {
    backgroundColor: palette.greyLight,
  },
  tabLabel: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 20,
    lineHeight: 25,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  tabCount: {
    minWidth: 30,
    height: 23,
    borderRadius: 166,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabCountText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 18,
    lineHeight: 22,
    color: palette.white,
  },
  search: {
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 200,
    maxWidth: 248,
    height: 41,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: webExtra.border,
    backgroundColor: webExtra.fieldBackground,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    gap: 14,
  },
  searchInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: fonts.cairoMedium,
    fontSize: 20,
    color: webExtra.fieldText,
  },
  tableCard: {
    minHeight: 702,
    paddingBottom: 90,
  },
  tableTitleRow: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 39,
    paddingRight: 30,
    zIndex: 2,
  },
  titleDot: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: palette.lime,
  },
  tableTitle: {
    flex: 1,
    marginLeft: 23,
    fontFamily: fonts.cairoBold,
    fontSize: 20,
    color: webColors.headerText,
  },
  headerRow: {
    height: 92,
    backgroundColor: webExtra.tableHeader,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 39,
    paddingRight: 39,
  },
  headerText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  centered: {
    textAlign: 'center',
  },
  stateColumn: {
    width: 160,
  },
  actionsColumn: {
    width: 125,
  },
  row: {
    minHeight: 93,
    borderTopWidth: 1,
    borderTopColor: webExtra.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 39,
    paddingRight: 39,
  },
  cellText: {
    fontFamily: fonts.cairoMedium,
    fontSize: 16,
    color: palette.nearBlack,
    paddingRight: 16,
  },
  cellBold: {
    fontFamily: fonts.cairoBold,
  },
  centeredCell: {
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loading: {
    marginTop: 40,
  },
  toastSlot: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 22,
    alignItems: 'center',
  },
  newButton: {
    width: 248,
    height: 79,
    borderRadius: 166,
    backgroundColor: palette.lime,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 25,
    gap: 10,
  },
  newButtonText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 20,
    color: palette.nearBlack,
  },
});
