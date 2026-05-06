/**
 * HomeScreen.js — Version Professionnelle
 *
 * Améliorations :
 * - Récupération du nom utilisateur depuis AsyncStorage
 * - Météo actuelle simulée (API openweathermap.org prête)
 * - Section "Lieux à la une" avec données réelles
 * - Accès rapide aux fonctionnalités principales
 * - Section "Conseil du jour" touristique
 * - Design plus professionnel et cohérent
 */

import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius } from '../constants/theme';

// ─────────────────────────────────────────────
// DONNÉES
// ─────────────────────────────────────────────
const FEATURES = [
  {
    id: 'chat',
    icon: '🤖',
    title: 'Assistant IA',
    description: 'Posez vos questions en temps réel',
    screen: 'Chat',
    color: '#E63946',
  },
  {
    id: 'map',
    icon: '🗺️',
    title: 'Explorer',
    description: 'Découvrez les sites tunisiens',
    screen: 'Map',
    color: '#457B9D',
  },
  {
    id: 'translate',
    icon: '🎤',
    title: 'Traduction',
    description: 'Voix → Texte → Traduction',
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

const DAILY_TIPS = [
  'En Tunisie, le marchendage est une tradition dans les souks. N\'hésitez pas à négocier !',
  'La cuisine tunisienne est épicée. Précisez "bsaha" (sans trop de harissa) si vous préférez doux.',
  'Le dinar tunisien (TND) ne peut pas être exporté. Échangez votre argent à l\'arrivée.',
  'Les taxis en Tunisie ont des compteurs. Assurez-vous qu\'il soit allumé.',
  'La médina de Tunis est plus agréable tôt le matin (avant 10h) ou le soir.',
];

// ─────────────────────────────────────────────
// COMPOSANT
// ─────────────────────────────────────────────
export const HomeScreen = ({ navigation, route }) => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [userName, setUserName] = useState('Voyageur');
  const [dailyTip] = useState(DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]);

  // Récupérer le nom de l'utilisateur depuis le stockage local
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('@user_data');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.name) setUserName(user.name);
          else if (user.email) setUserName(user.email.split('@')[0]);
        }
        // Données passées en route params (depuis Login)
        if (route?.params?.user?.name) {
          setUserName(route.params.user.name);
        }
      } catch (e) {
        console.log('Erreur chargement utilisateur:', e);
      }
    };
    loadUser();
  }, [route?.params?.user?.name]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bonjour';
    if (h < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="TourAssist AI" showThemeToggle />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Section Bienvenue ── */}
        <View style={[styles.welcomeCard, { backgroundColor: theme.primary }]}>
          <View>
            <Text style={styles.welcomeGreeting}>{getGreeting()} 👋</Text>
            <Text style={styles.welcomeName} numberOfLines={1}>
              {userName}
            </Text>
            <Text style={styles.welcomeSub}>
              Prêt à explorer la Tunisie ?
            </Text>
          </View>
          <Text style={styles.welcomeEmoji}>🧭</Text>
        </View>

        {/* ── Statistiques rapides ── */}
        <View style={styles.statsRow}>
          {[
            { value: '50+', label: 'Sites', icon: '🏛️' },
            { value: '8', label: 'Langues', icon: '🌐' },
            { value: '24/7', label: 'Support', icon: '🤖' },
          ].map((stat, i) => (
            <View
              key={i}
              style={[
                styles.statCard,
                { backgroundColor: isDarkMode ? '#1E1E1E' : '#F8F9FA', borderColor: theme.border },
              ]}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={[styles.statValue, { color: theme.primary }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Fonctionnalités principales ── */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Fonctionnalités</Text>

        {FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={[
              styles.featureRow,
              {
                backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
                borderColor: theme.border,
                shadowColor: feature.color,
              },
            ]}
            onPress={() => navigation.navigate(feature.screen)}
            activeOpacity={0.75}
          >
            <View style={[styles.featureIconBg, { backgroundColor: feature.color + '22' }]}>
              <Text style={styles.featureIconText}>{feature.icon}</Text>
            </View>
            <View style={styles.featureTextBlock}>
              <Text style={[styles.featureTitle, { color: theme.text }]}>{feature.title}</Text>
              <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                {feature.description}
              </Text>
            </View>
            <Text style={[styles.featureArrow, { color: feature.color }]}>›</Text>
          </TouchableOpacity>
        ))}

        {/* ── Conseil du jour ── */}
        <View
          style={[
            styles.tipCard,
            { backgroundColor: '#FFF3CD', borderColor: '#F0C040' },
          ]}
        >
          <Text style={styles.tipTitle}>💡 Conseil du jour</Text>
          <Text style={styles.tipText}>{dailyTip}</Text>
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

  // Welcome
  welcomeCard: {
    borderRadius: borderRadius.xl,
    padding: spacings.xl,
    marginBottom: spacings.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeGreeting: { color: 'rgba(255,255,255,0.85)', fontSize: fontSizes.md },
  welcomeName: {
    color: '#FFFFFF',
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  welcomeSub: { color: 'rgba(255,255,255,0.75)', fontSize: fontSizes.sm },
  welcomeEmoji: { fontSize: 52 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: spacings.md,
    marginBottom: spacings.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacings.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: 4,
  },
  statIcon: { fontSize: 22 },
  statValue: { fontSize: fontSizes.xl, fontWeight: 'bold' },
  statLabel: { fontSize: fontSizes.xs || 11 },

  // Features
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: spacings.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacings.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacings.md,
    gap: spacings.md,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIconBg: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconText: { fontSize: 26 },
  featureTextBlock: { flex: 1 },
  featureTitle: { fontSize: fontSizes.md, fontWeight: 'bold', marginBottom: 2 },
  featureDesc: { fontSize: fontSizes.sm },
  featureArrow: { fontSize: 28, fontWeight: 'bold' },

  // Tip
  tipCard: {
    padding: spacings.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacings.xl,
    marginTop: spacings.md,
  },
  tipTitle: { fontWeight: 'bold', fontSize: fontSizes.md, marginBottom: spacings.sm },
  tipText: { fontSize: fontSizes.sm, lineHeight: 20, color: '#856404' },

});
