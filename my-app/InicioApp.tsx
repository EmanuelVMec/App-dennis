import React, { useState, useEffect, useRef } from "react";
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
  Button,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,  // Importamos Alert para mostrar mensajes de advertencia
} from "react-native";
import styles from './styles'; // Importa el archivo de estilos

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

  // Lista de palabras ofensivas
const offensiveWords = [
  "puta", "pendejo", "estúpido", "imbécil", "mierda", "idiota", "concha", "hijo de puta", 
  "malnacido", "coño", "puto", "zorra", "cabrón", "maricón", "mierdero", "peluca", "chinga", 
  "hijueputa", "gilipollas", "imbécil", "tonto", "mierda", "carajo", "culero", "pajero", 
  "chocho", "cacas", "pito", "polla", "cabrón", "bastardo", "marica", "conchudo", "pendejazo", 
  "culero", "suicida", "putón", "verga", "sodomita", "follón", "follar", "chupapolla", "culos", 
  "hijoputa", "putísima", "mamada", "cachondo", "chupaculo", "plasta", "petardo", "sinvergüenza", 
  "muerto", "perra", "trapo", "escarba", "guarro", "fufurufa", "mamón", "seco", "pelotudo", 
  "chupapitos", "bicho", "cerdo", "come mierda", "madurón", "trozo de mierda", "mujerzuela", 
  "tragón", "bobalicón", "felpa", "mujercita", "bastarda", "chorra", "rata", "asqueroso", "sin vergüenza", 
  "vulgar", "jodido", "muerta", "pajote", "cabronazo", "hojalata", "malparido", "cabrona", 
  "asquerosidad", "puta madre", "camiseta", "borracho", "subnormal", "morra", "follacabras", 
  "borrachuzo", "caraculo", "joder", "chupacu...", "sobrada", "pirata", "cabronada", "pancha", 
  "puta madre", "pasota", "coñazo", "engendro", "quema", "matón", "carajista", "comemierda", 
  "sierrapilla", "bocadillos", "pelaculos", "chusma", "rebuzno", "carretón", "relente", "pelotas",
  "bryan", "anthony"
];


  const carreras = [
    { id: 1, nombre: "Sistemas de Información" },
    { id: 2, nombre: "Electromecánica" },
    { id: 3, nombre: "Turismo" },
    { id: 4, nombre: "Agroindustria" },
    { id: 5, nombre: "Contabilidad" },
    { id: 6, nombre: "Administración de Empresas" },
  ];

  const cargarMensajes = async () => {
    if (selectedCarrera === null) return;
    try {
      const response = await fetch(`http://192.168.11.20:8000/api/messages/${selectedCarrera}/`, {
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
  };

  useEffect(() => {
    if (selectedCarrera !== null) {
      cargarMensajes();
    }

    const intervalId = setInterval(() => {
      cargarMensajes();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [selectedCarrera]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [mensajes]);

  // Función de validación de mensaje
  const validateMessage = (message: string) => {
    const lowerCaseMessage = message.toLowerCase(); // Convertir a minúsculas
    for (let word of offensiveWords) {
      if (lowerCaseMessage.includes(word)) {
        return true; // Si el mensaje contiene palabras ofensivas, retorna true
      }
    }
    return false; // Si no se encuentran palabras ofensivas, retorna false
  };

  // Modificamos la función de enviar mensaje para validar antes de enviar
  const enviarMensaje = async () => {
    if (mensaje.trim() === "" || selectedCarrera === null) return;

    // Validación de mensaje
    if (validateMessage(mensaje)) {
      Alert.alert("Mensaje Inapropiado", "El mensaje contiene palabras ofensivas. Por favor, edítalo.");
      return; // No enviamos el mensaje
    }

    try {
      const response = await fetch("http://192.168.11.20:8000/api/send/", {
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
      } else {
        const errorData = await response.json();
        console.error("Error al enviar mensaje:", errorData);
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.innerContainer}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.hamburgerButton}>
              <Text style={styles.hamburgerText}>☰</Text>
            </TouchableOpacity>

            {selectedCarrera !== null && (
              <Text style={styles.selectedCarreraText}>
                {carreras.find(carrera => carrera.id === selectedCarrera)?.nombre}
              </Text>
            )}

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
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuText}>{carrera.nombre}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>

            <View style={styles.refreshButtonContainer}>
              <Button title="Refrescar" onPress={handleRefresh} />
            </View>

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
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe un mensaje..."
                value={mensaje}
                onChangeText={setMensaje}
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
