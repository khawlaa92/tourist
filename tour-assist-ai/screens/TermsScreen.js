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

const TERMS_SECTIONS = [
  {
    title: 'Acces au service',
    body:
      "TourAssist AI est fourni comme assistant numerique pour accompagner l'utilisateur dans ses besoins de voyage et d'information.",
  },
  {
    title: 'Bon usage',
    body:
      "Vous vous engagez a utiliser l'application de maniere responsable et a ne pas perturber son fonctionnement normal.",
  },
  {
    title: 'Contenus generes',
    body:
      'Les reponses, suggestions et traductions doivent etre verifiees avant toute decision importante de voyage.',
  },
  {
    title: 'Gestion du compte',
    body:
      'Vous pouvez mettre fin a votre session a tout moment via la deconnexion disponible dans les parametres.',
  },
];

export const TermsScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title="Conditions d'utilisation"
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
          <Text style={[styles.eyebrow, { color: theme.primary }]}>Conditions</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Cadre d&apos;utilisation de TourAssist AI
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Ces conditions presentent les principes generaux d&apos;utilisation
            du service et les responsabilites liees a son usage.
          </Text>
        </View>

        {TERMS_SECTIONS.map((section) => (
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
