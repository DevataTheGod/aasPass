import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/providers/auth-provider';
import { useAppStore } from '@/store/app-store';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const selectedCollege = useAppStore((s) => s.selectedCollege);
  const reset = useAppStore((s) => s.reset);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  async function handleLogout() {
    reset();
    await supabase.auth.signOut();
    router.replace('/(auth)/welcome');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <View style={[styles.avatar, { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f0f0f0' }]}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>
          {profile?.full_name ?? 'User'}
        </Text>
        <Text style={[styles.username, { color: colors.icon }]}>
          @{profile?.username ?? 'username'}
        </Text>
        <Text style={[styles.college, { color: colors.icon }]}>
          {selectedCollege?.name ?? profile?.college_name ?? ''}
        </Text>
      </View>

      <View style={[styles.stats, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff', borderColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}>
        <StatItem label="Posts" value="—" />
        <StatItem label="Comments" value="—" />
        <StatItem label="Connects" value="—" />
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}
        onPress={() => {
          Alert.alert('Logout', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: handleLogout },
          ]);
        }}
      >
        <Text style={[styles.logoutText, { color: colors.tint }]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.icon }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { alignItems: 'center', paddingTop: 40, marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '700' },
  username: { fontSize: 14, marginTop: 2 },
  college: { fontSize: 13, marginTop: 4 },
  stats: { flexDirection: 'row', padding: 20, borderRadius: 14, borderWidth: 1, marginBottom: 24 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 2 },
  logoutButton: { padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '600' },
});
