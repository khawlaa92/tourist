import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius, shadows } from '../constants/theme';

const INFO_ROWS = [
  { label: 'Application', value: 'TourAssist AI' },
  { label: 'Version', value: '1.0.0' },
  { label: 'Categorie', value: 'Smart AI Tourism' },
  { label: 'Plateforme', value: 'React Native' },
];

export const AboutScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="A propos" onPressBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: isDarkMode ? '#211416' : '#FFF5F6',
              borderColor: isDarkMode ? '#3A2327' : '#F3D7DC',
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: theme.primary }]}>Version</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Informations sur l&apos;application
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            TourAssist AI centralise le chat intelligent, la traduction et les
            outils utiles au voyageur dans une interface claire et moderne.
          </Text>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.surfaceElevated || theme.card || theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          {INFO_ROWS.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.infoRow,
                index < INFO_ROWS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.divider,
                },
              ]}
            >
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                {row.label}
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{row.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: {
    padding: spacings.lg,
    paddingBottom: spacings.xxxl,
    gap: spacings.xl,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xxl,
    padding: spacings.xl,
  },
  eyebrow: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: spacings.sm,
  },
  heroTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  heroSubtitle: {
    fontSize: fontSizes.sm,
    lineHeight: 22,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  infoRow: {
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.lg,
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    marginBottom: spacings.xs,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  backButton: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacings.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
