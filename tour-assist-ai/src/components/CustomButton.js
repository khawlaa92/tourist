/**
 * CustomButton.js — Simplified & Stable Version
 */

import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemeContext } from '../context/ThemeContext';

export const CustomButton = ({
  title,
  onPress,
  variant = 'filled',
  size = 'md',
  style,
  disabled = false,
  loading = false,
  icon,
  rightIcon,
  fullWidth = false,
}) => {
  const { theme } = useContext(ThemeContext);

  // Size configs
  const sizeConfig = {
    sm: { paddingVertical: 8, paddingHorizontal: 12, fontSize: 13, minHeight: 36 },
    md: { paddingVertical: 12, paddingHorizontal: 16, fontSize: 15, minHeight: 44 },
    lg: { paddingVertical: 16, paddingHorizontal: 20, fontSize: 17, minHeight: 52 },
  };

  // Variant configs
  const variantConfig = {
    filled: {
      bg: disabled ? '#D0D0D0' : theme.primary,
      textColor: disabled ? '#666666' : '#FFFFFF',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    outlined: {
      bg: 'transparent',
      textColor: disabled ? '#666666' : theme.primary,
      borderColor: disabled ? '#CCCCCC' : theme.primary,
      borderWidth: 1.5,
    },
    ghost: {
      bg: 'transparent',
      textColor: disabled ? '#666666' : theme.primary,
      borderColor: 'transparent',
      borderWidth: 0,
    },
    text: {
      bg: 'transparent',
      textColor: disabled ? '#666666' : theme.primary,
      borderColor: 'transparent',
      borderWidth: 0,
    },
  };

  const sConfig = sizeConfig[size] || sizeConfig.md;
  const vConfig = variantConfig[variant] || variantConfig.filled;

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      onPress?.();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          paddingVertical: sConfig.paddingVertical,
          paddingHorizontal: sConfig.paddingHorizontal,
          minHeight: sConfig.minHeight,
          backgroundColor: vConfig.bg,
          borderColor: vConfig.borderColor,
          borderWidth: vConfig.borderWidth,
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={vConfig.textColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && <Text style={[styles.icon, { fontSize: sConfig.fontSize }]}>{icon}</Text>}
          <Text
            style={[
              styles.text,
              {
                fontSize: sConfig.fontSize,
                color: vConfig.textColor,
              },
            ]}
          >
            {title}
          </Text>
          {rightIcon && <Text style={[styles.icon, { fontSize: sConfig.fontSize }]}>{rightIcon}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    lineHeight: 24,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
