import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
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

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // mantiene sesión activa
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al registrar");
      }

      Alert.alert("Éxito", "Usuario registrado correctamente.");
      navigation.navigate("LoginScreen");
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
          <Text style={styles.title}>Registro</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("LoginScreen")}
          >
            ¿Ya tienes cuenta? Inicia sesión
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
    color: "#000000" // Título en negro
  },
  input: {
    borderWidth: 1,
    borderColor: "#000000", // Bordes negros
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff", // Fondo blanco para los campos de entrada
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
