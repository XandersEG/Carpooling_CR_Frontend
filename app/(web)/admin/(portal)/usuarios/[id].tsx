import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAdminHeader } from '@/components/web/PageHeader';
import { InitialsCircle, RoundButton } from '@/components/web/controls';
import { IconActivity, IconArrowLeft, IconCar, IconHome, IconPencil, IconUser } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { WebModal } from '@/components/web/WebModal';
import { deleteUser, getUserDetail, setUserAdmin } from '@/src/services/admin/userAdminService';
import type { AdminUserDetail } from '@/src/types/admin';
import { fonts, palette, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';
import { capitalize, formatTableDate, getInitials } from '@/src/utils/format';

type Tab = 'info' | 'actividad' | 'vehiculos';

const TABS: { key: Tab; label: string }[] = [
  { key: 'info', label: 'Información general' },
  { key: 'actividad', label: 'Actividad' },
  { key: 'vehiculos', label: 'Vehículos' },
];

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type FieldProps = { label: string; value: string; editing?: boolean; small?: boolean };

/** Dato con etiqueta y línea inferior (`small` = rejilla de 3 columnas). En modo edición muestra el lápiz (sin edición en línea diseñada). */
function Field({ label, value, editing = false, small = false }: FieldProps) {
  return (
    <View style={[styles.field, small ? styles.fieldThird : styles.fieldHalf]}>
      <Text style={[styles.fieldLabel, small && styles.fieldLabelSmall]}>{label}</Text>
      <View style={styles.fieldValueRow}>
        <Text style={[styles.fieldValue, small && styles.fieldValueSmall]}>{value}</Text>
        {editing ? <IconPencil color={palette.brownDark} /> : null}
      </View>
    </View>
  );
}

type PillButtonProps = { label: string; color: string; hoverColor: string; onPress: () => void; icon?: ReactNode; width: number };

function PillButton({ label, color, hoverColor, onPress, icon, width }: PillButtonProps) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      {...hoverProps}
      style={[styles.pillButton, { width, backgroundColor: hovered ? hoverColor : color }]}
    >
      {icon}
      <Text style={[styles.pillButtonText, { color: icon ? webColors.headerText : palette.white }]}>{label}</Text>
    </Pressable>
  );
}

/**
 * Detalle de usuario: Información general (259:1878), Actividad (259:2633),
 * Vehículos (366:3989), modo edición (2979:6043), confirmación de eliminación
 * (3013:10219) y variante administrador (3017:9251).
 */
