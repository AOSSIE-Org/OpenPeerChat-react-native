import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { generateUId } from "./Utils";
import { COLORS } from "./assets/Colors";
import { RSA } from "react-native-rsa-native";

const getApiBaseUrl = () => {
  if (__DEV__) {
    return "http://10.0.2.2:3000";
  }
  return "http://YOUR_PRODUCTION_IP:3000";
};

const Name = ({ navigation }) => {
  const [name, setName] = useState();
  const [message, setMessage] = useState();
  const handleNameChange = (e) => {
    setName(e);
  };
  const saveName = async () => {
    if (name === "") {
      setMessage("Please enter a valid name");
      return;
    }
    try {
      const id = generateUId();
      const uid = `${name}@${id}`;
      const apiBaseUrl = getApiBaseUrl();

      try {
        const response = await fetch(`${apiBaseUrl}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: name, uid: uid }),
        });

        if (response.status === 429) {
          Alert.alert(
            "Rate Limit Reached",
            "Too many registration attempts. Please wait before trying again."
          );
          return;
        }

        if (!response.ok) {
          Alert.alert("Error", "Registration failed. Please try again.");
          return;
        }

        await AsyncStorage.setItem("username", name);
        await AsyncStorage.setItem("uid", uid);
      } catch (apiError) {
        console.error("Registration API error:", apiError);
        Alert.alert(
          "Offline Mode",
          "Unable to connect to server. Continuing in offline mode."
        );
        await AsyncStorage.setItem("username", name);
        await AsyncStorage.setItem("uid", uid);
      }

      RSA.generateKeys(1024)
        .then((keys) => {
          keys = JSON.stringify(keys);
          AsyncStorage.setItem(uid, keys)
            .then(() => {
              navigation.navigate("Home");
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.text}>Please enter your username</Text>
        {message !== "" && <Text>{message}</Text>}
        <TextInput
          placeholder="Username"
          onChangeText={(e) => handleNameChange(e)}
          style={styles.input}
        />
        <View style={styles.btn}>
          <Button title="Save" onPress={saveName} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {
    borderWidth: 0.5,
    borderColor: COLORS.blue,
    borderRadius: 10,
    color: COLORS.white,
    marginTop: 15,
    marginLeft: "8%",
    marginRight: "8%",
    flexDirection: "row",
    paddingLeft: 20,
  },
  btn: {
    padding: 25,
  },
  text: {
    alignSelf: "center",
    marginBottom: "5%",
    fontSize: 15,
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    elevation: 3,
    borderRadius: 5,
    paddingTop: 40,
  },
});

export default Name;
