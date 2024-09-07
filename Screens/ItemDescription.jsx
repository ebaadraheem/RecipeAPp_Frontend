import {
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFavoriteStore, useUserInfoStore } from "../Store/Store";

const ItemDescription = ({ route }) => {
  const { UserId, IsUser } = useUserInfoStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const {
    addFavorite,
    removeFavorite,
    Favorite,
    Add_Fav_Function,
    Remove_Fav_Function,
  } = useFavoriteStore();
  const navigation = useNavigation();

  const { item } = route.params;

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
    if (!Favorite) {
      setIsFavorite(false);
      return;
    }

    const isFav = Favorite.some(
      (favItem) => favItem.recipe_id === item.recipe_id
    );
    setIsFavorite(isFav);
  }, [Favorite, item.recipe_id]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handlePress} className="mr-4">
          {isFavorite ? (
            <MaterialIcons name="favorite" size={28} color="black" />
          ) : (
            <MaterialIcons name="favorite-outline" size={28} color="black" />
          )}
        </Pressable>
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 12,
          alignItems: "center",
          minHeight: "90%",
        }}
      >
        <View className="w-full min-h-[80%]  ">
          <View className="h-72 mt-2 items-center justify-center">
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </View>
          <View className="mt-2 w-full">
            <View className="py-2 items-center justify-center">
              <Text className="text-2xl font-bold text-center px-4">
                {item.title}
              </Text>
            </View>
            <View className="px-2">
              <Text className="text-xl font-bold underline text-center">
                Type: {item.type}
              </Text>
              <Text className="text-xl font-bold text-start px-1 py-2">
                Ingredients
              </Text>
              {item.ingredients &&
                item.ingredients.map((ingredient, index) => (
                  <Text
                    key={index + 1}
                    className="text-white px-3 py-2 border-2 border-black bg-[#3DA0A7] rounded-md font-bold text-start mb-1"
                  >
                    {index + 1}. {ingredient}
                  </Text>
                ))}
            </View>
            <View className="pt-2 ">
              <Text className="text-xl font-bold text-start pl-3 py-2">
                Recipe
              </Text>
              <Text className="text-lg text-start px-4 ">{item.recipe}</Text>
            </View>
          </View>
        </View>
        {item.posted_by && (
          <View className="w-full mt-2 mb-2">
            <View className="px-4 items-start  gap-1">
              <Text className="text-lg w-full  font-bold text-start underline">
                Posted By :
              </Text>
              <Text className="text-lg  text-[#3DA0A7] break-words">
                {item.posted_by}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemDescription;
