import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { MatrixServerContext } from "./context/MatrixServer";
import { UserInfoContext } from "./context/UserInfo";

const Home = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const { server } = useContext(MatrixServerContext);
  const { contacts } = useContext(UserInfoContext);

  const navigateToChat = (username, uid) => {
    navigation.navigate("Chat", {
      username: username,
      uid: uid,
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
        {contacts.map((user, key) => {
          const name = user.name;
          const id = user.id;
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
    backgroundColor: "#B83227",
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
    backgroundColor: "#B83227",
    borderRadius: 100,
    elevation: 3,
  },
});

export default Home;
