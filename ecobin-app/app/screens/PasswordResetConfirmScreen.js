import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Alert, StyleSheet} from 'react-native';


export default function PasswordResetConfirmScreen({ route, navigation }) {
const { email } = route.params || {};
const [code, setCode] = useState('');
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');
const [loading, setLoading] = useState(false);


const submit = async () => {
if (!code || !password) return Alert.alert('Erreur', 'Remplissez tous les champs');
if (password !== confirm) return Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
setLoading(true);
try {
const res = await fetch('http://192.168.187.90:8000/api/users/password-reset-confirm/', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email, code, new_password: password }),
});
const data = await res.json();
if (res.ok) {
Alert.alert('Succès', 'Mot de passe réinitialisé');
navigation.popToTop();
} else {
Alert.alert('Erreur', data.error || 'Impossible de réinitialiser');
}
} catch (e) {
Alert.alert('Erreur', 'Problème réseau');
} finally { setLoading(false); }
};


return (
<View style={styles.container}>
<Text style={styles.title}>Entrez le code et le nouveau mot de passe</Text>
<TextInput style={styles.input} placeholder="Code" value={code} onChangeText={setCode} />
<TextInput style={styles.input} placeholder="Nouveau mot de passe" secureTextEntry value={password} onChangeText={setPassword} />
<TextInput style={styles.input} placeholder="Confirmer mot de passe" secureTextEntry value={confirm} onChangeText={setConfirm} />
<TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
<Text style={styles.buttonText}>{loading ? 'En cours...' : 'Réinitialiser'}</Text>
</TouchableOpacity>
</View>
);
}


const styles = StyleSheet.create({
container: { flex:1, padding:20, justifyContent:'center' },
title: { fontSize:18, marginBottom:16, textAlign:'center' },
input: { borderWidth:1, padding:12, borderRadius:8, marginBottom:12 },
button: { padding:12, borderRadius:8, alignItems:'center', backgroundColor:'#2ecc71' },
buttonText: { color:'#fff', fontWeight:'600' }
});