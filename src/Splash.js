import React, { useEffect, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MatrixServerContext } from "./context/MatrixServer";
import { UserInfoContext } from "./context/UserInfo";

const TIME = 1500;

const Splash = ({ navigation }) => {
  const { setServerUrl, updateContacts } = useContext(MatrixServerContext);
  const { otherSavedInfo } = useContext(UserInfoContext)

  const isUserLogin = async () => {
    try {

      if (!otherSavedInfo) {
        return "Name";
      }
      try {
        const server = setServerUrl(otherSavedInfo.url);
        await server.login(otherSavedInfo.username, otherSavedInfo.password);
        const syncFunc = (state) => {
          if(server.clientSyncedOnce){
            updateContacts(server)
            server.off('sync', syncFunc);
          }
        }
        server.on('sync', syncFunc);
      } catch (e) {
        console.log(e.errcode);
        return "Name";
      }
      return "Home";
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(async () => {
    let navigateToScreen = await isUserLogin();
    
    navigation.navigate(navigateToScreen);
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
