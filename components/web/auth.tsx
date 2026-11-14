import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { DesktopViewport } from '@/components/web/DesktopViewport';
import { IconBrandRoute, IconEye } from '@/components/web/icons';
import { webExtra } from '@/components/web/tokens';
import { fonts, palette } from '@/src/constants/theme';
import { useHover } from '@/src/hooks/useHover';

const loginLogo = require('@/assets/images/web/login-logo.png');

/** Ancho de referencia del panel de marca y del área de acceso en el frame de 1920 px. */
const BRAND_PANEL_FLEX = 716;
const ACCESS_AREA_FLEX = 1204;

type AuthLayoutProps = {
  children: ReactNode;
};

/**
 * Pantallas de acceso del portal (sección 7:432): panel de marca oscuro con la
 * ruta punteada a la izquierda y tarjeta blanca sobre fondo salvia a la derecha.
 */
export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <DesktopViewport>
      <View style={styles.row}>
        <View style={styles.brandPanel}>
          <View style={styles.brandMessage}>
            <Text style={styles.brandTitle}>Viaja seguro,</Text>
            <Text style={[styles.brandTitle, styles.brandAccent]}>ahorra en cada recorrido</Text>
            <Text style={styles.brandText}>
              Un solo lugar para gestionar el servicio{'\n'}y acompañar a nuestra comunidad.
            </Text>
          </View>
          <View style={styles.route}>
            <IconBrandRoute />
          </View>
        </View>
        <View style={styles.accessArea}>
          {children}
          <Text style={styles.footer}>Tuanis Carpooling - Portal administrativo</Text>
        </View>
      </View>
    </DesktopViewport>
  );
}

/** Tarjeta de acceso con el logo y "PORTAL ADMINISTRATIVO". */
export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <View style={styles.card}>
      <View style={styles.identity}>
        <Image source={loginLogo} style={styles.logo} resizeMode="contain" accessibilityLabel="Tuanis Carpooling" />
        <Text style={styles.eyebrow}>PORTAL ADMINISTRATIVO</Text>
      </View>
      {children}
    </View>
  );
}

export function AuthTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

type AuthFieldProps = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label?: string;
  error?: boolean;
  /** Campo de contraseña con el botón del ojo para mostrarla u ocultarla. */
  password?: boolean;
};

/** Campo de los formularios de acceso (instancia `Campo / …` de 84 px). */
export function AuthField({ label, error = false, password = false, ...inputProps }: AuthFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputBox, error && styles.inputError]}>
        <TextInput
          placeholderTextColor={palette.mauve}
          autoCapitalize="none"
          {...inputProps}
          secureTextEntry={password && !visible}
          style={styles.input}
        />
        {password ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onPress={() => setVisible((current) => !current)}
            hitSlop={8}
          >
            <IconEye color={palette.mauve} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

type AuthButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
};

/** Botón principal lima (52 px, radio 10). */
export function AuthButton({ label, onPress, loading = false }: AuthButtonProps) {
  const { hovered, hoverProps } = useHover();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading }}
      disabled={loading}
      onPress={onPress}
      {...hoverProps}
      style={({ pressed }) => [styles.button, (pressed || hovered) && styles.buttonActive]}
    >
      {loading ? <ActivityIndicator color={palette.brownDark} /> : <Text style={styles.buttonText}>{label}</Text>}
    </Pressable>
  );
}

export function AuthLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="link" onPress={onPress}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

/** Aviso de error naranja claro ("Error de acceso", 319:1327). */
export function AuthErrorBanner({ message }: { message: string }) {
  return (
    <View style={styles.errorBanner} accessibilityRole="alert">
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export function AuthFootnote() {
  return <Text style={styles.footnote}>Acceso exclusivo para personal autorizado</Text>;
}

export const authTextStyles = StyleSheet.create({
  muted: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    color: palette.mauve,
  },
  body: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    lineHeight: 19,
    color: palette.mauve,
  },
});

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  brandPanel: {
    flex: BRAND_PANEL_FLEX,
    minWidth: 560,
    backgroundColor: palette.brownDark,
    justifyContent: 'center',
    paddingLeft: 107,
    paddingRight: 40,
  },
  brandMessage: {
    gap: 2,
  },
  brandTitle: {
    fontFamily: fonts.cairoBold,
    fontSize: 51,
    lineHeight: 69,
    color: palette.white,
  },
  brandAccent: {
    color: webExtra.authLime,
  },
  brandText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 17,
    lineHeight: 23,
    color: webExtra.authPale,
    marginTop: 2,
  },
  route: {
    marginTop: 31,
    marginLeft: -4,
  },
  accessArea: {
    flex: ACCESS_AREA_FLEX,
    minWidth: 700,
    backgroundColor: webExtra.authPale,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    color: palette.mauve,
  },
  card: {
    width: 626,
    backgroundColor: palette.white,
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 34,
    paddingHorizontal: 56,
  },
  identity: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  logo: {
    width: 180,
    height: 127,
  },
  eyebrow: {
    fontFamily: fonts.cairoBold,
    fontSize: 10,
    letterSpacing: 2,
    color: palette.mauve,
  },
  titleBlock: {
    gap: 7,
  },
  title: {
    fontFamily: fonts.cairoBold,
    fontSize: 30,
    lineHeight: 40,
    color: palette.brownDark,
  },
  subtitle: {
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: palette.mauve,
  },
  field: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 13,
    lineHeight: 18,
    color: palette.brownDark,
  },
  inputBox: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: webExtra.authInputBorder,
    backgroundColor: palette.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    gap: 8,
  },
  inputError: {
    borderColor: palette.terracotta,
  },
  input: {
    flex: 1,
    alignSelf: 'stretch',
    fontFamily: fonts.cairoRegular,
    fontSize: 14,
    color: palette.brownDark,
  },
  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: webExtra.authLime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    opacity: 0.85,
  },
  buttonText: {
    fontFamily: fonts.cairoBold,
    fontSize: 14,
    color: palette.brownDark,
  },
  link: {
    fontFamily: fonts.cairoSemiBold,
    fontSize: 12,
    color: palette.brownDark,
    textDecorationLine: 'underline',
  },
  errorBanner: {
    borderRadius: 6,
    backgroundColor: palette.terracottaLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  errorText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    color: palette.brownDark,
  },
  footnote: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    color: palette.mauve,
    textAlign: 'center',
  },
});
