import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAdminHeader } from '@/components/web/PageHeader';
import { CheckedBox, ModalField, RoundButton } from '@/components/web/controls';
import { IconPlusCircleSmall } from '@/components/web/icons';
import { DarkToast, DarkToastText, darkToastStyles } from '@/components/web/Toast';
import { webExtra } from '@/components/web/tokens';
import { WebModal } from '@/components/web/WebModal';
import {
  createInstitution,
  listInstitutions,
  sendValidationEmail,
  setInstitutionActive,
  updateInstitution,
} from '@/src/services/admin/institutionService';
import type { Institution } from '@/src/types/admin';
import { fonts, palette, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

type ActionTone = 'primary' | 'secondary' | 'tertiary' | 'resend';

const actionColors: Record<ActionTone, { background: string; hover: string }> = {
  primary: { background: palette.lime, hover: palette.limeMedium },
  secondary: { background: palette.terracotta, hover: palette.terracottaMedium },
  tertiary: { background: palette.brownDark, hover: palette.mauve },
  resend: { background: palette.mauve, hover: palette.mauveLight },
};

type RowActionProps = {
  label: string;
  tone: ActionTone;
  width: number;
  onPress: () => void;
};

/** Botones de fila (Primario / Secundario / Terciario, 37 px, Cairo Black 20). */
function RowAction({ label, tone, width, onPress }: RowActionProps) {
  const { hovered, hoverProps } = useHover();
  const colors = actionColors[tone];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      {...hoverProps}
      style={[styles.rowAction, { width, backgroundColor: hovered ? colors.hover : colors.background }]}
    >
      <Text style={styles.rowActionText}>{label}</Text>
    </Pressable>
  );
}

type FormState = { mode: 'add' | 'edit'; institution: Institution | null; name: string; email: string };

/**
 * Gestión > Instituciones (270:36) con sus estados: desactivar (270:2476),
 * aviso de validación (270:1922), editar (270:2074) y agregar (270:2793).
 */
