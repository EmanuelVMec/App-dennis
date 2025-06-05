import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";

export default function InicioApp() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<string[]>([]);

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;
    setMensajes([mensaje, ...mensajes]); // Insertamos el mensaje al principio
    setMensaje("");
  };

  const flatListRef = React.useRef<FlatList>(null);

  // Mover el scroll a la última entrada después de un mensaje
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [mensajes]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <FlatList
              ref={flatListRef}
              data={mensajes}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.mensajeContainer}>
                  <Text style={styles.nombre}>Anónimo</Text>
                  <View style={styles.burbuja}>
                    <Text style={styles.textoMensaje}>{item}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={styles.mensajes}
              keyboardShouldPersistTaps="handled"
              inverted
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={mensaje}
                onChangeText={setMensaje}
                onSubmitEditing={enviarMensaje}
                returnKeyType="send"
              />
              <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
                <Text style={styles.textoBoton}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // Asegura que la entrada esté al final
  },
  mensajes: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 20, // Añadimos un padding para evitar que el primer mensaje quede pegado al borde
    justifyContent: "flex-end",
  },
  mensajeContainer: {
    marginBottom: 10,
    marginTop: 10, // Añadido para evitar que el primer mensaje quede muy arriba
    alignSelf: "flex-start",
  },
  nombre: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5, // Mayor espacio entre el nombre y el mensaje
  },
  burbuja: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  textoMensaje: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  botonEnviar: {
    marginLeft: 10,
    backgroundColor: "#25D366",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  textoBoton: {
    color: "#fff",
    fontWeight: "bold",
  },
});
