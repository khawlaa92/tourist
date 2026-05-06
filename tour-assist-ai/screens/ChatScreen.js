/**
 * ChatScreen.js — Version Professionnelle
 * 
 * Améliorations par rapport à la version initiale :
 * - Vrai chatbot IA via API (OpenAI ou Anthropic) — plus de réponses aléatoires
 * - Prompt système spécialisé tourisme Tunisie (multilingue)
 * - Historique de conversation maintenu côté client
 * - Indicateur "typing..." pendant le chargement
 * - Gestion des erreurs réseau
 * - Horodatage des messages
 * - Scroll automatique amélioré
 */

import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../src/context/ThemeContext';
import { Header } from '../src/components/Header';
import { spacings, fontSizes, borderRadius } from '../constants/theme';

// ─────────────────────────────────────────────
// CONFIGURATION API
// Remplace par ta clé API dans ton fichier .env
// ─────────────────────────────────────────────
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Prompt système : définit le rôle du chatbot
const SYSTEM_PROMPT = `Tu es TourAssist AI, un guide touristique intelligent et multilingue spécialisé dans le tourisme en Tunisie.

Tes capacités :
- Répondre en français, anglais, arabe, espagnol, italien ou allemand selon la langue de l'utilisateur
- Donner des informations détaillées sur les sites touristiques tunisiens (histoire, horaires, conseils pratiques)
- Recommander des restaurants, hôtels et activités selon les préférences de l'utilisateur
- Aider avec les transports et la navigation en Tunisie
- Fournir des traductions et des conseils culturels
- Informer sur la monnaie, les coutumes, la sécurité et les formalités d'entrée

Lieux tunisiens que tu connais parfaitement :
Tunis (Médina, Bardo, Carthage, Sidi Bou Said), Hammamet, Sousse, Monastir, Sfax, Djerba, 
Tozeur, Douz (désert du Sahara), El Jem (Amphithéâtre romain), Kairouan, Tabarka, Bizerte

Personnalité : chaleureux, professionnel, passionné par la culture tunisienne.
Réponds toujours de manière concise et utile. Ne réponds JAMAIS aux sujets hors tourisme.`;

// ─────────────────────────────────────────────
// COMPOSANT MESSAGE
// ─────────────────────────────────────────────
const MessageBubble = ({ message, theme }) => {
  const isUser = message.role === 'user';
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View
      style={[
        styles.messageWrapper,
        isUser ? styles.messageWrapperUser : styles.messageWrapperBot,
      ]}
    >
      {!isUser && (
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>🤖</Text>
        </View>
      )}
      <View style={styles.bubbleColumn}>
        <View
          style={[
            styles.bubble,
            isUser
              ? [styles.bubbleUser, { backgroundColor: theme.primary }]
              : [styles.bubbleBot, { backgroundColor: theme.card || '#F5F5F5' }],
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? '#FFFFFF' : theme.text },
            ]}
          >
            {message.content}
          </Text>
        </View>
        <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────
// INDICATEUR "EN TRAIN D'ÉCRIRE..."
// ─────────────────────────────────────────────
const TypingIndicator = ({ theme }) => (
  <View style={[styles.messageWrapper, styles.messageWrapperBot]}>
    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
      <Text style={styles.avatarText}>🤖</Text>
    </View>
    <View style={[styles.bubble, styles.bubbleBot, { backgroundColor: theme.card || '#F5F5F5' }]}>
      <View style={styles.typingDots}>
        <Text style={[styles.dot, { color: theme.textSecondary }]}>●</Text>
        <Text style={[styles.dot, { color: theme.textSecondary }]}>●</Text>
        <Text style={[styles.dot, { color: theme.textSecondary }]}>●</Text>
      </View>
    </View>
  </View>
);

