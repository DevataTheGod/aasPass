import { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/app-store';
import { trackSignUp, trackLogin } from '@/lib/analytics';

type AuthTab = 'sign-up' | 'sign-in';

export default function AuthScreen() {
  const router = useRouter();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const setSelectedCollege = useAppStore((s) => s.setSelectedCollege);

  const [activeTab, setActiveTab] = useState<AuthTab>(
    initialTab === 'sign-in' ? 'sign-in' : 'sign-up'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    // If user already exists, auto sign them in directly
    if (error?.message?.toLowerCase().includes('already registered')) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        setLoading(false);
        Alert.alert('Error', 'Account exists but password is incorrect. Try signing in.');
        setActiveTab('sign-in');
        return;
      }

      // Sign-in succeeded — check profile and redirect directly
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profile) {
          setOnboardingComplete(true);
          if (profile.college_id && profile.college_name) {
            setSelectedCollege({
              id: profile.college_id,
              name: profile.college_name,
              city: '',
            });
          }
        }
      } else {
        // getUser() returned null — still set optimistic since sign-in succeeded
        setOnboardingComplete(true);
      }

      // Track the auto sign-in of an existing user
      trackLogin('email-exists');

      setLoading(false);
      router.replace('/(tabs)/feed');
      return;
    }

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    if (data?.session) {
      // Track successful sign up
      trackSignUp('email');
      // Auto-confirmed — new user, send to onboarding
      router.replace('/(onboarding)/college-select');
    } else {
      // Needs email confirmation
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link. Please check your inbox and click the link to verify your account.',
        [{ text: 'OK', onPress: () => setActiveTab('sign-in') }]
      );
    }
  }

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Enter email and password');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
      return;
    }

    // Sign-in succeeded — check profile and redirect directly
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profile) {
        setOnboardingComplete(true);
        if (profile.college_id && profile.college_name) {
          setSelectedCollege({
            id: profile.college_id,
            name: profile.college_name,
            city: '',
          });
        }
      }
    }

    // Track successful sign in
    trackLogin('email');

    setLoading(false);
    router.replace('/(tabs)/feed');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Tab switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sign-up' && { borderBottomWidth: 2, borderBottomColor: colors.tint },
          ]}
          onPress={() => { setActiveTab('sign-up'); setEmail(''); setPassword(''); }}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'sign-up' ? colors.tint : colors.icon },
            ]}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'sign-in' && { borderBottomWidth: 2, borderBottomColor: colors.tint },
          ]}
          onPress={() => { setActiveTab('sign-in'); setEmail(''); setPassword(''); }}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'sign-in' ? colors.tint : colors.icon },
            ]}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {activeTab === 'sign-up' ? 'Create your account' : 'Welcome back'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {activeTab === 'sign-up'
            ? 'Sign up to find your people nearby.'
            : 'Sign in to continue.'}
        </Text>
      </View>

      {/* Form */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0',
            color: colors.text,
          },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
        placeholder={activeTab === 'sign-up' ? 'Password (min 6 characters)' : 'Password'}
        placeholderTextColor={colors.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Forgot password (sign-in only) */}
      {activeTab === 'sign-in' && (
        <TouchableOpacity
          style={styles.forgotRow}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={[styles.forgotText, { color: colors.tint }]}>
            Forgot password?
          </Text>
        </TouchableOpacity>
      )}

      {/* Submit button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={activeTab === 'sign-up' ? handleSignUp : handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {activeTab === 'sign-up' ? 'Create Account' : 'Sign In'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Back to welcome */}
      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.replace('/(auth)/welcome')}
      >
        <Text style={[styles.backLinkText, { color: colors.icon }]}>
          Back
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  tabRow: { flexDirection: 'row', paddingTop: 60, marginBottom: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 17, fontWeight: '600' },
  header: { marginBottom: 28 },
  title: { fontSize: 24, fontWeight: '700', marginTop: 8 },
  subtitle: { fontSize: 15, marginTop: 6 },
  input: { fontSize: 16, padding: 16, borderRadius: 12, marginBottom: 12 },
  forgotRow: { alignItems: 'flex-end', marginBottom: 8, marginTop: -4 },
  forgotText: { fontSize: 14, fontWeight: '500' },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  backLink: { alignItems: 'center', marginTop: 20 },
  backLinkText: { fontSize: 14 },
});
