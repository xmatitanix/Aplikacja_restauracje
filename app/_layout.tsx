import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
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
      </Stack>
    </>
  );
}
