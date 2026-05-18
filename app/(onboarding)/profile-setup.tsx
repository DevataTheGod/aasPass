import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAppStore } from '@/store/app-store';
import { useAuth } from '@/providers/auth-provider';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const selectedCollege = useAppStore((s) => s.selectedCollege);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!fullName.trim() || !username.trim()) {
      Alert.alert('Error', 'Fill in your name and username');
      return;
    }
    if (!user || !selectedCollege) return;

    setLoading(true);
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName.trim(),
      username: username.trim().toLowerCase(),
      college_id: selectedCollege.id,
      college_name: selectedCollege.name,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setOnboardingComplete(true);
    router.replace('/(tabs)/feed');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Your Profile</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          {selectedCollege?.name}
        </Text>
      </View>

      <TextInput
        style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="Full Name"
        placeholderTextColor={colors.icon}
        value={fullName}
        onChangeText={setFullName}
        autoFocus
      />
      <TextInput
        style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="Username"
        placeholderTextColor={colors.icon}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint, opacity: loading ? 0.5 : 1 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Setting up...' : 'Done'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { alignItems: 'center', paddingTop: 60, marginBottom: 32 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarEmoji: { fontSize: 36 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 4 },
  input: { fontSize: 16, padding: 16, borderRadius: 12, marginBottom: 12 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
