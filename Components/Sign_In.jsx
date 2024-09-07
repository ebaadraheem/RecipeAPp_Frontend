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
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native";

import {
  useUserInfoStore,
  useFavoriteStore,
  useSwitchStore,
} from "../Store/Store";

const Sign_In = () => {
  const navigation = useNavigation();
  const { Get_Fav_Data, setFavorite } = useFavoriteStore();
  const [loading, setLoading] = useState(false);
  const { resetSwitches } = useSwitchStore();
  const [Sign_In_Info, setSign_In_Info] = useState({
    email: "",
    password: "",
  });

  const { IsUser, setIsUser, IsAdmin, setUserId, setIsAdmin,setUser } =
    useUserInfoStore();
  useEffect(() => {
    if (IsUser) {
      navigation.navigate("MyTabs");
    }
  }, [IsUser, IsAdmin]);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const Handle_Sign_In = async () => {
    try {
      setLoading(true); // Start loading
  
      if (Sign_In_Info.email === "" || Sign_In_Info.password === "") {
        Alert.alert("Please fill all the fields");
        return;
      }
  
      if (!isValidEmail(Sign_In_Info.email)) {
        Alert.alert("Please enter a valid email address.");
        return;
      }
  
      // Perform sign-in
      const userCredential = await signInWithEmailAndPassword(auth, Sign_In_Info.email, Sign_In_Info.password);
      const user = userCredential.user;
  
      if (user.uid === "zZWsKq1WnVdS9qz8tHBnRc1uLM12") {
        setIsAdmin(true);
      }
      
      setUserId(user.uid);
      setFavorite([]);
      await Get_Fav_Data(user.uid); // Ensure this is an async function
      resetSwitches();
      setSign_In_Info({ email: "", password: "" });
      setIsUser(true);
      setUser(user);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
  
      if (errorCode === "auth/invalid-credential") {
        Alert.alert("Invalid Email or Password");
      } else {
        console.error("Error signing in:", errorMessage);
        Alert.alert("Error", errorMessage); // Display error to the user
      }
  
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  return (
    <SafeAreaView className="h-full justify-center bg-[#042628]">
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center "
      >
        <View className={`items-center ${Dimensions.get("window").height < 2000 ? "mb-1" : "mb-8"}`}>
          <Image
            source={require("../assets/Entrance_Img.png")}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>
  
        <Text className={`text-3xl font-bold text-white ${Dimensions.get("window").height < 2000 ? "mb-2" : "mb-6"}`}>
          Sign In
        </Text>
  
        <View className={`w-4/5 ${Dimensions.get("window").height < 2000 ? "mb-0" : "mb-4"}`}>
          <Text className="text-white mb-2">E-mail</Text>
          <TextInput
            placeholder="E-mail"
            placeholderTextColor="#3DA0A7"
            className="bg-[#042628] border border-[#3DA0A7] rounded-lg p-4 text-white mb-4"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={Sign_In_Info.email}
            onChangeText={(text) => setSign_In_Info({ ...Sign_In_Info, email: text })}
          />
        </View>
  
        <View className={`w-4/5 ${Dimensions.get("window").height < 2000 ? "mb-0" : "mb-4"}`}>
          <Text className="text-white mb-2">Password</Text>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#3DA0A7"
            secureTextEntry
            className="bg-[#042628] border border-[#3DA0A7] rounded-lg p-4 text-white mb-4"
            value={Sign_In_Info.password}
            onChangeText={(text) => setSign_In_Info({ ...Sign_In_Info, password: text })}
          />
        </View>
  
        <TouchableOpacity onPress={() => navigation.navigate("Forgot_Password")}>
          <Text className={`text-[#3DA0A7] ${Dimensions.get("window").height < 2000 ? "mb-2" : "mb-6"}`}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={Handle_Sign_In}
          className={`w-4/5 bg-[#3DA0A7] rounded-lg py-3 ${Dimensions.get("window").height < 2000 ? "mb-2" : "mb-4"}`}
        >
          <Text className="text-center text-white text-lg font-bold">
            Sign In
          </Text>
        </TouchableOpacity>
  
        <View className="flex-row">
          <Text className="text-white">Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Sign_Up_Screen")}>
            <Text className="text-[#3DA0A7]">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {loading && (
          <View className="absolute w-full bg-transparent h-full justify-center items-center">
            <ActivityIndicator size="large" color="#3DA0A7" />
          </View>
        )}
    </ScrollView>
  </SafeAreaView>
  
  );
};

export default Sign_In;
