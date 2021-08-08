import React, { useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MatrixServerContext } from './context/MatrixServer';
import { UserInfoContext } from "./context/UserInfo";

const { NearbyConnection } = NativeModules;

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [message, setMessage] = useState("");
  const targetUsername = props.route.params.username; // username of the target device
  const targetUId = props.route.params.uid; // uid of the target device
  const [deviceId, setDeviceId] = useState();
  const { server } = useContext(MatrixServerContext)
  const { username } = useContext(UserInfoContext)
  const myUId = server.getUserId();
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
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const addMessageToDisplay = (id, text) => {
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

    setMessages((previousMessages) => GiftedChat.append(previousMessages, message))
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
        _id: myUId,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: targetUId,
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
  
  useEffect(() => {
    // Listens for endpoints discovered/lost
    DeviceEventEmitter.addListener("endpoints", endpointList);
  
    // Listens for incoming messages
    DeviceEventEmitter.addListener("message", receiveMessage);
    const receiveMatrixEvents = (event) => {
      if(event.sender.userId === targetUId && event.event.type === "m.room.message") {
        addMessageToDisplay(targetUId, event.event.content.body);
      }
    };
    server.on("Room.timeline", receiveMatrixEvents)
    
    return () => {
        // DeviceEventEmitter.removeListener("endpoints", endpointList);
        // DeviceEventEmitter.removeListener("message", receiveMessage);
        server.off("Room.timeline", receiveMatrixEvents);
      }
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.username}>{targetUsername}</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(messages) => {
          server.sendMessage(targetUId, messages[0].text);
          addMessageToDisplay(myUId, messages[0].text);
        }}
        user={{
          _id: myUId,
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
