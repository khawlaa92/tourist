import React, { useContext } from 'react';
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius, shadows } from '../constants/theme';

const PRIVACY_SECTIONS = [
  {
    title: 'Collecte des donnees',
    body:
      "L'application peut stocker localement l'historique du chat, des traductions et les sites visites afin d'ameliorer votre experience.",
  },
  {
    title: 'Utilisation des informations',
    body:
      'Ces informations servent uniquement a personnaliser vos interactions et a conserver vos donnees dans l application.',
  },
  {
    title: 'Stockage local',
    body:
      'Les donnees listees dans les parametres sont conservees sur votre appareil via AsyncStorage jusqu a leur suppression.',
  },
  {
    title: 'Vos choix',
    body:
      'Vous pouvez a tout moment reinitialiser vos donnees ou vous deconnecter depuis la section Parametres.',
  },
];

export const PrivacyScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Politique de confidentialite"
        onPressBack={() => navigation.goBack()}
      />

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
          <Text style={[styles.eyebrow, { color: theme.primary }]}>Confidentialite</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Protection de vos informations
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Cette page resume la maniere dont les donnees du voyageur sont
            enregistrees et gerees dans TourAssist AI.
          </Text>
        </View>

        {PRIVACY_SECTIONS.map((section) => (
          <View
            key={section.title}
            style={[
              styles.contentCard,
              {
                backgroundColor: theme.surfaceElevated || theme.card || theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.text }]}>{section.title}</Text>
            <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
              {section.body}
            </Text>
          </View>
        ))}

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
    gap: spacings.lg,
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
  contentCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacings.lg,
    ...shadows.sm,
  },
  cardTitle: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacings.sm,
  },
  cardBody: {
    fontSize: fontSizes.sm,
    lineHeight: 22,
  },
  backButton: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacings.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacings.sm,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
