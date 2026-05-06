/**
 * LoadingSpinner.js — Professional Loading Component
 *
 * A beautiful, reusable loading spinner with optional text
 */

import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, fontSizes } from '../../constants/theme';

export const LoadingSpinner = ({
  size = 'large', // 'small' | 'large'
  color = undefined, // Uses theme.primary if not specified
  text = 'Loading...',
  fullscreen = false,
}) => {
  const { theme } = useContext(ThemeContext);
  const spinnerColor = color || theme.primary;

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {text && (
        <Text
          style={[
            styles.text,
            {
              color: theme.textSecondary,
              fontSize: fontSizes.md,
              marginTop: spacings.md,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );

  if (fullscreen) {
    return (
      <View
        style={[
          styles.fullscreenContainer,
          { backgroundColor: theme.background },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacings.xl,
  },
  fullscreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 500,
  },
});
