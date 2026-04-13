import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStyles } from '../../src/theme/useAppStyles';

export default function TabLayout() {
  const { theme, styles } = useAppStyles();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: theme.primaryOrange,
        tabBarInactiveTintColor: theme.stroke,
      }}>
      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="swap-horizontal" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
