import React from "react";

import Login from "./components/Login";
import ListMemory from "./components/ListMemory";
import AddMemory from "./components/AddMemory";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// for navigation you need:
// npm install --save react-navigation
// expo install react-native-gesture-handler react-native-reanimated
// npm install --save react-navigation-header-buttons
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ListMemory"
          component={ListMemory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddMemory"
          component={AddMemory}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
