import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddChat = () => {
  const [uid, setUid] = useState();

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
  };
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(e) => setUid(e)}
        placeholder="Please enter UID of the contact"
      />
      <Button title="Save" onPress={saveContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AddChat;
