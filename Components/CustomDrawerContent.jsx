import { Text, View } from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { TouchableOpacity } from "react-native-gesture-handler";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import {
  useUserInfoStore,
  useSwitchStore,
  useFavoriteStore,
} from "../Store/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CustomDrawerContent = (props) => {
  const { IsUser, setIsUser, setIsAdmin, setUserId,User,setUser } = useUserInfoStore();
  const { setFavorite } = useFavoriteStore();
  const { resetSwitches } = useSwitchStore();
  return (
    <DrawerContentScrollView {...props}>
      {User ? (
        <View style={{ marginTop: 5, paddingHorizontal: 15, paddingTop: 10 }}>
          <Text className="text-white font-bold text-[16px]">
            {User && User.email}
          </Text>
        </View>
      ) : (
        <View style={{ marginTop: 5, paddingHorizontal: 15, paddingTop: 10 }}>
          <Text className="text-white font-bold text-[16px]">
            Welcome, Guest
          </Text>
        </View>
      )}
      <DrawerItemList {...props} />

      {IsUser ? (
        <View style={{ marginTop: 2, padding: 15 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#3DA0A7",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              signOut(auth)
                .then(() => {
                  setIsUser(false);
                  setIsAdmin(false);
                  setFavorite([]);
                  resetSwitches();
                  setUserId("");
                  setUser("");
                  AsyncStorage.removeItem("user");
                  props.navigation.navigate("Entrance");
                })
                .catch((error) => {
                  console.log("Sign out failed", error);
                });
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Logn Out
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ marginTop: 2, padding: 15 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#3DA0A7",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={() => {
              props.navigation.navigate("Sign_In_Screen");
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>Logn In</Text>
          </TouchableOpacity>
        </View>
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
