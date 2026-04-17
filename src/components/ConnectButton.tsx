import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";

interface Props {
  wallet: {
    connect: () => Promise<any>;
    disconnect: () => void;
    connected: boolean;
    connecting: boolean;
    publicKey: any; // or PublicKey if you import it
  };
}

export default function ConnectButton({ wallet }: Props) {
  const { connect, disconnect, connected, connecting, publicKey } = wallet;
  const { theme } = useTheme();

  if (connecting) {
    return (
      <View
        className="flex-row items-center px-4 py-2.5 rounded-full gap-2 opacity-80"
        style={{ backgroundColor: theme.surfaceFill }}
      >
        <ActivityIndicator size="small" color={theme.primaryOrange} />
        <Text
          className="font-poppins-semibold text-sm"
          style={{ color: theme.text }}
        >
          Connecting...
        </Text>
      </View>
    );
  }

  if (connected && publicKey) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center px-4 py-2.5 rounded-full gap-2 border"
        style={{
          backgroundColor: theme.surfaceFill,
          borderColor: theme.stroke,
          borderWidth: 0.25,
        }}
        onPress={connected ? disconnect : connect}
        disabled={connecting}
      >
        <View
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: theme.semanticGreen }}
        />
        <Text
          className="font-poppins-bold text-sm"
          style={{ color: theme.text }}
        >
          {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
        </Text>
        <Ionicons name="close-circle" size={16} color={theme.stroke} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="flex-row items-center px-4 py-1.5 rounded-[14px]  shadow-sm"
      style={{
        backgroundColor: theme.surfaceFill,
        borderColor: theme.primaryOrange,
        borderWidth: 1,
      }}
      onPress={connect}
    >
      <Ionicons name="wallet-outline" size={20} color={theme.primaryOrange} />
      {/* <Text
        className="font-poppins-bold text-base"
        style={{ color: theme.whiteConstant }}
      >
        Connect Wallet
      </Text> */}
    </TouchableOpacity>
  );
}
