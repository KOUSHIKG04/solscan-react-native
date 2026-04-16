import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../src/theme/useTheme";
import { useWalletStore } from "../../src/stores/wallet-store";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import ConfirmModal from "../../src/components/ConfirmModal";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, scheme, manualScheme, setScheme } = useTheme();
  const isDevnet = useWalletStore((s) => s.isDevnet);
  const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const favorites = useWalletStore((s) => s.favorites);
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const clearHistory = useWalletStore((s) => s.clearHistory);
  const [showClearModal, setShowClearModal] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme.primaryFill }}
      >
        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-10">
          <View className="flex-row items-center relative">
            <Text
              className="text-[32px] mt-3 font-poppins-bold"
              style={{ color: theme.text, includeFontPadding: false }}
            >
              Settings
            </Text>
          </View>

          <Text
            className="text-base mb-6 font-poppins"
            style={{ color: theme.stroke }}
          >
            Manage your preferences
          </Text>

          <View style={{ marginTop: 10 }}>
            <Text
              className="text-[12px] font-poppins-bold tracking-widest mb-2"
              style={{ color: theme.stroke }}
            >
              APPEARANCE
            </Text>

            <View
              className="rounded-[20px] py-4 px-6 border mb-4"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
            >
              <View className="flex-row items-center justify-between">
                <View>
                  <Text
                    className="font-poppins-bold text-base"
                    style={{ color: theme.text }}
                  >
                    Use DEVNET
                  </Text>
                </View>

                <Switch
                  value={isDevnet}
                  onValueChange={toggleNetwork}
                  trackColor={{
                    true: theme.primaryOrange,
                    false: theme.stroke,
                  }}
                  thumbColor={theme.whiteConstant}
                />
              </View>
            </View>

            <Text
              className="text-[12px] font-poppins-bold tracking-widest mb-2"
              style={{ color: theme.stroke }}
            >
              TOGGLE THEME
            </Text>
            <View
              className="rounded-[20px] py-4 px-6 border mb-4"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
            >
              <View className="flex-row items-center justify-between py-2 px-22">
                <Text
                  className="font-poppins-bold "
                  style={{ color: theme.text, includeFontPadding: false }}
                >
                  {scheme === "dark" ? "Dark mode " : "Light mode "}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setScheme(scheme === "dark" ? "light" : "dark")
                  }
                  style={{ marginRight: 13 }}
                >
                  <Ionicons
                    name={scheme === "dark" ? "moon" : "sunny-outline"}
                    size={18}
                    color={theme.stroke}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* <View
              className="rounded-[20px] py-4 px-6 border mb-4"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
            >
              <View className="flex-row items-center justify-between py-2 px-22">
                <Text
                  className="font-poppins-bold "
                  style={{ color: theme.text, includeFontPadding: false }}
                >
                  System Default
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setScheme(scheme === "dark" ? "light" : "dark")
                  }
                  style={{ marginRight: 13 }}
                >
                  <Ionicons
                    name={scheme === "dark" ? "moon" : "sunny-outline"}
                    size={18}
                    color={theme.stroke}
                  />
                </TouchableOpacity>
              </View>
            </View> */}

            <Text
              className="text-[12px] font-poppins-bold tracking-widest mb-2"
              style={{ color: theme.stroke }}
            >
              STATS
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/watchlist/watchlist")}
              className="rounded-[20px] py-4 px-6 border mb-4 gap-4"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
            >
              <View className="flex-row justify-between items-center py-2 px-2">
                <Text style={{ color: theme.text }}>Saved Wallets</Text>
                <View className="flex-row items-center gap-2 text-[12px]">
                  <Text
                    style={{
                      color: theme.primaryOrange,
                      fontWeight: "600",
                      includeFontPadding: false,
                      textAlignVertical: "center",
                      marginRight: 0.5,
                    }}
                  >
                    {favorites.length}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.stroke}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <View
              className="rounded-[20px] py-4 px-6 border mb-4 gap-4"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
            >
              <View className="flex-row justify-between py-2 px-2">
                <Text style={{ color: theme.text }}>Search History</Text>
                <View className="flex-row items-center gap-3 text-[12px]">
                  <Text
                    style={{
                      color: theme.primaryOrange,
                      fontWeight: "600",
                      includeFontPadding: false, // helps Android alignment
                      textAlignVertical: "center",
                    }}
                  >
                    {favorites.length}
                  </Text>

                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={theme.stroke}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </View>
            </View>

            <Text
              className="text-[12px] font-poppins-bold tracking-widest mb-2"
              style={{ color: theme.stroke }}
            >
              DANGER ZONE
            </Text>
            <TouchableOpacity
              className="rounded-[20px] py-4 px-6 border flex-row items-center justify-center gap-3"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
              onPress={() => setShowClearModal(true)}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color={theme.semanticRed}
              />
              <Text
                className="font-poppins-bold"
                style={{ color: theme.semanticRed }}
              >
                Clear Search History
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <ConfirmModal
        visible={showClearModal}
        title="Clear History"
        description="This will remove all your search history. Favorites won't be affected."
        confirmText="Clear"
        danger
        onCancel={() => setShowClearModal(false)}
        onConfirm={() => {
          clearHistory();
          setShowClearModal(false);
        }}
      />
    </SafeAreaProvider>
  );
}
