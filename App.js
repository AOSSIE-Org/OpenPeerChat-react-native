import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Splash from "./src/Splash";
import Name from "./src/Name";
import Home from "./src/Home";
import Chat from "./src/Chat";
import AddChat from "./src/AddChat";
import Settings from "./src/Settings";
import { COLORS } from "./src/assets/Colors";

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
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen
        name="AddChat"
        component={AddChat}
        options={{
          title: "Add Contact",
          headerStyle: {
            backgroundColor: COLORS.blue,
            height: 60,
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen name="Home" component={Home} />
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
