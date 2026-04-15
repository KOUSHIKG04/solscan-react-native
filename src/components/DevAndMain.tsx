import { View, Text } from "react-native";
import React from "react";
import { useWalletStore } from "../stores/wallet-store";
import { useTheme } from "../theme/useTheme";

export default function DevAndMain() {
  const { theme } = useTheme();
  const isDevnet = useWalletStore((s) => s.isDevnet);

  return (
    <View
      className="px-3 py-1.5 rounded-full border flex-row items-center justify-center gap-1.5"
      style={{
        backgroundColor: "transparent",
        borderColor: isDevnet ? theme.primaryOrange : "#22c55e",
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: isDevnet ? theme.primaryOrange : "#22c55e",
        }}
      />
      <Text
        className="text-[10px] font-poppins-bold text-center"
        style={{
          color: theme.text,
          lineHeight: 12,
        }}
      >
        {isDevnet ? "DEVNET" : "MAINNET"}
      </Text>
    </View>
  );
}
