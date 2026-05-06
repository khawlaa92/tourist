import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemeContext } from '../src/context/ThemeContext';
import { CustomButton } from '../src/components/CustomButton';
import { CustomInput } from '../src/components/CustomInput';
import { BrandLogo } from '../src/components/BrandLogo';
import { spacings, fontSizes, borderRadius } from '../constants/theme';
import { loginUser } from '../src/services/auth';

export const LoginScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleLogin = async () => {
    let hasError = false;
    setSubmitError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (!hasError) {
      try {
        setIsLoading(true);
        await loginUser({
          email: email.trim(),
          password,
        });
        navigation.replace('MainTabs');
      } catch (error) {
        setSubmitError(error.message || 'Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Title */}
        <Text
          style={[
            styles.title,
            {
              color: theme.text,
              fontSize: fontSizes.xxl,
            },
          ]}
        >
          Welcome Back
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: theme.textSecondary,
              fontSize: fontSizes.md,
            },
          ]}
        >
          Sign in to your account to continue exploring
        </Text>

        {/* Form */}
        <View style={styles.formContainer}>
          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            errorMessage={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            errorMessage={passwordError}
          />

          {/* Forgot Password */}
          <CustomButton
            title="Forgot Password?"
            variant="text"
            size="sm"
            style={styles.forgotButton}
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
          />
        </View>

        {submitError ? (
          <Text style={[styles.submitError, { color: theme.error }]}>
            {submitError}
          </Text>
        ) : null}

        {/* Login Button */}
        <CustomButton
          title="Login"
          onPress={handleLogin}
          size="lg"
          style={styles.loginButton}
          loading={isLoading}
        />

        {/* Sign Up Link */}
        <View style={styles.signupContainer}>
          <Text
            style={[
              {
                color: theme.textSecondary,
                fontSize: fontSizes.md,
              },
            ]}
          >
            Don&apos;t have an account?{' '}
          </Text>
          <CustomButton
            title="Sign Up"
            variant="text"
            size="sm"
            onPress={() => {
              navigation.navigate('Signup');
            }}
            style={styles.signupButton}
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
    marginBottom: spacings.xl,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: spacings.sm,
    marginBottom: spacings.lg,
  },
  submitError: {
    textAlign: 'center',
    marginBottom: spacings.md,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: spacings.lg,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacings.lg,
  },
  signupButton: {
    paddingHorizontal: 0,
  },
});
