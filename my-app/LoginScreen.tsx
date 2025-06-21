import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./config";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error desconocido");
      }

      navigation.navigate("InicioApp");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FF0000" }, // Fondo rojo
  inner: { flex: 1, justifyContent: "center", padding: 20 },
  title: { 
    fontSize: 32, 
    marginBottom: 40, 
    textAlign: "center", 
    fontWeight: "bold", 
    color: "#000000" // Texto negro para el título
  },
  input: {
    borderWidth: 1,
    borderColor: "#000000", // Borde negro
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff", // Fondo blanco para inputs
    fontSize: 16,
    elevation: 2, // Sombra suave para los campos de texto
  },
  button: {
    backgroundColor: "#000000", // Botón negro
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4, // Sombra suave para el botón
  },
  buttonText: {
    color: "#fff", // Texto blanco en el botón
    fontSize: 18,
    fontWeight: "bold",
  },
  link: { 
    marginTop: 20, 
    color: "#ffffff", // Texto blanco para el enlace
    textAlign: "center", 
    fontSize: 16 
  },
});
