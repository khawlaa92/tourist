/**
 * TranslationScreen.js — Voice Translation Feature
 * Translate text in multiple languages
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius } from '../constants/theme';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const LANGUAGES = [
  { code: 'fr', name: '🇫🇷 Français', flag: '🇫🇷' },
  { code: 'en', name: '🇺🇸 English', flag: '🇺🇸' },
  { code: 'ar', name: '🇹🇳 العربية', flag: '🇹🇳' },
  { code: 'es', name: '🇪🇸 Español', flag: '🇪🇸' },
  { code: 'it', name: '🇮🇹 Italiano', flag: '🇮🇹' },
  { code: 'de', name: '🇩🇪 Deutsch', flag: '🇩🇪' },
];

export const TranslationScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('fr');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const translateText = async () => {
    if (!sourceText.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer du texte à traduire');
      return;
    }

    setIsLoading(true);
    try {
      const sourceLangName = LANGUAGES.find(l => l.code === sourceLanguage)?.name || sourceLanguage;
      const targetLangName = LANGUAGES.find(l => l.code === targetLanguage)?.name || targetLanguage;

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es un traducteur professionnel. Traduis le texte fourni du ${sourceLangName} vers ${targetLangName}. Fournis UNIQUEMENT la traduction, rien d'autre.`,
            },
            {
              role: 'user',
              content: sourceText,
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur API');
      }

      const data = await response.json();
      const translation = data.choices[0].message.content;
      setTranslatedText(translation);
      
      // Sauvegarder la traduction
      const translationRecord = {
        id: `trans-${Date.now()}`,
        sourceText,
        translatedText: translation,
        sourceLanguage,
        targetLanguage,
        timestamp: Date.now(),
      };
      const existing = await AsyncStorage.getItem('@translation_history');
      const translations = existing ? JSON.parse(existing) : [];
      translations.push(translationRecord);
      await AsyncStorage.setItem('@translation_history', JSON.stringify(translations));
    } catch (error) {
      console.error('Erreur traduction:', error);
      Alert.alert('Erreur', 'Impossible de traduire. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Traduction 🌐" onPressBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          {/* Language Selectors */}
          <View style={styles.languageSection}>
            <View style={styles.languagePair}>
              {/* Source Language */}
              <View style={styles.languageBox}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  De:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      onPress={() => setSourceLanguage(lang.code)}
                      style={[
                        styles.languageBtn,
                        sourceLanguage === lang.code && {
                          backgroundColor: theme.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.languageBtnText,
                          {
                            color:
                              sourceLanguage === lang.code
                                ? '#FFFFFF'
                                : theme.text,
                          },
                        ]}
                      >
                        {lang.flag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Swap Button */}
              <TouchableOpacity
                onPress={swapLanguages}
                style={[styles.swapBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.swapIcon}>⇄</Text>
              </TouchableOpacity>

              {/* Target Language */}
              <View style={styles.languageBox}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  Vers:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity
                      key={lang.code}
                      onPress={() => setTargetLanguage(lang.code)}
                      style={[
                        styles.languageBtn,
                        targetLanguage === lang.code && {
                          backgroundColor: theme.primary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.languageBtnText,
                          {
                            color:
                              targetLanguage === lang.code
                                ? '#FFFFFF'
                                : theme.text,
                          },
                        ]}
                      >
                        {lang.flag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          {/* Source Text Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Texte à traduire
            </Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.card || theme.background,
                  color: theme.text,
                  borderColor: theme.divider,
                },
              ]}
              placeholder="Entrez le texte..."
              placeholderTextColor={theme.textSecondary}
              value={sourceText}
              onChangeText={setSourceText}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Translate Button */}
          <TouchableOpacity
            onPress={translateText}
            disabled={isLoading || !sourceText.trim()}
            style={[
              styles.translateBtn,
              { backgroundColor: theme.primary },
              (isLoading || !sourceText.trim()) && styles.translateBtnDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.translateBtnText}>🎤 Traduire</Text>
            )}
          </TouchableOpacity>

          {/* Translated Result */}
          {translatedText && (
            <View style={styles.resultSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Résultat
              </Text>
              <View
                style={[
                  styles.resultBox,
                  {
                    backgroundColor: theme.card || theme.background,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Text style={[styles.resultText, { color: theme.text }]}>
                  {translatedText}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // Copy to clipboard
                  Alert.alert('✅ Texte copié!');
                }}
                style={[styles.copyBtn, { borderColor: theme.primary }]}
              >
                <Text style={[styles.copyBtnText, { color: theme.primary }]}>
                  📋 Copier
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, padding: spacings.lg },

  languageSection: { marginBottom: spacings.xl },
  languagePair: { gap: spacings.md },
  languageBox: { gap: spacings.sm },
  label: { fontSize: fontSizes.sm, fontWeight: '600' },
  languageBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginRight: spacings.sm,
  },
  languageBtnText: { fontSize: 20 },

  swapBtn: {
    height: 44,
    marginHorizontal: spacings.md,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapIcon: { fontSize: 24, color: '#FFFFFF' },

  inputSection: { marginBottom: spacings.xl },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: '600', marginBottom: spacings.sm },
  textInput: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacings.md,
    minHeight: 120,
    fontSize: fontSizes.md,
  },

  translateBtn: {
    height: 50,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacings.xl,
  },
  translateBtnDisabled: { opacity: 0.5 },
  translateBtnText: {
    color: '#FFFFFF',
    fontSize: fontSizes.md,
    fontWeight: '600',
  },

  resultSection: { marginBottom: spacings.xl },
  resultBox: {
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    padding: spacings.md,
    minHeight: 100,
  },
  resultText: { fontSize: fontSizes.md, lineHeight: 24 },

  copyBtn: {
    borderWidth: 2,
    borderRadius: borderRadius.lg,
    paddingVertical: spacings.md,
    alignItems: 'center',
    marginTop: spacings.md,
  },
  copyBtnText: { fontSize: fontSizes.md, fontWeight: '600' },
});
