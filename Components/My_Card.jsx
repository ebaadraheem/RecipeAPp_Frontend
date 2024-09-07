import {
  Text,
  View,
  Pressable,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { React, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  useUserRecipesStore,
  useUserInfoStore,
  useRecipes,
  useFavoriteStore,
} from "../Store/Store";
const My_Card = ({ item }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { Get_Fav_Data } = useFavoriteStore();
  const { Get_Recipes } = useRecipes();
  const { RemovefromUserRecipes } = useUserRecipesStore();
  const { UserId } = useUserInfoStore();

  const Remove_Recipe = async (item) => {
    try {
      const response = await fetch(`${process.env.SERVER_URL}/Recipe/Delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipe_id: item.recipe_id }),
      });

      const data = await response.json();

      if (response.ok) {
        // Ensure the recipe is removed from the user's recipes and refresh data
        RemovefromUserRecipes(item);
        await Get_Recipes();
        await Get_Fav_Data(UserId);
      } else {
        console.error(
          "Failed to delete recipe:",
          data.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <View
      key={item.recipe_id}
      className="overflow-hidden bg-[#3DA0A7] rounded-md w-[95%] h-[220px] mb-2"
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
              onPress={() => setModalVisible(true)}
            >
              <AntDesign name="delete" size={24} color="black" />
            </Pressable>
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center ">
          <View className="bg-[#042628] p-6 rounded-lg w-[80%] h-[20%] items-center justify-center">
            <Text className="text-center text-white font-bold mb-4">
              Do you really want to delete this Recipe?
            </Text>
            <View className="flex-row gap-3 justify-around">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="bg-gray-300 rounded-lg p-2 w-[40%]"
              >
                <Text className="text-center">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Remove_Recipe(item);
                  setModalVisible(false);
                }}
                className="bg-[#3DA0A7] rounded-lg p-2 w-[40%]"
              >
                <Text className="text-center text-white">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default My_Card;
