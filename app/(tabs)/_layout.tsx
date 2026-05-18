import { Text } from 'react-native';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#2c2c2e' : '#e0e0e0',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#ffffff',
        },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Nearby',
          tabBarIcon: () => <TabIcon emoji="📍" />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: () => <TabIcon emoji="💬" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <TabIcon emoji="👤" />,
        }}
      />
    </Tabs>
  );
}
