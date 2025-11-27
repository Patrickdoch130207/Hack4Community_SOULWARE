import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from 'react-native';


export default function PasswordResetRequestScreen({ navigation }) {
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);


const requestReset = async () => {
if (!email) return Alert.alert('Erreur', 'Entrez votre email');
setLoading(true);
try {
const res = await fetch('http://192.168.187.90:8000/api/users/password-reset/', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email }),
});
const data = await res.json();
if (res.ok) {
Alert.alert('Succès', 'Code envoyé à votre email');
navigation.navigate('PasswordResetConfirm', { email });
} else {
Alert.alert('Erreur', data.error || 'Impossible d\'envoyer le code');
}
} catch (e) {
Alert.alert('Erreur', 'Problème réseau');
} finally { setLoading(false); }
};


return (
<View style={styles.container}>
<Text style={styles.title}>Réinitialiser le mot de passe</Text>
<TextInput
style={styles.input}
placeholder="Votre email"
keyboardType="email-address"
autoCapitalize="none"
value={email}
onChangeText={setEmail}
/>
<TouchableOpacity style={styles.button} onPress={requestReset} disabled={loading}>
<Text style={styles.buttonText}>{loading ? 'Envoi...' : 'Envoyer le code'}</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: { flex:1, padding:20, justifyContent:'center' },
title: { fontSize:20, marginBottom:20, textAlign:'center' },
input: { borderWidth:1, padding:12, borderRadius:8, marginBottom:12 },
button: { padding:12, borderRadius:8, alignItems:'center', backgroundColor:'#2ecc71' },
buttonText: { color:'#fff', fontWeight:'600' }
});