export default function InstitutionsScreen() {
  const [institutions, setInstitutions] = useState<Institution[] | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useAdminHeader({
    title: ['Gestión', 'Instituciones'],
    subtitle: 'Configuración de instituciones afiliadas al servicio.',
  });

  const load = useCallback(async () => {
    setInstitutions(await listInstitutions());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleActive = async (institution: Institution) => {
    await setInstitutionActive(institution.id, !institution.active);
    await load();
  };

  const sendValidation = async (institution: Institution) => {
    await sendValidationEmail(institution.id);
    setNotice(institution.email);
    await load();
  };

  const saveForm = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const input = { name: form.name.trim(), email: form.email.trim() };
      if (form.mode === 'edit' && form.institution) await updateInstitution(form.institution.id, input);
      else await createInstitution(input);
      setForm(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const canSave = Boolean(form && form.name.trim() && form.email.trim());

  return (
    <View style={styles.page}>
      <View style={styles.headerCard}>
        <Text style={[styles.headerText, styles.nameColumn]}>Nombre Institución</Text>
        <View style={styles.divider} />
        <Text style={[styles.headerText, styles.emailColumn]}>Correo Institución</Text>
        <View style={styles.divider} />
        <Text style={[styles.headerText, styles.validationColumn]}>Validación</Text>
        <View style={styles.divider} />
        <View style={styles.actionsColumn}>
          <AddButton onPress={() => setForm({ mode: 'add', institution: null, name: '', email: '' })} />
        </View>
      </View>

      <View style={styles.tableCard}>
        {institutions === null ? (
          <ActivityIndicator color={palette.lime} style={styles.loading} />
        ) : (
          institutions.map((institution, index) => (
            <View
              key={institution.id}
              style={[
                styles.row,
                index % 2 === 1 && styles.rowStripe,
                !institution.active && styles.rowInactive,
              ]}
            >
              <Text style={[styles.cellText, styles.nameColumn]} numberOfLines={2}>
                {institution.name}
              </Text>
              <Text style={[styles.cellText, styles.emailColumn]} numberOfLines={1}>
                {institution.email}
              </Text>
              <View style={[styles.validationColumn, styles.centered]}>
                {!institution.active ? (
                  <Text style={styles.cellText}>N/A</Text>
                ) : institution.validationStatus === 'validada' ? (
                  <CheckedBox />
                ) : institution.validationStatus === 'pendiente' ? (
                  <RowAction label="Reenviar" tone="resend" width={114} onPress={() => sendValidation(institution)} />
                ) : (
                  <RowAction label="Validar" tone="tertiary" width={114} onPress={() => sendValidation(institution)} />
                )}
              </View>
              <View style={[styles.actionsColumn, styles.rowActions]}>
                <RowAction
                  label="Editar"
                  tone={institution.active ? 'primary' : 'tertiary'}
                  width={111}
                  onPress={() =>
                    setForm({ mode: 'edit', institution, name: institution.name, email: institution.email })
                  }
                />
                <RowAction
                  label={institution.active ? 'Desactivar' : 'Activar'}
                  tone={institution.active ? 'secondary' : 'primary'}
                  width={120}
                  onPress={() => toggleActive(institution)}
                />
              </View>
            </View>
          ))
        )}
      </View>

      <WebModal
        visible={form !== null}
        title={form?.mode === 'edit' ? 'Editar' : 'Agregar Institución'}
        onClose={() => setForm(null)}
        footer={
          <>
            <RoundButton label="Cancelar" tone="cancel" onPress={() => setForm(null)} />
            <RoundButton
              label={form?.mode === 'edit' ? 'Guardar' : 'Agregar'}
              disabled={!canSave || saving}
              onPress={saveForm}
            />
          </>
        }
      >
        <ModalField
          label="Nombre"
          value={form?.name ?? ''}
          onChangeText={(name) => setForm((current) => (current ? { ...current, name } : current))}
        />
        <ModalField
          label="Correo electrónico"
          value={form?.email ?? ''}
          onChangeText={(email) => setForm((current) => (current ? { ...current, email } : current))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </WebModal>

      <DarkToast visible={notice !== null} onClose={() => setNotice(null)}>
        <DarkToastText>
          Correo de validación enviado,
          <Text style={darkToastStyles.regular}> esperando confirmación de </Text>
          {notice}
        </DarkToastText>
      </DarkToast>
    </View>
  );
}

/** "Agregar Institución" (2920:6660): botón oscuro con ícono de suma. */
function AddButton({ onPress }: { onPress: () => void }) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      {...hoverProps}
      style={[styles.addButton, hovered && { backgroundColor: palette.mauve }]}
    >
      <IconPlusCircleSmall color={palette.greyLight} />
      <Text style={styles.addButtonText}>Agregar Institución</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    paddingTop: 22,
    paddingBottom: 47,
    paddingLeft: '4.2%',
    paddingRight: '3.7%',
  },
  headerCard: {
    minHeight: 77,
    borderRadius: 16,
    backgroundColor: webColors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
    paddingRight: 28,
  },
  headerText: {
    fontFamily: fonts.cairoBold,
    fontSize: 20,
    color: palette.black,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 60,
    backgroundColor: palette.black,
  },
  nameColumn: {
    flex: 397,
    paddingHorizontal: 8,
  },
  emailColumn: {
    flex: 485,
    paddingHorizontal: 8,
  },
  validationColumn: {
    flex: 211,
  },
  actionsColumn: {
    flex: 337,
    alignItems: 'center',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 240,
    height: 45,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: palette.black,
    backgroundColor: palette.brownDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addButtonText: {
    fontFamily: fonts.cairoBlack,
    fontSize: 18,
    color: palette.greyLight,
  },
  tableCard: {
    flexGrow: 1,
    minHeight: 787,
    marginTop: 21,
    borderRadius: 16,
    backgroundColor: webColors.card,
    overflow: 'hidden',
  },
  loading: {
    marginTop: 40,
  },
  row: {
    minHeight: 73,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
    paddingRight: 28,
  },
  rowStripe: {
    backgroundColor: webExtra.rowStripe,
  },
  rowInactive: {
    backgroundColor: webColors.highlightRow,
  },
  cellText: {
    fontFamily: fonts.cairoMedium,
    fontSize: 20,
    color: palette.black,
  },
  rowActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  rowAction: {
    height: 37,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowActionText: {
    fontFamily: fonts.cairoBlack,
    fontSize: 20,
    color: palette.greyLight,
  },
});
