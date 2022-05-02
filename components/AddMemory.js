import React, { useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import { firebase } from "@firebase/app";
import "@firebase/firestore";
import firebaseConfig from "../firebaseConfig";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";

let firebaseApp = null;
let defaultImage = Image.resolveAssetSource(require("../assets/default.jpg"));

export default function AddMemory({ route, navigation }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUri, setImageUri] = useState(defaultImage.uri);
  const [userId, setUserId] = useState();
  const [basedImage, setBasedImage] = useState();

  useEffect(() => {
    if (route != null) {
      setUserId(route.params.id);
    }
  }, [route]);

  //Gets image from camera roll
  const cameraRoll = async () => {
    const image = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 2],
      quality: 0.2,
      base64: true,
    });

    if (!image.cancelled) {
      setImageUri(image.uri);
      setBasedImage(image.base64);
    }
  };

  const saveToDB = async () => {
    if (title != "") {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission error",
          "Permission to access location was denied"
        );
        return;
      }

      let location = await Location.getLastKnownPositionAsync({});
      console.log(location);
      if (location == null) {
        location = "Unknown location";
      } else {
        let reversedGeocode = await Location.reverseGeocodeAsync(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          {}
        );
        location = `${reversedGeocode[0].city}, ${reversedGeocode[0].region}, ${reversedGeocode[0].country}: ${reversedGeocode[0].street}`;
      }

      let fileName = imageUri.split("/").pop();
      let savedUri = FileSystem.documentDirectory + fileName;

      if (imageUri != defaultImage.uri) {
        await FileSystem.moveAsync({
          from: imageUri,
          to: savedUri,
        });
        setImageUri(savedUri);
      } else {
        savedUri = "";
      }

      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
      } else {
        firebaseApp = firebase.app();
      }
      let db = firebaseApp.firestore();

      db.collection("memory")
        .add({
          title: title,
          description: desc,
          imageUri: savedUri,
          location: location,
          userId: userId,
          basedImage: basedImage,
        })
        .then((doc) => {
          console.log("Document written with ID: ", doc.id);
          Alert.alert("Success!", "Memory added to database!");
        })
        .catch((error) => {
          console.log("Error adding doc: ", error);
          Alert.alert("Error!", "Error adding to collection");
        });

      navigation.navigate("ListMemory", { id: userId });
    } else {
      Alert.alert("Error!", "Please enter a title name");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 50 }}>Add Memory</Text>

      <TouchableOpacity onPress={cameraRoll}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 250,
            height: 150,
            borderRadius: 50,
            borderWidth: 0.5,
            borderColor: "gray",
            marginTop: "3%",
            marginBottom: "3%",
          }}
        />
      </TouchableOpacity>

      <View style={{ width: "90%", marginLeft: "17.5%" }}>
        <View style={{ paddingBottom: "5%" }}>
          <Text>Title</Text>
          <TextInput
            placeholder="Title"
            style={textInputStyle}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={{ marginBottom: "45%" }}>
          <Text>Description</Text>
          <TextInput
            placeholder="Description"
            style={descInputStyle}
            value={desc}
            onChangeText={(text) => setDesc(text)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "lightblue",
          padding: 10,
          width: "80%",
          borderRadius: 20,
        }}
        onPress={saveToDB}
      >
        <Text style={{ fontSize: 24, textAlign: "center" }}>Save</Text>
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

const descInputStyle = {
  borderColor: "black",
  borderWidth: 0.5,
  borderRadius: 5,
  padding: 7,
  width: "80%",
  paddingBottom: 45,
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    alignItems: "center",
  },
});
