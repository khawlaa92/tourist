/**
 * Divider.js — Professional Divider Component
 *
 * Flexible divider/separator for visual separation
 */

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, fontSizes } from '../../constants/theme';

export const Divider = ({
  type = 'solid', // 'solid' | 'dashed'
  orientation ='horizontal', // 'horizontal' | 'vertical'
  text,
  style,
  thickness = 1,
  margin = spacings.md,
}) => {
  const { theme } = useContext(ThemeContext);

  const borderStyle = type === 'dashed' ? 'dashed' : 'solid';
  const color = theme.divider;

  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.verticalDivider,
          {
            borderLeftColor: color,
            borderLeftWidth: thickness,
            marginHorizontal: margin,
          },
          style,
        ]}
      />
    );
  }

  // Horizontal divider
  if (text) {
    return (
      <View style={[styles.textDividerContainer, { marginVertical: margin }]}>
        <View
          style={[
            styles.divider,
            {
              borderBottomColor: color,
              borderBottomWidth: thickness,
              borderBottomStyle: borderStyle,
              flex: 1,
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            {
              color: theme.textSecondary,
              fontSize: fontSizes.sm,
              marginHorizontal: spacings.md,
            },
          ]}
        >
          {text}
        </Text>
        <View
          style={[
            styles.divider,
            {
              borderBottomColor: color,
              borderBottomWidth: thickness,
              borderBottomStyle: borderStyle,
              flex: 1,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.divider,
        {
          borderBottomColor: color,
          borderBottomWidth: thickness,
          borderBottomStyle: borderStyle,
          marginVertical: margin,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 0,
  },
  verticalDivider: {
    height: '100%',
    width: 0,
  },
  textDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: 500,
  },
});
