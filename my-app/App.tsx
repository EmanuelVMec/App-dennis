import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Edad from "./Edad";
import InicioApp from "./InicioApp";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Edad" component={Edad} />
        <Stack.Screen name="InicioApp" component={InicioApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Image source={require("./assets/fondo.png")} style={styles.image} />
      <Text style={styles.name}>Anonymous</Text>
      <View style={styles.separator} />

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => navigation.navigate("Edad")}
      >
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.subtitle}>
          Un espacio para expresarte sin revelar tu identidad.
        </Text>
      </View>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  separator: {
    width: "60%",
    height: 1,
    backgroundColor: "#000000",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    position: "absolute",
    bottom: 120,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    bottom: 80,
  },
});
