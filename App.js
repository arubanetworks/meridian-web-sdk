import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import Hello from "./components/Hello";

export default class App extends React.Component {
  render() {
    return (
      <View id="sobeawrapper" style={styles.wrapper}>
        <View id="superbro" style={styles.container}>
          <Hello />
          <Text>Duck Eggs for Everyone!</Text>
          <Text>Meridian Web Components</Text>
          <Text>Platform: {`${Platform.OS}, right?`}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  container: {
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
