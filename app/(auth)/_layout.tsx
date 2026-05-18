import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="email-sign-up" />
      <Stack.Screen name="email-sign-in" />
      <Stack.Screen name="phone-sign-in" />
      <Stack.Screen name="verify-otp" />
    </Stack>
  );
}
