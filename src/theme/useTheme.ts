import { useState, useEffect, useCallback } from "react";
import { useColorScheme, Appearance } from "react-native";
import { THEME_COLORS } from "./colors";

type SchemeType = "light" | "dark" | "system";

// Global state to allow manual theme overrides to instantly cascade across all screens
let globalManualScheme: SchemeType = "system";
const schemeListeners = new Set<(scheme: SchemeType) => void>();

const setGlobalScheme = (newScheme: SchemeType) => {
  globalManualScheme = newScheme;
  schemeListeners.forEach((listener) => listener(newScheme));
};

export const useTheme = () => {
  // Appearance.getColorScheme() is synchronous — always returns the correct system
  // theme on the very first render, unlike useColorScheme() which can be null initially
  const systemScheme = useColorScheme() ?? (Appearance.getColorScheme() ?? "light");
  const [manualScheme, setManualScheme] = useState<SchemeType>(globalManualScheme);

  useEffect(() => {
    const listener = (scheme: SchemeType) => setManualScheme(scheme);
    schemeListeners.add(listener);
    return () => {
      schemeListeners.delete(listener);
    };
  }, []);

  const resolvedScheme =
    manualScheme === "system" || !manualScheme
      ? systemScheme
      : manualScheme;
  const theme = THEME_COLORS[resolvedScheme as "light" | "dark"];

  const setScheme = useCallback((newScheme: SchemeType) => {
    setGlobalScheme(newScheme);
  }, []);

  const toggleScheme = useCallback(() => {
    if (manualScheme === "system") {
      // first click → override system
      setGlobalScheme(systemScheme === "dark" ? "light" : "dark");
    } else {
      // toggle between light/dark
      setGlobalScheme(manualScheme === "light" ? "dark" : "light");
    }
  }, [manualScheme, systemScheme]);

  // console.log("System:", systemScheme);
  // console.log("Manual:", manualScheme);


  return {
    theme,
    resolvedScheme,
    manualScheme,
    scheme: resolvedScheme,
    setScheme,
    toggleScheme,
    // setScheme: setGlobalScheme,
  };
};
