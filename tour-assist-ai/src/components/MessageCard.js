/**
 * MessageCard.js — Professional Redesigned Version
 *
 * Enhancements:
 * - Better bubble design with improved contrast
 * - Better spacing and typography
 * - Improved avatar design
 * - Better timestamp formatting
 * - Enhanced accessibility
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, borderRadius, fontSizes } from '../../constants/theme';

export const MessageCard = ({ message, isUserMessage = false }) => {
  const { theme } = useContext(ThemeContext);

  // Support both string and object message formats
  const text = typeof message === 'string' ? message : message?.content ?? '';
  const timestamp = message?.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  return (
    <View
      style={[
        styles.wrapper,
        isUserMessage ? styles.wrapperUser : styles.wrapperBot,
      ]}
    >
      {/* ── Bot Avatar ── */}
      {!isUserMessage && (
        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarEmoji}>🤖</Text>
        </View>
      )}

      {/* ── Message Column (bubble + timestamp) ── */}
      <View style={styles.column}>
        {/* ── Message Bubble ── */}
        <View
          style={[
            styles.bubble,
            isUserMessage
              ? [
                  styles.bubbleUser,
                  { backgroundColor: theme.primary || '#c41e3a' },
                ]
              : [
                  styles.bubbleBot,
                  { backgroundColor: theme.card || theme.background },
                ],
          ]}
        >
          <Text
            style={[
              styles.text,
              {
                color: isUserMessage ? '#FFFFFF' : theme.text,
                fontSize: fontSizes.md,
              },
            ]}
          >
            {text}
          </Text>
        </View>

        {/* ── Timestamp ── */}
        {timestamp && (
          <Text
            style={[
              styles.time,
              {
                color: theme.textSecondary,
                fontSize: fontSizes.xs,
                textAlign: isUserMessage ? 'right' : 'left',
              },
            ]}
          >
            {timestamp}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginVertical: spacings.sm,
    marginHorizontal: spacings.md,
    alignItems: 'flex-end',
    gap: spacings.sm,
  },
  wrapperUser: {
    justifyContent: 'flex-end',
  },
  wrapperBot: {
    justifyContent: 'flex-start',
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  avatarEmoji: {
    fontSize: 18,
  },

  column: {
    flex: 1,
    maxWidth: '85%',
  },

  
  bubble: {
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.md,
    borderRadius: borderRadius.xl,
    marginBottom: spacings.xs,
  },
  bubbleUser: {
    borderBottomRightRadius: borderRadius.sm,
  },
  bubbleBot: {
    borderBottomLeftRadius: borderRadius.sm,
  },

  text: {
    lineHeight: 20,
  },

  time: {
    fontWeight: 300,
    marginHorizontal: spacings.sm,
  },
});
