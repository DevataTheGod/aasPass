import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';
import { supabase } from '@/lib/supabase';
import type { Post, PostCategory } from '@/types';
import { POST_CATEGORIES } from '@/types';

export default function FeedScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const selectedCollege = useAppStore((s) => s.selectedCollege);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!selectedCollege) return;
    try {
      let query = supabase
        .from('posts_with_authors')
        .select('*')
        .eq('college_id', selectedCollege.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      setPosts(data ?? []);
    } catch (err: any) {
      console.warn('Fetch posts error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCollege, selectedCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* College header */}
      <View style={[styles.header, { borderBottomColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}>
        <Text style={[styles.collegeName, { color: colors.text }]}>
          {selectedCollege?.name ?? 'My College'}
        </Text>
      </View>

      {/* Category filter */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
        data={POST_CATEGORIES}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              {
                backgroundColor:
                  selectedCategory === item.key
                    ? colors.tint
                    : colorScheme === 'dark'
                    ? '#2c2c2e'
                    : '#f0f0f0',
              },
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === item.key ? null : item.key)
            }
          >
            <Text style={styles.categoryEmoji}>{item.emoji}</Text>
            <Text
              style={[
                styles.categoryLabel,
                { color: selectedCategory === item.key ? '#fff' : colors.text },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Posts list */}
      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.icon }]}>Loading posts...</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.tint} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nothing yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.icon }]}>
                Be the first to post something!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.postCard, { backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff', borderColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0' }]}
              onPress={() => router.push(`/post/${item.id}`)}
            >
              <View style={styles.postHeader}>
                <View style={[styles.avatar, { backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#f0f0f0' }]}>
                  <Text style={styles.avatarText}>
                    {item.author?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
                  </Text>
                </View>
                <View style={styles.postMeta}>
                  <Text style={[styles.authorName, { color: colors.text }]}>
                    {item.author?.full_name ?? 'Unknown'}
                  </Text>
                  <Text style={[styles.postTime, { color: colors.icon }]}>
                    {formatTimeAgo(item.created_at)}
                  </Text>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: colors.tint + '20' }]}>
                  <Text style={[styles.categoryBadgeText, { color: colors.tint }]}>
                    {POST_CATEGORIES.find((c) => c.key === item.category)?.emoji}
                  </Text>
                </View>
              </View>
              <Text style={[styles.postContent, { color: colors.text }]} numberOfLines={3}>
                {item.content}
              </Text>
              <View style={styles.postFooter}>
                <Text style={[styles.commentCount, { color: colors.icon }]}>
                  💬 {item.comment_count ?? 0} comments
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={() => router.push('/(modals)/create-post')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1 },
  collegeName: { fontSize: 20, fontWeight: '700' },
  categories: { maxHeight: 48, marginVertical: 8 },
  categoriesContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  categoryEmoji: { fontSize: 15 },
  categoryLabel: { fontSize: 13, fontWeight: '500' },
  list: { padding: 16, paddingBottom: 80, gap: 12 },
  postCard: { padding: 16, borderRadius: 14, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 15, fontWeight: '600' },
  postMeta: { flex: 1, marginLeft: 10 },
  authorName: { fontSize: 14, fontWeight: '600' },
  postTime: { fontSize: 12, marginTop: 1 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  categoryBadgeText: { fontSize: 14 },
  postContent: { fontSize: 15, lineHeight: 21, marginBottom: 10 },
  postFooter: { flexDirection: 'row', alignItems: 'center' },
  commentCount: { fontSize: 13 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  emptySubtitle: { fontSize: 14 },
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { fontSize: 14, marginTop: 12 },
  fab: { position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 30, fontWeight: '300' },
});
