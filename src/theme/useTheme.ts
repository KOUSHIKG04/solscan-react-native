import { useState, useEffect, useCallback } from "react";
import { useColorScheme } from "react-native";
import { THEME_COLORS } from "./colors";

type SchemeType = "light" | "dark" | null;

// Global state to allow manual theme overrides to instantly cascade across all screens
let globalManualScheme: SchemeType = null;
const schemeListeners = new Set<(scheme: SchemeType) => void>();

const setGlobalScheme = (newScheme: SchemeType) => {
  globalManualScheme = newScheme;
  schemeListeners.forEach((listener) => listener(newScheme));
};

export const useTheme = () => {
  const systemScheme = useColorScheme() || "light";
  const [manualScheme, setManualScheme] = useState<SchemeType>(globalManualScheme);

  useEffect(() => {
    const listener = (scheme: SchemeType) => setManualScheme(scheme);
    schemeListeners.add(listener);
    return () => {
      schemeListeners.delete(listener);
    };
  }, []);

  const scheme = manualScheme || systemScheme;
  const activeSchemeKey = (scheme === "dark" || scheme === "light" ? scheme : "light") as "light" | "dark";
  const theme = THEME_COLORS[activeSchemeKey];

  const toggleScheme = useCallback(() => {
    const current = globalManualScheme || systemScheme;
    setGlobalScheme(current === "light" ? "dark" : "light");
  }, [systemScheme]);

  return { theme, scheme: activeSchemeKey, toggleScheme };
};
