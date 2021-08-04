import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { MatrixServerContext } from "./context/MatrixServer";
import { UserInfoContext } from "./context/UserInfo";

const AddChat = ({navigation}) => {
  const [uid, setUid] = useState();
  const [name, setName] = useState();
  const { server } = useContext(MatrixServerContext);
  const { addContact } = useContext(UserInfoContext);

  const saveContact = async () => {
    const roomInfo = await server.createRoom({
      invite: [ uid ],
      name: 'private-chat-room'
    })
    addContact({
      id: uid,
      name
    });
    navigation.navigate("Chat", {
      username: name,
      uid: uid,
    });
  };
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(e) => setUid(e)}
        placeholder="Please enter UID of the contact"
      />
      <TextInput
        onChangeText={(e) => setName(e)}
        placeholder="Please enter Name of the contact"
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
