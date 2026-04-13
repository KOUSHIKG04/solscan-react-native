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
import { useAppStyles } from "../theme/useAppStyles";
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

  const { styles, theme, scheme, toggleScheme } = useAppStyles();

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
      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>SolScan</Text>
            <TouchableOpacity style={styles.themeToggle} onPress={toggleScheme}>
              <Ionicons
                name={scheme === "light" ? "moon" : "sunny"}
                size={16}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Explore any Solona Wallet here...</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Solana Address"
              placeholderTextColor={theme.stroke}
              value={address}
              onChangeText={setAddress}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View>
            <TouchableOpacity
              style={styles.btn}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.whiteConstant} />
              ) : (
                <Text style={styles.btnText}>Search</Text>
              )}
            </TouchableOpacity>
          </View>

          {error && !loading && (
            <View style={[styles.card, { borderColor: theme.semanticRed }]}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {(loading || (!error && balance !== null)) && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Balance</Text>
              {loading ? (
                <ActivityIndicator
                  color={theme.primaryOrange}
                  size="small"
                  style={styles.loaderSmall}
                />
              ) : (
                <Text style={styles.cardValue}>
                  {balance ? balance.toFixed(4) : 0} SOL
                </Text>
              )}
            </View>
          )}

          {!error && txns.length > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
                Recent Transactions
              </Text>
              {txns.slice(0, txnsLimit).map((tx, index) => (
                <View key={index} style={[styles.row, styles.rowTopAligned]}>
                  <View style={styles.colFlex1_5}>
                    <Text style={styles.colHeading}>ADDRESS / SIG</Text>
                    <Text style={styles.txSig}>
                      {shortenAddress(tx.sig, 4)}
                    </Text>
                    <Text style={styles.txTime}>{timeAgo(tx.time)}</Text>
                  </View>

                  <View style={styles.colCenter}>
                    <Text style={styles.colHeading}>STATUS</Text>
                    <Text
                      style={
                        tx.ok
                          ? styles.txStatusTextSuccess
                          : styles.txStatusTextFailed
                      }
                    >
                      {tx.ok ? "Success" : "Failed"}
                    </Text>
                  </View>

                  <View style={styles.colRight}>
                    <Text style={styles.colHeadingNoMargin}>LINK</Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://solscan.io/tx/${tx.sig}`)
                      }
                      style={styles.iconButton}
                    >
                      <Ionicons
                        name="open-outline"
                        size={20}
                        color={theme.primaryOrange}
                        style={styles.iconAdjust}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {txns.length > 5 && (
                <View style={styles.tokenFooterToggleRow}>
                  {txnsLimit > 5 && (
                    <TouchableOpacity
                      onPress={() => setTxnsLimit(5)}
                      style={styles.toggleBtn}
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
                      style={styles.toggleBtn}
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
            <View style={{ marginBottom: 24 }}>
              <Text style={[styles.cardTitle, { marginBottom: 12 }]}>
                Tokens ({tokens.length})
              </Text>
              {tokens.slice(0, tokensLimit).map((t, i) => (
                <View key={i} style={[styles.row, styles.rowTopAligned]}>
                  <View style={styles.colFlex1_5}>
                    <Text style={styles.colHeading}>TOKEN MINT</Text>
                    <Text style={styles.tokenMint} numberOfLines={1}>
                      {shortenAddress(t.mint, 4)}
                    </Text>
                  </View>

                  <View style={styles.colCenter}>
                    <Text style={styles.colHeading}>BALANCE</Text>
                    <Text style={styles.tokenAmount}>{t.amount}</Text>
                  </View>

                  <View style={styles.colRight}>
                    <Text style={styles.colHeadingNoMargin}>LINK</Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://solscan.io/token/${t.mint}`)
                      }
                      style={styles.iconButton}
                    >
                      <Ionicons
                        name="open-outline"
                        size={20}
                        color={theme.primaryOrange}
                        style={styles.iconAdjust}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
              {tokens.length > 5 && (
                <View style={styles.tokenFooterToggleRow}>
                  {tokensLimit > 5 && (
                    <TouchableOpacity
                      onPress={() => setTokensLimit(5)}
                      style={styles.toggleBtn}
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
                      style={styles.toggleBtn}
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

          {txns.length > 0 || tokens.length > 0 ? (
            <View style={styles.bottomSpacer} />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
