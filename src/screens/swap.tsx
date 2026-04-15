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
import { useTheme } from "../theme/useTheme";
import DevAndMain from "../components/DevAndMain";

export default function SwapScreen() {
  const { theme } = useTheme();

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
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme.primaryFill }}
      >
        <ScrollView
          className="flex-1"
          style={{ backgroundColor: theme.primaryFill }}
          contentContainerClassName="px-5 pb-10"
        >
          <View className="flex-row items-center relative">
            <Text
              className="text-[32px] mt-3 font-poppins-bold"
              style={{ color: theme.text, includeFontPadding: false }}
            >
              SolSwap
            </Text>
            <View className="absolute right-0 flex-row items-center gap-2 mt-3 ">
              <DevAndMain />
            </View>
          </View>

          <Text
            className="text-base mb-3.5 font-poppins"
            style={{ color: theme.stroke }}
          >
            Swap your tokens instantly...
          </Text>

          <View style={{ marginTop: 20 }}></View>
          <View
            className="rounded-[20px] p-4 border mb-2.5 "
            style={{
              backgroundColor: theme.surfaceFill,
              borderColor: theme.stroke,
              borderWidth: 0.25,
            }}
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-row items-center rounded-[24px] pl-2 pr-3 py-2 gap-1.5 border"
                style={{
                  backgroundColor: theme.containerFill,
                  borderColor: theme.stroke,
                  borderWidth: 0.25,
                }}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#9945FF" }}
                >
                  <Text className="text-sm font-poppins-bold text-white">
                    S
                  </Text>
                </View>
                <Text
                  className="text-lg font-poppins-bold"
                  style={{ color: theme.text }}
                >
                  {fromToken}
                </Text>
                <Ionicons name="chevron-down" size={18} color={theme.stroke} />
              </TouchableOpacity>
              <TextInput
                className="text-[32px] font-poppins flex-1 ml-2.5 text-right"
                style={{ color: theme.text }}
                value={fromAmount}
                onChangeText={setFromAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.stroke}
              />
            </View>
            <View className="flex-row justify-between mt-3">
              <Text
                className="text-sm font-poppins-medium"
                style={{ color: theme.stroke }}
              >
                Balance: 0.0661 {fromToken}
              </Text>
              <Text
                className="text-sm font-poppins-medium"
                style={{ color: theme.stroke }}
              >
                $499.749
              </Text>
            </View>
          </View>

          <View
            className="items-center"
            style={{ marginVertical: -22, zIndex: 10 }}
          >
            <TouchableOpacity
              className="w-11 h-11 rounded-xl items-center justify-center border"
              style={{
                backgroundColor: theme.primaryFill,
                borderColor: theme.stroke,
                borderWidth: 0.5,
              }}
              onPress={swapTokens}
            >
              <Ionicons name="arrow-down" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View
            className="rounded-[20px] p-4 border"
            style={{
              backgroundColor: theme.surfaceFill,
              borderColor: theme.stroke,
              borderWidth: 0.25,
            }}
          >
            <View className="flex-row justify-between items-center">
              <TouchableOpacity
                className="flex-row items-center rounded-[24px] pl-2 pr-3 py-2 gap-1.5 border"
                style={{
                  backgroundColor: theme.containerFill,
                  borderColor: theme.stroke,
                  borderWidth: 0.25,
                }}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: "#2775CA" }}
                >
                  <Text className="text-sm font-poppins-bold text-white">
                    $
                  </Text>
                </View>
                <Text
                  className="text-lg font-poppins-bold"
                  style={{ color: theme.text }}
                >
                  {toToken}
                </Text>
                <Ionicons name="chevron-down" size={18} color={theme.stroke} />
              </TouchableOpacity>
              <TextInput
                className="text-[32px] font-poppins flex-1 ml-2.5 text-right"
                style={{ color: theme.text }}
                value={toAmount}
                onChangeText={setToAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.stroke}
              />
            </View>
            <View className="flex-row justify-between mt-3">
              <Text
                className="text-sm font-poppins-medium"
                style={{ color: theme.stroke }}
              >
                Balance: 250 {toToken}
              </Text>
              <Text
                className="text-sm font-poppins-medium"
                style={{ color: theme.stroke }}
              >
                $499.419
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="py-[18px] rounded-2xl items-center mt-6"
            style={{ backgroundColor: theme.primaryOrange }}
            onPress={handleSwap}
          >
            <Text className="text-white text-lg font-poppins-bold">Swap</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
