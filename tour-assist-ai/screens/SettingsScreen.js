import React, { useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius, shadows } from '../constants/theme';

const APP_VERSION = '1.0.0';

const SECTION_DATA = [
  {
    title: 'Informations',
    items: [
      {
        key: 'about',
        label: 'Version',
        description: `TourAssist AI v${APP_VERSION}`,
        type: 'link',
        screen: 'About',
      },
    ],
  },
  {
    title: 'Donnees',
    items: [
      {
        key: 'clear-data',
        label: 'Reinitialiser les donnees',
        description: "Supprimer l'historique de chat, de traduction et les sites visites.",
        type: 'action',
        variant: 'danger',
      },
    ],
  },
  {
    title: 'Compte',
    items: [
      {
        key: 'logout',
        label: 'Deconnexion',
        description: 'Fermer votre session et revenir a la page de connexion.',
        type: 'action',
        variant: 'danger',
      },
    ],
  },
];

const SettingsRow = ({
  theme,
  label,
  description,
  onPress,
  variant = 'default',
  rightElement,
}) => {
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      activeOpacity={rightElement ? 1 : 0.8}
      onPress={rightElement ? undefined : onPress}
      style={[
        styles.rowCard,
        {
          backgroundColor: theme.surfaceElevated || theme.card || theme.background,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.rowTextContent}>
        <Text
          style={[
            styles.rowLabel,
            { color: isDanger ? theme.error : theme.text },
          ]}
        >
          {label}
        </Text>
        {description ? (
          <Text style={[styles.rowDescription, { color: theme.textSecondary }]}>
            {description}
          </Text>
        ) : null}
      </View>

      {rightElement || (
        <Text style={[styles.chevron, { color: isDanger ? theme.error : theme.textSecondary }]}>
          {'>'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const SettingsScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);

  const handleClearData = () => {
    Alert.alert(
      'Reinitialiser les donnees',
      "Cette action supprimera l'historique du chat, des traductions et les sites visites. Voulez-vous continuer ?",
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Reinitialiser',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                '@chat_history',
                '@translation_history',
                '@sites_visited',
              ]);
              Alert.alert('Confirmation', 'Les donnees ont ete reinitialisees.');
            } catch (_error) {
              Alert.alert('Erreur', "La reinitialisation des donnees a echoue.");
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Deconnexion',
      'Voulez-vous vraiment vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Deconnexion',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['@user_name', '@user_data', '@user_session']);
              navigation.replace('Login');
            } catch (_error) {
              Alert.alert('Erreur', 'La deconnexion a echoue.');
            }
          },
        },
      ]
    );
  };

  const handleRowPress = (itemKey, screen) => {
    if (screen) {
      navigation.navigate(screen);
      return;
    }

    if (itemKey === 'clear-data') {
      handleClearData();
      return;
    }

    if (itemKey === 'logout') {
      handleLogout();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Parametres" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.lightRed || theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.eyebrow, { color: theme.primary }]}>Preferences</Text>
          <Text style={[styles.heroTitle, { color: theme.text }]}>
            Gere votre experience TourAssist AI
          </Text>
          <Text style={[styles.heroSubtitle, { color: theme.textSecondary }]}>
            Personnalisez l&apos;apparence, consultez les informations legales et
            administrez vos donnees depuis un seul espace.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Apparence</Text>
          <View
            style={[
              styles.rowCard,
              {
                backgroundColor: theme.surfaceElevated || theme.card || theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.rowTextContent}>
              <Text style={[styles.rowLabel, { color: theme.text }]}>Mode sombre</Text>
              <Text style={[styles.rowDescription, { color: theme.textSecondary }]}>
                {isDarkMode ? 'Active' : 'Desactive'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D6D6D6', true: `${theme.primary}66` }}
              thumbColor={isDarkMode ? theme.primary : '#FFFFFF'}
            />
          </View>
        </View>

        {SECTION_DATA.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            {section.items.map((item) => (
              <SettingsRow
                key={item.key}
                theme={theme}
                label={item.label}
                description={item.description}
                variant={item.variant}
                onPress={() => handleRowPress(item.key, item.screen)}
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: spacings.lg,
    paddingBottom: spacings.xxxl * 2,
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
  section: {
    gap: spacings.md,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.lg,
    ...shadows.sm,
  },
  rowTextContent: {
    flex: 1,
    marginRight: spacings.md,
  },
  rowLabel: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacings.xs,
  },
  rowDescription: {
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  chevron: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
  },
});
