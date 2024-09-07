import { ScrollView, Text, TextInput, View,Alert } from "react-native";
import {React,useState} from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { auth } from "../Firebase/Firebase";
import { sendPasswordResetEmail } from "firebase/auth";
const Forgot_Password = () => {
  const [Forgot_Email, setForgot_Email] = useState("");

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const Handle_Forgot = () => {
    if (!isValidEmail(Forgot_Email)) {
      Alert.alert("Please enter a valid email address.");
      return;
    }
    sendPasswordResetEmail(auth, Forgot_Email)
      .then(() => {
        Alert.alert(
          "Link sent to your email address. Follow the link to reset your password."
        );
        setForgot_Email(""); // Clear the input field after the email is sent
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error: ", errorCode, errorMessage);
        Alert.alert("Error", errorMessage); // Inform the user about the error
      });
  };

  return (
    <ScrollView className="flex-1 bg-[#042628]">
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-3xl font-bold text-white mb-5">
          Forgot Password
        </Text>
        <TextInput
          value={Forgot_Email}
          onChangeText={(text) => setForgot_Email(text)}
          placeholder="Email"
          placeholderTextColor="#3DA0A7"
          className="w-11/12 p-4 border border-[#3DA0A7] rounded-md text-white bg-[#042628] mb-5"
        />
        <TouchableOpacity
          onPress={Handle_Forgot}
          className=" bg-[#3DA0A7] rounded-md p-3"
        >
          <Text className="text-center text-white text-lg font-bold">
            Send Link
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Forgot_Password;
