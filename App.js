import "./gesture-handler";
import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import MyAllTabs from "./Tabs/MyAllTabs";
import SettingScreen from "./Screens/SettingScreen";
import Add_Recipe from "./Screens/Add_Recipe";
import Entrance from "./Screens/Entrance";
import My_Recipes_Screen from "./Screens/My_Recipes_Screen";
import Entypo from "@expo/vector-icons/Entypo";
import CustomDrawerContent from "./Components/CustomDrawerContent";
import { useUserInfoStore } from "./Store/Store";
import Sign_In_Screen from "./Screens/Sign_In_Screen";
import Sign_Up_Screen from "./Screens/Sign_Up_Screen";
import Admin_Category from "./Screens/Admin_Category";
import NetInfo from "@react-native-community/netinfo";
import { Alert, View, Text } from "react-native";
import { useState } from "react";

export default function App() {
  const Drawer = createDrawerNavigator();
  const [isConnected, setIsConnected] = useState(true);
  const { IsUser, IsAdmin, initializeUserInfo } = useUserInfoStore();
  useEffect(() => {
    initializeUserInfo();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        setIsConnected(false);
        Alert.alert(
          "No Internet Connection",
          "Please connect to the internet to use App.",
          [{ text: "OK" }]
        );
      } else {
        setIsConnected(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {isConnected ? (
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            initialRouteName="Entrance"
            screenOptions={({ navigation }) => ({
              headerTintColor: "white",
              headerTitleAlign: "center",
              // setting icon size
              headerLeft: () => (
                <Entypo
                  onPress={() => navigation.openDrawer()}
                  name="menu"
                  size={30}
                  style={{ marginLeft: 12 }}
                  color="white"
                />
              ),
              headerStyle: {
                backgroundColor: "#3DA0A7",
              },
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
              },
              drawerStyle: {
                backgroundColor: "#042628",
                width: 240,
              },
              drawerItemStyle: {
                marginVertical: 4,
                color: "white",
              },
              drawerLabelStyle: {
                padding: 5,
                color: "white",
                fontWeight: "bold",
              },
            })}
          >
            <Drawer.Screen
              name="Entrance"
              options={{
                headerShown: false, // Hide the header
                drawerLabel: () => null, // Hide the label text
                drawerIcon: () => null, // Hide the drawer icon
                drawerItemStyle: {
                  height: 0, // Effectively hide the item by setting height to 0
                },
              }}
              component={Entrance}
            />
            <Drawer.Screen
              name="Sign_In_Screen"
              options={() => ({
                headerStyle: {
                  backgroundColor: "#042628",
                },
                headerShown: false,
                drawerItemStyle: {
                  height: 0,
                },
              })}
              component={Sign_In_Screen}
            />
            <Drawer.Screen
              name="Sign_Up_Screen"
              options={() => ({
                headerShown: false,
                drawerItemStyle: {
                  height: 0,
                },
              })}
              component={Sign_Up_Screen}
            />
            <Drawer.Screen
              name="MyTabs"
              component={MyAllTabs}
              options={{
                drawerLabel: "Home",
                title: "RecipeApp",
                headerShown: false,
              }}
            />

            {IsUser && (
              <Drawer.Screen
                name="Add Recipe"
                component={Add_Recipe}
                options={{ drawerLabel: "Add Recipe", title: "Add Recipe" }}
              />
            )}
            {IsUser && (
              <Drawer.Screen
                name="My Recipes"
                component={My_Recipes_Screen}
                options={{
                  drawerLabel: "My Recipes",
                  title: "My Recipes",
                  headerShown: false,
                }}
              />
            )}
            {IsAdmin && (
              <Drawer.Screen
                name="Admin_Category"
                component={Admin_Category}
                options={{
                  drawerLabel: "Admin Category",
                  title: "Admin Category",
                }}
              />
            )}
            <Drawer.Screen
              name="SettingScreen"
              component={SettingScreen}
              options={{ drawerLabel: "Setting", title: "Setting" }}
            />
          </Drawer.Navigator>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20, color: "red" }}>You are offline</Text>
          </View>
        )}
      </View>
    </NavigationContainer>
  );
}
