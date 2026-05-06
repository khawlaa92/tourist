import React, { useContext, useMemo, useState } from 'react';
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
import { requestPasswordReset } from '../src/services/auth';

export const ForgotPasswordScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const handleRequestReset = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    setSubmitError('');

    if (!normalizedEmail) {
      setEmailError('Email is required.');
      return;
    }

    if (!emailRegex.test(normalizedEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setEmailError('');

    try {
      setIsLoading(true);
      const result = await requestPasswordReset({ email: normalizedEmail });
      navigation.navigate('VerifyResetCode', {
        email: normalizedEmail,
        expiresAt: result.expiresAt,
        resendAvailableAt: result.resendAvailableAt,
        otpLength: result.otpLength || 6,
      });
    } catch (error) {
      setSubmitError(error.message || 'Unable to request a password reset.');
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
          <Text style={[styles.title, { color: theme.text }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Enter your email and we’ll send a verification code so you can reset your
            password securely.
          </Text>

          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            errorMessage={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          {submitError ? (
            <Text style={[styles.errorText, { color: theme.error }]}>{submitError}</Text>
          ) : null}

          <CustomButton
            title="Send Code"
            onPress={handleRequestReset}
            size="lg"
            style={styles.primaryButton}
            loading={isLoading}
            fullWidth
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Remembered your password?
          </Text>
          <CustomButton
            title="Login"
            variant="text"
            size="sm"
            onPress={() => navigation.navigate('Login')}
            style={styles.linkButton}
          />
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
    marginBottom: spacings.sm,
    textAlign: 'center',
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
  primaryButton: {
    marginTop: spacings.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacings.lg,
  },
  footerText: {
    fontSize: fontSizes.md,
  },
  linkButton: {
    paddingHorizontal: 0,
  },
});
