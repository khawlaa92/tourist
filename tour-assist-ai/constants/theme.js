/**
 * TourAssist AI Professional Theme Configuration
 * Red and White theme inspired by Tunisia flag 🇹🇳
 * 
 * Enhanced with:
 * - Better color contrast and accessibility
 * - Surface colors for better visual hierarchy
 * - Shadow/elevation utilities
 * - Gradient definitions
 * - Animation timing constants
 */

export const lightTheme = {
  // Core colors
  primary: '#c41e3a', // Tunisia red - Main brand color
  secondary: '#FFFFFF', // White
  accent: '#FF5252', // Brighter red for accents
  
  // Backgrounds & Surfaces
  background: '#FFFFFF',
  surface: '#F8F9FA', // Subtle gray background
  surfaceElevated: '#FFFFFF', // Cards, elevated sections
  card: '#F5F6F7', // Card backgrounds
  
  // Text colors
  text: '#1a1a1a', // Primary text
  textSecondary: '#666666', // Secondary text
  textTertiary: '#999999', // Tertiary text
  textInverse: '#FFFFFF', // Text on dark backgrounds
  
  // States & Feedback
  border: '#E8E8E8', // Slightly more defined borders
  divider: '#F0F0F0', // Dividers
  error: '#D84343', // Error states
  success: '#36B37E', // Success states
  warning: '#FFAB00', // Warning states
  info: '#0052CC', // Info states
  
  // Semantic colors
  lightRed: '#F8EFF0', // Light red tint
  lightGray: '#F5F5F5', // Light gray
  disabledBg: '#F0F0F0',
  disabledText: '#CCCCCC',
};

export const darkTheme = {
  // Core colors
  primary: '#c41e3a', // Tunisia red - Stays consistent
  secondary: '#2a2a2a', // Dark background
  accent: '#FF6B6B', // Lighter red for dark mode
  
  // Backgrounds & Surfaces
  background: '#121212', // Dark background (better for OLED)
  surface: '#1E1E1E', // Subtle elevation
  surfaceElevated: '#2A2A2A', // Cards, elevated sections
  card: '#252525', // Card backgrounds
  
  // Text colors
  text: '#FFFFFF', // Primary text
  textSecondary: '#B0B0B0', // Secondary text
  textTertiary: '#808080', // Tertiary text
  textInverse: '#1a1a1a', // Text on light backgrounds
  
  // States & Feedback
  border: '#3A3A3A', // Dark mode borders
  divider: '#2A2A2A', // Dividers
  error: '#FF5252', // Error states (more visible in dark)
  success: '#36B37E', // Success states
  warning: '#FFA500', // Warning states
  info: '#4A90E2', // Info states
  
  // Semantic colors
  darkRed: '#8B0000',
  darkGray: '#242424',
  disabledBg: '#2A2A2A',
  disabledText: '#606060',
};

export const spacings = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  screenPadding: 16, // Standard screen padding
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  displayLg: 36,
  displayXl: 48,
};

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 100,
};

// Shadow utilities for elevation
export const shadows = {
  none: {
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  xs: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sm: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  md: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  lg: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  xl: {
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
};

// Animation timing
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

// Line heights for typography
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// Legacy Colors export (for backward compatibility)
export const Colors = {
  light: {
    text: '#1a1a1a',
    background: '#FFFFFF',
    tint: '#c41e3a',
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: '#c41e3a',
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: '#FF6B6B',
    icon: '#B0B0B0',
    tabIconDefault: '#808080',
    tabIconSelected: '#FF6B6B',
  },
};

// Gradient definitions for future use
export const gradients = {
  primary: ['#c41e3a', '#FF5252'], // Red gradient
  success: ['#36B37E', '#56CCF2'], // Green to blue
  warning: ['#FFAB00', '#FF7A45'], // Orange to red-orange
  error: ['#D84343', '#FF5252'], // Dark red to bright red
  cool: ['#0052CC', '#0099FF'], // Cool blue gradient
};
