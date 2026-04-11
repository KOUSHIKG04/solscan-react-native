import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Linking,
} from "react-native";
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

    try {
      const bal = await getBalance(address);
      setBalance(bal);

      const toks = await getTokens(address).catch(() => []);
      setTokens(toks);

      const history = await getTxns(address).catch(() => []);
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
    <SafeAreaView style={styles.safe}>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        data={txns}
        keyExtractor={(item) => item.sig}
        ListHeaderComponent={
          <>
            <View style={styles.headerRow}>
              <Text style={styles.title}>SolScan</Text>
              <TouchableOpacity
                style={styles.themeToggle}
                onPress={toggleScheme}
              >
                <Ionicons
                  name={scheme === "light" ? "moon" : "sunny"}
                  size={16}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtitle}>
              Explore any Solona Wallet here...
            </Text>

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
                <Text
                  style={{
                    color: theme.semanticRed,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {error}
                </Text>
              </View>
            )}

            {(loading || (!error && balance !== null)) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Balance</Text>
                {loading ? (
                  <ActivityIndicator color={theme.primaryOrange} size="small" style={{ alignSelf: "flex-start", marginVertical: 4 }} />
                ) : (
                  <Text style={styles.cardValue}>
                    {balance ? balance.toFixed(4) : 0} SOL
                  </Text>
                )}
              </View>
            )}

            {(loading || (!error && tokens.length > 0)) && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  Tokens {!loading && tokens.length > 0 ? `(${tokens.length})` : ""}
                </Text>
                {loading ? (
                  <ActivityIndicator color={theme.primaryOrange} size="small" style={{ alignSelf: "flex-start", marginVertical: 4 }} />
                ) : (
                  <>
                    {tokens.slice(0, 5).map((t, i) => (
                      <View key={i} style={styles.row}>
                        <Text style={styles.tokenMint} numberOfLines={1}>
                          {shortenAddress(t.mint, 6)}
                        </Text>
                        <Text style={styles.tokenAmount}>{t.amount}</Text>
                      </View>
                    ))}
                    {tokens.length > 5 && (
                      <Text style={styles.moreText}>
                        + {tokens.length - 5} more tokens
                      </Text>
                    )}
                  </>
                )}
              </View>
            )}

            {(loading || (!error && txns.length > 0)) && (
              <View
                style={[
                  styles.card,
                  {
                    paddingBottom: loading ? 20 : 0,
                    marginBottom: loading ? 16 : 0,
                    borderBottomWidth: loading ? 0.25 : 0,
                    borderBottomLeftRadius: loading ? 8 : 0,
                    borderBottomRightRadius: loading ? 8 : 0,
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { marginBottom: loading ? 8 : 16 }]}>
                  Recent Transactions
                </Text>
                {loading && (
                  <ActivityIndicator color={theme.primaryOrange} size="small" style={{ alignSelf: "flex-start", marginVertical: 4 }} />
                )}
              </View>
            )}
          </>
        }
        renderItem={({ item: tx, index }) => {
          const isLast = index === txns.length - 1;
          return (
            <View
              style={[
                styles.card,
                {
                  paddingTop: 0,
                  paddingBottom: isLast ? 20 : 0,
                  marginBottom: isLast ? 16 : 0,
                  borderTopWidth: 0,
                  borderBottomWidth: isLast ? 1 : 0,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: isLast ? 8 : 0,
                  borderBottomRightRadius: isLast ? 8 : 0,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.row}
                onPress={() =>
                  Linking.openURL(`https://solscan.io/tx/${tx.sig}`)
                }
              >
                <View style={styles.txInfo}>
                  <Text style={styles.txSig}>{shortenAddress(tx.sig, 8)}</Text>
                  <Text style={styles.txTime}>{timeAgo(tx.time)}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      color: tx.ok ? theme.semanticGreen : theme.semanticRed,
                      fontFamily: "Poppins-Bold",
                    }}
                  >
                    {tx.ok ? "Success" : "Failed"}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.stroke} style={{ marginTop: 2 }} />
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListFooterComponent={
          txns.length > 0 ? <View style={{ height: 20 }} /> : null
        }
      />
    </SafeAreaView>
  );
}
