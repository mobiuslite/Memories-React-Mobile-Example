import React, { useState } from "react";
import { TextInput, View, Text, TouchableOpacity, Alert } from "react-native";
import { firebase } from "@firebase/app";
import "@firebase/auth";
import firebaseConfig from "../firebaseConfig";
import RegisterModal from "./RegisterModal";

let firebaseApp = null;

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [register, setRegister] = useState(false);

  const firebaseLogin = () => {
    let fixedEmail = email.replace(/\s/g, "");

    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }

    firebaseApp
      .auth()
      .signInWithEmailAndPassword(fixedEmail, password)
      .then((userCredential) => {
        // Signed in
        navigation.navigate("ListMemory", { id: userCredential.user.uid });
        // ...
      })
      .catch((error) => {
        Alert.alert("ERROR", error.message);
      });
  };

  return (
    <View
      style={{
        height: "100%",
      }}
    >
      <View>
        <RegisterModal visible={register} onCancel={() => setRegister(false)} />
      </View>
      <Text style={{ fontSize: 50, textAlign: "center", paddingTop: 50 }}>
        Memories
      </Text>
      <Text style={{ fontSize: 38, textAlign: "center" }}>Login</Text>

      <View
        style={{
          marginLeft: "15%",
          marginTop: 75,
        }}
      >
        <Text>Email</Text>
        <TextInput
          placeholder="Email"
          style={textInputStyle}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View
        style={{
          marginLeft: "15%",
          marginTop: 25,
          marginBottom: "30%",
        }}
      >
        <Text>Password</Text>
        <TextInput
          placeholder="Password"
          style={textInputStyle}
          value={password}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "lightblue",
          padding: 10,
          width: "80%",
          marginLeft: "10%",
          borderRadius: 20,
        }}
        onPress={firebaseLogin}
      >
        <Text style={{ fontSize: 24, textAlign: "center" }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "lightgreen",
          padding: 6,
          width: "60%",
          marginLeft: "20%",
          borderRadius: 20,
          marginTop: 30,
        }}
        onPress={() => setRegister(true)}
      >
        <Text style={{ fontSize: 24, textAlign: "center" }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const textInputStyle = {
  borderColor: "black",
  borderWidth: 0.5,
  borderRadius: 5,
  padding: 7,
  width: "80%",
};
