import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';
import type { College } from '@/types';

const MOCK_COLLEGES: College[] = [
  { id: '1', name: 'St. Xavier\'s College', city: 'Mumbai' },
  { id: '2', name: 'HR College of Commerce', city: 'Mumbai' },
  { id: '3', name: 'NMIMS University', city: 'Mumbai' },
  { id: '4', name: 'VJTI', city: 'Mumbai' },
  { id: '5', name: 'IIT Bombay', city: 'Mumbai' },
  { id: '6', name: 'SP Jain Institute of Management', city: 'Mumbai' },
  { id: '7', name: 'Sophia College', city: 'Mumbai' },
  { id: '8', name: 'Mithibai College', city: 'Mumbai' },
  { id: '9', name: 'KJ Somaiya College', city: 'Mumbai' },
  { id: '10', name: 'Ramnarain Ruia College', city: 'Mumbai' },
];

export default function CollegeSelectScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const setSelectedCollege = useAppStore((s) => s.setSelectedCollege);
  const [search, setSearch] = useState('');

  const filtered = MOCK_COLLEGES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleSelect(college: College) {
    setSelectedCollege(college);
    router.push('/(onboarding)/profile-setup');
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <Text style={[styles.title, { color: colors.text }]}>Your College</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Select your college to see what's happening around campus.
        </Text>
      </View>

      <TextInput
        style={[styles.search, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
        placeholder="Search colleges..."
        placeholderTextColor={colors.icon}
        value={search}
        onChangeText={setSearch}
        autoFocus
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.collegeItem, { borderBottomColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}
            onPress={() => handleSelect(item)}
          >
            <Text style={[styles.collegeName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.collegeCity, { color: colors.icon }]}>{item.city}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.icon }]}>No colleges found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  top: { paddingTop: 60, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 15, marginTop: 8, lineHeight: 20 },
  search: { fontSize: 16, padding: 14, borderRadius: 12, marginBottom: 16 },
  list: { gap: 0 },
  collegeItem: { paddingVertical: 16, borderBottomWidth: 1 },
  collegeName: { fontSize: 16, fontWeight: '500' },
  collegeCity: { fontSize: 13, marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 15 },
});