// ─────────────────────────────────────────────
// ÉCRAN PRINCIPAL
// ─────────────────────────────────────────────
export const ChatScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const scrollViewRef = useRef(null);

  // Historique complet des messages (format OpenAI)
  const [conversationHistory, setConversationHistory] = useState([]);

  // Messages affichés (avec timestamp pour l'UI)
  const [displayMessages, setDisplayMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Marhba bik! 👋 Bienvenue sur TourAssist AI.\n\nJe suis votre guide touristique intelligent pour la Tunisie. Posez-moi vos questions en français, anglais, arabe ou toute autre langue !',
      timestamp: Date.now(),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ── Charger l'historique au démarrage ──
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem('@chat_history');
        if (saved && saved !== '[]') {
          const history = JSON.parse(saved);
          setDisplayMessages(history);
        }
      } catch (error) {
        console.error('Erreur chargement historique:', error);
      }
    };
    loadChatHistory();
  }, []);

  // ── Sauvegarder les messages ──
  const saveMessageToStorage = async (messages) => {
    try {
      await AsyncStorage.setItem('@chat_history', JSON.stringify(messages));
    } catch (error) {
      console.error('Erreur sauvegarde message:', error);
    }
  };

  // ── Appel à l'API OpenAI ──
  const callAI = useCallback(async (userMessage, history) => {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',       // Modèle économique et performant
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur API');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }, []);

  // ── Envoi d'un message ──
  const handleSendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    // Afficher le message utilisateur immédiatement
    const updatedMessages = [...displayMessages, userMessage];
    setDisplayMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    // Mettre à jour l'historique pour l'API
    const newHistory = [
      ...conversationHistory,
      { role: 'user', content: text },
    ];

    try {
      const aiResponse = await callAI(text, conversationHistory);

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now(),
      };

      const finalMessages = [...updatedMessages, botMessage];
      setDisplayMessages(finalMessages);
      setConversationHistory([
        ...newHistory,
        { role: 'assistant', content: aiResponse },
      ]);

      // Sauvegarder l'historique
      await saveMessageToStorage(finalMessages);
    } catch (error) {
      console.error('Erreur chatbot:', error);
      Alert.alert(
        'Erreur de connexion',
        'Impossible de contacter le service IA. Vérifiez votre connexion internet.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [inputText, isLoading, conversationHistory, displayMessages, callAI]);

  // ── Suggestions rapides ──
  const quickSuggestions = [
    '🏛️ Sites à visiter',
    '🍜 Plats tunisiens',
    '🗺️ Comment aller à Djerba ?',
    '💱 Monnaie et budget',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Chat Assistant IA" onPressBack={() => navigation.goBack()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* ── Liste des messages ── */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {displayMessages.map((message) => (
            <MessageBubble key={message.id} message={message} theme={theme} />
          ))}
          {isLoading && <TypingIndicator theme={theme} />}
        </ScrollView>

        {/* ── Suggestions rapides (s'affiche seulement au début) ── */}
        {displayMessages.length === 1 && !isLoading && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsContainer}
            contentContainerStyle={styles.suggestionsContent}
          >
            {quickSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionChip, { borderColor: theme.primary }]}
                onPress={() => {
                  setInputText(suggestion.replace(/^.{2}/, '').trim());
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.suggestionText, { color: theme.primary }]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Zone de saisie ── */}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: theme.secondary || theme.background,
              borderTopColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.background,
                color: theme.text,
                borderColor: theme.border,
              },
            ]}
            placeholder="Posez votre question..."
            placeholderTextColor={theme.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            style={[
              styles.sendButton,
              { backgroundColor: theme.primary },
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendButtonIcon}>➤</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },

  messagesContainer: {
    paddingVertical: spacings.lg,
    paddingHorizontal: spacings.md,
    paddingBottom: spacings.xl,
  },

  // Messages
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: spacings.md,
    alignItems: 'flex-end',
  },
  messageWrapperUser: { justifyContent: 'flex-end' },
  messageWrapperBot: { justifyContent: 'flex-start' },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacings.sm,
    flexShrink: 0,
  },
  avatarText: { fontSize: 18 },

  bubbleColumn: { maxWidth: '78%' },
  bubble: {
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.sm + 2,
    borderRadius: borderRadius.lg,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: fontSizes.xs || 11,
    marginTop: 4,
    marginHorizontal: 4,
  },

  // Typing indicator
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 4,
  },
  dot: { fontSize: 16, opacity: 0.5 },

  // Suggestions
  suggestionsContainer: {
    maxHeight: 48,
    flexShrink: 0,
  },
  suggestionsContent: {
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.sm,
    gap: spacings.sm,
  },
  suggestionChip: {
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.sm,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    marginRight: spacings.sm,
  },
  suggestionText: {
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },

  // Input zone
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.md,
    borderTopWidth: 1,
    gap: spacings.sm,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.md,
    fontSize: fontSizes.md,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonIcon: {
    color: '#FFFFFF',
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
  },
});
