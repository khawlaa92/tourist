/**
 * Logo.js — Professional TourAssist AI Logo
 *
 * Simple, modern logo combining:
 * - A compass rose (travel/navigation symbol)
 * - Tunisia's red color (#c41e3a)
 * - Clean, minimalist design
 * - Emoji-based for simplicity and universal compatibility
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacings } from '../../constants/theme';

export const Logo = ({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  variant = 'full', // 'icon' | 'text' | 'full'
  color = '#c41e3a',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 12 },
    md: { icon: 32, text: 14 },
    lg: { icon: 48, text: 16 },
    xl: { icon: 64, text: 20 },
  };

  const s = sizeMap[size] || sizeMap.md;

  // Icon-only variant (just compass)
  if (variant === 'icon') {
    return (
      <View style={styles.iconContainer}>
        <Text style={{ fontSize: s.icon }}>🧭</Text>
      </View>
    );
  }

  // Text-only variant
  if (variant === 'text') {
    return (
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.logoText,
            {
              fontSize: s.text * 1.2,
              fontWeight: 700,
              color,
            },
          ]}
        >
          TourAssist
        </Text>
      </View>
    );
  }

  // Full variant (icon + text)
  return (
    <View style={styles.fullContainer}>
      <Text
        style={{
          fontSize: s.icon,
          lineHeight: s.icon,
          marginRight: spacings.sm,
        }}
      >
        🧭
      </Text>
      <View>
        <Text
          style={[
            styles.logoText,
            {
              fontSize: s.text,
              fontWeight: 800,
              color,
              lineHeight: s.text * 1.2,
            },
          ]}
        >
          Tour
        </Text>
        <Text
          style={[
            styles.logoSubtext,
            {
              fontSize: s.text * 0.8,
              fontWeight: 600,
              color,
              lineHeight: s.text * 0.9,
            },
          ]}
        >
          Assist AI
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    letterSpacing: 0.5,
  },
  logoSubtext: {
    opacity: 0.8,
    letterSpacing: 0.3,
  },
});
