import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  Alert,
  Text,
} from "react-native";
import { firebase } from "@firebase/app";
import "@firebase/auth";
import firebaseConfig from "../firebaseConfig";

let firebaseApp = null;

const RegisterModal = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const register = () => {
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
    } else {
      firebaseApp = firebase.app();
    }

    firebaseApp
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User registered
        Alert.alert("User registered!", `User ${email} registered!`);
        props.onCancel();
        // ...
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("ERROR", error.message);
        // ..
      });
  };

  return (
    <Modal visible={props.visible} animationType="fade" transparent={true}>
      <View style={styles.full}>
        <Text style={{ textAlign: "center", fontSize: 40, paddingBottom: 20 }}>
          Register User
        </Text>
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            autoCapitalize="none"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="CANCEL"
              color="red"
              onPress={props.onCancel}
              style={{ borderRadius: 10 }}
            ></Button>
          </View>
          <View style={styles.button}>
            <Button
              title="ADD"
              color="lightgreen"
              onPress={register}
              style={{ borderRadius: 10 }}
            ></Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1, // if its the only item, it takes all the available space in the parent element
    flexDirection: "column", // which is default
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    borderColor: "black",
    borderWidth: 0.5,
    paddingLeft: 10,
    paddingTop: "5%",
    marginBottom: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    //justifyContent: "space-between",
    alignSelf: "center",
    width: "70%",
    paddingRight: "10%",
  },
  button: {
    width: "45%",
    marginHorizontal: 20,
    borderColor: "black",
    borderWidth: 0.5,
  },
  full: {
    paddingTop: 40,
    paddingHorizontal: 10,
    margin: 30,
    paddingBottom: 40,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
});

export default RegisterModal;
