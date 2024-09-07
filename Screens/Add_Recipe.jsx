import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {
  useUserRecipesStore,
  useRecipes,
  useCategoryStore,
  useUserInfoStore,
} from "../Store/Store";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const Add_Recipe = () => {
  const { UserId, User } = useUserInfoStore();
  const { Get_Recipes } = useRecipes();
  const { AddtoUserRecipes } = useUserRecipesStore();
  const [ImageURL, setImageURL] = useState("");
  const [loading, setloading] = useState(false);
  const [RecipeDetails, setRecipeDetails] = useState({
    title: "",
    recipe: "",
    ingredients: [],
    image_url: "",
    user_id: "",
    recipe_id: "",
    posted_by: "",
  });
  const [inputHeight, setInputHeight] = useState(40); // Initial height
  const [Ingredients, setIngredients] = useState([]);

  const { CategoryData } = useCategoryStore();
  const [Ingredient, setIngredient] = useState("");
  const [selectedValue, setSelectedValue] = useState({
    type: "Easy",
    category: CategoryData && CategoryData.length > 0 ? CategoryData[0].category : "",
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

      setRecipeDetails({ ...RecipeDetails, image_url: result.data });
      setImageURL("");
      return { success: true, data: result.data };
    } catch (error) {
      console.error("Error:", error);
      return { success: false, message: error.message };
    }
  };

  const AddIngredients = (ingredient) => {
    if (ingredient === "") {
      return;
    }
    setIngredients([...Ingredients, ingredient]);
    setIngredient("");
  };

  const DeleteIngredient = (index) => {
    const filteredIngredients = Ingredients.filter((item, i) => i !== index);
    setIngredients(filteredIngredients);
  };
  const Post_Function = async () => {
    if (
      RecipeDetails.title === "" ||
      RecipeDetails.recipe === "" ||
      Ingredients.length === 0
    ) {
      Alert.alert("Please fill all the fields");
      return;
    }
    if (RecipeDetails.recipe.length < 100) {
      Alert.alert("Recipe should be greater than 100 characters");
      return;
    }
    if (Ingredients.length < 3) {
      Alert.alert("Add at least 3 ingredients");
      return;
    }
    if (RecipeDetails.title.length < 5) {
      Alert.alert("Title should be greater than 5 characters");
      return;
    }

    try {
      setloading(true);
      const imageUploadResult = await Upload_Image();

      if (!imageUploadResult.success) {
        Alert.alert("Failed to upload image", imageUploadResult.message);
        return;
      }

      // Update RecipeDetails with the image URL from Upload_Image result
      const updatedRecipeDetails = {
        ...RecipeDetails,
        ingredients: Ingredients,
        type: selectedValue.type,
        category: selectedValue.category,
        user_id: UserId,
        recipe_id: uuidv4(),
        posted_by: User.email,
        image_url: imageUploadResult.data, // Assuming Upload_Image returns the image URL
      };

      const response = await fetch(`${process.env.SERVER_URL}/Recipe/Add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedRecipeDetails), // Send the updatedRecipeDetails
      });

      if (response.ok) {
        const data = await response.json();
        AddtoUserRecipes(data.data); // Add the new recipe to the user's recipes
        Get_Recipes(); // Refresh the recipes

        Alert.alert("Recipe added successfully");

        // Resetting the form
        setRecipeDetails({
          title: "",
          recipe: "",
          ingredients: [],
          image_url: "",
          user_id: "",
          recipe_id: "",
        });
        setIngredients([]);
        setIngredient("");
        setSelectedValue({
          type: "Easy",
          category: CategoryData && CategoryData[0].category,
        });
      } else {
        const errorData = await response.json(); // Extract error message
        console.error(
          "Failed to add recipe",
          errorData.message || "Unknown error occurred"
        );
        Alert.alert(
          "Failed to add recipe",
          errorData.message || "Unknown error occurred"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("An error occurred", "Please try again later.");
    } finally {
      setloading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 ">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 mb-2"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-4 space-y-4">
            {/* Form for adding a recipe */}
            <View className="space-y-2">
              <Text className="text-[#042628] text-lg">Title</Text>
              <TextInput
                className="border border-[#042628] rounded-md p-2 "
                placeholder="Enter recipe title"
                value={RecipeDetails.title}
                onChangeText={(text) =>
                  setRecipeDetails({ ...RecipeDetails, title: text })
                }
              />
            </View>
            <View className="space-y-2 ">
              <Text className="text-[#042628] text-lg">Ingredients</Text>
              <View className="flex-row justify-between  items-center">
                <TextInput
                  className="border w-[85%] border-[#042628] rounded-md p-2 "
                  placeholder="Enter ingredient"
                  value={Ingredient}
                  onChangeText={(text) => setIngredient(text)}
                />
                <TouchableOpacity
                  onPress={() => {
                    const trimmedIngredient = Ingredient.trim(); // Remove leading and trailing whitespace
                    if (trimmedIngredient !== "") {
                      AddIngredients(trimmedIngredient);
                    }
                  }}
                  className="bg-[#3DA0A7]  rounded-md p-2"
                >
                  <Text className=" text-center text-white">Add</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center flex-wrap">
                {Ingredients &&
                  Ingredients.map((ingredient, index) => (
                    <View
                      key={index + 1}
                      className="bg-[#3DA0A7] rounded-md w-44 p-2 m-1 flex-row justify-center items-center"
                    >
                      <Text className=" text-white text-start px-2 w-36">
                        {ingredient}
                      </Text>
                      <TouchableOpacity
                        className="  w-8 justify-center items-center"
                        onPress={() => DeleteIngredient(index)}
                      >
                        <Entypo
                          name="circle-with-cross"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            </View>
            <View className="space-y-2 ">
              <Text className="text-[#042628] text-lg">Recipe</Text>

              <TextInput
                className="border border-[#042628] rounded-md p-2 "
                placeholder="Enter recipe instructions"
                multiline={true}
                onContentSizeChange={(e) =>
                  setInputHeight(e.nativeEvent.contentSize.height)
                }
                value={RecipeDetails.recipe}
                onChangeText={(text) =>
                  setRecipeDetails({ ...RecipeDetails, recipe: text })
                }
                style={{ height: Math.max(46, inputHeight) }} // Set dynamic height
              />
            </View>

            <View className="space-y-2">
              <Text className="text-[#042628] text-lg">Type</Text>
              <View className="bg-[#3DA0A7] w-40 rounded-md ">
                <Picker
                  selectedValue={selectedValue.type}
                  onValueChange={(itemValue) =>
                    setSelectedValue((prev) => ({ ...prev, type: itemValue }))
                  }
                  style={{ color: "white" }}
                >
                  <Picker.Item label="Easy" value="Easy" />
                  <Picker.Item label="Medium" value="Medium" />
                  <Picker.Item label="Difficult" value="Difficult" />
                </Picker>
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-[#042628] text-lg">Category</Text>
              <View className="bg-[#3DA0A7] w-40 rounded-md ">
                <Picker
                  selectedValue={selectedValue.category}
                  onValueChange={(itemValue) =>
                    setSelectedValue((prev) => ({
                      ...prev,
                      category: itemValue,
                    }))
                  }
                  style={{ color: "white" }}
                >
                  {CategoryData && CategoryData.length > 0 ? (
                    CategoryData.map((item) => (
                      <Picker.Item
                        label={item.category}
                        value={item.category}
                        key={item.category_id}
                      />
                    ))
                  ) : (
                    <Picker.Item label="No Categories Available" value="" />
                  )}
                </Picker>
              </View>
            </View>
            <View className="space-y-2">
              <TouchableOpacity
                onPress={() => Handle_ImageUpload()}
                className="bg-[#3DA0A7] rounded-md p-3"
              >
                <Text className=" text-center text-white text-lg">
                  {ImageURL ? "Change Image" : "Upload Image"}
                </Text>
              </TouchableOpacity>
              <View className="flex justify-center items-center">
                {ImageURL && (
                  <View className=" items-end  ">
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
            </View>
            <TouchableOpacity
              onPress={() => Post_Function()}
              className="bg-[#3DA0A7] rounded-md p-3 mt-4"
            >
              <Text className=" text-center text-white text-lg">Post</Text>
            </TouchableOpacity>
          </View>

          {loading && (
            <View className="absolute w-full bg-transparent h-full justify-center items-center">
              <ActivityIndicator size="large" color="#3DA0A7" />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Add_Recipe;
