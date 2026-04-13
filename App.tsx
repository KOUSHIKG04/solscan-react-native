import React from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import WalletScreen from "./src/screens/wallet";
import SwapScreen from "./src/screens/swap";
import { useAppStyles } from "./src/theme/useAppStyles";
import { Ionicons } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Light": Poppins_300Light,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  // Wrap at the highest level to establish system tracking natively over the entire react tree
  const { theme, scheme, styles } = useAppStyles();

  if (!fontsLoaded) {
    return (
      <View style={styles.fullLoadingView}>
        <ActivityIndicator size="large" color={theme.primaryOrange} />
      </View>
    );
  }

  const navTheme =
    scheme === "dark"
      ? {
          ...DarkTheme,
          colors: {
            ...DarkTheme.colors,
            background: theme.primaryFill,
            card: theme.surfaceFill,
            text: theme.text,
            border: theme.stroke,
            primary: theme.primaryOrange,
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: theme.primaryFill,
            card: theme.surfaceFill,
            text: theme.text,
            border: theme.stroke,
            primary: theme.primaryOrange,
          },
        };

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: theme.primaryOrange,
          tabBarInactiveTintColor: theme.stroke,
        }}
      >
        <Tab.Screen
          name="Swap"
          component={SwapScreen}
          options={{
            tabBarLabel: "Swap",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="swap-horizontal" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            tabBarLabel: "Scanner",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="scan" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
