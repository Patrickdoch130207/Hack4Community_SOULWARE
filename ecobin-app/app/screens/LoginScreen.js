import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {

  const [email, setEmail] = useState("");
  const [motdepasse, setMotdepasse] = useState("");
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) navigation.replace("Home");
    };
    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.243:8000/api/users/login/", {
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
        Alert.alert("Email ou mot de passe incorrect");
      }
    } catch (error) {
      Alert.alert("Erreur serveur");
    }
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, useNativeDriver: true, duration: 100 }),
      Animated.timing(scaleAnim, { toValue: 1, useNativeDriver: true, duration: 100 })
    ]).start(handleLogin);
  };

  return (
    <LinearGradient colors={['#022c22', '#064e3b', '#16a34a']} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.wrapper}>

          <View style={styles.glassCard}>
            <Text style={styles.logo}>Ecobin</Text>
            <Text style={styles.slogan}>Connexion </Text>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#a7f3d0" />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#d1fae5"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#a7f3d0" />
              <TextInput
                placeholder="Mot de passe"
                placeholderTextColor="#d1fae5"
                value={motdepasse}
                onChangeText={setMotdepasse}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity onPress={animatePress} activeOpacity={0.9}>
                <LinearGradient
                  colors={['#22c55e', '#4ade80']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Connexion </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
              <Text style={{ color: '#a7f3d0', textAlign: 'center' }}>
                Pas de compte ? <Text style={{ fontWeight: 'bold' }}>S'inscrire</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 15 },
    shadowRadius: 30,
  },
  logo: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ecfdf5',
    textAlign: 'center',
    letterSpacing: 2,
  },
  slogan: {
    color: '#a7f3d0',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    padding: 14,
    color: '#ecfdf5',
    fontSize: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#064e3b',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
