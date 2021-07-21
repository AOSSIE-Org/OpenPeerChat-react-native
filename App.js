import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import Splash from "./src/Splash";
import Name from "./src/Name";
import Home from "./src/Home";
import Chat from "./src/Chat";
import AddChat from "./src/AddChat";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Name"
        component={Name}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddChat"
        component={AddChat}
        options={{
          title: "Add Contact",
          headerStyle: {
            backgroundColor: "#B83227",
            height: 60,
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerLeft: () => null,
          title: "Aossie Chat",
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <Icon
                name="search"
                size={25}
                style={{ marginRight: 20, color: "#fff" }}
              />
              <Icon
                name="md-settings-sharp"
                size={25}
                style={{ marginRight: 15, color: "#fff" }}
              />
            </View>
          ),
          headerStyle: {
            backgroundColor: "#B83227",
            height: 80,
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
