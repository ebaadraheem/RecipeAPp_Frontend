import {
  Image,
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useUserInfoStore } from "../Store/Store";
const Entrance = ({ navigation }) => {
  const { IsUser } = useUserInfoStore();

  return (
    <SafeAreaView>
      <View className=" bg-[#3DA0A7] h-full ">
        <View className="  h-[60%] justify-center items-center  ">
          <View className="  w-[90%] justify-end h-[90%] ">
            <View className=" h-[70%] items-center justify-end    ">
              <Image
                source={require("../assets/Entrance_Img.png")}
                className="w-full h-full"
              />
            </View>
          </View>
        </View>
        <View className=" gap-4 items-center ">
          <View className=" w-[85%]  justify-center h-20 items-center">
            <Text className=" text-white text-xl font-bold text-center ">
              Help your path to health goals with happiness
            </Text>
          </View>
          {IsUser ? (
            <View className=" w-[85%] justify-center gap-3 min-h-16 items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate("MyTabs")}
                className=" w-full items-center"
              >
                <Text className=" p-2 rounded-xl w-[90%] text-center text-white text-lg  font-bold bg-[#042628] ">
                  Welcome
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className=" w-[85%] justify-center gap-3 min-h-16 items-center">
              <TouchableOpacity
                onPress={() => navigation.navigate("Sign_In_Screen")}
                className=" w-full items-center"
              >
                <Text className=" p-2 rounded-xl w-[90%] text-center text-white text-lg  font-bold bg-[#042628] ">
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("MyTabs")}
                className=" w-full items-center"
              >
                <Text className=" p-2 rounded-xl w-[90%] text-center text-white text-lg  font-bold bg-[#042628] ">
                  Continue as a Guest
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Entrance;
