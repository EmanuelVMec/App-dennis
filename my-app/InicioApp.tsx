import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function InicioApp({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido a confesiones anónimas!</Text>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF0000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
