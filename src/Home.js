import React, { useEffect, useState, useLayoutEffect, useCallback } from "react";
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
  }, [navigation]);

  const [users, setUsers] = useState({});

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const id = await AsyncStorage.getItem("uid");
        setTimeout(() => {
          console.info("Discovery started");
          NearbyConnection.startDiscovery(id);
        }, 7500);
        console.info("Advertising started");
        NearbyConnection.startAdvertising(id);
      } catch (err) {
        console.error(err);
      }
    };

    initializeConnection();

    const subscribe = navigation.addListener("focus", async () => {
      try {
        let contacts = await AsyncStorage.getItem("contacts");
        if (contacts !== null) {
          contacts = JSON.parse(contacts);
          setUsers(contacts);
        }
      } catch (err) {
        console.error(err);
      }
    });
    return subscribe;
  }, [navigation]);

  const navigateToChat = useCallback((username, uid) => {
    navigation.navigate("Chat", {
      receiverName: username,
      receiverId: uid,
    });
  }, [navigation]);

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
      <ScrollView style={styles.chatContainer}>
        {Object.keys(users).map((userId) => {
          const name = users[userId];
          return (
            <TouchableOpacity
              key={userId}
              onPress={() => navigateToChat(name, userId)}
              style={{ flexDirection: "row", marginBottom: 15 }}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.contactIcon}>{name?.[0] || "?"}</Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginRight: 20,
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
    zIndex: 10,
  },
});

export default Home;
