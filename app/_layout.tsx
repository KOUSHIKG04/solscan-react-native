import "../global.css";
import "../src/utils/polyfills";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { useTheme } from "../src/theme/useTheme";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { useEffect, useMemo } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Light": Poppins_300Light,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  const { theme, scheme } = useTheme();

  const activeTheme = useMemo(() => {
    const navTheme = scheme === "dark" ? DarkTheme : DefaultTheme;

    return {
      ...navTheme,
      colors: {
        ...navTheme.colors,
        background: theme.primaryFill,
        card: theme.surfaceFill,
        text: theme.text,
        border: theme.stroke,
        primary: theme.primaryOrange,
      },
    };
  }, [scheme, theme]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.primaryFill);
  }, [theme.primaryFill]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={activeTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.primaryFill },
            animation: "default",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} /> */}
          <Stack.Screen
            name="token/[mint]"
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.primaryFill },
            }}
          />
          <Stack.Screen
            name="watchlist/watchlist"
            options={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.primaryFill },
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
