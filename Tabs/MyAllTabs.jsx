import React from "react";
import HomeScreen from "./HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoriteScreen from "./FavoriteScreen";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Dimensions } from "react-native";
const MyAllTabs = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#3DA0A7",
        },
        headerTitleAlign: "center",
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 24,
        },
        tabBarActiveTintColor: "white",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#042628",
          paddingBottom: Dimensions.get("window").width > 370 ? 5 : 1,
          height: Dimensions.get("window").width > 370 ? 60 : 52,
        },
      }}
      initialRouteName="HomeScreen"
    >
      <Tab.Screen
        name="HomeScreen"
        options={{
          tabBarLabel: "Home",

          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="FavoriteScreen"
        options={{
          headerShown: false,
          tabBarLabel: "Favorite",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="favorite" size={24} color={color} />
          ),
        }}
        component={FavoriteScreen}
      />
    </Tab.Navigator>
  );
};

export default MyAllTabs;
