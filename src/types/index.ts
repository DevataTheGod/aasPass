export interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  college_id: string | null;
  college_name: string | null;
  created_at: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
}

export interface Post {
  id: string;
  author_id: string;
  college_id: string;
  category: PostCategory;
  content: string;
  image_url: string | null;
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
  comment_count: number;
  created_at: string;
}

export type PostCategory = 'general' | 'sports' | 'food' | 'study' | 'help' | 'event';

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  author: Pick<Profile, 'id' | 'full_name' | 'avatar_url'>;
  created_at: string;
}

export const POST_CATEGORIES: { key: PostCategory; label: string; emoji: string }[] = [
  { key: 'general', label: 'General', emoji: '💬' },
  { key: 'sports', label: 'Sports', emoji: '⚽' },
  { key: 'food', label: 'Food', emoji: '🍕' },
  { key: 'study', label: 'Study', emoji: '📚' },
  { key: 'help', label: 'Help', emoji: '🆘' },
  { key: 'event', label: 'Event', emoji: '🎉' },
];
