import React, { useState, useEffect, useLayoutEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-community/clipboard";
import { COLORS } from "./assets/Colors";

const Settings = ({ navigation }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: COLORS.blue,
        height: 70,
      },
      headerTintColor: "#fff",
    });
  });

  useEffect(async () => {
    let id = await AsyncStorage.getItem("uid");
    let keys = await AsyncStorage.getItem(id);
    keys = JSON.parse(keys);
    setDeviceId(id);
    setPublicKey(keys.public);
    setPrivateKey(keys.private);
    return;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text>UID</Text>
          </View>
          <View>
            <Text>{deviceId}</Text>
          </View>
        </View>
        <Text style={{ alignSelf: "center", marginTop: 10, marginBottom: 5 }}>Public Key</Text>
        <Text selectable style={{ fontSize: 10 }}>
          {publicKey}
        </Text>

        <TouchableOpacity onPress={() => Clipboard.setString(publicKey)}>
          <View>
            <Text
              style={{
                color: COLORS.red,
                fontSize: 14,
                textAlign: "center",
                textAlign: 'center'
              }}
            >
              Copy
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    elevation: 3,
    borderRadius: 5,
  },
});

export default Settings;
