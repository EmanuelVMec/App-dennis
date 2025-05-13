import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";

export default function Edad({ navigation }: any) {
  const [age, setAge] = useState("");

  const handleCheckAge = () => {
    const ageNumber = parseInt(age);

    if (isNaN(ageNumber)) {
      Alert.alert("Error", "Por favor ingresa un número válido.");
      return;
    }

    if (ageNumber >= 18) {
      navigation.navigate("InicioApp");
    } else {
      Alert.alert("Acceso Denegado", "Debes ser mayor de 18 años para ingresar.");
    }

    setAge("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingrese su edad:</Text>

      <TextInput 
        style={styles.input}
        keyboardType="numeric"
        placeholder="Edad"
        placeholderTextColor="#888"
        value={age}
        onChangeText={setAge}
      />

      <TouchableOpacity style={styles.button} onPress={handleCheckAge}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: "#888", marginTop: 20 }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Regresar</Text>
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
    color: "#000000",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
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
