import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius, shadows } from '../constants/theme';

const DAILY_TIP =
  'Utilisez le chat pour obtenir des recommandations plus precises avant de lancer une traduction ou une visite.';

const getStatAccent = (index) => {
  const accents = ['#C41E3A', '#2A9D8F', '#457B9D', '#F4A261'];
  return accents[index] || accents[0];
};

const StatCard = ({ theme, label, value, accent }) => (
  <View
    style={[
      styles.statCard,
      {
        backgroundColor: theme.surfaceElevated || theme.card || theme.background,
        borderColor: theme.border,
      },
    ]}
  >
    <View style={[styles.statAccent, { backgroundColor: accent }]} />
    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
  </View>
);

const SectionCard = ({ theme, title, children }) => (
  <View
    style={[
      styles.sectionCard,
      {
        backgroundColor: theme.surfaceElevated || theme.card || theme.background,
        borderColor: theme.border,
      },
    ]}
  >
    <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
    {children}
  </View>
);

const ActionButton = ({ title, backgroundColor, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.actionButton, { backgroundColor }]}
    activeOpacity={0.85}
  >
    <Text style={styles.actionButtonText}>{title}</Text>
  </TouchableOpacity>
);

export const DashboardScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalTranslations: 0,
    uniqueLanguages: [],
    sitesVisited: [],
    lastActiveDate: null,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const chatHistory = await AsyncStorage.getItem('@chat_history');
      const translationHistory = await AsyncStorage.getItem('@translation_history');
      const sitesVisited = await AsyncStorage.getItem('@sites_visited');

      const parsedChat = chatHistory ? JSON.parse(chatHistory) : [];
      const parsedTranslations = translationHistory ? JSON.parse(translationHistory) : [];
      const parsedSites = sitesVisited ? JSON.parse(sitesVisited) : [];

      const languages = new Set(parsedTranslations.map(t => t.targetLanguage || 'Unknown'));

      setStats({
        totalMessages: parsedChat.length,
        totalTranslations: parsedTranslations.length,
        uniqueLanguages: Array.from(languages),
        sitesVisited: parsedSites,
        lastActiveDate: new Date().toLocaleDateString('fr-FR'),
      });
    } catch (error) {
      console.log('Erreur chargement stats:', error);
    }
  };

  const resetAllData = () => {
    Alert.alert(
      'Reinitialiser',
      'Etes-vous sur? Cette action ne peut pas etre annulee.',
      [
        { text: 'Annuler', onPress: () => {} },
        {
          text: 'Reinitialiser',
          onPress: async () => {
            await AsyncStorage.removeItem('@chat_history');
            await AsyncStorage.removeItem('@translation_history');
            await AsyncStorage.removeItem('@sites_visited');
            Alert.alert('Succes', 'Toutes les donnees ont ete reinitialisees');
            loadStats();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const statItems = [
    { label: 'Messages', value: stats.totalMessages },
    { label: 'Traductions', value: stats.totalTranslations },
    { label: 'Lieux', value: stats.sitesVisited.length },
    { label: 'Langues', value: stats.uniqueLanguages.length },
  ];

  const recentActivityItems = [
    {
      key: 'last-active',
      title: 'Derniere utilisation',
      value: stats.lastActiveDate || 'Aucune activite',
      accent: '#C41E3A',
    },
    {
      key: 'total-interactions',
      title: 'Total interactions',
      value: `${stats.totalMessages + stats.totalTranslations} activites`,
      accent: '#2A9D8F',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Tableau de Bord" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
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
          <Text style={[styles.heroEyebrow, { color: theme.primary }]}>Vue d&apos;ensemble</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Suivez votre activite de voyage
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Consultez rapidement vos statistiques, vos habitudes d&apos;utilisation
            et vos prochaines actions depuis un seul ecran.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {statItems.map((item, index) => (
            <StatCard
              key={item.label}
              theme={theme}
              label={item.label}
              value={item.value}
              accent={getStatAccent(index)}
            />
          ))}
        </View>

        <SectionCard theme={theme} title="Activite Recente">
          {recentActivityItems.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.timelineRow,
                index < recentActivityItems.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.divider,
                },
              ]}
            >
              <View style={[styles.timelineMarker, { backgroundColor: item.accent }]} />
              <View style={styles.timelineTextContent}>
                <Text style={[styles.timelineTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.timelineValue, { color: theme.textSecondary }]}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </SectionCard>

        {stats.uniqueLanguages.length > 0 && (
          <SectionCard theme={theme} title="Langues Utilisees">
            <View style={styles.tagContainer}>
              {stats.uniqueLanguages.map((lang, index) => (
                <View
                  key={`${lang}-${index}`}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: isDarkMode ? '#22181A' : '#FFF4F5',
                      borderColor: isDarkMode ? '#4A2A2F' : '#F1D5D9',
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: theme.primary }]}>{lang}</Text>
                </View>
              ))}
            </View>
          </SectionCard>
        )}

        {stats.sitesVisited.length > 0 && (
          <SectionCard theme={theme} title="Lieux Explores">
            {stats.sitesVisited.slice(0, 5).map((site, index) => (
              <View
                key={`${site}-${index}`}
                style={[
                  styles.siteRow,
                  index < Math.min(stats.sitesVisited.length, 5) - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.divider,
                  },
                ]}
              >
                <Text style={[styles.siteName, { color: theme.text }]}>{site}</Text>
                <View
                  style={[
                    styles.siteIndicator,
                    { backgroundColor: index % 2 === 0 ? theme.primary : '#2A9D8F' },
                  ]}
                />
              </View>
            ))}
          </SectionCard>
        )}

        <SectionCard theme={theme} title="Conseil du Jour">
          <View
            style={[
              styles.tipContainer,
              {
                backgroundColor: isDarkMode ? '#1A1A1A' : '#FAFAFA',
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.tipText, { color: theme.text }]}>{DAILY_TIP}</Text>
          </View>
        </SectionCard>

        <View style={styles.actionsSection}>
          <ActionButton
            title="Continuer le Chat"
            backgroundColor={theme.primary}
            onPress={() => navigation.navigate('Chat')}
          />
          <ActionButton
            title="Traduire"
            backgroundColor="#2A9D8F"
            onPress={() => navigation.navigate('Translation')}
          />
          <ActionButton
            title="Reinitialiser les Donnees"
            backgroundColor={isDarkMode ? '#333333' : '#666666'}
            onPress={resetAllData}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  contentContainer: {
    paddingHorizontal: spacings.lg,
    paddingTop: spacings.lg,
    paddingBottom: spacings.xxxl * 2,
    gap: spacings.xl,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xxl,
    padding: spacings.xl,
  },
  heroEyebrow: {
    fontSize: fontSizes.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacings.md,
  },
  statCard: {
    width: '48%',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacings.lg,
    minHeight: 122,
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  statAccent: {
    width: 36,
    height: 5,
    borderRadius: borderRadius.full,
    marginBottom: spacings.lg,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    marginBottom: spacings.xs,
  },
  statValue: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacings.lg,
    ...shadows.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacings.lg,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacings.md,
  },
  timelineMarker: {
    width: 10,
    height: 10,
    borderRadius: borderRadius.full,
    marginTop: 6,
    marginRight: spacings.md,
  },
  timelineTextContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacings.xs,
  },
  timelineValue: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacings.sm,
  },
  tag: {
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.sm,
  },
  tagText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  siteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacings.md,
  },
  siteName: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '500',
    marginRight: spacings.md,
  },
  siteIndicator: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.full,
  },
  tipContainer: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacings.lg,
  },
  tipText: {
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
  actionsSection: {
    gap: spacings.md,
  },
  actionButton: {
    borderRadius: borderRadius.xl,
    paddingVertical: spacings.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: spacings.lg,
  },
});
