import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from "react-native";
import Edad from "./Edad";
import InicioApp from "./InicioApp";
import LoginScreen from "./LoginScreen";        // 🔹 Agregado
import RegisterScreen from "./RegisterScreen";  // 🔹 Agregado

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="Edad" component={Edad} />
        <Stack.Screen name="InicioApp" component={InicioApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function HomeScreen({ navigation }: any) {
  const [showModal, setShowModal] = React.useState(false);

  const handleIniciar = () => {
    setShowModal(true);
  };

  const handleAceptar = () => {
    setShowModal(false);
    navigation.navigate("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/fondo.png")} style={styles.image} />
      <Text style={styles.name}>Anonymous</Text>
      <View style={styles.separator} />

      <TouchableOpacity style={styles.button} onPress={handleIniciar}>
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.subtitle}>
          Un espacio para expresarte sin revelar tu identidad.
        </Text>
      </View>

      {/* Modal de Términos */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Términos y Condiciones</Text>
            <Text style={styles.modalText}>
              Al usar esta app aceptas mantener el respeto y no compartir contenido ofensivo o ilegal. Esta app es anónima, pero el mal uso puede llevar a restricciones.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleAceptar}
            >
              <Text style={styles.modalButtonText}>Aceptar y continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#db6aa8ff",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#db6aa8ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
