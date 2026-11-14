import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconSliders } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { fonts, palette, webColors } from '@/src/constants/theme';

type WebModalProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  /** Ícono del encabezado (por defecto `Sliders` lima). */
  icon?: ReactNode;
  children: ReactNode;
  /** Botones alineados a la derecha al pie del modal. */
  footer?: ReactNode;
  width?: number;
};

const MODAL_WIDTH = 574;
/** Radio de las esquinas del modal (Rectangle 21, 47 px). */
const MODAL_RADIUS = 47;

/**
 * Modal con encabezado oscuro (Parámetros, Instituciones, Usuarios): barra café
 * de 81 px con ícono lima y título blanco, cuerpo blanco y botones al pie.
 */
export function WebModal({ visible, title, onClose, icon, children, footer, width = MODAL_WIDTH }: WebModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.scrim}>
        <Pressable accessibilityLabel="Cerrar" style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.card, { width }]} accessibilityViewIsModal>
          <View style={styles.header}>
            <View style={styles.headerIcon}>{icon ?? <IconSliders color={palette.lime} />}</View>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
            {children}
            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: webExtra.scrim,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    maxHeight: '100%',
    backgroundColor: palette.white,
    borderRadius: MODAL_RADIUS,
    overflow: 'hidden',
  },
  header: {
    height: 81,
    backgroundColor: webColors.modalHeader,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 28,
    paddingRight: 32,
    gap: 9,
  },
  headerIcon: {
    width: 29,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontFamily: fonts.cairoBold,
    fontSize: 20,
    color: webColors.sidebarText,
  },
  scroll: {
    flexGrow: 0,
  },
  body: {
    paddingTop: 34,
    paddingHorizontal: 30,
    paddingBottom: 43,
    gap: 9,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 18,
    marginTop: 28,
  },
});
