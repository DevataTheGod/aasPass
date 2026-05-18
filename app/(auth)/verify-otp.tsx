import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function VerifyOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!code || code.length < 4) {
      Alert.alert('Error', 'Enter the code sent to your phone');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phone!,
      token: code,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    // Auth provider picks up session, router guard handles redirect
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: colors.text }]}>Enter the code</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Sent to {phone}
        </Text>
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="000000"
        placeholderTextColor={colors.icon}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        autoFocus
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={handleVerify}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { paddingTop: 60, marginBottom: 32 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 8 },
  input: { fontSize: 24, padding: 16, borderRadius: 12, marginBottom: 16, textAlign: 'center', letterSpacing: 8 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
