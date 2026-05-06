import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemeContext } from '../src/context/ThemeContext';
import { BrandLogo } from '../src/components/BrandLogo';
import { CustomButton } from '../src/components/CustomButton';
import { CustomInput } from '../src/components/CustomInput';
import { borderRadius, fontSizes, shadows, spacings } from '../constants/theme';
import { resetPassword } from '../src/services/auth';

export const ResetPasswordScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  const resetToken = route?.params?.resetToken || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!newPassword.trim()) {
      nextErrors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = 'Password must be at least 6 characters.';
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleResetPassword = async () => {
    setSubmitError('');
    setSuccessMessage('');

    if (!resetToken) {
      setSubmitError('Your reset session is missing or expired. Please request a new code.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword({
        resetToken,
        newPassword,
      });
      setSuccessMessage('Password updated successfully. You can now sign in.');
    } catch (error) {
      setSubmitError(error.message || 'Unable to reset your password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.backButtonText, { color: theme.primary }]}>Back</Text>
        </TouchableOpacity>

        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <BrandLogo size="xl" />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surfaceElevated || theme.background,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>Create New Password</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Choose a strong new password to finish your recovery flow.
          </Text>

          <CustomInput
            label="New Password"
            placeholder="Enter a new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            errorMessage={errors.newPassword}
            autoCapitalize="none"
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            errorMessage={errors.confirmPassword}
            autoCapitalize="none"
          />

          {submitError ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{submitError}</Text>
          ) : null}
          {successMessage ? (
            <Text style={[styles.successText, { color: theme.success }]}>{successMessage}</Text>
          ) : null}

          <CustomButton
            title="Update Password"
            onPress={handleResetPassword}
            size="lg"
            style={styles.primaryButton}
            loading={isLoading}
            fullWidth
          />

          {successMessage ? (
            <CustomButton
              title="Back To Login"
              variant="outlined"
              size="lg"
              onPress={() => navigation.navigate('Login')}
              fullWidth
            />
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacings.lg,
    paddingVertical: spacings.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacings.lg,
  },
  backButtonText: {
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacings.xl,
    paddingVertical: spacings.xl,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: borderRadius.xxl,
    padding: spacings.xl,
    ...shadows.sm,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacings.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacings.xl,
    lineHeight: 24,
    fontSize: fontSizes.md,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: spacings.md,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  successText: {
    textAlign: 'center',
    marginBottom: spacings.md,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: spacings.sm,
    marginBottom: spacings.md,
  },
});
