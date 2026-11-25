import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.acc,
        tabBarInactiveTintColor: theme.ink3,
        tabBarStyle: {
          backgroundColor: theme.bg,
          borderTopColor: theme.line,
          height: 70,
          paddingTop: 6,
          paddingBottom: 14,
        },
        tabBarLabelStyle: { fontFamily: fonts.uiMedium, fontSize: 10 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Découvrir',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size - 2} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Chercher',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size - 2} color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <Ionicons name="book-outline" size={size - 2} color={String(color)} />,
        }}
      />
    </Tabs>
  );
}
