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
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { BASE_URL } from "./config";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [cedula, setCedula] = useState("");

  const navigation = useNavigation();

  const calculateAgeFromParts = (year: string, month: string, day: string): number => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const d = parseInt(day, 10);

    const birthDate = new Date(y, m, d);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const mDiff = today.getMonth() - birthDate.getMonth();

    if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const validarCedula = (cedula: string): boolean => {
    if (!/^\d{10}$/.test(cedula)) return false;

    const region = parseInt(cedula.substring(0, 2));
    if (region < 1 || region > 24) return false;

    const digits = cedula.split("").map(Number);
    const checkDigit = digits.pop(); // último dígito

    let total = 0;
    for (let i = 0; i < digits.length; i++) {
      let value = digits[i];
      if (i % 2 === 0) {
        value *= 2;
        if (value > 9) value -= 9;
      }
      total += value;
    }

    const expected = (10 - (total % 10)) % 10;
    return expected === checkDigit;
  };

  const handleRegister = async () => {
    if (!username || !password || !birthYear || !birthMonth || !birthDay || !cedula) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    if (!validarCedula(cedula)) {
      Alert.alert("Cédula inválida", "Ingresa una cédula ecuatoriana válida.");
      return;
    }

    const year = parseInt(birthYear, 10);
    const month = parseInt(birthMonth, 10);
    const day = parseInt(birthDay, 10);

    if (
      isNaN(year) || isNaN(month) || isNaN(day) ||
      year < 1900 || year > new Date().getFullYear() ||
      month < 1 || month > 12 ||
      day < 1 || day > 31
    ) {
      Alert.alert("Error", "Fecha de nacimiento inválida.");
      return;
    }

    const age = calculateAgeFromParts(birthYear, birthMonth, birthDay);
    if (age < 18) {
      Alert.alert("Edad no permitida", "Debes tener al menos 18 años para registrarte.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }), // no se envía la cédula ni la fecha
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

          <TextInput
            style={styles.input}
            placeholder="Cédula ecuatoriana"
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
            maxLength={10}
            placeholderTextColor="#888"
          />

          <View style={styles.birthDateContainer}>
            <TextInput
              style={[styles.input, styles.birthInput]}
              placeholder="Año"
              value={birthYear}
              onChangeText={setBirthYear}
              keyboardType="numeric"
              maxLength={4}
              placeholderTextColor="#888"
            />
            <TextInput
              style={[styles.input, styles.birthInput]}
              placeholder="Mes"
              value={birthMonth}
              onChangeText={setBirthMonth}
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor="#888"
            />
            <TextInput
              style={[styles.input, styles.birthInput]}
              placeholder="Día"
              value={birthDay}
              onChangeText={setBirthDay}
              keyboardType="numeric"
              maxLength={2}
              placeholderTextColor="#888"
            />
          </View>

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
  container: { flex: 1, backgroundColor: "#dd86b6ff" },
  inner: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 32,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    elevation: 2,
  },
  birthDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  birthInput: {
    flex: 1,
    marginRight: 10,
  },
  button: {
    backgroundColor: "#000000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#ffffff",
    textAlign: "center",
    fontSize: 16,
  },
});
