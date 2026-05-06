/**
 * Header.js — Professional Redesigned Version
 *
 * Enhancements:
 * - Better typography and spacing
 * - Improved visual hierarchy
 * - Better elevation and shadows
 * - Smoother interactions
 * - Enhanced accessibility
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { spacings, fontSizes } from '../../constants/theme';

export const Header = ({
  title,
  showThemeToggle = false,
  onPressBack,
  rightComponent,
}) => {
  const { theme, isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const fallbackBackAction =
    !onPressBack && navigation?.canGoBack?.() ? () => navigation.goBack() : null;
  const backAction = onPressBack || fallbackBackAction;

  return (
    <>
      <StatusBar
        backgroundColor={theme.primary}
        barStyle="light-content"
        animated={true}
      />
      <SafeAreaView style={{ backgroundColor: theme.primary }}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.primary || '#c41e3a',
            },
          ]}
        >
          <View style={styles.content}>
            {/* ── Left: Back Button + Title ── */}
            <View style={styles.leftSection}>
              {backAction && (
                <TouchableOpacity
                  onPress={backAction}
                  style={styles.backButton}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
              )}
              <Text
                style={[
                  styles.title,
                  {
                    fontSize: fontSizes.lg,
                    fontWeight: 700,
                  },
                ]}
                numberOfLines={1}
              >
                {title}
              </Text>
            </View>

            {/* ── Right: Custom Component + Theme Toggle ── */}
            {(showThemeToggle || rightComponent) && (
              <View style={styles.rightSection}>
                {rightComponent && rightComponent}
                {showThemeToggle && (
                  <TouchableOpacity
                    onPress={toggleTheme}
                    style={styles.themeToggle}
                    activeOpacity={0.75}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Text style={styles.themeIcon}>
                      {isDarkMode ? '☀️' : '🌙'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.md,
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacings.md,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacings.md,
  },
  backButton: {
    padding: spacings.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: fontSizes.xl,
    fontWeight: 700,
    lineHeight: 24,
  },
  title: {
    color: '#FFFFFF',
    flex: 1,
  },
  themeToggle: {
    padding: spacings.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
});
