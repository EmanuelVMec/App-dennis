import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TouchableWithoutFeedback,
  StatusBar,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import styles from './styles';

export default function InicioApp() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState<{
    text: string;
    reactions: string[];
    comments: string[];
    selectedCommentIndex: number | null;
  }[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isReactionsVisible, setIsReactionsVisible] = useState<boolean>(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [selectedCarrera, setSelectedCarrera] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const flatListRef = useRef<FlatList>(null);

  const offensiveWords = [
    "puta", "pendejo", "estúpido", "imbécil", "mierda", "idiota", "concha", 
    "hijo de puta", "malnacido", "coño", "puto", "zorra", "cabrón", "maricón",
    // ... (lista completa de palabras ofensivas)
  ];

  const carreras = [
    { id: 1, nombre: "Sistemas de Información", color: "#4A90E2" },
    { id: 2, nombre: "Electromecánica", color: "#F5A623" },
    { id: 3, nombre: "Turismo", color: "#7ED321" },
    { id: 4, nombre: "Agroindustria", color: "#BD10E0" },
    { id: 5, nombre: "Contabilidad", color: "#50E3C2" },
    { id: 6, nombre: "Administración de Empresas", color: "#ff001eff" },
  ];

  const cargarMensajes = useCallback(async () => {
    if (selectedCarrera === null) return;
    try {
      const response = await fetch(`http://192.168.0.113:8000/api/messages/${selectedCarrera}/`, {
        credentials: "include",
      });
      const data = await response.json();
      setMensajes(
        data.messages.map((msg: any) => ({
          text: msg.text,
          reactions: msg.reactions || [],
          comments: msg.comments || [],
          selectedCommentIndex: null,
        }))
      );
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  }, [selectedCarrera]);

  useEffect(() => {
    if (selectedCarrera !== null) {
      cargarMensajes();
    }
    const intervalId = setInterval(cargarMensajes, 15000);
    return () => clearInterval(intervalId);
  }, [cargarMensajes, selectedCarrera]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [mensajes]);

  const validateMessage = (message: string) => {
    const lowerCaseMessage = message.toLowerCase();
    return offensiveWords.some(word => lowerCaseMessage.includes(word));
  };

  const enviarMensaje = async () => {
    if (mensaje.trim() === "" || selectedCarrera === null) return;

    if (validateMessage(mensaje)) {
      Alert.alert("Mensaje Inapropiado", "El mensaje contiene palabras ofensivas. Por favor, edítalo.");
      return;
    }

    try {
      const response = await fetch("http://192.168.0.113:8000/api/send/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          text: mensaje,
          carrera_id: selectedCarrera,
        }),
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

  const handleRefresh = () => {
    cargarMensajes();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Fijo */}
      <View style={styles.headerFixed}>
        <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.hamburgerButton}>
          <Text style={styles.hamburgerText}>☰</Text>
        </TouchableOpacity>

        <Text style={styles.selectedCarreraText}>
          {carreras.find(carrera => carrera.id === selectedCarrera)?.nombre}
        </Text>

        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={mensajes}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.mensajeContainer}>
              <Text style={styles.nombre}>Anónimo</Text>
              <Text style={styles.textoMensaje}>{item.text}</Text>
              <View style={styles.reactionsContainer}>
                <TouchableOpacity onPress={() => activarReaccion(index)}>
                  <Text style={styles.reactionText}> 👍 {item.reactions[0] || ""}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => activarComentario(index)}>
                  <Text style={styles.commentText}>   💬 </Text>
                </TouchableOpacity>
              </View>
              {selectedMessageIndex === index && isReactionsVisible && (
                <View style={styles.reactionList}>
                  {emojis.map((emoji, i) => (
                    <TouchableOpacity key={i} onPress={() => agregarReaccion(index, emoji)}>
                      <Text style={styles.emojiButton}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {item.comments.map((c, i) => (
                <Text key={i} style={styles.commentText}>- {c}</Text>
              ))}
              {item.selectedCommentIndex === index && (
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Comentario..."
                    value={newComment}
                    onChangeText={setNewComment}
                  />
                  <TouchableOpacity onPress={() => agregarComentario(index)} style={styles.commentButton}>
                    <Text style={styles.textoBoton}>Comentar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={styles.flatListContainer}
          keyboardShouldPersistTaps="handled"
        />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Escribe un mensaje..."
              value={mensaje}
              onChangeText={setMensaje}
              multiline
            />
            <TouchableOpacity onPress={enviarMensaje} style={styles.botonEnviar}>
              <Text style={styles.textoBoton}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.menu}>
            {carreras.map((carrera) => (
              <TouchableOpacity
                key={carrera.id}
                onPress={() => {
                  setSelectedCarrera(carrera.id);
                  setIsModalVisible(false);
                }}
                style={[styles.menuItem, { backgroundColor: carrera.color }]}
              >
                <Text style={styles.menuText}>{carrera.nombre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}