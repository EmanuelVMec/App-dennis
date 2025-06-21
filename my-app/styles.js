import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 15,
  },
  innerContainer: {
    flex: 1,
    paddingBottom: 15,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  hamburgerButton: {
    padding: 12,
    position: "absolute",
    top:15,
    left: 15,
    zIndex: 2,
  },
  hamburgerText: {
    fontSize: 30,
    color: "#007BFF",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    backgroundColor: "#FFFFFF",
    width: 250,
    borderRadius: 8,
    padding: 18,
  },
  menuItem: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
  },
  menuText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  refreshButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 15,
  },
  mensajeContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  nombre: {
    fontSize: 14,
    color: "#6C6C6C",
    marginBottom: 10,
  },
  textoMensaje: {
    fontSize: 16,
    color: "#333333",
  },
  reactionsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  reactionText: {
    fontSize: 16,
    color: "#007BFF",
  },
  commentText: {
    fontSize: 15,
    color: "#6C6C6C",
  },
  reactionList: {
    flexDirection: "row",
    marginTop: 12,
  },
  emojiButton: {
    fontSize: 24,
    marginRight: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#BDC3C7",
  },
  botonEnviar: {
    marginLeft: 12,
    backgroundColor: "#007BFF",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  flatListContainer: {
    paddingBottom: 80,
  },
  commentInputContainer: {
    marginTop: 10,
    flexDirection: "row",
    paddingHorizontal: 18,
    backgroundColor: "#F9F9F9",
  },
  commentButton: {
    backgroundColor: "#007BFF",
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectedCarreraText: {
  fontSize: 18,
  color: "#333",
  marginBottom: 10,  // Un pequeño margen para separarlo de los botones
  textAlign: "center",
  fontWeight: "bold",
},
});

export default styles;
