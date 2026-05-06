/**
 * CustomInput.js — Professional Redesigned Version
 *
 * Enhancements:
 * - Better focus and error states
 * - Improved spacing and typography
 * - Better accessibility
 * - Cleaner visual design
 * - Support for helper text and validation icons
 */

import React, { useContext, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, borderRadius, fontSizes } from '../../constants/theme';

export const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  label,
  errorMessage,
  helperText,
  style,
  icon,
  rightIcon,
  onBlurValidate,
  editable = true,
  maxLength,
  keyboardType = 'default',
  ...props
}) => {
  const { theme, isDarkMode } = useContext(ThemeContext);
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasError = !!errorMessage;
  const inputBorderColor = hasError
    ? theme.error
    : isFocused
      ? theme.primary
      : theme.border;
  const inputBackgroundColor = isDarkMode
    ? isFocused
      ? theme.surface
      : '#1E1E1E'
    : isFocused
      ? '#FAFAFA'
      : '#F5F6F7';

  return (
    <View style={[styles.container, style]}>
      {/* ── Label ── */}
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isFocused ? theme.primary : theme.text,
              fontSize: fontSizes.sm,
              fontWeight: 600,
            },
          ]}
        >
          {label}
        </Text>
      )}

      {/* ── Input Wrapper ── */}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: inputBackgroundColor,
            borderColor: inputBorderColor,
            borderWidth: isFocused || hasError ? 1.5 : 1,
          },
        ]}
      >
        {/* ── Left Icon ── */}
        {icon && (
          <Text style={[styles.inputIcon, { fontSize: fontSizes.lg }]}>
            {icon}
          </Text>
        )}

        {/* ── Input Field ── */}
        <TextInput
          style={[
            styles.input,
            {
              color: editable ? theme.text : theme.textSecondary,
              fontSize: fontSizes.md,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlurValidate?.();
          }}
          editable={editable}
          maxLength={maxLength}
          keyboardType={keyboardType}
          {...props}
        />

        {/* ── Right Action (Password toggle or custom) ── */}
        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.actionButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.actionIcon}>
              {showPassword ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <Text style={[styles.inputIcon, { fontSize: fontSizes.lg, marginLeft: spacings.sm }]}>
            {rightIcon}
          </Text>
        ) : hasError ? (
          <Text style={styles.actionIcon}>⚠️</Text>
        ) : null}
      </View>

      {/* ── Helper Text or Error Message ── */}
      {errorMessage ? (
        <Text style={[styles.errorText, { color: theme.error, fontSize: fontSizes.xs }]}>
          {errorMessage}
        </Text>
      ) : helperText ? (
        <Text
          style={[styles.helperText, { color: theme.textSecondary, fontSize: fontSizes.xs }]}
        >
          {helperText}
        </Text>
      ) : null}

      {/* ── Character Counter (if maxLength) ── */}
      {maxLength && (
        <Text
          style={[
            styles.counterText,
            {
              color: theme.textTertiary,
              fontSize: fontSizes.xs,
            },
          ]}
        >
          {value?.length || 0} / {maxLength}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacings.lg,
  },
  label: {
    marginBottom: spacings.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacings.md,
    minHeight: 48,
    transition: 'all 0.2s ease',
  },
  inputIcon: {
    marginRight: spacings.sm,
    flexShrink: 0,
  },
  input: {
    flex: 1,
    paddingVertical: spacings.md,
    paddingHorizontal: 0,
  },
  actionButton: {
    paddingLeft: spacings.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 18,
  },
  errorText: {
    marginTop: spacings.sm,
    fontWeight: 500,
  },
  helperText: {
    marginTop: spacings.sm,
  },
  counterText: {
    marginTop: spacings.xs,
    textAlign: 'right',
  },
});
