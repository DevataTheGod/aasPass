import * as Sentry from '@sentry/react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/providers/auth-provider';
import { useAppStore } from '@/store/app-store';

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

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (session && inAuthGroup) {
      if (!onboardingComplete) {
        router.replace('/(onboarding)/college-select');
      } else {
        router.replace('/(tabs)/feed');
      }
    } else if (session && inOnboardingGroup && onboardingComplete) {
      router.replace('/(tabs)/feed');
    }
  }, [session, segments, isLoading, onboardingComplete]);

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