export default function UserDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [missing, setMissing] = useState(false);
  const [tab, setTab] = useState<Tab>('info');
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  useAdminHeader({
    title: ['Gestión', 'Usuarios', 'Detalle'],
    subtitle:
      tab === 'actividad' && user ? `Uso del servicio · ${user.institutionName}` : 'Uso del servicio',
  });

  const load = useCallback(async () => {
    try {
      setUser(await getUserDetail(id));
    } catch {
      // Solo el usuario au-1 tiene datos de detalle en el diseño.
      setMissing(true);
    }
  }, [id]);

  useEffect(() => {
    setUser(null);
    setMissing(false);
    load();
  }, [load]);

  const toggleAdmin = async () => {
    if (!user) return;
    setBusy(true);
    try {
      setUser(await setUserAdmin(user.id, !user.isAdmin));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await deleteUser(user.id);
      setConfirmDelete(false);
      router.replace('/admin/usuarios');
    } finally {
      setBusy(false);
    }
  };

  const back = (
    <Pressable accessibilityRole="link" onPress={() => router.push('/admin/usuarios')} style={styles.back}>
      <IconArrowLeft color={palette.brownDark} />
      <Text style={styles.backText}>Volver a usuarios</Text>
    </Pressable>
  );

  if (missing) {
    return (
      <View style={styles.page}>
        {back}
        <Card style={styles.missing}>
          <Text style={styles.missingText}>No hay información de detalle para este usuario.</Text>
        </Card>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.page}>
        {back}
        <ActivityIndicator color={palette.lime} style={styles.loading} />
      </View>
    );
  }

  const vehicle = user.vehicles[0];

  return (
    <View style={styles.page}>
      {back}

      <Card style={styles.profileCard}>
        <InitialsCircle initials={getInitials(user.fullName)} size={125} fontSize={41} backgroundColor={palette.limeLight} />
        <View style={styles.profileTexts}>
          <Text style={styles.eyebrow}>DETALLE DEL USUARIO</Text>
          <Text style={styles.profileName}>
            {user.fullName}
            {user.isAdmin ? <Text style={styles.adminTag}> - Administrador</Text> : null}
          </Text>
        </View>
        {editing ? (
          <View style={styles.profileActions}>
            <PillButton
              label="Eliminar Usuario"
              color={palette.brownDark}
              hoverColor={palette.mauve}
              width={149}
              onPress={() => setConfirmDelete(true)}
            />
            <PillButton
              label={user.isAdmin ? 'Quitar Administrador' : 'Dar rango Administrador'}
              color={palette.terracotta}
              hoverColor={palette.terracottaMedium}
              width={149}
              onPress={busy ? () => undefined : toggleAdmin}
            />
          </View>
        ) : null}
      </Card>

      <Card style={styles.tabsCard}>
        {TABS.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === item.key }}
            onPress={() => setTab(item.key)}
          >
            <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>{item.label}</Text>
          </Pressable>
        ))}
      </Card>

      {tab === 'info' ? (
        <Card style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <IconUser color={palette.mauve} />
            <Text style={styles.sectionTitle}>Información personal</Text>
          </View>
          <View style={styles.grid}>
            <Field label="Nombre completo" value={user.fullName} editing={editing} />
            <Field label="Identificación académica" value={user.academicId} editing={editing} />
            <Field label="Correo electrónico" value={user.email} editing={editing} />
            <Field label="Teléfono" value={user.phone} editing={editing} />
          </View>
        </Card>
      ) : null}

      {tab === 'actividad' ? (
        <>
          <View style={styles.kpis}>
            <Kpi value={user.activity.completedTrips} label="Viajes completados" />
            <Kpi value={user.activity.asDriver} label="Como conductor" />
            <Kpi value={user.activity.asPassenger} label="Como pasajero" />
          </View>
          <Card style={styles.historyCard}>
            <View style={styles.sectionTitleRow}>
              <IconActivity color={palette.mauve} />
              <Text style={styles.sectionTitle}>Historial de viajes</Text>
            </View>
            <View style={styles.historyHeader}>
              <Text style={[styles.historyHead, styles.colDate]}>Fecha</Text>
              <Text style={[styles.historyHead, styles.colRoute]}>Ruta</Text>
              <Text style={[styles.historyHead, styles.colRole]}>Participación</Text>
              <Text style={[styles.historyHead, styles.colStatus]}>Estado</Text>
            </View>
            {user.activity.history.map((entry, index) => (
              <View key={entry.id} style={[styles.historyRow, index > 0 && styles.historyDivider]}>
                <Text style={[styles.historyCell, styles.colDate]}>{formatTableDate(`${entry.date}T12:00:00-06:00`)}</Text>
                <Text style={[styles.historyCell, styles.colRoute]}>{entry.route}</Text>
                <Text style={[styles.historyCell, styles.colRole]}>{capitalize(entry.role)}</Text>
                <View style={styles.colStatus}>
                  <View
                    style={[
                      styles.statusChip,
                      { backgroundColor: entry.status === 'completado' ? palette.limeLight : palette.terracottaLight },
                    ]}
                  >
                    <Text style={styles.statusChipText}>{capitalize(entry.status)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Card>
        </>
      ) : null}

      {tab === 'vehiculos' ? (
        <Card style={styles.sectionCard}>
          <View style={styles.sectionTitleRow}>
            <IconCar color={palette.mauve} />
            <Text style={[styles.sectionTitle, styles.flex]}>Vehículo registrado</Text>
            {vehicle?.active ? (
              <View style={styles.vehicleActive}>
                <Text style={styles.vehicleActiveText}>Activo</Text>
              </View>
            ) : null}
          </View>
          {vehicle ? (
            <View style={styles.grid}>
              <Field small label="Marca" value={vehicle.brand} />
              <Field small label="Modelo" value={vehicle.model} />
              <Field small label="Placa" value={vehicle.plate} />
              <Field small label="Año" value={vehicle.year ? String(vehicle.year) : '—'} />
              <Field small label="Color" value={vehicle.color} />
              <Field small label="Espacios para pasajeros" value={String(vehicle.capacity)} />
            </View>
          ) : (
            <Text style={styles.missingText}>Sin vehículos registrados.</Text>
          )}
        </Card>
      ) : null}

      <Card style={styles.institutionCard}>
        <IconHome color={palette.mauve} />
        <View style={styles.flex}>
          <Text style={styles.fieldLabel}>Institución</Text>
          <Text style={styles.institutionValue}>{user.institutionName}</Text>
        </View>
        <View style={styles.flex}>
          <Text style={styles.fieldLabel}>Estado de la cuenta</Text>
          <Text style={styles.institutionValue}>{user.active ? 'Activo' : 'Inactivo'}</Text>
        </View>
      </Card>

      <View style={styles.footer}>
        {editing ? (
          <PillButton
            label="Salir"
            color={palette.greyDark}
            hoverColor={palette.greyMedium}
            width={278}
            onPress={() => setEditing(false)}
          />
        ) : (
          <PillButton
            label="Editar usuario"
            color={palette.lime}
            hoverColor={palette.limeMedium}
            width={278}
            icon={<IconPencil color={palette.brownDark} />}
            onPress={() => {
              setTab('info');
              setEditing(true);
            }}
          />
        )}
      </View>

      <WebModal
        visible={confirmDelete}
        title="Atención"
        width={473}
        onClose={() => setConfirmDelete(false)}
        footer={
          <>
            <RoundButton label="Aceptar" disabled={busy} onPress={remove} style={styles.modalButton} />
            <RoundButton label="Cancelar" tone="cancel" onPress={() => setConfirmDelete(false)} style={styles.modalButton} />
          </>
        }
      >
        <Text style={styles.confirmText}>¿Está seguro que desea eliminar a este usuario?</Text>
      </WebModal>
    </View>
  );
}

function Kpi({ value, label }: { value: number; label: string }) {
  return (
    <View style={[styles.card, styles.kpi]}>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 11,
    paddingBottom: 38,
    paddingLeft: '6.6%',
    paddingRight: '7%',
    gap: 21,
  },
  flex: {
    flex: 1,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginLeft: -7,
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: fonts.cairoBold,
    fontSize: 13,
    color: webColors.headerText,
  },
  card: {
    backgroundColor: webColors.card,
    borderRadius: 16,
  },
  loading: {
    marginTop: 40,
  },
  missing: {
    padding: 40,
  },
  missingText: {
    fontFamily: fonts.cairoMedium,
    fontSize: 16,
    color: palette.mauve,
  },
  profileCard: {
    minHeight: 165,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 33,
    gap: 42,
  },
  profileTexts: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fonts.cairoBold,
    fontSize: 11,
    color: palette.mauve,
  },
  profileName: {
    fontFamily: fonts.cairoBold,
    fontSize: 26,
    color: webColors.headerText,
  },
  adminTag: {
    color: palette.terracotta,
  },
  profileActions: {
    flexDirection: 'row',
    gap: 24,
  },
  pillButton: {
    minHeight: 49,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 16,
  },
  pillButtonText: {
    fontFamily: fonts.cairoBold,
    fontSize: 13,
    textAlign: 'center',
  },
  tabsCard: {
    height: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 39,
    gap: 54,
  },
  tabText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 16,
    color: palette.mauve,
  },
  tabTextActive: {
    fontFamily: fonts.cairoBold,
    color: palette.nearBlack,
  },
  sectionCard: {
    paddingTop: 22,
    paddingBottom: 46,
    paddingHorizontal: 39,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  sectionTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 18,
    color: webColors.headerText,
  },
  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 65,
    rowGap: 34,
  },
  field: {
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: palette.greyLight,
    paddingBottom: 14,
  },
  // Información personal en 2 columnas; datos del vehículo en 3.
  fieldHalf: {
    flexBasis: '40%',
  },
  fieldThird: {
    flexBasis: '26%',
  },
  fieldLabel: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    color: palette.mauve,
  },
  fieldLabelSmall: {
    fontSize: 11,
  },
  fieldValueRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 27,
  },
  fieldValue: {
    fontFamily: fonts.cairoRegular,
    fontSize: 16,
    color: palette.nearBlack,
  },
  fieldValueSmall: {
    fontSize: 13,
  },
  kpis: {
    flexDirection: 'row',
    gap: 28,
  },
  kpi: {
    flex: 1,
    minHeight: 110,
    paddingHorizontal: 35,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  kpiValue: {
    fontFamily: fonts.cairoBold,
    fontSize: 40,
    lineHeight: 52,
    color: webColors.headerText,
  },
  kpiLabel: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    color: palette.mauve,
  },
  historyCard: {
    paddingTop: 22,
    paddingBottom: 12,
    paddingHorizontal: 37,
  },
  historyHeader: {
    marginTop: 12,
    height: 37,
    backgroundColor: webExtra.tableHeader,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
  },
  historyHead: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 12,
    color: webColors.headerText,
  },
  historyRow: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 19,
  },
  historyDivider: {
    borderTopWidth: 1,
    borderTopColor: palette.greyLight,
  },
  historyCell: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    color: webColors.headerText,
  },
  colDate: {
    flex: 173,
  },
  colRoute: {
    flex: 579,
  },
  colRole: {
    flex: 290,
  },
  colStatus: {
    flex: 207,
  },
  statusChip: {
    width: 189,
    maxWidth: '100%',
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusChipText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 12,
    color: webColors.headerText,
  },
  vehicleActive: {
    width: 129,
    height: 25,
    borderRadius: 13,
    backgroundColor: palette.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleActiveText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 12,
    color: webColors.headerText,
  },
  institutionCard: {
    minHeight: 119,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 44,
    gap: 25,
  },
  institutionValue: {
    marginTop: 10,
    fontFamily: fonts.cairoBold,
    fontSize: 16,
    color: palette.nearBlack,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  modalButton: {
    minWidth: 105,
  },
  confirmText: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 18,
    color: palette.nearBlack,
  },
});
