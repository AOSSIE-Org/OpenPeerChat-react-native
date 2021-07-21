import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { NearbyConnection } = NativeModules;

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [message, setMessage] = useState("");
  const { username, uid } = props.route.params; // username and uid of the target device
  const [deviceId, setDeviceId] = useState();

  const endpointList = (event) => {
    setEndpoints(event);
  };

  const sendMessage = () => {
    endpoints.map((endpoint) => {
      let id = endpoint.split("_")[0];
      let endpointName = endpoint.split("_")[1];
      if (endpointName !== senderName) {
        let message = msg;
        message = msg + "%" + uid + "%" + deviceId;
        addMessageToDisplay(1, message);
        NearbyConnection.sendMessage(id, message);
      }
    });
  };

  const onSend = useCallback((messages = []) => {
    console.log(messages);
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const addMessageToDisplay = (id, messages) => {
    const text = messages[0].text;
    const message = [
      {
        _id: Math.random(1000),
        createdAt: new Date(),
        text: text,
        user: {
          _id: id,
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ];

    setMessages((previousMessages) => {
      GiftedChat.append(previousMessages, message)
    })
  };

  const receiveMessage = (event) => {
    let data = event["message"];
    data = data.split("%");
    let message = data[0];
    let targetName = data[1]; // Device ID intended to receive message
    let senderName = data[2]; // Name of the sender who sent the message
    if (uid === targetName) {
      addMessageToDisplay(2, message);
      alert(`Message: ${message}`);
    } else {
      sendMessage(senderName);
    }
  };

  useEffect(async () => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: "https://placeimg.com/140/140/any",
        },
      },
    ]);
    const device = await AsyncStorage.getItem("uid");
    setDeviceId(device);
    // start discovering to nearby devices
    NearbyConnection.startDiscovery(device);

    // Start Advertising to nearby devices
    NearbyConnection.startAdvertising(device);
  }, []);

  // useEffect(() => {
  // setMessages([
  //   {
  //     _id: 1,
  //     text: "Hello developer",
  //     createdAt: new Date(),
  //     user: {
  //       _id: 2,
  //       name: "React Native",
  //       avatar: "https://placeimg.com/140/140/any",
  //     },
  //   },
  // ]);
  // }, []);

  // Listens for endpoints discovered/lost
  DeviceEventEmitter.addListener("endpoints", endpointList);

  // Listens for incoming messages
  DeviceEventEmitter.addListener("message", receiveMessage);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => addMessageToDisplay(1, messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    backgroundColor: "#B83227",
    height: 60,
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 15,
  },
});

export default Chat;
