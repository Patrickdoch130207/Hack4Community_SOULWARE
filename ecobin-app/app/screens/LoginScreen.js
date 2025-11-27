import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

// Le nom du composant est conservé : LoginScreen
export default function LoginScreen({ navigation }) {

  // States d'origine
  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  
  // L'animation a été retirée pour coller au nouveau style simple

  // Vérification du token au démarrage (Logique de LoginScreen.js)
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) navigation.replace("Home");
    };
    checkToken();
  }, [navigation]);

  // Logique de connexion (inchangée)
  const handleLogin = async () => {
    // Validation simple
    if (!email || !motdepasse) {
        Alert.alert("Erreur", "Veuillez entrer votre email et votre mot de passe.");
        return;
    }

    try {
      const response = await fetch("http://192.168.187.90:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: motdepasse
        })
      });

      const data = await response.json();

      if (response.ok && data.access) {
        await AsyncStorage.setItem("token", data.access);
        navigation.replace("Home");
      } else {
        // Affiche l'erreur renvoyée par l'API si disponible
        const errorMessage = data.detail || "Email ou mot de passe incorrect";
        Alert.alert("Erreur de connexion", errorMessage);
      }
    } catch (error) {
      console.error("Erreur serveur lors de la connexion:", error);
      Alert.alert("Erreur serveur", "Impossible de se connecter au serveur. Veuillez réessayer.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header - Design Connexion.tsx */}
        <View style={styles.header}>
          {/* L'icône de retour en arrière a été maintenue */}
          <TouchableOpacity onPress={() => navigation.navigate()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>CONNEXION</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Contenu - Design Connexion.tsx */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Content de vous revoir !{'\n'}
            Connectez-vous à votre compte.
          </Text>

          {/* Formulaire */}
          <View style={styles.form}>
            {/* Champ Email */}
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
            </View>

            {/* Champ Mot de passe */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Mot de passe"
                placeholderTextColor="#999"
                secureTextEntry
                value={motdepasse}
                onChangeText={setMotdepasse}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
            </View>

            {/* Mot de passe oublié (Navigation vers PasswordResetRequest de l'original) */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('PasswordResetRequest')} // Route de l'original LoginScreen
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Bouton de Connexion */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>SE CONNECTER</Text>
            </TouchableOpacity>
          </View>
         

          {/* Lien vers inscription (Navigation vers Register de l'original) */}
          <View style={styles.signupLink}>
            <Text style={styles.signupText}>Nouveau ici ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}> 
              <Text style={styles.signupLinkText}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles copiés et adaptés de Connexion.tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32', // Couleur verte de Connexion.tsx
    letterSpacing: 1,
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: '#2E7D32', // Couleur verte de Connexion.tsx
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2E7D32', // Couleur verte de Connexion.tsx
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#666',
    fontSize: 14,
  },
  signupLinkText: {
    color: '#2E7D32', // Couleur verte de Connexion.tsx
    fontSize: 14,
    fontWeight: 'bold',
  },
});