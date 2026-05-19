import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      Alert.alert('Error', 'Enter your email address');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'aaspaas://reset-password',
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert(
      'Check your email',
      'We sent you a password reset link. Please check your inbox.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.top}>
        <Text style={styles.lockEmoji}>🔐</Text>
        <Text style={[styles.title, { color: colors.text }]}>Reset password</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Enter your email and we'll send you a reset link.
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
        placeholder="Email"
        placeholderTextColor={colors.icon}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoFocus
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
        <Text style={[styles.backLinkText, { color: colors.icon }]}>
          Back to sign in
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { alignItems: 'center', paddingTop: 80, marginBottom: 32 },
  lockEmoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 8, textAlign: 'center', paddingHorizontal: 20 },
  input: { fontSize: 16, padding: 16, borderRadius: 12, marginBottom: 12 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  backLink: { alignItems: 'center', marginTop: 20 },
  backLinkText: { fontSize: 14 },
});
