import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.top}>
        <Text style={styles.emoji}>👋</Text>
        <Text style={[styles.title, { color: colors.text }]}>AasPaas</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>
          Find your people nearby.
        </Text>
      </View>

      <View style={styles.features}>
        {[
          { emoji: '⚽', text: 'Find sports partners in your college' },
          { emoji: '📚', text: 'Study groups, café hops, hangouts' },
          { emoji: '💬', text: 'See what people near you are up to' },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={[styles.featureText, { color: colors.text }]}>{f.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tint }]}
          onPress={() => router.push('/(auth)/email-sign-up')}
        >
          <Text style={styles.buttonText}>Continue with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonOutline, { borderColor: colors.tint }]}
          onPress={() => router.push('/(auth)/phone-sign-in')}
        >
          <Text style={[styles.buttonOutlineText, { color: colors.tint }]}>Continue with Phone</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signInLink}
          onPress={() => router.push('/(auth)/email-sign-in')}
        >
          <Text style={[styles.signInText, { color: colors.icon }]}>
            Already have an account?{' '}
            <Text style={{ color: colors.tint, fontWeight: '600' }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  top: { alignItems: 'center', paddingTop: 80 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 36, fontWeight: '700' },
  subtitle: { fontSize: 16, marginTop: 8, textAlign: 'center' },
  features: { gap: 20, paddingVertical: 40 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  featureEmoji: { fontSize: 28 },
  featureText: { fontSize: 15, flex: 1 },
  bottom: { paddingBottom: 40, gap: 12 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  buttonOutline: { padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1.5 },
  buttonOutlineText: { fontSize: 17, fontWeight: '600' },
  signInLink: { alignItems: 'center', paddingVertical: 8 },
  signInText: { fontSize: 14 },
});
