import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function PhoneSignInScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    const cleaned = phone.trim();
    if (!cleaned) {
      Alert.alert('Error', 'Enter your phone number');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: cleaned });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    router.push({ pathname: '/(auth)/verify-otp', params: { phone: cleaned } });
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: colors.text }]}>Your phone number</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          You'll receive a code to verify.
        </Text>
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="+91 98765 43210"
        placeholderTextColor={colors.icon}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoFocus
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send Code'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => router.push('/(auth)/email-sign-in')}>
        <Text style={[styles.linkText, { color: colors.icon }]}>
          Use <Text style={{ color: colors.tint, fontWeight: '600' }}>email</Text> instead
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
  input: { fontSize: 18, padding: 16, borderRadius: 12, marginBottom: 16 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  link: { alignItems: 'center', marginTop: 20 },
  linkText: { fontSize: 14 },
});
