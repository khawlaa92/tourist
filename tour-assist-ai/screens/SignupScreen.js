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
import { borderRadius, fontSizes, spacings } from '../constants/theme';
import { registerUser } from '../src/services/auth';

export const SignupScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

  const validateForm = () => {
    const nextErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 3) {
      nextErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = async () => {
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await registerUser({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
      navigation.navigate('VerifyEmail', {
        email: email.trim(),
        expiresAt: result.expiresAt,
        resendAvailableAt: result.resendAvailableAt,
        otpLength: result.otpLength || 6,
      });
    } catch (error) {
      setSubmitError(error.message || 'Unable to create your account right now.');
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
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
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

        <Text style={[styles.title, { color: theme.text, fontSize: fontSizes.xxl }]}>
          Create Account
        </Text>
        <Text
          style={[
            styles.subtitle,
            { color: theme.textSecondary, fontSize: fontSizes.md },
          ]}
        >
          Join TourAssist AI and keep your travel tools, history, and sessions in one
          place.
        </Text>

        <View style={styles.formContainer}>
          <CustomInput
            label="Full Name"
            placeholder="Your full name"
            value={fullName}
            onChangeText={setFullName}
            errorMessage={errors.fullName}
            autoCapitalize="words"
          />

          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            errorMessage={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Password"
            placeholder="Enter a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            errorMessage={errors.password}
            autoCapitalize="none"
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            errorMessage={errors.confirmPassword}
            autoCapitalize="none"
          />
        </View>

        {submitError ? (
          <Text style={[styles.submitError, { color: theme.error }]}>{submitError}</Text>
        ) : null}

        <CustomButton
          title="Create Account"
          onPress={handleSignup}
          size="lg"
          style={styles.primaryButton}
          loading={isLoading}
        />

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Already have an account?{' '}
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
  container: {
    flex: 1,
  },
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
    marginBottom: spacings.xxl,
    paddingVertical: spacings.xl,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: spacings.md,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacings.xl,
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: spacings.lg,
  },
  submitError: {
    marginBottom: spacings.md,
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  primaryButton: {
    marginBottom: spacings.lg,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacings.sm,
  },
  footerText: {
    fontSize: fontSizes.md,
  },
  linkButton: {
    paddingHorizontal: 0,
  },
});
