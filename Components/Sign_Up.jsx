import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { Dimensions } from "react-native";
import { React, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import {
  useUserInfoStore,
  useFavoriteStore,
  useSwitchStore,
} from "../Store/Store";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Sign_Up = () => {
  const navigation = useNavigation();
  const { Get_Fav_Data, setFavorite } = useFavoriteStore();
  const [loading, setLoading] = useState(false);
  const { resetSwitches } = useSwitchStore();
  const [Sign_Up_Info, setSign_Up_Info] = useState({
    email: "",
    password: "",
    c_password: "",
  });
  const { IsUser, setIsUser, IsAdmin, setUserId,setUser } = useUserInfoStore();
  useEffect(() => {
    if (IsUser) {
      navigation.navigate("MyTabs");
    }
  }, [IsUser, IsAdmin]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const Handle_Sign_Up = async () => {
    try {
      setLoading(true); // Start loading
  
      if (Sign_Up_Info.email === "" || Sign_Up_Info.password === "") {
        Alert.alert("Please fill all the fields");
        return;
      }
  
      if (!isValidEmail(Sign_Up_Info.email)) {
        Alert.alert("Please enter a valid email address.");
        return;
      }
  
      if (Sign_Up_Info.password !== Sign_Up_Info.c_password) {
        Alert.alert("Passwords do not match");
        return;
      }
  
      // Perform sign-up
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        Sign_Up_Info.email,
        Sign_Up_Info.password
      );
  
      const user = userCredential.user;
  
      // Update user data and state
      await Get_Fav_Data(user.uid); // Ensure this is an async function
      setFavorite([]);
      resetSwitches();
      setUserId(user.uid);
      setUser(user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
  
      setSign_Up_Info({ email: "", password: "", c_password: "" });
      setIsUser(true);
  
    } catch (error) {
      const errorMessage = error.message;
      console.error("Error signing up:", errorMessage);
      Alert.alert("Error", errorMessage); // Display error to the user
  
    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  return (
    <SafeAreaView className="flex-1  bg-[#042628]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center"
      >
        {Dimensions.get("window").height < 2000 && (
          <View
            className={` mb-2 `}
          >
            <Image
              source={require("../assets/Entrance_Img.png")}
              className="w-40 h-40 "
              resizeMode="contain"
            />
          </View>
        )}

        <Text
          className={`text-3xl font-bold text-white ${
            Dimensions.get("window").height < 2000 ? "mb-1" : " mb-6"
          }`}
        >
          Sign Up
        </Text>

        <View
          className={`w-4/5 ${
            Dimensions.get("window").height < 2000 ? "mb-0" : " mb-4"
          }`}
        >
          <Text className="text-white mb-2">E-mail</Text>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#3DA0A7"
            className="bg-[#042628] border border-[#3DA0A7] rounded-lg p-4 text-white mb-4"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={Sign_Up_Info.email}
            onChangeText={(text) =>
              setSign_Up_Info({ ...Sign_Up_Info, email: text })
            }
          />
        </View>

        <View
          className={`w-4/5 ${
            Dimensions.get("window").height < 2000 ? "mb-0" : " mb-4"
          }`}
        >
          <Text className="text-white mb-2">Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#3DA0A7"
            secureTextEntry
            className="bg-[#042628] border border-[#3DA0A7] rounded-lg p-4 text-white mb-4"
            value={Sign_Up_Info.password}
            onChangeText={(text) =>
              setSign_Up_Info({ ...Sign_Up_Info, password: text })
            }
          />
        </View>
        <View
          className={`w-4/5 ${
            Dimensions.get("window").height < 2000 ? "mb-0" : " mb-4"
          }`}
        >
          <Text className="text-white mb-2">Confirm Password</Text>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#3DA0A7"
            secureTextEntry
            className="bg-[#042628] border border-[#3DA0A7] rounded-lg p-4 text-white mb-4"
            value={Sign_Up_Info.c_password}
            onChangeText={(text) =>
              setSign_Up_Info({ ...Sign_Up_Info, c_password: text })
            }
          />
        </View>

        <TouchableOpacity
          onPress={Handle_Sign_Up}
          className={`w-4/5 bg-[#3DA0A7] rounded-lg py-3 mb-4 `}
        >
          <Text className="text-center text-white text-lg font-bold">
            Sign Up
          </Text>
        </TouchableOpacity>

        <View className="flex-row ">
          <Text className="text-white">Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign_In")}>
            <Text className="text-[#3DA0A7]">Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && (
          <View className="absolute w-full bg-transparent h-full justify-center items-center">
            <ActivityIndicator size="large" color="#3DA0A7" />
          </View>
        )}
    </SafeAreaView>
  );
};

export default Sign_Up;
