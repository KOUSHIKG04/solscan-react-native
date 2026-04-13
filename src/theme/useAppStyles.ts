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
      scrollContent: {
        paddingHorizontal: 20,
        // paddingBottom: 10,
      },
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
      // Swap Specific Styles
      swapScroll: {
        flex: 1,
        backgroundColor: theme.primaryFill,
      },
      swapContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
      },
      swapHeaderRow: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
        justifyContent: "flex-start",
      },
      swapCard: {
        backgroundColor: theme.surfaceFill,
        borderRadius: 20,
        padding: 16,
        borderWidth: 0.25,
        borderColor: theme.stroke,
      },
      swapCardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      swapTokenSelector: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.containerFill,
        paddingLeft: 8,
        paddingRight: 12,
        paddingVertical: 8,
        borderRadius: 24,
        gap: 6,
        borderWidth: 0.25,
        borderColor: theme.stroke,
      },
      swapTokenIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
      },
      swapTokenIconText: {
        fontSize: 14,
        fontFamily: "Poppins-Bold",
        color: "#FFFFFF",
      },
      swapTokenName: {
        fontSize: 18,
        fontFamily: "Poppins-Bold",
        color: theme.text,
      },
      swapAmountInput: {
        fontSize: 32,
        fontFamily: "Poppins-Regular",
        color: theme.text,
        textAlign: "right",
        flex: 1,
        marginLeft: 10,
      },
      swapCardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
      },
      swapBalanceText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: theme.stroke,
      },
      swapUsdText: {
        fontSize: 14,
        fontFamily: "Poppins-Medium",
        color: theme.stroke,
      },
      swapArrowContainer: {
        alignItems: "center",
        marginVertical: -22,
        zIndex: 10,
      },
      swapArrow: {
        backgroundColor: theme.primaryFill,
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 0.5,
        borderColor: theme.stroke,
      },
      swapBtn: {
        backgroundColor: theme.primaryOrange,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: "center",
        marginTop: 24,
      },
      swapBtnText: {
        color: theme.whiteConstant,
        fontSize: 18,
        fontFamily: "Poppins-Bold",
      },
      // Wallet Specific Styles
      rowTopAligned: { alignItems: "flex-start" },
      colFlex1_5: { flex: 1.5 },
      colCenter: { flex: 1, alignItems: "center" },
      colRight: { flex: 0.5, alignItems: "flex-end", justifyContent: "center" },
      // errorCard: {  },
      errorText: { color: theme.semanticRed, textAlign: "center", fontFamily: "Poppins-Bold" },
      loaderSmall: { alignSelf: "flex-start", marginVertical: 4 },
      colHeading: {
        fontFamily: "Poppins-Medium",
        fontSize: 10,
        color: theme.stroke,
        marginBottom: 4,
        letterSpacing: 1,
      },
      colHeadingNoMargin: {
        fontFamily: "Poppins-Medium",
        fontSize: 10,
        color: theme.stroke,
        letterSpacing: 1,
      },
      txStatusTextSuccess: {
        color: theme.semanticGreen,
        fontFamily: "Poppins-Bold",
      },
      txStatusTextFailed: {
        color: theme.semanticRed,
        fontFamily: "Poppins-Bold",
      },
      iconButton: { padding: 4 },
      iconAdjust: { marginTop: 2 },
      txItemCardBase: {
        paddingTop: 0,
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      },
      txItemCardBottom: {
        paddingBottom: 20,
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      },
      txItemCardNoBottom: {
        paddingBottom: 0,
        marginBottom: 0,
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      },
      cardFooterToggle: {
        paddingTop: 10,
        paddingBottom: 20,
        marginBottom: 16,
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
      },
      toggleBtn: { padding: 10, alignItems: "center" },
      tokenFooterToggleRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 10,
      },
      bottomSpacer: { height: 20 },
      loadingCardActive: {
        paddingBottom: 20,
        marginBottom: 16,
        borderBottomWidth: 0.25,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      },
      // App Routing Layer Styles
      fullLoadingView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.primaryFill,
      },
      tabBar: {
        backgroundColor: theme.surfaceFill,
        borderTopWidth: 0.2,
        borderTopColor: theme.stroke,
        height: 90,
        paddingTop: 8,
      },
      tabBarLabel: {
        fontSize: 14,
        paddingBottom: 8,
        fontFamily: "Poppins-Bold",
      },
    });

    cachedStyles[activeSchemeKey] = generatedStyles;
    return generatedStyles;
  }, [activeSchemeKey, theme]);

  return { styles, theme, scheme: activeSchemeKey, toggleScheme };
};
