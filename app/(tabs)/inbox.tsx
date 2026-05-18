import { StyleSheet, View, Text } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={styles.emoji}>💬</Text>
      <Text style={[styles.title, { color: colors.text }]}>Inbox</Text>
      <Text style={[styles.subtitle, { color: colors.icon }]}>
        Messages and notifications will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
