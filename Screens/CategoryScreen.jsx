import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
} from "react-native";

import { React, useEffect, useState, useCallback } from "react";
import { ScrollView } from "react-native";

import {
  useCategoryStore,
  useRecipes,
  useFavoriteStore,
  useUserInfoStore,
} from "../Store/Store";
const CategoryScreen = ({ navigation }) => {
  const { UserId, IsUser } = useUserInfoStore();
  const { Get_Fav_Data, Favorite } = useFavoriteStore();
  const { CategoryData, Get_Categories } = useCategoryStore();
  const { Get_Recipes } = useRecipes();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    Get_Recipes();
    Get_Categories();
    if (IsUser) {
      Get_Fav_Data(UserId);
    }
  }, []);

  // Function to handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Get_Recipes();
    Get_Categories();
    if (IsUser) {
      Get_Fav_Data(UserId);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const RenderFunction = ({ item }) => {
    const CategoryDataFunction = () => {
      navigation.navigate("CategoryItems", {
        category: item.category,
      });
    };

    return (
      <TouchableOpacity
        className="bg-[#3DA0A7]  shadow-lg rounded-lg shadow-black"
        activeOpacity={0.4}
        onPress={CategoryDataFunction}
      >
        <View className="items-center w-32  h-32  ">
          <View>
            <Text className=" text-white font-semibold text-lg">
              {item.category}
            </Text>
          </View>
          <View className="  items-center justify-center w-[70%] h-[70%] ">
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-full rounded-lg"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
  <View className="h-full">
    {!CategoryData || CategoryData.length === 0 ? (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3DA0A7"]}
          />
        }
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text className="text-xl">No items found</Text>
      </ScrollView>
    ) : (
      <View className="mt-10 mb-5 justify-center items-center">
        <FlatList
          data={CategoryData}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 10 }}
          columnWrapperStyle={{ gap: 20 }}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3DA0A7"]}
            />
          }
          keyExtractor={(item) => item.category_id}
          renderItem={RenderFunction}
        />
      </View>
    )}
  </View>
</SafeAreaView>

  );
};

export default CategoryScreen;
