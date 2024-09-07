import {
  FlatList,
  View,
  RefreshControl,
  ScrollView,
  Text,
  SafeAreaView,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import Card from "../Components/Card";
import { useRecipes, useSwitchStore } from "../Store/Store";

const CategoryItems = ({ navigation, route }) => {
  const { SeparateDataByCategory, Get_Recipes } = useRecipes();
  const Switches = useSwitchStore((state) => state.switches);

  const [categoryItems, setCategoryItems] = useState(() =>
    SeparateDataByCategory(route.params?.category)
  );

  const [refreshing, setRefreshing] = useState(false);

  // Function to handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Get_Recipes(); // Ensure the recipes are fetched before updating the category data
    const updatedCategoryData = SeparateDataByCategory(route.params?.category);
    setCategoryItems(
      updatedCategoryData.filter((item) => Switches[item.type] === true)
    );
    setRefreshing(false);
  }, [route.params.category, Switches, Get_Recipes]);

  useEffect(() => {
    const initialCategoryData = SeparateDataByCategory(route.params.category);
    setCategoryItems(
      initialCategoryData.filter((item) => Switches[item.type] === true)
    );
  }, [route.params.category, Switches, SeparateDataByCategory]);

  const RenderFunction = ({ item }) => {
    return <Card item={item} navigation={navigation} />;
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="pt-8 flex-1">
        
        {!categoryItems || categoryItems.length === 0 ? (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3DA0A7"]}
              />
            }
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text className="text-xl">No items found</Text>
          </ScrollView>
        ) : (
          <FlatList
            data={categoryItems}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3DA0A7"]}
              />
            }
            contentContainerStyle={{
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
            keyExtractor={(item) => item.recipe_id}
            renderItem={RenderFunction}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default CategoryItems;
