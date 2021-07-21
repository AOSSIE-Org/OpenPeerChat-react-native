import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TIME = 1500;

const Splash = ({ navigation }) => {
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
      <Text>Splash Screen</Text>
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

export default Splash;
