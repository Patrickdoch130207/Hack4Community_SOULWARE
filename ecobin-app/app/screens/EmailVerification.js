import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';

export default function VerifyCodeScreen({navigation}) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyCode = async () => {
    if (!email || !code) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://192.168.187.90:8000/api/users/verify_email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          code: code
        })
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Erreur", data.error || "Code invalide");
      } else {
        Alert.alert("Succès ✅", data.message);
        navigation.navigate("Login");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vérification Email</Text>
      <Text style={styles.subtitle}>
        Entrez le code reçu par email
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Votre email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.inputCode}
        placeholder="------"
        keyboardType="numeric"
        maxLength={6}
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={verifyCode}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Vérifier</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2fdf6",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e8449",
    textAlign: "center",
    marginBottom: 10
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    marginBottom: 30
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#d4efdf"
  },
  inputCode: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 10,
    borderWidth: 1,
    borderColor: "#2ecc71",
    marginBottom: 20
  },
  button: {
    backgroundColor: "#2ecc71",
    padding: 15,
    borderRadius: 12,
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  }
});
