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
        data={txns.slice(0, txnsLimit)}
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
                  <ActivityIndicator
                    color={theme.primaryOrange}
                    size="small"
                    style={{ alignSelf: "flex-start", marginVertical: 4 }}
                  />
                ) : (
                  <Text style={styles.cardValue}>
                    {balance ? balance.toFixed(4) : 0} SOL
                  </Text>
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
                <Text
                  style={[styles.cardTitle, { marginBottom: loading ? 8 : 16 }]}
                >
                  Recent Transactions
                </Text>
                {loading && (
                  <ActivityIndicator
                    color={theme.primaryOrange}
                    size="small"
                    style={{ alignSelf: "flex-start", marginVertical: 4 }}
                  />
                )}
              </View>
            )}
          </>
        }
        renderItem={({ item: tx, index }) => {
          const visibleTxns = txns.slice(0, txnsLimit);
          const isAtEndOfVisible = index === visibleTxns.length - 1;
          const isCollapsible = txns.length > 5;
          const applyBottomCorners = isAtEndOfVisible && !isCollapsible;

          return (
            <View>
              <View
                style={[
                  styles.card,
                  {
                    paddingTop: 0,
                    paddingBottom: applyBottomCorners ? 20 : 0,
                    marginBottom: applyBottomCorners ? 16 : 0,
                    borderTopWidth: 0,
                    borderBottomWidth: applyBottomCorners ? 1 : 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: applyBottomCorners ? 8 : 0,
                    borderBottomRightRadius: applyBottomCorners ? 8 : 0,
                  },
                ]}
              >
                <View style={[styles.row, { alignItems: "flex-start" }]}>
                  <View style={{ flex: 1.5 }}>
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 10,
                        color: theme.stroke,
                        marginBottom: 4,
                        letterSpacing: 1,
                      }}
                    >
                      ADDRESS / SIG
                    </Text>
                    <Text style={styles.txSig}>{shortenAddress(tx.sig, 8)}</Text>
                    <Text style={styles.txTime}>{timeAgo(tx.time)}</Text>
                  </View>

                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 10,
                        color: theme.stroke,
                        marginBottom: 4,
                        letterSpacing: 1,
                      }}
                    >
                      STATUS
                    </Text>
                    <Text
                      style={{
                        color: tx.ok ? theme.semanticGreen : theme.semanticRed,
                        fontFamily: "Poppins-Bold",
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
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 10,
                        color: theme.stroke,
                        letterSpacing: 1,
                      }}
                    >
                      LINK
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(`https://solscan.io/tx/${tx.sig}`)
                      }
                      style={{ padding: 4 }}
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
              </View>

              {isAtEndOfVisible && isCollapsible && (
                <View
                  style={[
                    styles.card,
                    {
                      paddingTop: 10,
                      paddingBottom: 20,
                      marginBottom: 16,
                      borderTopWidth: 0,
                      borderBottomWidth: 1,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      borderBottomLeftRadius: 8,
                      borderBottomRightRadius: 8,
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                    },
                  ]}
                >
                  {txnsLimit > 5 && (
                    <TouchableOpacity
                      onPress={() => setTxnsLimit(5)}
                      style={{ padding: 10, alignItems: "center" }}
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
                      style={{ padding: 10, alignItems: "center" }}
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
          );
        }}
        ListFooterComponent={
          <>
            {(loading || (!error && tokens.length > 0)) && (
              <View
                style={[styles.card, { marginTop: txns.length > 0 ? 16 : 0 }]}
              >
                <Text style={styles.cardTitle}>
                  Tokens{" "}
                  {!loading && tokens.length > 0 ? `(${tokens.length})` : ""}
                </Text>
                {loading ? (
                  <ActivityIndicator
                    color={theme.primaryOrange}
                    size="small"
                    style={{ alignSelf: "flex-start", marginVertical: 4 }}
                  />
                ) : (
                  <>
                    {tokens.slice(0, tokensLimit).map((t, i) => (
                      <View
                        key={i}
                        style={[styles.row, { alignItems: "flex-start" }]}
                      >
                        <View style={{ flex: 1.5 }}>
                          <Text
                            style={{
                              fontFamily: "Poppins-Medium",
                              fontSize: 10,
                              color: theme.stroke,
                              marginBottom: 4,
                              letterSpacing: 1,
                            }}
                          >
                            TOKEN MINT
                          </Text>
                          <Text style={styles.tokenMint} numberOfLines={1}>
                            {shortenAddress(t.mint, 8)}
                          </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: "center" }}>
                          <Text
                            style={{
                              fontFamily: "Poppins-Medium",
                              fontSize: 10,
                              color: theme.stroke,
                              marginBottom: 4,
                              letterSpacing: 1,
                            }}
                          >
                            BALANCE
                          </Text>
                          <Text style={styles.tokenAmount}>{t.amount}</Text>
                        </View>

                        <View
                          style={{
                            flex: 0.5,
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Poppins-Medium",
                              fontSize: 10,
                              color: theme.stroke,
                              letterSpacing: 1,
                            }}
                          >
                            LINK
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              Linking.openURL(
                                `https://solscan.io/token/${t.mint}`,
                              )
                            }
                            style={{ padding: 4 }}
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
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          paddingTop: 10,
                        }}
                      >
                        {tokensLimit > 5 && (
                          <TouchableOpacity
                            onPress={() => setTokensLimit(5)}
                            style={{ padding: 10, alignItems: "center" }}
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
                            style={{ padding: 10, alignItems: "center" }}
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
                  </>
                )}
              </View>
            )}
            {txns.length > 0 || tokens.length > 0 ? (
              <View style={{ height: 20 }} />
            ) : null}
          </>
        }
      />
    </SafeAreaView>
  );
}
