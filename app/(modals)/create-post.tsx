import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { useAppStore } from '@/store/app-store';
import { POST_CATEGORIES, type PostCategory } from '@/types';

export default function CreatePostScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const selectedCollege = useAppStore((s) => s.selectedCollege);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [loading, setLoading] = useState(false);

  async function handlePost() {
    if (!content.trim()) {
      Alert.alert('Error', 'Write something');
      return;
    }
    if (!user || !selectedCollege) return;

    setLoading(true);
    const { error } = await supabase.from('posts').insert({
      author_id: user.id,
      college_id: selectedCollege.id,
      category,
      content: content.trim(),
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    router.back();
  }

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancel, { color: colors.icon }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Post</Text>
        <TouchableOpacity
          style={[styles.postButton, { backgroundColor: colors.tint, opacity: loading || !content.trim() ? 0.5 : 1 }]}
          onPress={handlePost}
          disabled={loading || !content.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Category selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow} contentContainerStyle={styles.categoryContent}>
        {POST_CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.key}
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  category === c.key
                    ? colors.tint
                    : colorScheme === 'dark'
                    ? '#2c2c2e'
                    : '#f0f0f0',
              },
            ]}
            onPress={() => setCategory(c.key)}
          >
            <Text style={styles.categoryEmoji}>{c.emoji}</Text>
            <Text style={[styles.categoryLabel, { color: category === c.key ? '#fff' : colors.text }]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Text input */}
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder="What's happening around you?"
        placeholderTextColor={colors.icon}
        value={content}
        onChangeText={setContent}
        multiline
        autoFocus
        textAlignVertical="top"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  cancel: { fontSize: 16 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  postButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  postButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  categoryRow: { maxHeight: 52, marginVertical: 8 },
  categoryContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  categoryEmoji: { fontSize: 15 },
  categoryLabel: { fontSize: 13, fontWeight: '500' },
  input: { flex: 1, fontSize: 16, padding: 16, lineHeight: 24 },
});
