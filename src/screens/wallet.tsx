import { useState } from "react";
import {
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";
import { Token, Txn, getBalance, getTokens, getTxns } from "../utils/solanaApi";
import { formatAddress, shortenAddress, timeAgo } from "../utils/formatters";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "../stores/wallet-store";
import DevAndMain from "../components/DevAndMain";
import { FavoriteButton } from "../components/FavoriteButton";
import { useWallet } from "../hooks/useWallet";
import ConnectButton from "../components/ConnectButton";

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
  const wallet = useWallet();

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
    <View className="flex-1" style={{ backgroundColor: theme.primaryFill }}>
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
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
            <View className="flex-row items-center justify-between  pt-3">
              <Text
                className="text-[32px] font-poppins-bold"
                style={{ color: theme.text, includeFontPadding: false }}
              >
                SolScan
              </Text>
              <View className="flex-row items-center gap-3">
                <DevAndMain />
                <ConnectButton wallet={wallet} />
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
              className="flex-row items-center mb-3  border rounded-[20px]"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.6,
              }}
            >
              <TextInput
                className="flex-1 py-3.5 pl-3 text-base font-poppins rounded-[20px]"
                style={{
                  color: theme.text,
                  includeFontPadding: false,
                  textAlignVertical: "center",
                  marginLeft: 12,
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
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={theme.stroke}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View className="flex-row items-center mb-6" style={{ gap: 10 }}>
              <TouchableOpacity
                className="p-4 items-center justify-center rounded-[20px] shadow-sm"
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
                className="p-4 items-center justify-center rounded-[20px] border shadow-sm"
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
              <View className="mb-6 ">
                <View className="flex-row justify-between items-center mb-3 ">
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
                      className="p-5 rounded-[20px] border w-full flex-row items-center justify-between"
                      style={{
                        backgroundColor: theme.containerFill,
                        borderColor: theme.stroke,
                        borderWidth: 0.6,
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
                  borderWidth: 0.6,
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
                className="mb-4 rounded-[20px] border"
                style={{
                  backgroundColor: theme.surfaceFill,
                  borderColor: theme.stroke,
                  borderWidth: 0.6,
                  padding: 22,
                }}
              >
                <View
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    zIndex: 10,
                    elevation: 10,
                  }}
                >
                  <FavoriteButton address={lastSearchedAddress} />
                </View>

                <Text
                  className="text-[22px] font-poppins-bold text-center tracking-widest"
                  style={{ color: theme.text }}
                >
                  SOL BALANCE
                </Text>
                {loading ? (
                  <ActivityIndicator
                    color={theme.primaryOrange}
                    size="large"
                    style={{ alignSelf: "center", marginVertical: 12 }}
                  />
                ) : (
                  <View>
                    <Text
                      className="text-[32px] font-poppins-bold text-center mt-2"
                      style={{ color: theme.primaryOrange }}
                    >
                      {balance ? balance.toFixed(4) : 0}
                      <Text className="text-[22px]"> SOL</Text>
                    </Text>
                    <View className="flex-row justify-center items-center mt-2">
                      <View
                        className="flex-row items-center gap-2 px-5 py-3 rounded-[20px]"
                        style={{
                          backgroundColor: theme.containerFill,
                          borderColor: theme.stroke,
                          borderWidth: 0.6,
                        }}
                      >
                        <Ionicons
                          name="wallet-outline"
                          size={13}
                          color={theme.text}
                        />
                        <Text
                          className="text-[12px] font-poppins-medium"
                          style={{
                            color: theme.stroke,
                            includeFontPadding: false,
                            textAlignVertical: "center",
                          }}
                        >
                          {formatAddress(lastSearchedAddress)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* ... rest of the ScrollView content ... */}
            {/* {!error && txns.length > 0 && (
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
                    className="flex-row justify-between items-start p-3.5 mb-2 rounded-[20px] border"
                    style={{
                      backgroundColor: theme.containerFill,
                      borderColor: theme.stroke,
                      borderWidth: 0.6,
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
                          color: tx.ok
                            ? theme.semanticGreen
                            : theme.semanticRed,
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
                        className="p-2.5 items-center rounded-[12px]"
                        style={{
                          borderWidth: 0.6,
                          borderColor: theme.stroke,
                        }}
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
                        className="p-2.5 items-center rounded-[12px]"
                        style={{
                          borderWidth: 0.6,
                          borderColor: theme.stroke,
                        }}
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
            )} */}

            {/* {!error && tokens.length > 0 && (
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
                    className="flex-row justify-between items-start p-3.5 mb-2 rounded-[20px] border"
                    style={{
                      backgroundColor: theme.containerFill,
                      borderColor: theme.stroke,
                      borderWidth: 0.6,
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
                        className="p-2.5 items-center rounded-[12px]"
                        style={{
                          borderWidth: 0.6,
                          borderColor: theme.stroke,
                        }}
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
            )} */}

            {(txns.length > 0 || tokens.length > 0) && <View className="h-5" />}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
