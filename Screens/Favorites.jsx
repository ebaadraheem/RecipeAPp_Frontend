import {
  Text,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { React, useEffect, useState } from "react";
import Card from "../Components/Card";
import { useFavoriteStore, useUserInfoStore } from "../Store/Store";

const Favorites = ({ navigation }) => {
  const { UserId, IsUser } = useUserInfoStore();
  const { Favorite, Get_Fav_Data } = useFavoriteStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (IsUser) {
      Get_Fav_Data(UserId);
    }
  }, []);

  // Function to handle refresh
  const onRefresh = () => {
    setRefreshing(true);

    if (IsUser) {
      Get_Fav_Data(UserId);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const RenderFunction = ({ item }) => {
    return <Card item={item} navigation={navigation} />;
  };
  return (
    <SafeAreaView className="flex-1 ">
      {!Favorite || Favorite.length === 0 ? (
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
        <FlatList
          data={Favorite}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#3DA0A7"]}
            />
          }
          contentContainerStyle={{
            paddingVertical: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          keyExtractor={(item) => item.recipe_id}
          renderItem={RenderFunction}
        />
      )}
    </SafeAreaView>
  );
};

export default Favorites;
