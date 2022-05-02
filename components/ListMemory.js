import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

import * as WebBrowser from "expo-web-browser";

import { firebase } from "@firebase/app";
import "@firebase/firestore";
import firebaseConfig from "../firebaseConfig";

import MemoryModal from "./MemoryModal";
import { useIsFocused } from "@react-navigation/core";

let firebaseApp = null;

const ListMemory = ({ route, navigation }) => {
  const [userId, setUserId] = useState("");
  const [memoryList, setMemoryList] = useState([]);
  const [viewMemory, setViewMemory] = useState(false);
  const isFocused = useIsFocused();

  const [memoryToShow, setMemoryToShow] = useState({ data: { title: "" } });
  useEffect(() => {
    if (route != null) {
      setUserId(route.params.id);
    }
    if (!firebase.apps.length) {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseApp = firebase.app();
      console.log("App inited");
    } else {
      firebaseApp = firebase.app();
    }

    console.log(userId);
    databaseGet();
  }, [firebaseApp, isFocused]);

  const databaseGet = async () => {
    let addArray = [];

    await new Promise((resolve, reject) => {
      console.log("STARTED DATABASE GET");

      //Connect to the database
      let db = firebaseApp.firestore();
      resolve(db);
    }).then(async (db) => {
      await new Promise((resolve, reject) => {
        console.log("started promise");

        //Return each memory that has the same id as the user
        db.collection("memory")
          .where("userId", "==", userId)
          .get()
          .then(async (query) => {
            await query.forEach(async (doc) => {
              //DATA BASE STUFF
              let data = doc.data();
              console.log(doc.id + "  =>  " + data.title);

              //Pushes the memory to the list of memories.
              addArray.push({ id: doc.id, data: data });
            });
          })
          .then(() => {
            console.log("ADD Array __________________________________");

            //Sets the memory list to the array at the start of the function
            setMemoryList(addArray);
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
        resolve();
      });
    });
  };

  return (
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        textAlign: "center",
        marginTop: 45,
      }}
    >
      <View>
        <MemoryModal
          visible={viewMemory}
          onCancel={() => setViewMemory(false)}
          data={memoryToShow}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%",
          marginLeft: "10%",
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
          onPress={() => navigation.navigate("AddMemory", { id: userId })}
        >
          <Text style={{ fontSize: 30, textAlign: "center" }}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 30 }}>
        <FlatList
          data={memoryList}
          renderItem={(itemData) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setViewMemory(true);
                setMemoryToShow(itemData.item);
              }}
            >
              <View style={styles.listItem}>
                <Text style={{ color: "white" }}>
                  {itemData.item.data.title}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    marginVertical: 15,
    backgroundColor: "gray",
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    width: "70%",
    marginLeft: "15%",
  },
});

export default ListMemory;
