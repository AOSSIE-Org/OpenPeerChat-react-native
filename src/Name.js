import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MatrixServerContext } from './context/MatrixServer';

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
  const [userInfo, setUserInfo] = useState({
    name: '',
    password: '',
    username: '',
    url: '',
  });
  const [message, setMessage] = useState();
  const { server, setServerUrl } = useContext(MatrixServerContext);
  const handleUrlChange = (e) => {
    setUserInfo({
      ...userInfo,
      url: e
    });
  };
  const handleNameChange = (e) => {
    setUserInfo({
      ...userInfo,
      name: e
    });
  };
  const handleUsernameChange = (e) => {
    setUserInfo({
      ...userInfo,
      username: e,
    });
  };
  const handlePasswordChange = (e) => {
    setUserInfo({
      ...userInfo,
      password: e,
    });
  };
  const saveName = async () => {
    if (userInfo.name === "" || userInfo.username === "" || userInfo.password === "" || userInfo.url === "") {
      setMessage("Please enter a valid information");
      return;
    }
    try {
      const id = generateUId();
      const uid = `${userInfo.name}@${id}`;
      setServerUrl(userInfo.url);
      try {
        await server.login(userInfo.username, userInfo.password)
      } catch (e) {
        console.log(e);
        if(e.errcode === "M_FORBIDDEN") {
          const res = await server.registration(userInfo.username, userInfo.password);
          console.log(res);
        }
      }
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
      await AsyncStorage.setItem("uid", uid);
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
      setMessage("Please enter valid details")
    }
  };
  return (
    <View style={styles.container}>
      <Text>Please enter your username and password (SignIn/SignUp)</Text>
      {message !== "" && <Text>{message}</Text>}
      <TextInput
        placeholder="Server URL"
        onChangeText={(e) => handleUrlChange(e)}
      />
      <TextInput
        placeholder="Your Name"
        onChangeText={(e) => handleNameChange(e)}
      />
      <TextInput
        placeholder="Your Username"
        onChangeText={(e) => handleUsernameChange(e)}
      />
      <TextInput
        placeholder="Your Password"
        onChangeText={(e) => handlePasswordChange(e)}
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
});

export default Name;
