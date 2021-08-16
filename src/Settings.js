import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { NearbyConnection } = NativeModules;

const Settings = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [endpoints, setEndpoints] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: "#B83227",
        height: 70,
      },
      headerTintColor: "#fff",
    });
  });

  useEffect(async () => {
    let id = await AsyncStorage.getItem("uid");
    setDeviceId(id);
    return;
  }, []);

  const endpointList = (event) => {
    setEndpoints(event);
  };

  // Listens for endpoints discovered/lost
  DeviceEventEmitter.addListener("endpoints", endpointList);

  return (
    <View style={styles.container}>
      <Text>{deviceId}</Text>
      <Text> Connected Devices </Text>
      {endpoints.map((endpoint, key) => {
        return <Text key={key}>{endpoint}</Text>;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Settings;
