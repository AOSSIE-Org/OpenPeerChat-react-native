import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetStorage } from "./Utils";
import { COLORS } from "./assets/Colors";

const TIME = 1500;

const Splash = ({ navigation }) => {
  // resetStorage();
  const isUserLogin = async () => {
    try {
      let name = await AsyncStorage.getItem("username");
      if (name !== null) {
        return "Home";
      }
      return "Name";
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(async () => {
    let navigateToScreen = await isUserLogin();
    setTimeout(() => {
      navigation.navigate(navigateToScreen);
    }, TIME);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("./assets/Images/aossieLogo.png")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
});

export default Splash;
