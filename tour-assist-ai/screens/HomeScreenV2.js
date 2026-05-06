import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius, shadows } from '../constants/theme';

const FEATURES = [
  {
    id: 'chat',
    icon: '🤖',
    title: 'Assistant IA',
    description: 'Posez vos questions en temps reel',
    screen: 'Chat',
    color: '#E63946',
  },
  {
    id: 'map',
    icon: '🗺️',
    title: 'Explorer',
    description: 'Decouvrez les sites tunisiens',
    screen: 'Map',
    color: '#457B9D',
  },
  {
    id: 'translate',
    icon: '🎤',
    title: 'Traduction',
    description: 'Voix vers texte et traduction',
    screen: 'Translation',
    color: '#2A9D8F',
  },
  {
    id: 'money',
    icon: '💱',
    title: 'Transformation d\'argent',
    description: 'Convertir le dinar, l\'euro et le dollar',
    screen: 'MoneyConverter',
    color: '#F4A261',
  },
];

export const HomeScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const surfaceColor = isDarkMode ? '#191919' : '#FFFFFF';
  const mutedSurface = isDarkMode ? '#222222' : '#F7F7F7';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="TourAssist AI" showThemeToggle />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>TourAssist</Text>
          </View>
          <Text style={[styles.pageTitle, { color: theme.text }]}>
            Votre assistant de voyage
          </Text>
          <Text style={[styles.pageSubtitle, { color: theme.textSecondary }]}>
            Une page d&apos;accueil plus simple, avec les outils essentiels a portee
            de main.
          </Text>
        </View>

        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: surfaceColor,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: theme.primary }]}>
            Acces rapide
          </Text>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Fonctionnalites principales
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Choisissez l&apos;outil dont vous avez besoin pour continuer votre
            voyage.
          </Text>

          <View style={styles.featureGrid}>
            {FEATURES.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: mutedSurface,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => navigation.navigate(feature.screen)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.featureIconBg,
                    { backgroundColor: `${feature.color}18` },
                  ]}
                >
                  <Text style={styles.featureIconText}>{feature.icon}</Text>
                </View>
                <Text style={[styles.featureTitle, { color: theme.text }]}>
                  {feature.title}
                </Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                {feature.description}
              </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.lg,
    paddingBottom: spacings.xl * 5,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xxl,
    padding: spacings.xl,
    marginBottom: spacings.xl,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#C41E3A',
    borderRadius: borderRadius.full,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs,
    marginBottom: spacings.md,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: fontSizes.xs,
    fontWeight: '700',
  },
  pageTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    marginBottom: spacings.sm,
  },
  pageSubtitle: {
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacings.lg,
    ...shadows.sm,
  },
  sectionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacings.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacings.xs,
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginBottom: spacings.lg,
  },
  featureGrid: {
    gap: spacings.md,
  },
  featureCard: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacings.lg,
  },
  featureIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.md,
  },
  featureIconText: { fontSize: 26 },
  featureTitle: { fontSize: fontSizes.md, fontWeight: 'bold', marginBottom: spacings.xs },
  featureDesc: { fontSize: fontSizes.sm, lineHeight: 20 },
});
