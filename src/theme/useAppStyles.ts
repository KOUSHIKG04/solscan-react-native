import { useMemo, useState, useEffect, useCallback } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { THEME_COLORS } from "./colors";

type SchemeType = "light" | "dark" | null;

// Global state to allow manual theme overrides to instantly cascade across multiple screens
let globalManualScheme: SchemeType = null;
const schemeListeners = new Set<(scheme: SchemeType) => void>();

const setGlobalScheme = (newScheme: SchemeType) => {
  globalManualScheme = newScheme;
  schemeListeners.forEach((listener) => listener(newScheme));
};

// Caching layer to prevent React Native from recalculating StyleSheets repeatedly across different screens or renders
const cachedStyles: { light?: any; dark?: any } = {};

export const useAppStyles = () => {
  const systemScheme = useColorScheme() || "light";

  // State maps to the global tracker 
  const [manualScheme, setManualScheme] = useState<SchemeType>(globalManualScheme);

  // Sync mount and cleanups
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

  const styles = useMemo(() => {
    // Highly optimized cache return that prevents performance drops in memory
    if (cachedStyles[activeSchemeKey]) {
      return cachedStyles[activeSchemeKey];
    }

    const generatedStyles = StyleSheet.create({
      safe: { flex: 1, backgroundColor: theme.primaryFill },
      scroll: { flex: 1 },
      scrollContent: { padding: 20, paddingTop: 65, },
      headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 1,
        position: "relative",
        justifyContent: "flex-start",
        textAlign: "left",
        padding: 0
      },
      themeToggle: {
        position: "absolute",
        right: 0,
        padding: 8,
        backgroundColor: theme.surfaceFill,
        borderWidth: 0.5,
        borderColor: theme.stroke,
        borderRadius: 8,
      },
      themeToggleText: { fontSize: 14, fontFamily: "Poppins-Regular" },
      title: {
        fontSize: 32,
        color: theme.text,
        marginTop: 12,
        textAlign: "left",
        fontFamily: "Poppins-Bold",
      },
      subtitle: {
        fontSize: 16,
        color: theme.stroke,
        marginBottom: 14,
        textAlign: "left",
        fontFamily: "Poppins-Regular",
      },
      inputContainer: { flexDirection: "row", marginBottom: 12, borderRadius: 8 },
      input: {
        flex: 3,
        backgroundColor: theme.surfaceFill,
        color: theme.text,
        padding: 14,
        fontSize: 16,
        borderColor: theme.stroke,
        borderWidth: 0.25,
        borderRadius: 8,
        fontFamily: "Poppins-Regular",

      },
      btn: {
        flex: 1,
        backgroundColor: theme.primaryOrange,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginBottom: 24
      },
      btnText: {
        color: theme.whiteConstant,
        fontSize: 16,
        fontFamily: "Poppins-Bold",
      },
      card: {
        backgroundColor: theme.surfaceFill,
        padding: 16,
        marginBottom: 16,
        borderWidth: 0.25,
        borderColor: theme.stroke,
        borderRadius: 8,
      },
      cardTitle: {
        fontSize: 18,
        color: theme.text,
        marginBottom: 4,
        fontFamily: "Poppins-Bold",
      },
      cardValue: {
        fontSize: 28,
        color: theme.primaryOrange,
        fontFamily: "Poppins-Bold",
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.containerFill,
        padding: 14,
        marginBottom: 8,
        borderWidth: 0.25,
        borderColor: theme.stroke,
        borderRadius: 8,
      },
      tokenMint: { color: theme.text, flex: 1, marginRight: 10, fontFamily: "Poppins-Regular" },
      tokenAmount: { color: theme.primaryOrange, fontFamily: "Poppins-Bold" },
      txInfo: { flex: 1 },
      txSig: { color: theme.text, marginBottom: 4, fontFamily: "Poppins-Regular" },
      txTime: { color: theme.stroke, fontSize: 12, fontFamily: "Poppins-Light" },
      moreText: {
        color: theme.stroke,
        textAlign: "center",
        marginTop: 8,
        fontSize: 14,
        fontFamily: "Poppins-Medium",
      },
    });

    cachedStyles[activeSchemeKey] = generatedStyles;
    return generatedStyles;
  }, [activeSchemeKey, theme]);

  return { styles, theme, scheme: activeSchemeKey, toggleScheme };
};
