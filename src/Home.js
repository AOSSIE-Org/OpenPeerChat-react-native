import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeModules,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { COLORS } from "./assets/Colors";

const { NearbyConnection } = NativeModules;

const Home = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      title: "Aossie Chat",
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <Icon
            name="md-settings-sharp"
            size={25}
            style={{ marginRight: 20, color: "#fff" }}
            onPress={() => navigation.navigate("Settings")}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: COLORS.blue,
        height: 70,
      },
      headerTintColor: "#fff",
    });
  });

  const [users, setUsers] = useState({});

  useEffect(() => {
    AsyncStorage.getItem("uid")
      .then((id) => {
        setTimeout(() => {
          console.info("Discovery started");
          NearbyConnection.startDiscovery(id);
        }, 7500);
        console.info("Advertising started");
        NearbyConnection.startAdvertising(id);
      })
      .catch((err) => console.error(err));
    const subscribe = navigation.addListener("focus", async () => {
      // await AsyncStorage.removeItem("contacts");
      let contacts = await AsyncStorage.getItem("contacts");
      if (contacts !== null) {
        contacts = JSON.parse(contacts);
        let users = {};
        Object.keys(contacts).map((item) => {
          users[item] = contacts[item];
        });
        setUsers(users);
      }
    });
    return subscribe;
  }, []);

  const navigateToChat = (username, uid) => {
    navigation.navigate("Chat", {
      receiverName: username,
      receiverId: uid,
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.floatButton}
        onPress={() => {
          navigation.navigate("AddChat");
        }}
      >
        <Icon name="ios-person-add-sharp" size={23} color="#fff" />
      </TouchableOpacity>
      <View style={styles.chatContainer}>
        {Object.keys(users).map((user, key) => {
          const name = users[user];
          const id = user;
          return (
            <ScrollView key={key}>
              <TouchableOpacity
                onPress={() => navigateToChat(name, id)}
                style={{ flexDirection: "row", marginBottom: 10 }}
              >
                <View style={styles.iconContainer}>
                  <Text style={styles.contactIcon}>{name[0]}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{name}</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatContainer: {
    marginLeft: 20,
    marginTop: 10,
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
  contactIcon: {
    fontSize: 28,
    color: "#fff",
  },
  infoContainer: {
    flexDirection: "column",
  },
  infoContainer: {
    marginTop: 10,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
  },
  floatButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.blue,
    borderRadius: 100,
    elevation: 3,
  },
});

export default Home;
