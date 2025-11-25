import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView ,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';




export default function Index() {
  
  const [nom,setNom]=useState("");
  const [prenom,setPrenom]=useState("");
  const [email,setEmail]=useState("")
  const [motdepasse,setMotdepasse]=useState("");
  const [passconfirm,setPassconfirm]=useState("");

   const handleRegister = async () => {
    if(motdepasse !== passconfirm) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8000/api/users/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({  nom,prenom, email, password:motdepasse }),
      });

      const data = await response.json();
      if(response.ok) {
        Alert.alert("Succès", data.message);
      } else {
        Alert.alert("Erreur", JSON.stringify(data));
      }
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  }


 
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.topSection}>
          <Text style={styles.header}>Ecobin</Text>
          <Text style={styles.title}>S'inscrire</Text>
        </View>

        
        <View style={styles.form}>
          <TextInput onChangeText={setNom} placeholder="Nom " style={styles.input} />
          <TextInput onChangeText={setPrenom} placeholder="Prénom" style={styles.input} />
          <TextInput onChangeText={setEmail} placeholder="Email" style={styles.input} keyboardType="email-address"/>
          <TextInput onChangeText={setMotdepasse} placeholder="Mot de passe" secureTextEntry={true} style={styles.input} />
          <TextInput onChangeText={setPassconfirm} placeholder="Confirmer le mot de passe" secureTextEntry={true} style={styles.input} />

          <TouchableOpacity style={styles.button} onPress={() => {handleRegister()}}>
            <Text style={styles.buttonText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.bottomSection}></View>
      </ScrollView>
    </SafeAreaView>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  topSection: {
    backgroundColor: '#4ade80', 
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginTop: 5,
  },
  form: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: -30, // superposition sur la section verte
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#22c55e', // vert plus sombre
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSection: {
    height: 80,
    backgroundColor: '#d1fae5', // vert très clair pour contraste
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 30,
  },
});



