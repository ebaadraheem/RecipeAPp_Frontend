import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import Sign_Up from "../Components/Sign_Up";
const Sign_Up_Screen = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#042628",
        },
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 22,
        },
      }}
      initialRouteName="Sign_Up"
    >
      <Stack.Screen
        name="Sign_Up"
        options={({ navigation }) => ({
          headerRight: () => (
            <Entypo
              onPress={() => navigation.goBack()}
              name="circle-with-cross"
              size={30}
              color="white"
            />
          ),
          title: "",
        })}
        component={Sign_Up}
      />
    </Stack.Navigator>
  );
};

export default Sign_Up_Screen;
