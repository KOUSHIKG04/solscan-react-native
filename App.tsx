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
import { 
  useFonts, 
  Poppins_300Light, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold 
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
  const { theme, scheme } = useAppStyles();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.primaryFill }}>
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
          tabBarStyle: {
            backgroundColor: theme.surfaceFill,
            borderTopWidth: 0.25,
            borderTopColor: theme.stroke,
            // paddingTop: 8,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            paddingBottom: 8,
            fontFamily: "Poppins-Bold",
          },
          tabBarActiveTintColor: theme.primaryOrange,
          tabBarInactiveTintColor: theme.stroke,
        }}
      >
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ tabBarLabel: "Scanner" }}
        />
        <Tab.Screen
          name="Swap"
          component={SwapScreen}
          options={{ tabBarLabel: "Swap" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
