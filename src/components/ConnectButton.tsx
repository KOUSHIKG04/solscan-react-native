import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";

interface Props {
  connected: boolean;
  connecting: boolean;
  publicKey: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectButton({
  connected,
  connecting,
  publicKey,
  onConnect,
  onDisconnect,
}: Props) {
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
          borderWidth: 0.25
        }}
        onPress={onDisconnect}
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
      className="flex-row items-center px-6 py-3 rounded-full gap-2 shadow-sm"
      style={{ backgroundColor: theme.primaryOrange }}
      onPress={onConnect}
    >
      <Ionicons name="wallet-outline" size={20} color={theme.whiteConstant} />
      <Text 
        className="font-poppins-bold text-base"
        style={{ color: theme.whiteConstant }}
      >
        Connect Wallet
      </Text>
    </TouchableOpacity>
  );
}
