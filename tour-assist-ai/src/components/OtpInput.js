import React, { useContext, useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { borderRadius, fontSizes, shadows, spacings } from '../../constants/theme';

function sanitizeOtp(value, length) {
  return String(value || '')
    .replace(/\D/g, '')
    .slice(0, length);
}

export const OtpInput = ({
  value,
  onChange,
  length = 6,
  autoFocus = true,
  errorMessage,
  disabled = false,
  onComplete,
}) => {
  const { theme } = useContext(ThemeContext);
  const inputRef = useRef(null);
  const sanitizedValue = sanitizeOtp(value, length);

  useEffect(() => {
    if (!autoFocus || disabled) {
      return;
    }

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 250);

    return () => clearTimeout(timer);
  }, [autoFocus, disabled]);

  useEffect(() => {
    if (sanitizedValue.length === length) {
      onComplete?.(sanitizedValue);
    }
  }, [length, onComplete, sanitizedValue]);

  const handleChange = (nextValue) => {
    onChange?.(sanitizeOtp(nextValue, length));
  };

  const activeIndex = Math.min(sanitizedValue.length, length - 1);

  return (
    <Pressable
      onPress={() => inputRef.current?.focus()}
      style={styles.container}
      disabled={disabled}
    >
      <TextInput
        ref={inputRef}
        value={sanitizedValue}
        onChangeText={handleChange}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === 'android' ? 'sms-otp' : 'one-time-code'}
        importantForAutofill="yes"
        maxLength={length}
        editable={!disabled}
        style={styles.hiddenInput}
        caretHidden
      />

      <View style={styles.boxRow}>
        {Array.from({ length }).map((_, index) => {
          const digit = sanitizedValue[index] || '';
          const isFilled = Boolean(digit);
          const isActive = !disabled && (index === activeIndex || (sanitizedValue.length === length && index === length - 1));
          const borderColor = errorMessage
            ? theme.error
            : isActive
              ? theme.primary
              : theme.border;

          return (
            <View
              key={`otp-box-${index}`}
              style={[
                styles.box,
                {
                  borderColor,
                  backgroundColor: isFilled ? theme.surfaceElevated || '#FFFFFF' : theme.card,
                },
                isActive ? styles.boxActive : null,
              ]}
            >
              <Text style={[styles.boxText, { color: theme.text }]}>{digit || ''}</Text>
            </View>
          );
        })}
      </View>

      {errorMessage ? (
        <Text style={[styles.errorText, { color: theme.error }]}>{errorMessage}</Text>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    width: 1,
    height: 1,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacings.sm,
  },
  box: {
    flex: 1,
    minHeight: 62,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxActive: {
    ...shadows.sm,
  },
  boxText: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  errorText: {
    marginTop: spacings.sm,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
});
