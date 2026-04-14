import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";
import { Token, Txn, getBalance, getTokens, getTxns } from "../utils/solanaApi";
import { shortenAddress, timeAgo } from "../utils/formatters";
import { Ionicons } from "@expo/vector-icons";

export default function WalletScreen() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [txnsLimit, setTxnsLimit] = useState(5);
  const [tokensLimit, setTokensLimit] = useState(5);
  const [loadingTxnsMore, setLoadingTxnsMore] = useState(false);
  const [loadingTokensMore, setLoadingTokensMore] = useState(false);

  const { theme, scheme, toggleScheme } = useTheme();

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter a search string or wallet address");
      return;
    }
    setLoading(true);
    setError(null);
    setBalance(null);
    setTokens([]);
    setTxns([]);
    setTxnsLimit(5);
    setTokensLimit(5);

    try {
      const [bal, toks, history] = await Promise.all([
        getBalance(address),
        getTokens(address).catch(() => []),
        getTxns(address).catch(() => []),
      ]);
      setBalance(bal);
      setTokens(toks);
      setTxns(history);
    } catch (err: any) {
      setError(err.message || "Invalid or unreachable address.");
      setBalance(null);
      setTokens([]);
      setTxns([]);
    } finally {
      setLoading(false);
    }
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
        >
          
          <View className="flex-row items-center mb-0.5 relative">
            <Text
              className="text-[32px] mt-3 font-poppins-bold"
              style={{ color: theme.text }}
            >
              SolScan
            </Text>
            <TouchableOpacity
              className="absolute right-0 p-2 rounded-lg border"
              style={{
                backgroundColor: theme.surfaceFill,
                borderColor: theme.stroke,
                borderWidth: 0.5,
              }}
              onPress={toggleScheme}
            >
              <Ionicons
                name={scheme === "light" ? "moon" : "sunny"}
                size={16}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>

          <Text
            className="text-base mb-3.5 font-poppins"
            style={{ color: theme.stroke }}
          >
            Explore any Solona Wallet here...
          </Text>

          <View className="flex-row mb-3 rounded-lg">
            <TextInput
              className="flex-1 p-3.5 text-base rounded-lg border font-poppins"
              style={{
                backgroundColor: theme.surfaceFill,
                color: theme.text,
                borderColor: theme.stroke,
                borderWidth: 0.25,
              }}
              placeholder="Solana Address"
              placeholderTextColor={theme.stroke}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Search Button */}
          <View>
            <TouchableOpacity
              className="flex-1 p-3 items-center justify-center rounded-xl mb-6"
              style={{ backgroundColor: theme.primaryOrange }}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.whiteConstant} />
              ) : (
                <Text className="text-white text-base font-poppins-bold">
                  Search
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Error Card */}
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

                  <View style={{ flex: 0.5, alignItems: "flex-end", justifyContent: "center" }}>
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
                      <Ionicons name="chevron-up" size={24} color={theme.stroke} />
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
                        <ActivityIndicator color={theme.primaryOrange} size="small" />
                      ) : (
                        <Ionicons name="chevron-down" size={24} color={theme.stroke} />
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

                  <View style={{ flex: 0.5, alignItems: "flex-end", justifyContent: "center" }}>
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
                      <Ionicons name="chevron-up" size={24} color={theme.stroke} />
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
                        <ActivityIndicator color={theme.primaryOrange} size="small" />
                      ) : (
                        <Ionicons name="chevron-down" size={24} color={theme.stroke} />
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          )}

          {(txns.length > 0 || tokens.length > 0) && (
            <View className="h-5" />
          )}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
