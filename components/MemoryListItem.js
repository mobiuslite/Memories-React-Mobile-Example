import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const MemoryListItem = (props) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={props.onPress.bind(this)}>
      <View style={styles.listItem}>
        <Text style={{ color: "white" }}>{props.data.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: 15,
    marginVertical: 15,
    backgroundColor: "purple",
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
});

export default MemoryListItem;
