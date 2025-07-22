import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7b3d0ff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerFixed: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#e7b3d0ff',
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  hamburgerButton: {
    padding: 5,
  },
  hamburgerText: {
    fontSize: 30,
    color: "#007BFF",
  },
  selectedCarreraText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  refreshButton: {
    padding: 5,
  },
  refreshText: {
    fontSize: 20,
    color: "#007BFF",
  },
  flatListContainer: {
    paddingTop: 70,
    paddingBottom: 80,
    paddingHorizontal: 15,
  },
  mensajeContainer: {
    backgroundColor: "#fff0f0ff",
    borderRadius: 15,
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
    flexDirection: 'row',
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
    flexDirection: 'row',
    marginTop: 12,
  },
  emojiButton: {
    fontSize: 24,
    marginRight: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    maxHeight: 100,
  },
  botonEnviar: {
    marginLeft: 12,
    backgroundColor: "#ff00bfff",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  textoBoton: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  commentInputContainer: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 18,
    backgroundColor: '#F9F9F9',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    width: 250,
    borderRadius: 8,
    padding: 18,
  },
  menuItem: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#db6aa8ff',
    borderRadius: 8,
  },
  menuText: {
    color: '#000000ff',
    fontSize: 16,
  },
});

export default styles;