/**
 * Card.js — Professional Card Component
 *
 * Flexible card for container sections
 */

import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, borderRadius, shadows } from '../../constants/theme';

export const Card = ({
  children,
  elevated = true,
  padding = spacings.lg,
  borderRadius: radius = borderRadius.lg,
  style,
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.surfaceElevated,
          borderColor: theme.divider,
          padding,
          borderRadius: radius,
        },
        elevated && shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
});
