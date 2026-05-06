import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { OtpInput } from '../src/components/OtpInput';
import { borderRadius, fontSizes, shadows, spacings } from '../constants/theme';
import { resendVerificationCode, verifyEmailCode } from '../src/services/auth';

function formatCountdown(targetTime) {
  const remainingSeconds = Math.max(
    0,
    Math.ceil((new Date(targetTime || 0).getTime() - Date.now()) / 1000)
  );
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export const VerifyEmailScreen = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  const initialEmail = route?.params?.email || '';
  const otpLength = route?.params?.otpLength || 6;
  const [email] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(`Code sent to ${initialEmail}.`);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendAvailableAt, setResendAvailableAt] = useState(
    route?.params?.resendAvailableAt || new Date(Date.now() + 60000).toISOString()
  );
  const lastSubmittedCodeRef = useRef('');
  const [, forceTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceTick((value) => value + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const canResend = useMemo(
    () => new Date(resendAvailableAt || 0).getTime() <= Date.now(),
    [resendAvailableAt]
  );

  const handleVerify = async (nextCode = code) => {
    const normalizedCode = String(nextCode || '').trim();

    if (isVerifying || normalizedCode.length !== otpLength || lastSubmittedCodeRef.current === normalizedCode) {
      return;
    }

    setSubmitError('');
    setSuccessMessage('');
    lastSubmittedCodeRef.current = normalizedCode;

    try {
      setIsVerifying(true);
      await verifyEmailCode({
        email: email.trim(),
        code: normalizedCode,
      });
      setSuccessMessage('Email verified successfully.');
      navigation.replace('MainTabs');
    } catch (error) {
      setSubmitError(error.message || 'Unable to verify your email.');
      lastSubmittedCodeRef.current = '';
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) {
      return;
    }

    setSubmitError('');
    setSuccessMessage('');
    setCode('');
    lastSubmittedCodeRef.current = '';

    try {
      setIsResending(true);
      const response = await resendVerificationCode({ email: email.trim() });
      setResendAvailableAt(response.resendAvailableAt);
      setInfoMessage(`Code sent to ${email.trim()}.`);
    } catch (error) {
      setSubmitError(error.message || 'Unable to resend the verification code.');
    } finally {
      setIsResending(false);
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
          <Text style={[styles.title, { color: theme.text }]}>Verify Your Email</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Enter the {otpLength}-digit code we sent to {email}.
          </Text>

          <OtpInput
            value={code}
            onChange={setCode}
            length={otpLength}
            errorMessage={submitError}
            disabled={isVerifying}
            onComplete={handleVerify}
          />

          {infoMessage ? (
            <Text style={[styles.infoText, { color: theme.textSecondary }]}>{infoMessage}</Text>
          ) : null}
          {successMessage ? (
            <Text style={[styles.successText, { color: theme.success }]}>{successMessage}</Text>
          ) : null}

          <View style={styles.timerRow}>
            <Text style={[styles.timerLabel, { color: theme.textSecondary }]}>Code sent</Text>
            <Text style={[styles.timerValue, { color: theme.primary }]}>
              {canResend ? 'You can resend now' : `Resend in ${formatCountdown(resendAvailableAt)}`}
            </Text>
          </View>

          <CustomButton
            title="Verify Code"
            onPress={() => handleVerify(code)}
            size="lg"
            style={styles.primaryButton}
            loading={isVerifying}
            disabled={code.length !== otpLength}
            fullWidth
          />

          <CustomButton
            title="Resend Code"
            variant="outlined"
            size="lg"
            onPress={handleResend}
            loading={isResending}
            disabled={!canResend}
            fullWidth
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
    textAlign: 'center',
    marginBottom: spacings.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: spacings.xl,
    lineHeight: 24,
    fontSize: fontSizes.md,
  },
  infoText: {
    marginTop: spacings.md,
    textAlign: 'center',
    fontSize: fontSizes.sm,
  },
  successText: {
    marginTop: spacings.md,
    textAlign: 'center',
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  timerRow: {
    marginTop: spacings.lg,
    marginBottom: spacings.lg,
    alignItems: 'center',
    gap: spacings.xs,
  },
  timerLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  timerValue: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
  primaryButton: {
    marginBottom: spacings.md,
  },
});
