import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";

export default function Edad({ navigation }: any) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  // Función para calcular edad a partir de fecha
  const calcularEdad = (fechaNacimiento: Date) => {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Validar que la fecha sea válida
  const esFechaValida = (d: number, m: number, y: number) => {
    const fecha = new Date(y, m - 1, d);
    return (
      fecha.getFullYear() === y &&
      fecha.getMonth() === m - 1 &&
      fecha.getDate() === d
    );
  };

  const handleContinuar = () => {
    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);

    if (!d || !m || !y) {
      setError("Por favor completa todos los campos con números.");
      return;
    }

    if (!esFechaValida(d, m, y)) {
      setError("Fecha inválida, revisa los datos.");
      return;
    }

    const fechaNacimiento = new Date(y, m - 1, d);
    const edad = calcularEdad(fechaNacimiento);

    if (edad < 18) {
      setError("Debes ser mayor de 18 años para usar la app.");
    } else if (edad > 80) {
      setError("No puedes tener más de 80 años para usar la app.");
    } else {
      setError("");
      navigation.navigate("InicioApp");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa tu fecha de nacimiento</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Día"
          keyboardType="number-pad"
          maxLength={2}
          value={day}
          onChangeText={setDay}
        />
        <TextInput
          style={styles.input}
          placeholder="Mes"
          keyboardType="number-pad"
          maxLength={2}
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={styles.input}
          placeholder="Año"
          keyboardType="number-pad"
          maxLength={4}
          value={year}
          onChangeText={setYear}
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Continuar" onPress={handleContinuar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF0000",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    width: "30%",
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    textAlign: "center",
  },
  error: {
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
});
