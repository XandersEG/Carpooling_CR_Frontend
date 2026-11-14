import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAdminHeaderState } from '@/components/web/PageHeader';
import { IconBell, IconBellHover } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { InitialsCircle } from '@/components/web/controls';
import { fonts, layout, palette, webColors } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';
import { getInitials } from '@/src/utils/format';

/** Componente `Bell` (280:96). Solo tiene estado hover: no hay panel de notificaciones diseñado. */
function BellButton() {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Notificaciones" {...hoverProps} style={styles.bell}>
      {hovered ? <IconBellHover /> : <IconBell />}
    </Pressable>
  );
}

type UserChipProps = {
  name: string;
  role: string;
};

/** Componente `Usuario` (280:374). Solo tiene estado hover: no hay menú diseñado. */
function UserChip({ name, role }: UserChipProps) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityLabel={`${name}, ${role}`}
      {...hoverProps}
      style={[styles.userChip, hovered && { backgroundColor: webExtra.userChipHover }]}
    >
      <InitialsCircle initials={getInitials(name)} size={51} fontSize={25} backgroundColor={palette.terracottaLight} />
      <View>
        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userRole}>{role}</Text>
      </View>
    </Pressable>
  );
}

type AdminHeaderProps = {
  userName: string;
  userRole: string;
};

/** Barra superior blanca (126 px): título o migas de pan, subtítulo, acciones, campana y usuario. */
export function AdminHeader({ userName, userRole }: AdminHeaderProps) {
  const { title, subtitle, actions } = useAdminHeaderState();
  const segments = Array.isArray(title) ? title : [title];

  return (
    <View style={styles.header}>
      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {segments.map((segment, index) => {
            const last = index === segments.length - 1;
            return (
              <Text key={`${segment}-${index}`} style={last && segments.length > 1 ? styles.titleLast : null}>
                {segment}
                {last ? '' : ' > '}
              </Text>
            );
          })}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
      <BellButton />
      <UserChip name={userName} role={userRole} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: layout.webHeaderHeight,
    backgroundColor: webColors.header,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 54,
    paddingRight: 29,
  },
  titles: {
    flex: 1,
    alignSelf: 'stretch',
    paddingTop: 22,
  },
  title: {
    fontFamily: fonts.cairoBold,
    fontSize: 32,
    color: webColors.headerText,
  },
  titleLast: {
    fontFamily: fonts.cairoBlack,
  },
  subtitle: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
    marginTop: -6,
  },
  actions: {
    marginRight: 26,
  },
  bell: {
    width: 46,
    height: 44,
    marginRight: 18,
  },
  userChip: {
    width: 176,
    height: 71,
    borderRadius: 9,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    gap: 5,
  },
  userName: {
    fontFamily: fonts.cairoBold,
    fontSize: 15,
    color: webColors.headerText,
  },
  userRole: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 15,
    color: webColors.headerText,
    marginTop: -6,
  },
});
