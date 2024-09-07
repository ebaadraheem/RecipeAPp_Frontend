import { Text, View, TouchableOpacity, Switch } from "react-native";
import { React, useState, useCallback } from "react";
import { useSwitchStore } from "../Store/Store";
import { useFocusEffect } from "@react-navigation/native";
const SettingScreen = () => {
  const { switches, toggleSwitch } = useSwitchStore();
  const [tempSwitch, setTempSwitch] = useState({});

  const toggleTempSwitch = (key) => {
    setTempSwitch((prevState) => {
      const newState = { ...prevState, [key]: !prevState[key] };
      return newState;
    });
  };

  // Reset tempSwitch whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      setTempSwitch(switches);
    }, [switches])
  );

  const handleSave = () => {
    for (const key in tempSwitch) {
      if (tempSwitch[key] !== switches[key]) {
        toggleSwitch(key);
      }
    }
  };

  return (
    <View className="flex-1  justify-center items-center p-10">
      <View className="flex-row justify-between w-full items-center mb-4">
        <Text className="text-lg">Easy</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3DA0A7" }}
          thumbColor={tempSwitch["Easy"] ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleTempSwitch("Easy")}
          value={tempSwitch["Easy"]}
        />
      </View>

      <View className="flex-row justify-between w-full items-center mb-4">
        <Text className="text-lg">Medium</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3DA0A7" }}
          thumbColor={tempSwitch["Medium"] ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleTempSwitch("Medium")}
          value={tempSwitch["Medium"]}
        />
      </View>

      <View className="flex-row justify-between w-full items-center mb-4">
        <Text className="text-lg">Difficult</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#3DA0A7" }}
          thumbColor={tempSwitch["Difficult"] ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => toggleTempSwitch("Difficult")}
          value={tempSwitch["Difficult"]}
        />
      </View>

      <View className="w-full h-16 justify-center items-end">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#3DA0A7] px-4 py-2 rounded"
        >
          <Text className=" text-white text-lg font-bold">Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingScreen;
