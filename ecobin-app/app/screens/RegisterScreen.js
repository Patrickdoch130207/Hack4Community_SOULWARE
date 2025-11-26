import React, { useRef, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motdepasse, setMotdepasse] = useState('');
  const [passconfirm, setPassconfirm] = useState('');

  const scrollRef = useRef(null);
  const nomRef = useRef(null);
  const prenomRef = useRef(null);
  const emailRef = useRef(null);
  const motdepasseRef = useRef(null);
  const passconfirmRef = useRef(null);

  const handleRegister = async () => {
    if (motdepasse !== passconfirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const response = await fetch('http://192.168.187.90:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, password: motdepasse }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Succès', data.message);
        navigation.navigate('Login');
      } else {
        Alert.alert('Erreur', JSON.stringify(data));
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    }
  };

  // Scroll automatique du ScrollView vers le champ actif.
  // On measure la position du champ dans la fenêtre et on scroll si nécessaire.
  const scrollToInput = (ref) => {
    if (!ref || !ref.current || !scrollRef.current) return;
    // délai très court pour laisser le clavier apparaître et les layouts se stabiliser
    setTimeout(() => {
      ref.current.measure((_fx, _fy, _w, h, _px, pageY) => {
        // pageY = position absolue du champ à l'écran
        // on veut que le champ soit visible au-dessus du clavier :
        const keyboardSpace = Platform.OS === 'ios' ? 320 : 220; // estimation initiale
        const targetY = pageY - keyboardSpace / 2;
        // scrollTo attend un y relatif au ScrollView content
        scrollRef.current.scrollTo({ y: targetY > 0 ? targetY : 0, animated: true });
      });
    }, 120);
  };

  // Ajuste cette valeur si ton header / statusbar change la position:
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 80;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://i.imgur.com/8Km9tLL.png' }}
        style={styles.background}
        blurRadius={6}
      >
        <View style={styles.overlay} />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.scroll}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.logoBox}>
                <Text style={styles.logo}>ECOBIN</Text>
                <Text style={styles.subtitle}>Créer un compte</Text>
              </View>

              <View style={styles.glassCard}>
                <Text style={styles.title}>Inscription</Text>

                <TextInput
                  ref={nomRef}
                  placeholder="Nom"
                  placeholderTextColor="#d1fae5"
                  style={styles.input}
                  value={nom}
                  onChangeText={setNom}
                  returnKeyType="next"
                  onSubmitEditing={() => prenomRef.current && prenomRef.current.focus()}
                  blurOnSubmit={false}
                  onFocus={() => scrollToInput(nomRef)}
                />

                <TextInput
                  ref={prenomRef}
                  placeholder="Prénom"
                  placeholderTextColor="#d1fae5"
                  style={styles.input}
                  value={prenom}
                  onChangeText={setPrenom}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current && emailRef.current.focus()}
                  blurOnSubmit={false}
                  onFocus={() => scrollToInput(prenomRef)}
                />

                <TextInput
                  ref={emailRef}
                  placeholder="Email"
                  placeholderTextColor="#d1fae5"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => motdepasseRef.current && motdepasseRef.current.focus()}
                  blurOnSubmit={false}
                  onFocus={() => scrollToInput(emailRef)}
                />

                <TextInput
                  ref={motdepasseRef}
                  placeholder="Mot de passe"
                  placeholderTextColor="#d1fae5"
                  style={styles.input}
                  value={motdepasse}
                  onChangeText={setMotdepasse}
                  secureTextEntry
                  returnKeyType="next"
                  onSubmitEditing={() => passconfirmRef.current && passconfirmRef.current.focus()}
                  blurOnSubmit={false}
                  onFocus={() => scrollToInput(motdepasseRef)}
                />

                <TextInput
                  ref={passconfirmRef}
                  placeholder="Confirmer mot de passe"
                  placeholderTextColor="#d1fae5"
                  style={styles.input}
                  value={passconfirm}
                  onChangeText={setPassconfirm}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  onFocus={() => scrollToInput(passconfirmRef)}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                  <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 40 },
  logoBox: { alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 36, fontWeight: '900', color: '#22c55e', letterSpacing: 2 },
  subtitle: { color: '#e5e7eb', fontSize: 16 },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  title: { textAlign: 'center', color: '#ecfdf5', fontSize: 20, fontWeight: '700', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: 'white',
    marginBottom: 12,
  },
  button: { backgroundColor: '#22c55e', paddingVertical: 13, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#052e16', fontSize: 16, fontWeight: '700' },
  link: { marginTop: 14, textAlign: 'center', color: '#bbf7d0' },
});
