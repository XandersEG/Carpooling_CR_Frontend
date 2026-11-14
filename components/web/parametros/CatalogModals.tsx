import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ModalField, ModalLabel, RoundButton, SelectField, WebSwitch } from '@/components/web/controls';
import { IconTrash } from '@/components/web/icons';
import {
  CATALOG_KEYS,
  catalogConfigs,
  catalogLabels,
  type CatalogFormValues,
} from '@/components/web/parametros/catalogConfig';
import { webExtra } from '@/components/web/tokens';
import { WebModal } from '@/components/web/WebModal';
import type { CatalogItem, CatalogItemInput, CatalogKey } from '@/src/types/admin';
import { fonts, palette, webColors } from '@/src/constants/theme';

type CatalogFormModalProps = {
  visible: boolean;
  catalog: CatalogKey;
  /** `null` = NUEVO; con elemento = EDITAR. */
  item: CatalogItem | null;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (catalog: CatalogKey, input: CatalogItemInput<CatalogKey>) => void;
};

/**
 * Modales NUEVO / EDITAR de Parámetros (p. ej. 271:3127 / 271:2023): select
 * "Catálogo", campos propios de cada catálogo y fila "Estado" con interruptor.
 * Al crear, el select permite cambiar de catálogo; al editar queda fijo.
 */
export function CatalogFormModal({ visible, catalog, item, saving = false, onCancel, onSubmit }: CatalogFormModalProps) {
  const [target, setTarget] = useState<CatalogKey>(catalog);
  const [values, setValues] = useState<CatalogFormValues>({});
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!visible) return;
    setTarget(catalog);
    setValues(catalogConfigs[catalog].toForm(item));
    setActive(item?.active ?? true);
  }, [visible, catalog, item]);

  const config = catalogConfigs[target];
  const input = config.toInput(values, active);
  const editing = item !== null;

  const changeCatalog = (label: string) => {
    const key = CATALOG_KEYS.find((candidate) => catalogLabels[candidate] === label);
    if (!key) return;
    setTarget(key);
    setValues(catalogConfigs[key].toForm(null));
  };

  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));

  // Los campos a media columna se agrupan de dos en dos.
  const rows: (typeof config.fields)[] = [];
  config.fields.forEach((field) => {
    const last = rows[rows.length - 1];
    if (field.half && last && last.length === 1 && last[0].half) last.push(field);
    else rows.push([field]);
  });

  return (
    <WebModal
      visible={visible}
      title={editing ? config.editTitle(item.name) : config.newTitle}
      onClose={onCancel}
      footer={
        <>
          <RoundButton label="Cancelar" tone="cancel" onPress={onCancel} />
          <RoundButton
            label={editing ? 'Guardar cambios' : 'Agregar'}
            disabled={!input || saving}
            onPress={() => input && onSubmit(target, input)}
          />
        </>
      }
    >
      <View style={styles.field}>
        <ModalLabel>Catálogo</ModalLabel>
        <SelectField
          variant="modal"
          value={catalogLabels[target]}
          options={CATALOG_KEYS.map((key) => catalogLabels[key])}
          onChange={changeCatalog}
          disabled={editing}
          accessibilityLabel="Catálogo"
        />
      </View>
      {rows.map((row) => (
        <View key={row.map((field) => field.key).join('-')} style={styles.row}>
          {row.map((field) => (
            <ModalField
              key={field.key}
              label={field.label}
              placeholder={field.placeholder}
              value={values[field.key] ?? ''}
              onChangeText={(text) => setValue(field.key, text)}
              keyboardType={field.numeric ? 'numeric' : 'default'}
              style={styles.rowField}
            />
          ))}
        </View>
      ))}
      <View style={styles.stateBox}>
        <View style={styles.stateTexts}>
          <Text style={styles.stateTitle}>Estado</Text>
          <Text style={styles.stateHelp}>Si está inactivo, no aparecerá como opción en la app ni en el portal.</Text>
        </View>
        <WebSwitch value={active} onValueChange={setActive} accessibilityLabel="Estado activo" />
      </View>
    </WebModal>
  );
}

type CatalogDeleteModalProps = {
  visible: boolean;
  catalog: CatalogKey;
  item: CatalogItem | null;
  deleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Confirmación ELIMINAR (p. ej. 2950:10658). */
export function CatalogDeleteModal({ visible, catalog, item, deleting = false, onCancel, onConfirm }: CatalogDeleteModalProps) {
  return (
    <WebModal
      visible={visible}
      title={catalogConfigs[catalog].deleteTitle}
      icon={<IconTrash width={30} height={30} color={palette.lime} />}
      onClose={onCancel}
      footer={
        <>
          <RoundButton label="Cancelar" tone="cancel" onPress={onCancel} />
          <RoundButton label="Eliminar" tone="danger" disabled={deleting} onPress={onConfirm} />
        </>
      }
    >
      <Text style={styles.deleteQuestion}>
        ¿Seguro que deseas eliminar «{item?.name ?? ''}» del catálogo de {catalogLabels[catalog]}?
      </Text>
      <Text style={styles.deleteHelp}>
        Esta acción no se puede deshacer. Si solo quieres ocultarlo, puedes desactivarlo desde Editar.
      </Text>
    </WebModal>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 52,
  },
  rowField: {
    flex: 1,
  },
  stateBox: {
    marginTop: 32,
    minHeight: 74,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.limeMedium,
    backgroundColor: palette.limeLight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 17,
    paddingRight: 39,
    paddingVertical: 8,
    gap: 16,
  },
  stateTexts: {
    flex: 1,
  },
  stateTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  stateHelp: {
    fontFamily: fonts.cairoMedium,
    fontSize: 13,
    color: webExtra.fieldText,
  },
  deleteQuestion: {
    fontFamily: fonts.cairoBold,
    fontSize: 17,
    lineHeight: 34,
    color: palette.nearBlack,
  },
  deleteHelp: {
    fontFamily: fonts.cairoMedium,
    fontSize: 13,
    lineHeight: 28,
    color: webExtra.fieldText,
  },
});
