import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStyles } from "../theme/useAppStyles";

export default function SwapScreen() {
  const { styles, theme, scheme, toggleScheme } = useAppStyles();

  const [fromAmount, setFromAmount] = useState("100");
  const [toAmount, setToAmount] = useState("0.28014");
  const [fromToken, setFromToken] = useState("USDC");
  const [toToken, setToToken] = useState("SOL");

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromAmount) return Alert.alert("Enter an amount");
    Alert.alert(
      "Swap",
      `Swapping ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.swapScroll}
          contentContainerStyle={styles.swapContent}
        >
          <View style={styles.swapHeaderRow}>
            <Text style={styles.title}>SolSwap</Text>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleScheme}>
              <Ionicons
                name={scheme === "light" ? "moon" : "sunny"}
                size={16}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Swap your tokens instantly...</Text>

          <View style={[styles.swapCard, { marginBottom: 10 }]}>
            <View style={styles.swapCardHeader}>
              <TouchableOpacity style={styles.swapTokenSelector}>
                <View
                  style={[styles.swapTokenIcon, { backgroundColor: "#9945FF" }]}
                >
                  <Text style={styles.swapTokenIconText}>S</Text>
                </View>
                <Text style={styles.swapTokenName}>{fromToken}</Text>
                <Ionicons name="chevron-down" size={18} color={theme.stroke} />
              </TouchableOpacity>
              <TextInput
                style={styles.swapAmountInput}
                value={fromAmount}
                onChangeText={setFromAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.stroke}
              />
            </View>
            <View style={styles.swapCardFooter}>
              <Text style={styles.swapBalanceText}>
                Balance: 0.0661 {fromToken}
              </Text>
              <Text style={styles.swapUsdText}>$499.749</Text>
            </View>
          </View>

          <View style={styles.swapArrowContainer}>
            <TouchableOpacity style={styles.swapArrow} onPress={swapTokens}>
              <Ionicons name="arrow-down" size={20} color={theme.text} />
              {/* <Ionicons name="arrow-up" size={20} color={theme.text} /> */}
            </TouchableOpacity>
          </View>

          <View style={styles.swapCard}>
            <View style={styles.swapCardHeader}>
              <TouchableOpacity style={styles.swapTokenSelector}>
                <View
                  style={[styles.swapTokenIcon, { backgroundColor: "#2775CA" }]}
                >
                  <Text style={styles.swapTokenIconText}>$</Text>
                </View>
                <Text style={styles.swapTokenName}>{toToken}</Text>
                <Ionicons name="chevron-down" size={18} color={theme.stroke} />
              </TouchableOpacity>
              <TextInput
                style={styles.swapAmountInput}
                value={toAmount}
                onChangeText={setToAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.stroke}
              />
            </View>
            <View style={styles.swapCardFooter}>
              <Text style={styles.swapBalanceText}>Balance: 250 {toToken}</Text>
              <Text style={styles.swapUsdText}>$499.419</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <Text style={styles.swapBtnText}>Swap</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
