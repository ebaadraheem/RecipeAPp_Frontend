import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { v4 as uuidv4 } from "uuid";
import { useCategoryStore } from "../Store/Store";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { ActivityIndicator } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";

const Admin_Category = () => {
  const { CategoryData, addCategory, removeCategory, Get_Categories } =
    useCategoryStore();
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [ImageURL, setImageURL] = useState("");
  const [loading, setloading] = useState(false);
  const [Item, setItem] = useState({});
  const [Category, setCategory] = useState({
    category_id: "",
    category: "",
    image_url: "",
  });

  const Handle_ImageUpload = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImageURL(result.assets[0].uri);
    }
  };

  const Upload_Image = async () => {
    if (ImageURL === "") {
      return { success: false, message: "No image URL provided" };
    }

    // Create a FormData object
    const formData = new FormData();
    formData.append("file", {
      uri: Platform.OS === "ios" ? ImageURL.replace("file://", "") : ImageURL,
      name: "photo.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(
        `${process.env.SERVER_URL}/Recipe/UploadImage`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        console.log("Failed to upload image", result.message);
        return { success: false, message: result.message };
      }

      if (response.status === 404) {
        console.log("Failed to upload image", result.message);
        return { success: false, message: result.message };
      }

      setCategory({ ...Category, image_url: result.data });
      setImageURL("");
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: error.message };
    }
  };

  const Add_Category = async (category) => {
    const response = await fetch(process.env.SERVER_URL + "/Category/Add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    const data = await response.json();
    if (data.status === 200) {
      addCategory(data.data);
    } else {
      console.log("Failed to add category");
    }
  };

  const Remove_Category = async (item) => {
    const response = await fetch(process.env.SERVER_URL + "/Category/Remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    const data = await response.json();
    if (data.status === 200) {
      removeCategory(data.data);
      setItem({});
      Get_Categories();
    } else {
      setItem({});
      console.log("Failed to remove category");
    }
  };

  const Handle_Add = async () => {
    try {
      setloading(true);
      if (Category.category === "") {
        Alert.alert("Please enter a category name");
        return;
      }

      if (Category.image_url === "") {
        const response = await Upload_Image();
        if (!response.success) {
          Alert.alert("Failed to upload image");
          return;
        }
        
        await Add_Category({
          category_id: uuidv4(),
          category: Category.category,
          image_url: response.data,
        });
      }

    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setloading(false);
      setCategory({ category: "", image_url: "" });
    }
  };

  const HandleCross = (item) => {
    setItem(item);
    setModalVisible(true); // Show confirmation modal before removing category
  };

  const onRefresh = () => {
    setRefreshing(true);
    Get_Categories();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    Get_Categories();
  }, []);

  return (
    <SafeAreaView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3DA0A7"]}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-4">
          <View className="bg-[#3DA0A7] rounded-lg p-4 mb-4">
            <Text className="text-lg text-white font-semibold mb-2">
              Category
            </Text>
            <TextInput
              className="bg-white rounded p-2 mb-4"
              placeholder="Enter Category"
              placeholderTextColor="#6e6e6e"
              value={Category.category}
              onChangeText={(text) =>
                setCategory({ ...Category, category: text })
              }
            />
            <TouchableOpacity
              className="bg-[#042628] rounded-lg py-4 px-2 mt-4"
              onPress={()=>Handle_ImageUpload()}
            >
              <Text className="text-white text-center"> {ImageURL ? "Change Image" : "Upload Image"}</Text>
            </TouchableOpacity>
            
            <View className="flex justify-center items-center">
            {ImageURL && (
                  <View className=" items-end ">
                    <TouchableOpacity
                      className=" w-6 justify-center items-center "
                      onPress={() => setImageURL("")}
                    >
                      <Entypo
                        name="circle-with-cross"
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>

                    <Image
                      source={{ uri: ImageURL }}
                      style={{ width: 200, height: 200 }}
                    />
                  </View>
                )}
            </View>
            <TouchableOpacity
              className="bg-[#042628] rounded-lg py-4 px-2 mt-4"
              onPress={Handle_Add}
            >
              <Text className="text-white text-center">Add Category</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-5 justify-center items-center">
          <View className="flex-row flex-wrap gap-4 justify-center">
            {CategoryData.map((item) => {
              return (
                <View
                  key={item.category_id}
                  className="bg-[#3DA0A7] shadow-lg rounded-lg shadow-black relative"
                >
                  <View className="items-center w-32 h-32 relative justify-between">
                    {/* category */}
                    <Text
                      className="text-white font-semibold text-lg text-center px-2"
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {item.category}
                    </Text>

                    {/* Image */}
                    <View className="items-center justify-center w-[70%] h-[70%] mt-2">
                      <Image
                        source={{ uri: item.image_url }}
                        className="w-full h-full rounded-lg"
                      />
                    </View>
                  </View>

                  {/* Close Icon */}
                  <TouchableOpacity
                    onPress={() => HandleCross(item)}
                    className="absolute top-0 right-0 p-1"
                  >
                    <Entypo name="circle-with-cross" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Modal Confirmation */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center ">
            <View className="bg-[#042628] p-6 rounded-lg w-[80%] h-[20%] items-center justify-center">
              <Text className="text-center text-white font-bold mb-4">
                Do you really want to delete this category?
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
                    Remove_Category(Item);
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
        {loading && (
          <View className="absolute w-full bg-transparent h-full justify-center items-center">
            <ActivityIndicator size="large" color="#3DA0A7" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin_Category;
