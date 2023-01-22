import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "./assets/Colors";

const AddChat = ({navigation}) => {
  const [uid, setUid] = useState();
  const [publicKey, setPublicKey] = useState();

  const saveContact = async () => {
    let previousContacts = await AsyncStorage.getItem("contacts");
    if (previousContacts === null) {
      previousContacts = "{}";
    }
    let updatedContacts = JSON.parse(previousContacts);
    let username = uid.split("@")[0];
    updatedContacts[uid] = username;
    updatedContacts = JSON.stringify(updatedContacts);
    await AsyncStorage.setItem("contacts", updatedContacts);

    // Save the public key of the target user
    await AsyncStorage.setItem(uid, publicKey);
    navigation.navigate('Home')
  };
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.text}>Please enter user details</Text>
        <TextInput
          placeholder="UID"
          placeholderTextColor={COLORS.light_blue}
          onChangeText={(e) => setUid(e)}
          style={styles.input}
          required
        />
        <TextInput
          placeholder="Public Key"
          placeholderTextColor={COLORS.light_blue}
          onChangeText={(e) => setPublicKey(e)}
          style={styles.input}
          required
        />
        <View style={styles.btn}>
          <Button title="Save" onPress={saveContact} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderRadius: 10,
  },
  card: {
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    elevation: 3,
    borderRadius: 5,
    paddingTop: 40,
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
});

export default AddChat;
