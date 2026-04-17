import { Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "../stores/wallet-store";

interface Props {
  address: string;
}

export function FavoriteButton({ address }: Props) {
  // Fine-grained boolean selector: re-renders ONLY when this address's
  // favorite status changes. Primitive === comparison is always correct here.
  const favorited = useWalletStore((s) => s.favorites.includes(address));

  // Action refs are stable (never recreated) in Zustand — safe to select directly.
  const addFavorite = useWalletStore((s) => s.addFavorite);
  const removeFavorite = useWalletStore((s) => s.removeFavorite);

  return (
    <Pressable
      onPress={() =>
        favorited ? removeFavorite(address) : addFavorite(address)
      }
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons
        name={favorited ? "heart" : "heart-outline"}
        size={24}
        color={favorited ? "#FF4545" : "#888"}
      />
    </Pressable>
  );
}
