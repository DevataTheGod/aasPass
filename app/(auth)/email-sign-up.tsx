import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function EmailSignUpScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    Alert.alert(
      'Check your email',
      'We sent you a confirmation link. Please check your inbox and click the link to verify your account, then sign in.',
      [{ text: 'OK', onPress: () => router.replace('/(auth)/email-sign-in') }]
    );
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: colors.text }]}>Create account</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Sign up with your email to get started.
        </Text>
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="Email"
        placeholderTextColor={colors.icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus
      />
      <TextInput
        style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="Password (min 6 characters)"
        placeholderTextColor={colors.icon}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/email-sign-in')}>
        <Text style={[styles.linkText, { color: colors.icon }]}>
          Already have an account?{' '}
          <Text style={{ color: colors.tint, fontWeight: '600' }}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { paddingTop: 60, marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 8 },
  input: { fontSize: 16, padding: 16, borderRadius: 12, marginBottom: 12 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: 20 },
  linkText: { fontSize: 14 },
});
