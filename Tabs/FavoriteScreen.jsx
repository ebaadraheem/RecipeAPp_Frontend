import React from "react";
import Favorites from "../Screens/Favorites";
import ItemDescription from "../Screens/ItemDescription";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const FavoriteScreen = () => {
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
      initialRouteName="Favorites"
    >
      <Stack.Screen
        name="Favorites"
        options={{
          title: "Favorite",
          headerLeft: () => (
            <Ionicons
              onPress={() => navigation.toggleDrawer()}
              name="menu"
              size={30}
              color="white"
            />
          ),
        }}
        component={Favorites}
      />

      <Stack.Screen
        name="ItemDescription"
        options={{ title: "Recipe" }}
        component={ItemDescription}
      />
    </Stack.Navigator>
  );
};

export default FavoriteScreen;
