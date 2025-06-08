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
  StatusBar,
} from "react-native";

export default function InicioApp() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<{ [key: string]: { text: string, likes: Set<string>, comments: string[], reactions: string[], selectedCommentIndex: number | null }[] }>({
    "Sistemas De Informacion": [],
    Contabilidad: [],
    Agronomia: [],
    Electromecanica: [],
    Turismo: [],
  });
  const [selectedCareer, setSelectedCareer] = useState<string>("Seleccione una Carrera");
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");

  const [isReactionsVisible, setIsReactionsVisible] = useState<boolean>(false); // Controla la visibilidad de las reacciones
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null); // Guarda la reacción seleccionada

  const carreras = ["Sistemas De Informacion", "Contabilidad", "Agronomia", "Electromecanica", "Turismo"];

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"]; // Emojis que se pueden seleccionar como reacciones

  const enviarMensaje = () => {
    if (mensaje.trim() === "" || selectedCareer === "Select a career") {
      return; // No enviamos el mensaje si no se ha seleccionado una carrera
    }

    setMensajes((prevMensajes) => {
      const updatedMensajes = { ...prevMensajes };

      // Aseguramos que el valor de mensajes[selectedCareer] no sea undefined
      if (!updatedMensajes[selectedCareer]) {
        updatedMensajes[selectedCareer] = [];
      }

      updatedMensajes[selectedCareer] = [
        ...updatedMensajes[selectedCareer],
        { text: mensaje, likes: new Set(), comments: [], reactions: [], selectedCommentIndex: null },
      ];
      return updatedMensajes;
    });

    setMensaje(""); // Limpiamos el campo de texto
  };

  const agregarLike = (index: number) => {
    setMensajes((prevMensajes) => {
      const updatedMensajes = { ...prevMensajes };
      const mensajeSeleccionado = updatedMensajes[selectedCareer][index];

      // Si el usuario ya dio like, no se permite agregarlo nuevamente
      if (mensajeSeleccionado.reactions.length > 0) return updatedMensajes; // Si ya hay una reacción, no permite más likes

      // Mostrar las reacciones personalizadas (emojis)
      setIsReactionsVisible(true);
      setSelectedReaction(null); // Resetea la reacción seleccionada al mostrar las reacciones
      return updatedMensajes;
    });
  };

  const agregarReaccion = (index: number, emoji: string) => {
    setMensajes((prevMensajes) => {
      const updatedMensajes = { ...prevMensajes };
      const mensajeSeleccionado = updatedMensajes[selectedCareer][index];

      // Si ya hay una reacción, no permitirá agregarla de nuevo
      if (mensajeSeleccionado.reactions.includes(emoji)) return updatedMensajes;

      // Agregar la reacción al mensaje
      mensajeSeleccionado.reactions = [emoji];
      setIsReactionsVisible(false); // Ocultar las reacciones después de seleccionar una
      return updatedMensajes;
    });
  };

  const agregarComentario = (index: number) => {
    if (newComment.trim() === "") return;

    setMensajes((prevMensajes) => {
      const updatedMensajes = { ...prevMensajes };
      const mensajeSeleccionado = updatedMensajes[selectedCareer][index];

      mensajeSeleccionado.comments.push(newComment); // Añadir el comentario al mensaje
      mensajeSeleccionado.selectedCommentIndex = null; // Desactivar el campo de comentario después de agregarlo
      return updatedMensajes;
    });

    setNewComment(""); // Limpiamos el campo de comentario después de agregarlo
  };

  const activarComentario = (index: number) => {
    setMensajes((prevMensajes) => {
      const updatedMensajes = { ...prevMensajes };
      const mensajeSeleccionado = updatedMensajes[selectedCareer][index];

      // Activar el comentario para este mensaje
      mensajeSeleccionado.selectedCommentIndex = index; // Seleccionamos el mensaje para comentar

      return updatedMensajes;
    });
  };

  const flatListRef = React.useRef<FlatList>(null);

  // Mover el scroll a la última entrada después de un mensaje
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [mensajes]);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible); // Mostrar u ocultar el menú de carreras
  };

  const handleCareerSelection = (career: string) => {
    setSelectedCareer(career);
    setIsMenuVisible(false); // Cerrar el menú después de seleccionar una carrera
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Barra de estado para evitar el notch */}
      <StatusBar barStyle="dark-content" />

      {/* Botón de Hamburguesa */}
      <TouchableOpacity onPress={toggleMenu} style={styles.hamburgerButton}>
        <Text style={styles.hamburgerText}>☰</Text>
      </TouchableOpacity>

      {/* Menú de Carreras */}
      {isMenuVisible && (
        <View style={styles.overlay}>
          <View style={styles.menu}>
            <FlatList
              data={carreras}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleCareerSelection(item)}
                >
                  <Text style={styles.menuText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            {/* Título de la carrera */}
            <View style={styles.header}>
              <Text style={styles.careerTitle}>{selectedCareer}</Text>
            </View>

            {/* Mensajes */}
            <FlatList
              ref={flatListRef}
              data={mensajes[selectedCareer] || []}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.mensajeContainer}>
                  <Text style={styles.nombre}>Anónimo</Text>
                  <View style={styles.burbuja}>
                    <Text style={styles.textoMensaje}>{item.text}</Text>
                    <View style={styles.reactionsContainer}>
                      <TouchableOpacity onPress={() => agregarLike(index)}>
                        <Text style={styles.likeButton}>
                          👍 {item.reactions.length === 0 ? "Reaccionar" : item.reactions[0]}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => activarComentario(index)}>
                        <Text style={styles.commentButton}>💬</Text>
                      </TouchableOpacity>
                    </View>
                    {/* Mostrar las reacciones seleccionadas */}
                    <FlatList
                      data={item.reactions}
                      keyExtractor={(_, reactionIndex) => reactionIndex.toString()}
                      renderItem={({ item: reaction }) => (
                        <Text style={styles.commentText}>Reacción: {reaction}</Text>
                      )}
                    />
                    {/* Mostrar las opciones de reacciones (emojis) */}
                    {isReactionsVisible && (
                      <View style={styles.reactionList}>
                        {emojis.map((emoji, emojiIndex) => (
                          <TouchableOpacity key={emojiIndex} onPress={() => agregarReaccion(index, emoji)}>
                            <Text style={styles.emojiButton}>{emoji}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {/* Mostrar los comentarios */}
                    <FlatList
                      data={item.comments}
                      keyExtractor={(_, commentIndex) => commentIndex.toString()}
                      renderItem={({ item: comment }) => (
                        <Text style={styles.commentText}>- {comment}</Text>
                      )}
                    />
                    {/* Mostrar el campo de comentario solo cuando el mensaje es seleccionado */}
                    {item.selectedCommentIndex === index && (
                      <View style={styles.commentInputContainer}>
                        <TextInput
                          style={styles.input}
                          placeholder="Escribe un comentario..."
                          value={newComment}
                          onChangeText={setNewComment}
                          returnKeyType="done"
                        />
                        <TouchableOpacity
                          onPress={() => agregarComentario(index)}
                          style={styles.botonEnviar}
                        >
                          <Text style={styles.textoBoton}>Comentar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              )}
              contentContainerStyle={styles.mensajes}
              keyboardShouldPersistTaps="handled"
              inverted
            />

            {/* Enviar mensaje */}
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
