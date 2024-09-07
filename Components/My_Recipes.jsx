import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  Text,
} from "react-native";
import { useUserInfoStore, useUserRecipesStore } from "../Store/Store";

import My_Card from "./My_Card";
const My_Recipes = () => {
  const { UserRecipes, FetchUserRecipes } = useUserRecipesStore();
  const [refreshing, setRefreshing] = useState(false);
  const { UserId } = useUserInfoStore();

  useEffect(() => {
    FetchUserRecipes(UserId);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    FetchUserRecipes(UserId);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const RenderFunction = ({ item }) => {
    return <My_Card item={item} />;
  };
  return (
    <SafeAreaView className="flex-1 ">
      {!UserRecipes || UserRecipes.length === 0 ? (
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
          data={UserRecipes}
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

export default My_Recipes;
