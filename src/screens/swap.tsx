import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { useAppStyles } from "../theme/useAppStyles";

export default function SwapScreen() {
  const { styles, theme, scheme, toggleScheme } = useAppStyles();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.scrollContent}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>SolSwap</Text>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleScheme}>
            <Text style={styles.themeToggleText}>
              {scheme === "light" ? "🌙" : "☀️"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Swap your tokens instantly</Text>

        <View style={[styles.card, { marginTop: 40, paddingVertical: 40 }]}>
          <Text
            style={[
              styles.cardTitle,
              { textAlign: "center", color: theme.stroke, marginBottom: 0 },
            ]}
          >
            Swap infrastructure coming soon...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
