import * as Sentry from '@sentry/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { useAppStore } from '@/store/app-store';
import { supabase } from '@/lib/supabase';
import { trackScreen, setUserId, setUserProperties } from '@/lib/analytics';

// Initialize Sentry (before any other code runs)
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enableAutoSessionTracking: true,
  tracesSampleRate: 1.0, // Capture 100% of transactions during beta (reduce to 0.2 post-launch)
  attachStacktrace: true,
});

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  const setOnboardingComplete = useAppStore((s) => s.setOnboardingComplete);
  const setSelectedCollege = useAppStore((s) => s.setSelectedCollege);
  const [profileCheckState, setProfileCheckState] = useState<'idle' | 'checking' | 'done'>('idle');
  const colors = useColorScheme() === 'dark'
    ? { bg: '#000', text: '#fff' }
    : { bg: '#fff', text: '#000' };

  // Reset profile check state when session changes (e.g., logout → login)
  useEffect(() => {
    if (!session) {
      setProfileCheckState('idle');
    }
  }, [session]);

  // Set analytics user ID when session changes
  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
      setUserProperties({
        aud: session.user.aud ?? null,
      });
    } else {
      setUserId(null);
    }
  }, [session]);

  // Track screen views for analytics
  const screenName = segments.join('/') || 'root';
  useEffect(() => {
    if (!isLoading) {
      trackScreen(screenName);
    }
  }, [screenName, isLoading]);

  async function checkExistingProfile(userId: string) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (data) {
        // Profile exists → onboarding already completed
        setOnboardingComplete(true);
        if (data.college_id && data.college_name) {
          setSelectedCollege({
            id: data.college_id,
            name: data.college_name,
            city: '',
          });
        }
      }
      // If no data, onboardingComplete stays false → redirect to onboarding below
    } catch {
      // Network error — redirect to feed optimistically instead of forcing re-onboarding
      setOnboardingComplete(true);
    } finally {
      setProfileCheckState('done');
    }
  }

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inPostGroup = segments[0] === 'post';
    const inModalsGroup = segments[0] === '(modals)';
    const inResetPasswordGroup = segments[0] === 'reset-password';

    if (!session) {
      // Allow reset-password route without session — deep link entry point
      if (!inAuthGroup && !inResetPasswordGroup) {
        router.replace('/(auth)/welcome');
      }
      return;
    }

    // Session exists — check if user already has a profile in the database
    // This prevents sending existing users back through onboarding on cold start
    if (!onboardingComplete && profileCheckState === 'idle') {
      setProfileCheckState('checking');
      checkExistingProfile(session.user.id);
      return;
    }

    // Don't route while profile check is in progress
    if (profileCheckState === 'checking') return;

    // Don't redirect away from reset-password while user is setting a new password
    if (inResetPasswordGroup) {
      return;
    }

    // Route based on auth + onboarding state
    if (inAuthGroup) {
      if (onboardingComplete) {
        router.replace('/(tabs)/feed');
      } else {
        router.replace('/(onboarding)/college-select');
      }
    } else if (inOnboardingGroup) {
      if (onboardingComplete) {
        router.replace('/(tabs)/feed');
      }
    } else if (onboardingComplete && !inTabsGroup && !inPostGroup && !inModalsGroup && !inResetPasswordGroup) {
      // Cold-start catch-all: session exists, profile complete,
      // but user is on an unknown root route — route to feed
      router.replace('/(tabs)/feed');
    } else if (!onboardingComplete && !inTabsGroup && !inPostGroup && !inModalsGroup && !inResetPasswordGroup) {
      // Cold-start catch-all: session exists, onboarding not complete
      // but user is not in auth or onboarding group — route to onboarding
      router.replace('/(onboarding)/college-select');
    }
  }, [session, segments, isLoading, onboardingComplete, profileCheckState,
      setOnboardingComplete, setSelectedCollege]);

  // Show loading splash while waiting for auth or profile check
  if (isLoading || profileCheckState === 'checking') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.text === '#fff' ? '#fff' : '#000'} />
      </View>
    );
  }

  return <>{children}</>;
}

function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="reset-password" />
              <Stack.Screen name="post/[id]" options={{ presentation: 'card', title: 'Post' }} />
            </Stack>
          </AuthGuard>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(RootLayout);
