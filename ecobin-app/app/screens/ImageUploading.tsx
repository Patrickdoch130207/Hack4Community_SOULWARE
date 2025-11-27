import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";

const ImageCaptureScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(
    null
  );

  const [selectedOption, setSelectedOption] = useState<"camera" | "library">(
    "library"
  );
  // Pour suivre l'état de l'analyse
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fonction pour demander les permissions
  const requestPermissions = async (type: "camera" | "library") => {
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === "granted";
    } else {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === "granted";
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Vous devez autoriser l'accès à la caméra pour prendre des photos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setSelectedImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à la caméra");
      console.error("Camera error:", error);
    }
  };
  
  const chooseFromLibrary = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Vous devez autoriser l'accès à la galerie pour sélectionner des images."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setSelectedImage({ uri: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'accéder à la galerie");
      console.error("Gallery error:", error);
    }
  };

  const handleOptionSelect = async (option: "camera" | "library") => {
    setSelectedOption(option);
    if (option === "camera") {
      await takePhoto();
    } else {
      await chooseFromLibrary();
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setSelectedOption("library");
  };

  const classifyWaste = async (imageUri) => {
    // Démarrer l'analyse
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    try {
      const response = await fetch(
        "http://192.168.1.243:8000/api/predict/image/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Le nom de l'écran "AnalyseResultat" est correct selon App.js
        navigation.navigate("AnalyseResultat", {
          classificationData: data,
        });
      } else {
        Alert.alert("Erreur", data.error || "Erreur inconnue");
      }
    } catch (error) {
      Alert.alert(
        "Erreur réseau",
        "Impossible de contacter le serveur : " + error.message
      );
    } finally {
      // Arrêter l'analyse (qu'il y ait succès ou échec)
      setIsAnalyzing(false);
    }
    // AUCUN return JSX ici
  };

  // ------------------------------------------------------------------
  // DÉBUT DU RENDU PRINCIPAL DU COMPOSANT (CORRIGÉ)
  // ------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header avec design courbé */}
      <View style={styles.curvedHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Recyclage Intelligent</Text>
          <Text style={styles.headerSubtitle}>Identification des déchets</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Titre principal */}
        <Text style={styles.mainTitle}>
          Vous pouvez soit prendre une photo, soit charger une image pour
          identifier le déchet.
        </Text>

        {/* Options de sélection */}
        <View style={styles.optionsContainer}>
          {/* Option Camera */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === "camera" && styles.optionCardSelected,
            ]}
            onPress={() => handleOptionSelect("camera")}
          >
            <View style={styles.optionHeader}>
              <View style={styles.checkbox}>
                {selectedOption === "camera" && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </View>
              <Icon
                name="camera"
                size={24}
                color={selectedOption === "camera" ? "#2E7D32" : "#666"}
              />
            </View>
            <Text style={styles.optionTitle}>Prendre une photo</Text>
            <Text style={styles.optionDescription}>
              Capturez une photo du déchet pour l'identifier
            </Text>
          </TouchableOpacity>

          {/* Option Gallery */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOption === "library" && styles.optionCardSelected,
            ]}
            onPress={() => handleOptionSelect("library")}
          >
            <View style={styles.optionHeader}>
              <View style={styles.checkbox}>
                {selectedOption === "library" && (
                  <Icon name="check" size={16} color="#fff" />
                )}
              </View>
              <Icon
                name="image"
                size={24}
                color={selectedOption === "library" ? "#2E7D32" : "#666"}
              />
            </View>
            <Text style={styles.optionTitle}>Charger une image</Text>
            <Text style={styles.optionDescription}>
              Sélectionnez une image depuis votre galerie pour identifier le
              déchet
            </Text>
          </TouchableOpacity>
        </View>

        {/* Aperçu de l'image sélectionnée */}
        {selectedImage && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Aperçu de l'image</Text>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.previewImage}
            />

            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={resetSelection}
                disabled={isAnalyzing}
              >
                <Text style={styles.secondaryButtonText}>Changer d'image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isAnalyzing && styles.primaryButtonDisabled,
                ]}
                onPress={() => {
                  if (selectedImage?.uri) {
                    classifyWaste(selectedImage.uri);
                  } else {
                    Alert.alert(
                      "Aucune image",
                      "Veuillez sélectionner ou capturer une image."
                    );
                  }
                }}
                disabled={isAnalyzing} // Désactivation complète du clic
              >
                {/* Contenu conditionnel : Indicateur ou Texte */}
                {isAnalyzing ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" />
                    <Text style={styles.primaryButtonText}>
                      Analyse en cours...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.primaryButtonText}>
                    Analyser le déchet
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>
            Conseils pour une meilleure identification :
          </Text>
          <View style={styles.instructionItem}>
            <Icon name="check-circle" size={16} color="#2E7D32" />
            <Text style={styles.instructionText}>
              Prenez la photo sous un bon éclairage
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="check-circle" size={16} color="#2E7D32" />
            <Text style={styles.instructionText}>Cadrez le déchet de près</Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="check-circle" size={16} color="#2E7D32" />
            <Text style={styles.instructionText}>
              Évitez les arrière-plans complexes
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
// ------------------------------------------------------------------
// STYLES DÉPLACÉS ET NETTOYÉS
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  curvedHeader: {
    backgroundColor: "#2E7D32",
    height: 120,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: "center",
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 30,
    alignItems: "center",
    width: "100%",
  },
  optionCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 2,
    borderColor: "transparent",
    width: "100%",
  },
  optionCardSelected: {
    borderColor: "#2E7D32",
    backgroundColor: "#f1f8e9",
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2E7D32",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  previewContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    backgroundColor: "#2E7D32",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  primaryButtonDisabled: {
    backgroundColor: "#689F38", 
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  instructions: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
  },
});

export default ImageCaptureScreen;