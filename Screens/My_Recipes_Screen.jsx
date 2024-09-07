import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ItemDescription from "../Screens/ItemDescription";
import { useNavigation } from "@react-navigation/native";
import My_Recipes from "../Components/My_Recipes";
import { Ionicons } from "@expo/vector-icons";
const My_Recipes_Screen = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3DA0A7",
        },
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 22,
        },
      }}
      initialRouteName="MyItems"
    >
      <Stack.Screen
        name="MyItems"
        options={{
          title: "My Recipes",
          headerLeft: () => (
            <Ionicons
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={30}
              color="white"
            />
          ),
        }}
        component={My_Recipes}
      />
      <Stack.Screen
        name="ItemDescription"
        options={{ title: "Recipe" }}
        component={ItemDescription}
      />
    </Stack.Navigator>
  );
};

export default My_Recipes_Screen;
