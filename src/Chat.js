import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  NativeModules,
  DeviceEventEmitter,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GiftedChat } from "react-native-gifted-chat";
import {
  getDBConnection,
  createTable,
  getMyChatMessages,
  getOtherChatMessages,
  saveMessage,
  deleteTable,
} from "./dbUtils";
import { COLORS } from "./assets/Colors";
import { RSA } from "react-native-rsa-native";

const { NearbyConnection } = NativeModules;

const Chat = (props) => {
  const [messages, setMessages] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [senderId, setSenderId] = useState();
  const [mounted, setMounted] = useState(false);
  const [keys, setKeys] = useState({});
  const [refresh, setRefresh] = useState();
  const [receiverPK, setReceiverPk] = useState(null); // public key of the receiver
  const dbConnection = useRef(null);
  const { receiverName, receiverId } = props.route.params;
  const { navigation } = props;

  useEffect(() => {
    // Getting the public key of the receiver id
    AsyncStorage.getItem(receiverId)
      .then((key) => {
        setReceiverPk(key);
      })
      .catch((err) => console.error(err));

    const subscribe = navigation.addListener("focus", () => {
      AsyncStorage.getItem("uid")
        .then((id) => {
          setSenderId(id);
          AsyncStorage.getItem(id)
            .then((key) => {
              const myKey = JSON.parse(key);
              setKeys(myKey);
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    });
    return subscribe;
  }, [navigation]);

  const getEndpoints = (event) => {
    setEndpoints(event);
  };

  const addMessageToDisplay = (chat, type) => {
    const id = type === "SEND" ? senderId : receiverId;
    let message = [
      {
        _id: Math.random(1000).toString(),
        text: chat.message,
        createdAt: chat.timestamp,
        user: {
          _id: id,
        },
      },
    ];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, message)
    );
  };

  const loadChat = async (senderId) => {
    try {
      if (dbConnection.current === null) {
        dbConnection.current = await getDBConnection();
      }
      // await deleteTable(dbConnection.current);
      await createTable(dbConnection.current);

      let sentChats = await getMyChatMessages(
        dbConnection.current,
        senderId,
        receiverId
      );
      let receivedChats = await getOtherChatMessages(
        dbConnection.current,
        senderId,
        receiverId
      );

      let chats = [];
      for (let i = 0; i < sentChats[0].rows.length; i++) {
        let chat = sentChats[0].rows.item(i);

        chats.push({
          message: chat.message,
          timestamp: parseInt(chat.timestamp),
          type: "SEND",
        });
      }

      for (let i = 0; i < receivedChats[0].rows.length; i++) {
        let chat = receivedChats[0].rows.item(i);

        chats.push({
          message: chat.message,
          timestamp: parseInt(chat.timestamp),
          type: "RECEIVE",
        });
      }

      chats.sort((a, b) => {
        return a.timestamp - b.timestamp;
      });

      chats.map((chat) => {
        addMessageToDisplay(chat, chat.type);
      });

      setRefresh(Math.random(10000));
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = (text, id = null) => {
    let message = {
      message: text,
      targetId: null,
      senderId: id == null ? senderId : id,
      timestamp: Date.now(),
      type: "payload",
    };

    if (message.message === undefined) {
      return;
    }

    endpoints.map((endpoint) => {
      const res = endpoint.split("_");
      const id = res[0];
      const username = res[1];
      if (username !== senderId) {
        message["targetId"] = receiverId;
        message = JSON.stringify(message);
        RSA.encrypt(message, receiverPK)
          .then((encodedMessage) => {
            NearbyConnection.sendMessage(id, encodedMessage);
          })
          .catch((err) => {
            console.error(err);
            return null;
          });
      }
    });
  };

  const receiveMessage = async (event) => {
    let payload = event["message"];
    RSA.decrypt(payload, keys.private)
      .then(async (decryptedMessage) => {
        const payload = JSON.parse(decryptedMessage);
        const { message, timestamp } = payload;
        await saveMessage(
          dbConnection.current,
          payload.senderId,
          senderId,
          message,
          timestamp
        );
        await loadChat(senderId);
      })
      .catch((err) => {
        // Hop the message
        endpoints.map((endpoint) => {
          const res = endpoint.split("_");
          const id = res[0];
          NearbyConnection.sendMessage(payload, id);
        });
      });
  };

  const handleSend = async (newMessage = []) => {
    const { text } = newMessage[0];

    // Send the message to the nearby devices
    sendMessage(text);

    if (endpoints.length === 0) {
      Alert.alert("no nearby devices at the moment");
      return;
    }

    // Save the message to the database
    const timestamp = Date.now();
    await saveMessage(
      dbConnection.current,
      senderId,
      receiverId,
      text,
      timestamp
    );

    // Display the message
    await loadChat(senderId);
  };

  if (!mounted && senderId !== undefined) {
    setMounted(true);
    loadChat(senderId);
  }

  DeviceEventEmitter.addListener("endpoints", getEndpoints);
  DeviceEventEmitter.addListener("message", receiveMessage);

  if (!mounted) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.username}>{receiverName}</Text>
          </View>
        </View>
        <View style={styles.loader}>
          <ActivityIndicator
            style={styles.loader}
            color={COLORS.blue}
            size="large"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{receiverName}</Text>
        </View>
        <View>
          <Text style={[styles.username, { marginRight: 15 }]}>
            @{receiverId.split("@")[1]}
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: "orange" }}>
        {endpoints.length === 0 && (
          <Text style={{ color: "#fff", textAlign: "center" }}>
            There is no active nearby device at the moment
          </Text>
        )}
      </View>
      <GiftedChat
        isAnimated
        messages={messages}
        onSend={(messages) => {
          handleSend(messages);
        }}
        user={{
          _id: senderId,
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
    backgroundColor: COLORS.blue,
    height: 60,
    flexDirection: "row",
  },
  username: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 15,
    marginTop: 15,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Chat;
