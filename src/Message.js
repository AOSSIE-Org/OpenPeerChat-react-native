import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  NativeModules,
  DeviceEventEmitter,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./assets/Colors";

const { NearbyConnection } = NativeModules;

const TIME = 1500;
const LENGTH_OF_ID = 5;

const generateUId = (length) => {
  let id = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < LENGTH_OF_ID; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
};

const Name = ({ navigation }) => {
  const [name, setName] = useState();
  const [message, setMessage] = useState();
  const [endpoints, setEndpoints] = useState([]);
  const handleNameChange = (e) => {
    setName(e);
  };
  useEffect(async () => {
    const device = await AsyncStorage.getItem("uid");
    // start discovering to nearby devices
    NearbyConnection.startDiscovery(device);

    // Start Advertising to nearby devices
    NearbyConnection.startAdvertising(device);
  }, []);

  const sendMessage = () => {};

  const saveName = async () => {
    if (name === "") {
      setMessage("Please enter a valid name");
      return;
    }
    try {
      const id = generateUId();
      const uid = `${name}@${id}`;
      await AsyncStorage.setItem("username", name);
      await AsyncStorage.setItem("uid", uid);
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
    }
  };
  const endpointList = (event) => {
    setEndpoints(event);
  };

  // Listens for endpoints discovered/lost
  DeviceEventEmitter.addListener("endpoints", endpointList);

  // Listens for incoming messages
  DeviceEventEmitter.addListener("message", receiveMessage);

  return (
    <View style={styles.container}>
      <Text>Please enter your username</Text>
      {message !== "" && <Text>{message}</Text>}
      <TextInput
        placeholder="Your Name"
        onChangeText={(e) => handleNameChange(e)}
      />
      <Button title="Save" onPress={saveName} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.blue,
    borderRadius: 100,
    flexDirection: "row",
  },
});

export default Name;
