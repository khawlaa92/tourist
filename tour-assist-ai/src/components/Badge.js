/**
 * Badge.js — Professional Badge Component
 *
 * Flexible badge for labels, tags, and status indicators
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, borderRadius, fontSizes } from '../../constants/theme';

export const Badge = ({
  label,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'error' | 'info'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  style,
}) => {
  const { theme } = useContext(ThemeContext);

  const variantConfig = {
    primary: {
      bgColor: theme.primary,
      textColor: '#FFFFFF',
    },
    success: {
      bgColor: theme.success,
      textColor: '#FFFFFF',
    },
    warning: {
      bgColor: theme.warning,
      textColor: '#FFFFFF',
    },
    error: {
      bgColor: theme.error,
      textColor: '#FFFFFF',
    },
    info: {
      bgColor: theme.info,
      textColor: '#FFFFFF',
    },
    subtle: {
      bgColor: theme.surface,
      textColor: theme.primary,
    },
  };

  const sizeConfig = {
    sm: {
      paddingHorizontal: spacings.sm,
      paddingVertical: 2,
      fontSize: fontSizes.xs,
    },
    md: {
      paddingHorizontal: spacings.md,
      paddingVertical: spacings.xs,
      fontSize: fontSizes.sm,
    },
    lg: {
      paddingHorizontal: spacings.lg,
      paddingVertical: spacings.sm,
      fontSize: fontSizes.md,
    },
  };

  const config = variantConfig[variant] || variantConfig.primary;
  const sizeStyle = sizeConfig[size] || sizeConfig.md;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.bgColor,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          paddingVertical: sizeStyle.paddingVertical,
        },
        style,
      ]}
    >
      {icon && <Text style={[styles.icon, { fontSize: sizeStyle.fontSize }]}>{icon}</Text>}
      <Text
        style={[
          styles.label,
          {
            color: config.textColor,
            fontSize: sizeStyle.fontSize,
            fontWeight: 600,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    gap: spacings.xs,
  },
  icon: {
    lineHeight: 18,
  },
  label: {
    letterSpacing: 0.2,
  },
});
