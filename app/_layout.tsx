import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useAppStyles } from '../src/theme/useAppStyles';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Light": Poppins_300Light,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  const { theme, scheme, styles } = useAppStyles();

  if (!fontsLoaded) {
    return (
      <View style={styles.fullLoadingView}>
        <ActivityIndicator size="large" color={theme.primaryOrange} />
      </View>
    );
  }

  const navTheme = scheme === "dark" ? DarkTheme : DefaultTheme;
  const activeTheme = {
    ...navTheme,
    colors: {
      ...navTheme.colors,
      background: theme.primaryFill,
      card: theme.surfaceFill,
      text: theme.text,
      border: theme.stroke,
      primary: theme.primaryOrange,
    }
  };

  return (
    <ThemeProvider value={activeTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
