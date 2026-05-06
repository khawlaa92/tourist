import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacings } from '../../constants/theme';

export const BrandLogo = ({
  size = 'md',
  variant = 'full',
  color = '#c41e3a',
}) => {
  const sizeMap = {
    sm: { icon: 34, text: 12, subtext: 10, ring: 3 },
    md: { icon: 44, text: 15, subtext: 11, ring: 4 },
    lg: { icon: 60, text: 18, subtext: 13, ring: 5 },
    xl: { icon: 84, text: 24, subtext: 16, ring: 6 },
  };

  const s = sizeMap[size] || sizeMap.md;
  const iconSize = s.icon;
  const innerSize = iconSize * 0.7;
  const needleHeight = iconSize * 0.32;
  const needleWidth = iconSize * 0.14;

  const Mark = () => (
    <View
      style={[
        styles.markWrapper,
        {
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize / 2,
          borderWidth: s.ring,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.innerCircle,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
          },
        ]}
      />
      <View
        style={[
          styles.needleUp,
          {
            top: iconSize * 0.14,
            borderLeftWidth: needleWidth,
            borderRightWidth: needleWidth,
            borderBottomWidth: needleHeight,
            borderBottomColor: color,
          },
        ]}
      />
      <View
        style={[
          styles.needleDown,
          {
            bottom: iconSize * 0.14,
            borderLeftWidth: needleWidth,
            borderRightWidth: needleWidth,
            borderTopWidth: needleHeight * 0.82,
          },
        ]}
      />
      <View
        style={[
          styles.centerDot,
          {
            width: iconSize * 0.16,
            height: iconSize * 0.16,
            borderRadius: iconSize * 0.08,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );

  if (variant === 'icon') {
    return (
      <View style={styles.iconContainer}>
        <Mark />
      </View>
    );
  }

  if (variant === 'text') {
    return (
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.logoText,
            {
              fontSize: s.text * 1.15,
              fontWeight: '800',
              color,
            },
          ]}
        >
          TourAssist AI
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <Mark />
      <View style={styles.textBlock}>
        <Text
          style={[
            styles.logoText,
            {
              fontSize: s.text,
              fontWeight: '800',
              color,
              lineHeight: s.text * 1.1,
            },
          ]}
        >
          TourAssist
        </Text>
        <Text
          style={[
            styles.logoSubtext,
            {
              fontSize: s.subtext,
              fontWeight: '700',
              color,
              lineHeight: s.subtext * 1.1,
            },
          ]}
        >
          Smart Travel Guide
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
  textBlock: {
    marginLeft: spacings.md,
  },
  markWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerCircle: {
    position: 'absolute',
    backgroundColor: '#F8EFF0',
  },
  needleUp: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  needleDown: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1F2937',
  },
  centerDot: {
    position: 'absolute',
  },
  logoText: {
    letterSpacing: 0.5,
  },
  logoSubtext: {
    opacity: 0.82,
    letterSpacing: 0.4,
  },
});
