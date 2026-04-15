import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";
import { Token, Txn, getBalance, getTokens, getTxns } from "../utils/solanaApi";
import { shortenAddress, timeAgo } from "../utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "../stores/wallet-store";
import DevAndMain from "../components/DevAndMain";

export default function WalletScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [address, setAddress] = useState("");
  const [lastSearchedAddress, setLastSearchedAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [txnsLimit, setTxnsLimit] = useState(5);
  const [tokensLimit, setTokensLimit] = useState(5);
  const [loadingTxnsMore, setLoadingTxnsMore] = useState(false);
  const [loadingTokensMore, setLoadingTokensMore] = useState(false);

  const { theme } = useTheme();
  const isDevnet = useWalletStore((s) => s.isDevnet);
  // const toggleNetwork = useWalletStore((s) => s.toggleNetwork);
  const addToHistory = useWalletStore((s) => s.addToHistory);
  const searchHistory = useWalletStore((s) => s.searchHistory);
  const clearHistory = useWalletStore((s) => s.clearHistory);

  const handleSearch = async (targetAddress?: string) => {
    const searchAddr = targetAddress || address;
    if (!searchAddr.trim()) {
      setError("Please enter a search string or wallet address");
      return;
    }

    if (targetAddress) {
      setAddress(targetAddress);
    }

    const isNewAddress = searchAddr.trim() !== lastSearchedAddress;

    setLoading(true);
    setError(null);

    if (isNewAddress) {
      setBalance(null);
      setTokens([]);
      setTxns([]);
      setTxnsLimit(5);
      setTokensLimit(5);
    }

    try {
      const [bal, toks, history] = await Promise.all([
        getBalance(searchAddr, isDevnet),
        getTokens(searchAddr, isDevnet).catch(() => []),
        getTxns(searchAddr, isDevnet).catch(() => []),
        addToHistory(searchAddr),
      ]);
      setBalance(bal);
      setTokens(toks);
      setTxns(history);
      setLastSearchedAddress(searchAddr.trim());
    } catch (err: any) {
      setError(err.message || "Invalid or unreachable address.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (!address.trim()) {
      setBalance(null);
      setTokens([]);
      setTxns([]);
      setError(null);
      setLastSearchedAddress("");
    } else {
      await handleSearch();
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: theme.primaryFill }}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.primaryOrange}
              colors={[theme.primaryOrange]}
              progressBackgroundColor={theme.surfaceFill}
            />
          }
        >
          <View className="flex-row items-center relative">
            <Text
              className="text-[32px] mt-3 font-poppins-bold"
              style={{ color: theme.text, includeFontPadding: false }}
            >
              SolScan
            </Text>
            <View className="absolute right-0 flex-row items-center gap-2 mt-3 ">
              <DevAndMain />
            </View>
          </View>

          <Text
            className="text-base mb-3.5 font-poppins"
            style={{ color: theme.stroke }}
          >
            Explore any Solona Wallet here...
          </Text>

          <View style={{ marginTop: 20 }}></View>
          <View
            className="flex-row items-center mb-3 rounded-lg border"
            style={{
              backgroundColor: theme.surfaceFill,
              borderColor: theme.stroke,
              borderWidth: 0.25,
            }}
          >
            <TextInput
              className="flex-1 py-3.5 pl-3 text-base font-poppins"
              style={{
                color: theme.text,
              }}
              placeholder="Solana Address"
              placeholderTextColor={theme.stroke}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {address.length > 0 && (
              <TouchableOpacity
                onPress={() => setAddress("")}
                className="p-2"
                hitSlop={{ top: 1, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close-circle" size={20} color={theme.stroke} />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-center mb-6" style={{ gap: 10 }}>
            <TouchableOpacity
              className="p-4 items-center justify-center rounded-xl shadow-sm"
              style={{ backgroundColor: theme.primaryOrange, flex: 2 }}
              onPress={() => handleSearch()}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.whiteConstant} />
              ) : (
                <Text
                  className="text-base font-poppins-bold"
                  style={{ color: theme.whiteConstant }}
                >
                  Search
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="p-4 items-center justify-center rounded-xl border shadow-sm"
              style={{
                borderColor: theme.stroke,
                backgroundColor: theme.surfaceFill,
                flex: 1,
              }}
              onPress={() => {
                setAddress("86xCnPeV69n6t3DnyGvkKobf9FdN2H9oiVDdaMpo2MMY");
                setBalance(null);
                setTokens([]);
                setTxns([]);
              }}
            >
              <Text
                className="text-base font-poppins-bold"
                style={{ color: theme.text }}
              >
                Demo
              </Text>
            </TouchableOpacity>
          </View>

          {!loading && balance === null && searchHistory.length > 0 && (
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text
                  className="text-base font-poppins-bold"
                  style={{ color: theme.text }}
                >
                  Recent Searches
                </Text>
                <TouchableOpacity onPress={clearHistory}>
                  <Text
                    className="text-xs font-poppins"
                    style={{ color: theme.stroke }}
                  >
                    Clear
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="gap-4">
                {searchHistory.slice(0, 5).map((addr) => (
                  <TouchableOpacity
                    key={addr}
                    onPress={() => handleSearch(addr)}
                    className="p-5 rounded-lg border w-full flex-row items-center justify-between"
                    style={{
                      backgroundColor: theme.containerFill,
                      borderColor: theme.stroke,
                      borderWidth: 0.25,
                    }}
                  >
                    <View className="flex-row items-center gap-3 mr-2 ">
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={theme.stroke}
                      />
                      <Text
                        className="text-xs font-poppins"
                        style={{ color: theme.text }}
                      >
                        {shortenAddress(addr, 20)}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={theme.stroke}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {error && !loading && (
            <View
              className="p-4 mb-4 rounded-lg border"
              style={{
                backgroundColor: theme.surfaceFill,
                // borderColor: theme.semanticRed,
                borderWidth: 0.25,
              }}
            >
              <Text
                className="text-center font-poppins-bold"
                style={{ color: theme.semanticRed }}
              >
                {error}
              </Text>
            </View>
          )}

          {(loading || (!error && balance !== null)) && (
            <View
              className="p-4 mb-4 rounded-lg border"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
            >
              <Text
                className="text-lg mb-1 font-poppins-bold"
                style={{ color: theme.text }}
              >
                Balance
              </Text>
              {loading ? (
                <ActivityIndicator
                  color={theme.primaryOrange}
                  size="small"
                  style={{ alignSelf: "flex-start", marginVertical: 4 }}
                />
              ) : (
                <Text
                  className="text-[28px] font-poppins-bold"
                  style={{ color: theme.primaryOrange }}
                >
                  {balance ? balance.toFixed(4) : 0} SOL
                </Text>
              )}
            </View>
          )}

          {!error && txns.length > 0 && (
            <View className="mb-6">
              <Text
                className="text-lg mb-3 font-poppins-bold"
                style={{ color: theme.text }}
              >
                Recent Transactions
              </Text>
              {txns.slice(0, txnsLimit).map((tx, index) => (
                <View
                  key={index}
                  className="flex-row justify-between items-start p-3.5 mb-2 rounded-lg border"
                  style={{
                    backgroundColor: theme.containerFill,
                    borderColor: theme.stroke,
                    borderWidth: 0.25,
                  }}
                >
                  <View style={{ flex: 1.5 }}>
                    <Text
                      className="font-poppins-medium text-[10px] mb-1 tracking-widest"
                      style={{ color: theme.stroke }}
                    >
                      ADDRESS / SIG
                    </Text>
                    <Text
                      className="mb-1 font-poppins"
                      style={{ color: theme.text }}
                    >
                      {shortenAddress(tx.sig, 4)}
                    </Text>
                    <Text
                      className="text-xs font-poppins-light"
                      style={{ color: theme.stroke }}
                    >
                      {timeAgo(tx.time)}
                    </Text>
                  </View>

                  <View className="flex-1 items-center">
                    <Text
                      className="font-poppins-medium text-[10px] mb-1 tracking-widest"
                      style={{ color: theme.stroke }}
                    >
                      STATUS
                    </Text>
                    <Text
                      className="font-poppins-bold"
                      style={{
                        color: tx.ok ? theme.semanticGreen : theme.semanticRed,
                      }}
                    >
                      {tx.ok ? "Success" : "Failed"}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      className="font-poppins-medium text-[10px] tracking-widest"
                      style={{ color: theme.stroke }}
                    >
                      LINK
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://solscan.io/tx/${tx.sig}`)
                      }
                      className="p-1"
                    >
                      <Ionicons
                        name="open-outline"
                        size={20}
                        color={theme.primaryOrange}
                        style={{ marginTop: 2 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {txns.length > 5 && (
                <View className="flex-row justify-evenly pt-2.5">
                  {txnsLimit > 5 && (
                    <TouchableOpacity
                      onPress={() => setTxnsLimit(5)}
                      className="p-2.5 items-center"
                    >
                      <Ionicons
                        name="chevron-up"
                        size={24}
                        color={theme.stroke}
                      />
                    </TouchableOpacity>
                  )}
                  {txnsLimit < txns.length && (
                    <TouchableOpacity
                      onPress={() => {
                        setLoadingTxnsMore(true);
                        setTimeout(() => {
                          setTxnsLimit((prev) => prev + 5);
                          setLoadingTxnsMore(false);
                        }, 300);
                      }}
                      className="p-2.5 items-center"
                    >
                      {loadingTxnsMore ? (
                        <ActivityIndicator
                          color={theme.primaryOrange}
                          size="small"
                        />
                      ) : (
                        <Ionicons
                          name="chevron-down"
                          size={24}
                          color={theme.stroke}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}

          {!error && tokens.length > 0 && (
            <View className="mb-6">
              <Text
                className="text-lg mb-3 font-poppins-bold"
                style={{ color: theme.text }}
              >
                Tokens ({tokens.length})
              </Text>
              {tokens.slice(0, tokensLimit).map((t, i) => (
                <View
                  key={i}
                  className="flex-row justify-between items-start p-3.5 mb-2 rounded-lg border"
                  style={{
                    backgroundColor: theme.containerFill,
                    borderColor: theme.stroke,
                    borderWidth: 0.25,
                  }}
                >
                  <View style={{ flex: 1.5 }}>
                    <Text
                      className="font-poppins-medium text-[10px] mb-1 tracking-widest"
                      style={{ color: theme.stroke }}
                    >
                      TOKEN MINT
                    </Text>
                    <Text
                      className="flex-1 mr-2.5 font-poppins"
                      style={{ color: theme.text }}
                      numberOfLines={1}
                    >
                      {shortenAddress(t.mint, 4)}
                    </Text>
                  </View>

                  <View className="flex-1 items-center">
                    <Text
                      className="font-poppins-medium text-[10px] mb-1 tracking-widest"
                      style={{ color: theme.stroke }}
                    >
                      BALANCE
                    </Text>
                    <Text
                      className="font-poppins-bold"
                      style={{ color: theme.primaryOrange }}
                    >
                      {t.amount}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.5,
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      className="font-poppins-medium text-[10px] tracking-widest"
                      style={{ color: theme.stroke }}
                    >
                      LINK
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://solscan.io/token/${t.mint}`)
                      }
                      className="p-1"
                    >
                      <Ionicons
                        name="open-outline"
                        size={20}
                        color={theme.primaryOrange}
                        style={{ marginTop: 2 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {tokens.length > 5 && (
                <View className="flex-row justify-evenly pt-2.5">
                  {tokensLimit > 5 && (
                    <TouchableOpacity
                      onPress={() => setTokensLimit(5)}
                      className="p-2.5 items-center"
                    >
                      <Ionicons
                        name="chevron-up"
                        size={24}
                        color={theme.stroke}
                      />
                    </TouchableOpacity>
                  )}
                  {tokensLimit < tokens.length && (
                    <TouchableOpacity
                      onPress={() => {
                        setLoadingTokensMore(true);
                        setTimeout(() => {
                          setTokensLimit((prev) => prev + 5);
                          setLoadingTokensMore(false);
                        }, 300);
                      }}
                      className="p-2.5 items-center"
                    >
                      {loadingTokensMore ? (
                        <ActivityIndicator
                          color={theme.primaryOrange}
                          size="small"
                        />
                      ) : (
                        <Ionicons
                          name="chevron-down"
                          size={24}
                          color={theme.stroke}
                        />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}

          {(txns.length > 0 || tokens.length > 0) && <View className="h-5" />}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
