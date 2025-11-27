import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
} 

from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RegisterScreen({ navigation }) {
  
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [passconfirm, setPassconfirm] = useState('');

  
  const prenomRef = useRef(null);
  const nomRef = useRef(null);
  const emailRef = useRef(null);
  const motdepasseRef = useRef(null);
  const passconfirmRef = useRef(null);

  const handleRegister = async () => {
    if (motdepasse !== passconfirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    
    // Ajout d'une validation simple pour s'assurer que les champs sont remplis
    if (!nom || !prenom || !email || !motdepasse || !passconfirm) {
        Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
        return;
    }

    try {
      const response = await fetch('http://192.168.187.90:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Envoi des states d'origine complètes
        body: JSON.stringify({ nom, prenom, email, password: motdepasse }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', data.message);
        navigation.navigate('EmailVerification');
      } else {
        Alert.alert('Erreur', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Erreur d'enregistrement:", error);
      Alert.alert('Erreur', "Impossible de se connecter au serveur. Veuillez vérifier votre connexion.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAwareScrollView enableOnAndroid extraScrollHeight={100} contentContainerStyle={styles.scrollContent}>
                

      
        
        {/* Header (inchangé) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>INSCRIPTION</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Contenu (inchangé) */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Créer un compte et{'\n'}
            vous êtes prêt à partir !
          </Text>

          
          <View style={styles.form}>
           
            
            {/* Nom */}
            <View style={styles.inputContainer}>
              <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                ref={nomRef}
                style={styles.textInput}
                placeholder="Nom"
                placeholderTextColor="#999"
                value={nom}
                onChangeText={setNom}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
              />
            </View>

             {/* Prénom */}
            <View style={styles.inputContainer}>
              <Icon name="user-o" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                ref={prenomRef}
                style={styles.textInput}
                placeholder="Prénom"
                placeholderTextColor="#999"
                value={prenom}
                onChangeText={setPrenom}
                returnKeyType="next"
                onSubmitEditing={() => nomRef.current && nomRef.current.focus()}
              />
            </View>


            {/* Email */}
            <View style={styles.inputContainer}>
              <Icon name="envelope" size={18} color="#666" style={styles.inputIcon} />
              <TextInput
                ref={emailRef}
                style={styles.textInput}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => motdepasseRef.current && motdepasseRef.current.focus()}
              />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                ref={motdepasseRef}
                style={styles.textInput}
                placeholder="Mot de passe"
                placeholderTextColor="#999"
                secureTextEntry
                value={motdepasse}
                onChangeText={setMotdepasse}
                returnKeyType="next"
                onSubmitEditing={() => passconfirmRef.current && passconfirmRef.current.focus()}
              />
            </View>

            {/* Confirmer mot de passe */}
            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                ref={passconfirmRef}
                style={styles.textInput}
                placeholder="Confirmer le mot de passe"
                placeholderTextColor="#999"
                secureTextEntry
                value={passconfirm}
                onChangeText={setPassconfirm}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>

            <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
              <Text style={styles.signUpButtonText}>S'INSCRIRE</Text>
            </TouchableOpacity>
          </View>


          {/* Lien vers connexion */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}


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
    color: '#2E7D32',
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
  signUpButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: 'bold',
  },
});