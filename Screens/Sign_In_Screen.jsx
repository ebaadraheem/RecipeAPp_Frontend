import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";
import Sign_In from "../Components/Sign_In";
import Forgot_Password from "../Components/Forgot_Password";
const Sign_In_Screen = () => {
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
      initialRouteName="Sign_In"
    >
      <Stack.Screen
        name="Sign_In"
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
        component={Sign_In}
      />
      <Stack.Screen
        name="Forgot_Password"
        options={{ title: "" }}
        component={Forgot_Password}
      />
    </Stack.Navigator>
  );
};

export default Sign_In_Screen;
