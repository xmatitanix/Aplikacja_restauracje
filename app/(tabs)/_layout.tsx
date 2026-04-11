import { Tabs } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../constants/theme';

function TabIcon({
  label,
  focused,
}: {
  label: string;
  focused: boolean;
}) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '700',
          letterSpacing: 3,
          fontSize: 13,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'SETLOG',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="HOME" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'EXPLORE',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="CITIES" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'TOP SETS',
          tabBarIcon: ({ focused }) => (
            <TabIcon label="TOP" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tabIconFocused: {
    borderColor: theme.colors.text,
    backgroundColor: theme.colors.text,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.textTertiary,
  },
  tabLabelFocused: {
    color: theme.colors.white,
  },
});
