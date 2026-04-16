import { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useWalletStore } from "../../src/stores/wallet-store";
import { useTheme } from "../../src/theme/useTheme";
import { getBalance } from "../../src/utils/solanaApi";
import { shortenAddress, formatAddress } from "../../src/utils/formatters";
import ConfirmModal from "../../src/components/ConfirmModal";

interface WatchlistItem {
  address: string;
  balance: number | null;
  loading: boolean;
}

export default function WatchlistScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const favorites = useWalletStore((s) => s.favorites);
  const removeFavorite = useWalletStore((s) => s.removeFavorite);
  const isDevnet = useWalletStore((s) => s.isDevnet);

  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    const results = await Promise.all(
      favorites.map(async (address) => {
        try {
          const balance = await getBalance(address, isDevnet);
          return {
            address,
            balance,
            loading: false,
          };
        } catch {
          return { address, balance: null, loading: false };
        }
      })
    );
    setItems(results);
  }, [favorites, isDevnet]);

  useEffect(() => {
    if (favorites.length > 0) {
      setItems(
        favorites.map((a) => ({ address: a, balance: null, loading: true }))
      );
      fetchBalances();
    } else {
      setItems([]);
    }
  }, [favorites, fetchBalances]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBalances();
    setRefreshing(false);
  };

  const handleRemove = (address: string) => {
    setAddressToDelete(address);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme.primaryFill }}
      >
        <View className="flex-1 px-5 pt-4">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full"
              style={{ backgroundColor: theme.surfaceFill }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <View>
              <Text
                className="text-[32px] font-poppins-bold"
                style={{ color: theme.text, includeFontPadding: false }}
              >
                Watchlist
              </Text>
              <Text
                className="text-sm font-poppins"
                style={{ color: theme.stroke }}
              >
                {favorites.length} wallet{favorites.length !== 1 ? "s" : ""} ·{" "}
                {isDevnet ? "Devnet" : "Mainnet"}
              </Text>
            </View>
          </View>

          {favorites.length === 0 ? (
            <View className="flex-1 justify-center items-center pb-20">
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: theme.surfaceFill }}
              >
                <Ionicons name="heart-outline" size={40} color={theme.stroke} />
              </View>
              <Text
                className="text-xl font-poppins-bold mb-2"
                style={{ color: theme.text }}
              >
                No Wallets Saved
              </Text>
              <Text
                className="text-center font-poppins px-10"
                style={{ color: theme.stroke }}
              >
                Search for a wallet and tap the heart to save it here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => item.address}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.primaryOrange}
                  colors={[theme.primaryOrange]}
                />
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onLongPress={() => handleRemove(item.address)}
                  className="mb-4 rounded-[20px] border p-5 flex-row items-center justify-between"
                  style={{
                    backgroundColor: theme.surfaceFill,
                    borderColor: theme.stroke,
                    borderWidth: 0.25,
                  }}
                >
                  <View className="flex-row items-center flex-1 mr-4">
                    <View
                      className="w-10 h-10 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: theme.containerFill }}
                    >
                      <Ionicons
                        name="wallet-outline"
                        size={20}
                        color={theme.primaryOrange}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-poppins-bold text-sm"
                        style={{ color: theme.text }}
                      >
                        {shortenAddress(item.address, 6)}
                      </Text>
                      <Text
                        className="font-poppins text-[10px]"
                        style={{ color: theme.stroke }}
                      >
                        {formatAddress(item.address)}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    {item.loading ? (
                      <ActivityIndicator
                        size="small"
                        color={theme.primaryOrange}
                      />
                    ) : item.balance !== null ? (
                      <View className="items-end">
                        <Text
                          className="font-poppins-bold text-base"
                          style={{ color: theme.primaryOrange }}
                        >
                          {item.balance.toFixed(4)}
                        </Text>
                        <Text
                          className="font-poppins-bold text-[10px]"
                          style={{ color: theme.text }}
                        >
                          SOL
                        </Text>
                      </View>
                    ) : (
                      <Text
                        className="font-poppins-medium text-xs"
                        style={{ color: theme.semanticRed }}
                      >
                        Error
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </SafeAreaView>

      <ConfirmModal
        visible={addressToDelete !== null}
        title="Remove Wallet"
        description={`Are you sure you want to remove ${
          addressToDelete ? shortenAddress(addressToDelete, 6) : ""
        } from your watchlist?`}
        confirmText="Remove"
        danger
        onCancel={() => setAddressToDelete(null)}
        onConfirm={() => {
          if (addressToDelete) {
            removeFavorite(addressToDelete);
            setAddressToDelete(null);
          }
        }}
      />
    </SafeAreaProvider>
  );
}
