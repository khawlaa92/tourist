/**
 * LocationCard.js — Professional Redesigned Version
 *
 * Enhancements:
 * - Better visual hierarchy
 * - Improved spacing and alignment
 * - Better typography
 * - Enhanced shadows and elevation
 * - More polished design with smooth transitions
 */

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, borderRadius, fontSizes } from '../../constants/theme';

const CATEGORY_COLORS = {
  MONUMENT: '#E63946',
  BEACH: '#457B9D',
  DESERT: '#E9C46A',
  CITY: '#2A9D8F',
  NATURE: '#52B788',
};

export const LocationCard = ({
  title,
  description,
  distance,
  onPress,
  rating,
  emoji,
  category,
  tips,
}) => {
  const { theme } = useContext(ThemeContext);
  const catColor = CATEGORY_COLORS[category] || theme.primary;
  const ratingValue = rating ? parseFloat(rating) : 0;
  const stars = '★'.repeat(Math.floor(ratingValue));

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.surfaceElevated || theme.background,
          borderColor: theme.divider || '#E0E0E0',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {/* ── Header with Emoji & Title ── */}
      <View style={styles.header}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <View style={styles.titleSection}>
          <Text
            style={[
              styles.title,
              {
                color: theme.text,
                fontSize: fontSizes.lg,
                fontWeight: 700,
              },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {rating && (
            <View style={styles.ratingBadge}>
              <Text style={[styles.stars, { color: '#FFB800' }]}>
                {stars}
              </Text>
              <Text style={[styles.ratingValue, { color: theme.textSecondary }]}>
                {rating}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Description ── */}
      <Text
        style={[
          styles.description,
          {
            color: theme.textSecondary,
            fontSize: fontSizes.sm,
          },
        ]}
        numberOfLines={2}
      >
        {description}
      </Text>

      {/* ── Footer with Distance & Category ── */}
      <View style={styles.footer}>
        <View style={styles.distanceSection}>
          {distance && (
            <Text
              style={[
                styles.distance,
                {
                  color: theme.primary,
                  fontSize: fontSizes.xs,
                  fontWeight: 600,
                },
              ]}
            >
              📍 {distance}
            </Text>
          )}
        </View>

        {category && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: catColor + '15',
                borderColor: catColor,
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: catColor,
                  fontSize: fontSizes.xs,
                  fontWeight: 600,
                },
              ]}
            >
              {category.charAt(0) + category.slice(1).toLowerCase()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacings.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacings.md,
    gap: spacings.md,
  },
  emoji: {
    fontSize: 32,
    flexShrink: 0,
    lineHeight: 40,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    marginBottom: spacings.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.xs,
  },
  stars: {
    fontSize: fontSizes.sm,
    fontWeight: 700,
  },
  ratingValue: {
    fontSize: fontSizes.xs,
    fontWeight: 600,
  },
  description: {
    lineHeight: 20,
    marginBottom: spacings.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacings.md,
  },
  distanceSection: {
    flex: 1,
  },
  distance: {},
  badge: {
    paddingHorizontal: spacings.md,
    paddingVertical: spacings.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  badgeText: {},
});
