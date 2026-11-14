import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/mobile/BackButton';
import { AuthButton } from '@/components/mobile/passenger/Auth';
import {
  termsIntro,
  termsNotice,
  termsReferences,
  termsReferencesIntro,
  termsReferencesTitle,
  termsSections,
  type TermsSection,
} from '@/components/mobile/passenger/termsContent';
import { authColors, colors, fonts, palette, radius, spacing } from '@/src/constants/theme';

function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/registro');
}

/**
 * "Términos y condiciones" (Figma 3069:3947). El frame es una importación HTML
 * con colores y fuente Inter propios; se reestiliza con los tokens de Punto 4–7
 * (D1) conservando la estructura y el texto.
 */
export default function TerminosScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={goBack} />
        <Text accessibilityRole="header" style={styles.headerTitle}>
          Información legal
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>TUANIS CARPOOLING</Text>
          <Text style={styles.heroTitle}>Términos y condiciones</Text>
          <Text style={styles.heroIntro}>{termsIntro}</Text>
        </View>

        {termsSections.map((section) => (
          <Section key={section.number} section={section} />
        ))}

        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            <Text style={styles.noticeLead}>{termsNotice.lead}</Text> {termsNotice.text}
          </Text>
        </View>

        <View style={styles.references}>
          <Text style={styles.sectionTitle}>{termsReferencesTitle}</Text>
          <Text style={styles.referencesIntro}>{termsReferencesIntro}</Text>
          <View style={styles.list}>
            {termsReferences.map((reference) => (
              <View key={reference.text} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.referenceText}>
                  {reference.name ? <Text style={styles.referenceName}>{reference.name} — </Text> : null}
                  {reference.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <AuthButton title="← Volver al registro" onPress={goBack} />
          <Text style={styles.caption}>TUANIS CARPOOLING · Costa Rica</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ section }: { section: TermsSection }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.number}>
          <Text style={styles.numberText}>{section.number}</Text>
        </View>
        <Text style={[styles.sectionTitle, styles.sectionTitleFlex]}>{section.title}</Text>
      </View>
      {section.paragraphs?.map((paragraph) => (
        <Text key={paragraph} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
      {section.bullets ? (
        <View style={styles.list}>
          {section.bullets.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={[styles.paragraph, styles.flex]}>{bullet}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const BODY_LINE_HEIGHT = 21;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: authColors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingHorizontal: 20,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
  },
  headerTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.textDark,
  },
  content: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    paddingHorizontal: 26,
  },
  hero: {
    gap: 9,
    paddingHorizontal: spacing.screen,
    paddingTop: 33,
    paddingBottom: 43,
    backgroundColor: palette.brownDark,
    borderRadius: radius.button,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 2,
    color: palette.terracottaLight,
  },
  heroTitle: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.7,
    color: palette.white,
  },
  heroIntro: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    lineHeight: 20,
    color: palette.sand,
  },
  section: {
    gap: 9,
    paddingTop: 17,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderCard,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  number: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.terracottaLight,
    borderRadius: 8,
  },
  numberText: {
    fontFamily: fonts.black,
    fontSize: 12,
    color: palette.terracotta,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 21,
    color: colors.textPrimary,
  },
  sectionTitleFlex: {
    flex: 1,
    paddingTop: 3,
  },
  paragraph: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    lineHeight: BODY_LINE_HEIGHT,
    color: palette.taupe,
  },
  list: {
    gap: spacing.s,
    paddingLeft: spacing.xs,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  bullet: {
    fontFamily: fonts.cairoRegular,
    fontSize: 13,
    lineHeight: BODY_LINE_HEIGHT,
    color: palette.taupe,
  },
  notice: {
    marginTop: 24,
    paddingHorizontal: 15,
    paddingVertical: spacing.l,
    backgroundColor: colors.surfaceOrangeLight,
    borderLeftWidth: 4,
    borderLeftColor: palette.terracotta,
    borderRadius: 8,
  },
  noticeText: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    lineHeight: 19,
    color: colors.textDark,
  },
  noticeLead: {
    fontFamily: fonts.cairoBold,
  },
  references: {
    marginTop: 24,
    gap: 11,
    paddingHorizontal: spacing.xl,
    paddingTop: 26,
    paddingBottom: 26,
    backgroundColor: authColors.inputBackground,
    borderRadius: radius.card,
  },
  referencesIntro: {
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    lineHeight: 19,
    color: palette.taupe,
  },
  referenceText: {
    flex: 1,
    fontFamily: fonts.cairoRegular,
    fontSize: 12,
    lineHeight: 19,
    color: palette.taupe,
  },
  referenceName: {
    fontFamily: fonts.cairoBold,
    color: palette.terracotta,
  },
  footer: {
    gap: spacing.l,
    paddingTop: 24,
    paddingBottom: 32,
  },
  caption: {
    fontFamily: fonts.cairoRegular,
    fontSize: 11,
    textAlign: 'center',
    color: palette.greyMedium,
  },
});
