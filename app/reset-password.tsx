import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setSessionFromTokens(
      accessToken: string,
      refreshToken: string,
    ): Promise<boolean> {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) {
        if (!cancelled) setError('Link expired or invalid. Request a new password reset.');
        return false;
      }
      return true;
    }

    function parseTokens(url: string): { accessToken: string; refreshToken: string } | null {
      // Mobile deep link: aaspaas://reset-password#access_token=xxx&type=recovery&refresh_token=yyy
      // Web fallback: window.location.hash = #access_token=xxx&type=recovery&refresh_token=yyy
      const hash = url.split('#')[1];
      if (!hash) return null;

      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const type = params.get('type');

      if (type !== 'recovery' || !accessToken) return null;
      return { accessToken, refreshToken: refreshToken ?? '' };
    }

    // Set up URL event listener up-front so it's ready when deep links arrive
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Don't bother parsing if already handled
      if (!cancelled && !error) {
        const tokens = parseTokens(url);
        if (tokens) {
          setSessionFromTokens(tokens.accessToken, tokens.refreshToken).then((ok) => {
            if (ok && !cancelled) {
              clearTimeout(timer);
              setInitializing(false);
            }
          });
        }
      }
    });

    const timer = setTimeout(() => {
      // Only show timeout error if we haven't succeeded yet
      if (!cancelled) {
        setInitializing(false);
        setError('No reset link found. Request a new password reset from the app.');
      }
    }, 3000);

    async function handleDeepLink() {
      try {
        // 1. Try the initial URL (app opened via deep link on cold start)
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          const tokens = parseTokens(initialUrl);
          if (tokens) {
            const ok = await setSessionFromTokens(tokens.accessToken, tokens.refreshToken);
            if (ok && !cancelled) {
              clearTimeout(timer);
              setInitializing(false);
            }
            return;
          }
        }

        // 2. Web fallback — check window.location.hash directly
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const webUrl = window.location.href;
          const tokens = parseTokens(webUrl);
          if (tokens) {
            const ok = await setSessionFromTokens(tokens.accessToken, tokens.refreshToken);
            if (ok && !cancelled) {
              clearTimeout(timer);
              setInitializing(false);
            }
            return;
          }
        }

        // 3. If user is already authenticated (session set by another method),
        //    they navigated here legitimately — show the form
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          clearTimeout(timer);
          if (!cancelled) setInitializing(false);
          return;
        }
      } catch {
        if (!cancelled) {
          setInitializing(false);
          setError('Something went wrong. Try requesting a new reset link.');
        }
      }
    }

    handleDeepLink();

    return () => {
      cancelled = true;
      subscription.remove();
      clearTimeout(timer);
    };
  }, []);

  async function handleUpdatePassword() {
    if (!password.trim() || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: password.trim(),
    });
    setLoading(false);

    if (updateError) {
      Alert.alert('Error', updateError.message);
      return;
    }

    // Sign out so the user must sign in with their new password
    await supabase.auth.signOut();

    Alert.alert(
      'Password updated',
      'Your password has been reset successfully. Sign in with your new password.',
      [{ text: 'OK', onPress: () => router.replace('/(auth)/auth') }]
    );
  }

  // --- Initial loading: verifying the deep link ---
  if (initializing) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.helperText, { color: colors.icon, marginTop: 16 }]}>
          Verifying reset link...
        </Text>
      </View>
    );
  }

  // --- Error state: link was invalid / expired ---
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerBlock}>
          <Text style={styles.lockEmoji}>❌</Text>
          <Text style={[styles.title, { color: colors.text, textAlign: 'center' }]}>{error}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.tint, marginTop: 24 }]}
            onPress={() => router.replace('/(auth)/forgot-password')}
          >
            <Text style={styles.buttonText}>Request New Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // --- Normal form: user can set a new password ---
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.top}>
        <Text style={styles.lockEmoji}>🔐</Text>
        <Text style={[styles.title, { color: colors.text }]}>Set new password</Text>
        <Text style={[styles.helperText, { color: colors.icon }]}>
          Enter your new password below.
        </Text>
      </View>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0',
            color: colors.text,
          },
        ]}
        placeholder="New password"
        placeholderTextColor={colors.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoFocus
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0',
            color: colors.text,
          },
        ]}
        placeholder="Confirm new password"
        placeholderTextColor={colors.icon}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={handleUpdatePassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Password'}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { alignItems: 'center', paddingTop: 80, marginBottom: 32 },
  centerBlock: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  lockEmoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  helperText: { fontSize: 15, marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },
  input: { fontSize: 16, padding: 16, borderRadius: 12, marginBottom: 12 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
