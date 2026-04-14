import { View, Text } from "react-native";
import { useTheme } from "../../src/theme/useTheme";

export default function OrdersScreen() {
  const { theme } = useTheme();
  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: theme.primaryFill }}>
      <Text className="text-lg font-poppins-bold" style={{ color: theme.text }}>Orders</Text>
    </View>
  );
}