import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Modal, Text, Image } from "react-native";

import * as FileSystem from "expo-file-system";

let defaultImage = Image.resolveAssetSource(require("../assets/default.jpg"));

const MemoryModal = (props) => {
  const [image, setImage] = useState();

  useEffect(() => {
    async function checkFile() {
      if (props.data.data.title != "") {
        let fileInfo = await FileSystem.getInfoAsync(
          props.data.data.imageUri
        ).catch((err) => {
          setImage(`data:image/png;base64,${props.data.data.basedImage}`);
          return;
        });
        console.log(fileInfo);
        if (fileInfo != undefined && fileInfo.exists) {
          setImage(props.data.data.imageUri);
        } else {
          setImage(`data:image/png;base64,${props.data.data.basedImage}`);
        }
      } else {
        setImage(defaultImage.uri);
      }
    }
    checkFile();
  }, [props.data]);

  return (
    <Modal visible={props.visible} animationType="fade" transparent={true}>
      <View style={styles.full}>
        <Text style={{ textAlign: "center", fontSize: 32, paddingBottom: 20 }}>
          {props.data.data.title}
        </Text>
        <View style={styles.container}>
          <Image
            source={{
              uri: image,
            }}
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
          <Text style={{ fontSize: 24, padding: 8 }}>
            {props.data.data.description}
          </Text>
          <Text>{props.data.data.location}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button
              title="Close"
              color="lightblue"
              onPress={props.onCancel}
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
    marginTop: 50,
    flexDirection: "row",
    //justifyContent: "space-between",
    alignSelf: "center",
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

export default MemoryModal;
