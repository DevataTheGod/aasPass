import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/auth-provider';
import { POST_CATEGORIES } from '@/types';
import type { Post, Comment } from '@/types';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadPost();
    loadComments();
  }, [id]);

  async function loadPost() {
    try {
      const { data, error } = await supabase
        .from('posts_with_authors')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      if (data) setPost(data);
    } catch (err: any) {
      console.warn('Load post error:', err.message);
    }
  }

  async function loadComments() {
    try {
      const { data, error } = await supabase
        .from('comments_with_authors')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (data) setComments(data);
    } catch (err: any) {
      console.warn('Load comments error:', err.message);
    }
  }

  async function handleComment() {
    if (!newComment.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from('comments').insert({
      post_id: id,
      author_id: user.id,
      content: newComment.trim(),
    });
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setNewComment('');
    loadComments();
    loadPost(); // refresh comment count
  }

  const category = POST_CATEGORIES.find((c) => c.key === post?.category);

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Post' }} />

      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          post ? (
            <View style={styles.postSection}>
              <View style={styles.postHeader}>
                <View style={[styles.avatar, { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f0f0f0' }]}>
                  <Text style={styles.avatarText}>{post.author?.full_name?.charAt(0)?.toUpperCase() ?? '?'}</Text>
                </View>
                <View style={styles.postMeta}>
                  <Text style={[styles.authorName, { color: colors.text }]}>{post.author?.full_name ?? 'Unknown'}</Text>
                  <Text style={[styles.postTime, { color: colors.icon }]}>{new Date(post.created_at).toLocaleString()}</Text>
                </View>
                {category && (
                  <View style={[styles.categoryBadge, { backgroundColor: colors.tint + '20' }]}>
                    <Text style={[styles.categoryEmoji, { color: colors.tint }]}>{category.emoji}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.postContent, { color: colors.text }]}>{post.content}</Text>
              <Text style={[styles.commentCountHeader, { color: colors.icon }]}>
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={[styles.commentCard, { borderLeftColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}>
            <View style={styles.commentHeader}>
              <Text style={[styles.commentAuthor, { color: colors.text }]}>
                {item.author?.full_name ?? 'Unknown'}
              </Text>
              <Text style={[styles.commentTime, { color: colors.icon }]}>
                {formatTimeAgo(item.created_at)}
              </Text>
            </View>
            <Text style={[styles.commentContent, { color: colors.text }]}>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyComments, { color: colors.icon }]}>No comments yet. Be the first!</Text>
        }
      />

      {/* Comment input */}
      <View style={[styles.commentInput, { borderTopColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0', backgroundColor: colors.background }]}>
        <TextInput
          style={[styles.input, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#f0f0f0', color: colors.text }]}
          placeholder="Write a comment..."
          placeholderTextColor={colors.icon}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: colors.tint, opacity: loading || !newComment.trim() ? 0.5 : 1 }]}
          onPress={handleComment}
          disabled={loading || !newComment.trim()}
        >
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16 },
  postSection: { marginBottom: 20 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600' },
  postMeta: { flex: 1, marginLeft: 12 },
  authorName: { fontSize: 15, fontWeight: '600' },
  postTime: { fontSize: 12, marginTop: 1 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  categoryEmoji: { fontSize: 16 },
  postContent: { fontSize: 16, lineHeight: 24, marginBottom: 12 },
  commentCountHeader: { fontSize: 13, fontWeight: '500' },
  commentCard: { padding: 12, marginBottom: 8, borderLeftWidth: 2, paddingLeft: 14 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  commentAuthor: { fontSize: 13, fontWeight: '600' },
  commentTime: { fontSize: 11 },
  commentContent: { fontSize: 14, lineHeight: 20 },
  emptyComments: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  commentInput: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, gap: 8 },
  input: { flex: 1, fontSize: 14, padding: 10, borderRadius: 20, maxHeight: 80 },
  sendButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  sendText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
