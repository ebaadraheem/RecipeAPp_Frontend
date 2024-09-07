import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFavoriteStore, useUserInfoStore } from "../Store/Store";

const Card = ({ item, navigation }) => {
  const { UserId, IsUser } = useUserInfoStore();
  const {
    addFavorite,
    removeFavorite,
    Favorite,
    Add_Fav_Function,
    Remove_Fav_Function,
  } = useFavoriteStore();
  const [isFavorite, setIsFavorite] = useState(false);

  const RecipeDescription = () => {
    navigation.navigate("ItemDescription", { item: item });
  };
  const handlePress = () => {
    if (isFavorite) {
      removeFavorite(item);

      if (IsUser) {
        Remove_Fav_Function(UserId, item.recipe_id);
      }
    } else {
      addFavorite(item);
      if (IsUser) {
        Add_Fav_Function(UserId, item.recipe_id);
      }
    }
    // Toggle the favorite state
    setIsFavorite((prevFavorite) => !prevFavorite);
  };
  useEffect(() => {
    const isFav = Favorite.some(
      (favItem) => favItem.recipe_id === item.recipe_id
    );
    setIsFavorite(isFav);
  }, [Favorite, item.recipe_id]);
  return (
    <TouchableOpacity
      className="overflow-hidden bg-[#3DA0A7] rounded-md w-[95%] h-[220px] mb-2"
      activeOpacity={0.5}
      onPress={RecipeDescription}
      key={item.recipe_id}
    >
      <View className="h-full">
        <View className="h-[75%] items-center justify-center">
          <Image
            source={{ uri: item.image_url }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <View className="h-[30%] overflow-hidden flex-row justify-center items-center">
          <View className="w-[75%] justify-center h-full px-2 mb-3">
            <Text className="text-lg text-center font-bold text-white">
              {item.title}
            </Text>
          </View>
          <View className="w-[25%] justify-center items-center h-full border-l-2 mb-3 border-black">
            <Pressable
              className="rounded-full p-1"
              onPress={() => handlePress(item)}
            >
              {isFavorite ? (
                <MaterialIcons name="favorite" size={28} color="black" />
              ) : (
                <MaterialIcons
                  name="favorite-outline"
                  size={28}
                  color="black"
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Card;
