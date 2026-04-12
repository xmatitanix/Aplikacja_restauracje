import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../context/AuthContext';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 13,
          },
          headerShadowVisible: false,
          headerBackTitle: '',
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="event/[id]"
          options={{ title: 'SET DETAIL' }}
        />
        <Stack.Screen
          name="rate/[id]"
          options={{ title: 'RATE SET', presentation: 'modal' }}
        />
        <Stack.Screen
          name="rate-support/[id]"
          options={{ title: 'RATE SUPPORT', presentation: 'modal' }}
        />
        <Stack.Screen
          name="explore/[city]"
          options={{ title: 'CITY SETS' }}
        />
        <Stack.Screen
          name="login"
          options={{ title: 'KONTO', presentation: 'modal' }}
        />
      </Stack>
    </AuthProvider>
  );
}
