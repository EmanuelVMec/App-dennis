import React, { useState, useEffect, useRef } from "react";
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
  StatusBar,
} from "react-native";

export default function InicioApp() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<
    { text: string; reactions: string[]; comments: string[]; selectedCommentIndex: number | null }[]
  >([]);
  const [selectedCommentIndex, setSelectedCommentIndex] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [isReactionsVisible, setIsReactionsVisible] = useState<boolean>(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const flatListRef = useRef<FlatList>(null);

  const cargarMensajes = async () => {
    try {
      const response = await fetch("http://192.168.11.20:8000/api/messages/", {
        credentials: "include",
      });
      const data = await response.json();
      setMensajes(
        data.map((msg: any) => ({
          text: msg.text,
          reactions: msg.reactions || [],
          comments: msg.comments || [],
          selectedCommentIndex: null,
        }))
      );
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  };

  useEffect(() => {
    cargarMensajes();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [mensajes]);

  const enviarMensaje = async () => {
    if (mensaje.trim() === "") return;
    try {
      const response = await fetch("http://192.168.11.20:8000/api/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: mensaje }),
      });
      if (response.ok) {
        await cargarMensajes();
        setMensaje("");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  const agregarComentario = (index: number) => {
    if (newComment.trim() === "") return;
    setMensajes((prev) => {
      const updated = [...prev];
      updated[index].comments.push(newComment);
      updated[index].selectedCommentIndex = null;
      return updated;
    });
    setNewComment("");
  };

  const agregarReaccion = (index: number, emoji: string) => {
    setMensajes((prev) => {
      const updated = [...prev];
      updated[index].reactions = [emoji];
      return updated;
    });
    setIsReactionsVisible(false);
    setSelectedMessageIndex(null);
  };

  const activarComentario = (index: number) => {
    setMensajes((prev) => {
      const updated = [...prev];
      updated.forEach((msg, i) => (msg.selectedCommentIndex = i === index ? index : null));
      return updated;
    });
  };

  const activarReaccion = (index: number) => {
    setIsReactionsVisible(true);
    setSelectedMessageIndex(index);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, padding: 10 }}>
            <FlatList
              ref={flatListRef}
              data={mensajes}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={{ marginBottom: 10, borderWidth: 1, padding: 10, borderRadius: 8 }}>
                  <Text style={{ fontWeight: "bold" }}>Anónimo</Text>
                  <Text>{item.text}</Text>
                  <View style={{ flexDirection: "row", marginTop: 5 }}>
                    <TouchableOpacity onPress={() => activarReaccion(index)}>
                      <Text style={{ marginRight: 10 }}>
                        👍 {item.reactions[0] || "Reaccionar"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => activarComentario(index)}>
                      <Text>💬</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedMessageIndex === index && isReactionsVisible && (
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      {emojis.map((emoji, i) => (
                        <TouchableOpacity key={i} onPress={() => agregarReaccion(index, emoji)}>
                          <Text style={{ fontSize: 18, marginRight: 5 }}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  {item.comments.map((c, i) => (
                    <Text key={i} style={{ fontSize: 14, color: "gray" }}>
                      - {c}
                    </Text>
                  ))}
                  {item.selectedCommentIndex === index && (
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                      <TextInput
                        style={{ flex: 1, borderWidth: 1, padding: 5, borderRadius: 5 }}
                        placeholder="Comentario..."
                        value={newComment}
                        onChangeText={setNewComment}
                      />
                      <TouchableOpacity
                        onPress={() => agregarComentario(index)}
                        style={{ marginLeft: 5 }}
                      >
                        <Text>Comentar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />

            <View style={{ flexDirection: "row", borderTopWidth: 1, padding: 10 }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, padding: 10, borderRadius: 10 }}
                placeholder="Escribe un mensaje..."
                value={mensaje}
                onChangeText={setMensaje}
              />
              <TouchableOpacity onPress={enviarMensaje} style={{ marginLeft: 10 }}>
                <Text style={{ padding: 10, backgroundColor: "#25D366", color: "white", borderRadius: 10 }}>
                  Enviar
                </Text>
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
    justifyContent: "flex-end",
    padding: 10,
  },
  mensajes: {
    flexGrow: 1,
    padding: 15,
    paddingBottom: 20,
    justifyContent: "flex-end",
  },
  mensajeContainer: {
    marginBottom: 10,
    marginTop: 10,
    alignSelf: "stretch", // Cambié el estilo para que ocupe todo el ancho
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  nombre: {
    fontSize: 12,
    color: "#555",
    marginBottom: 5,
  },
  burbuja: {
    backgroundColor: "#DCF8C6",
    padding: 10,
    borderRadius: 8,
    width: "100%", // Esto asegura que el mensaje ocupe todo el ancho de la pantalla
  },
  textoMensaje: {
    fontSize: 16,
  },
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  likeButton: {
    marginRight: 10,
  },
  commentButton: {},
  commentText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#555",
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
  hamburgerButton: {
    padding: 10,
    position: "absolute",
    top: Platform.OS === "ios" ? 40 : 20,
    left: 10,
    zIndex: 1,
  },
  hamburgerText: {
    fontSize: 30,
    color: "#5c3d7d",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  menu: {
    position: "absolute",
    top: 80,
    left: 0,
    backgroundColor: "#5c3d7d",
    width: 200,
    padding: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    zIndex: 2,
  },
  menuItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#3e2c5b",
    borderRadius: 5,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
  },
  careerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center", // Centra el texto
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Centra el texto
    marginTop: Platform.OS === "ios" ? 50 : 30, // Ajusta el margen superior para el header
  },
  commentInputContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
  },
  reactionList: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  emojiButton: {
    fontSize: 20,
    marginRight: 10,
  },
});
