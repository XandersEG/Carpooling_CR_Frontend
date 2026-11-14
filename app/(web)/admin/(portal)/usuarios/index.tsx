import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAdminHeader } from '@/components/web/PageHeader';
import { SelectField } from '@/components/web/controls';
import { IconSearch } from '@/components/web/icons';
import { listInstitutions } from '@/src/services/admin/institutionService';
import { listUsers, setUserActive } from '@/src/services/admin/userAdminService';
import type { AdminUserSummary } from '@/src/types/admin';
import { fonts, palette, radius, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

const ALL_INSTITUTIONS = 'Todas las instituciones';
/** Filas por página: el diseño muestra 18 usuarios por tabla. */
const PAGE_SIZE = 18;

type PillProps = {
  label: string;
  color: string;
  hoverColor: string;
  onPress: () => void;
  accessibilityLabel: string;
};

/** Pastillas "Ver detalle" / "Activo" / "Inactivo" (124 × 27, Cairo Black 14). */
function TablePill({ label, color, hoverColor, onPress, accessibilityLabel }: PillProps) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      {...hoverProps}
      style={[styles.pill, { backgroundColor: hovered ? hoverColor : color }]}
    >
      <Text style={styles.pillText}>{label}</Text>
    </Pressable>
  );
}

/** Gestión > Usuarios: tabla (259:13) con activar/desactivar (259:1459). */
export default function UsersScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserSummary[] | null>(null);
  const [institutionOptions, setInstitutionOptions] = useState<string[]>([ALL_INSTITUTIONS]);
  // El resumen de usuarios no incluye la institución: el filtro solo es visual por ahora.
  const [institution, setInstitution] = useState(ALL_INSTITUTIONS);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  useAdminHeader({ title: ['Gestión', 'Usuarios'], subtitle: 'Uso del servicio' });

  const load = useCallback(async () => {
    setUsers(await listUsers());
  }, []);

  useEffect(() => {
    load();
    listInstitutions().then((list) => setInstitutionOptions([ALL_INSTITUTIONS, ...list.map((item) => item.name)]));
  }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (users ?? []).filter((user) => !term || user.fullName.toLowerCase().includes(term));
  }, [users, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const toggle = async (user: AdminUserSummary) => {
    await setUserActive(user.id, !user.active);
    await load();
  };

  return (
    <View style={styles.page}>
      <View style={styles.column}>
        <View style={styles.search}>
          <IconSearch color={palette.greyMedium} />
          <TextInput
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setPage(0);
            }}
            placeholder="Buscar"
            placeholderTextColor={palette.greyMedium}
            accessibilityLabel="Buscar usuario"
            style={styles.searchInput}
          />
        </View>
        <SelectField
          value={institution}
          options={institutionOptions}
          onChange={setInstitution}
          width={287}
          accessibilityLabel="Institución"
          style={styles.filter}
        />

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerText, styles.nameCell]}>Nombre</Text>
            <Text style={[styles.headerText, styles.actionCell]}>Detalle</Text>
            <Text style={[styles.headerText, styles.stateCell]}>Estado</Text>
          </View>
          {users === null ? (
            <ActivityIndicator color={palette.lime} style={styles.loading} />
          ) : (
            rows.map((user) => (
              <View key={user.id} style={styles.row}>
                <Text style={[styles.cellText, styles.nameCell]} numberOfLines={1}>
                  {user.fullName}
                </Text>
                <View style={styles.actionCell}>
                  <TablePill
                    label="Ver detalle"
                    color={palette.mauveLight}
                    hoverColor={palette.grey}
                    accessibilityLabel={`Ver detalle de ${user.fullName}`}
                    onPress={() => router.push(`/admin/usuarios/${user.id}`)}
                  />
                </View>
                <View style={styles.stateCell}>
                  <TablePill
                    label={user.active ? 'Activo' : 'Inactivo'}
                    color={user.active ? palette.lime : palette.terracotta}
                    hoverColor={user.active ? palette.limeMedium : palette.terracottaMedium}
                    accessibilityLabel={`${user.active ? 'Desactivar' : 'Activar'} a ${user.fullName}`}
                    onPress={() => toggle(user)}
                  />
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.pager}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Página anterior"
            disabled={currentPage === 0}
            onPress={() => setPage(currentPage - 1)}
            style={styles.pagerButton}
          >
            <Text style={styles.pagerText}>{'<'}</Text>
          </Pressable>
          <View style={styles.pagerDivider} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Página siguiente"
            disabled={currentPage >= pageCount - 1}
            onPress={() => setPage(currentPage + 1)}
            style={styles.pagerButton}
          >
            <Text style={styles.pagerText}>{'>'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 21,
    paddingBottom: 37,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: 1037,
  },
  search: {
    height: 40,
    borderRadius: radius.webControl,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 29,
    gap: 21,
  },
  searchInput: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: fonts.cairoBlack,
    fontSize: 20,
    color: webColors.headerText,
  },
  filter: {
    marginTop: 5,
    marginLeft: 2,
    alignSelf: 'flex-start',
    zIndex: 5,
  },
  table: {
    marginTop: 5,
    backgroundColor: palette.white,
    borderBottomWidth: 1,
    borderBottomColor: palette.black,
  },
  row: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: palette.black,
  },
  headerRow: {
    height: 41,
    borderTopWidth: 0,
  },
  headerText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  nameCell: {
    flex: 642,
    paddingLeft: 17,
  },
  actionCell: {
    flex: 195,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderLeftWidth: 1,
    borderLeftColor: palette.black,
  },
  stateCell: {
    flex: 200,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderLeftWidth: 1,
    borderLeftColor: palette.black,
  },
  cellText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  pill: {
    width: 124,
    height: 27,
    borderRadius: radius.webControl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontFamily: fonts.cairoBlack,
    fontSize: 14,
    color: palette.greyDark,
  },
  loading: {
    marginVertical: 40,
  },
  pager: {
    alignSelf: 'flex-end',
    marginTop: 5,
    width: 201,
    height: 35,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pagerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  pagerDivider: {
    width: 1,
    height: '100%',
    backgroundColor: palette.black,
  },
  pagerText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 36,
    lineHeight: 40,
    color: palette.black,
    marginTop: -14,
  },
});
