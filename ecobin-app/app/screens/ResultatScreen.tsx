import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 

// 1. Définition du type TypeScript pour les données reçues
interface AnalyseData {
  classe_detectee: string;
  type_de_dechet: string;
  recyclable: boolean;
  action_a_faire: string;
  confiance_modele: number;
}

const AnalyseResultat = ({ navigation }) => {
    
    const route = useRoute();
    
    const data = route.params?.classificationData as AnalyseData | undefined;

    if (!data) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                    <Text style={[styles.titre, { fontSize: 20 }]}>Données de classification manquantes</Text>
                    <Text style={styles.valeur}>Veuillez retourner à la page précédente pour lancer une nouvelle analyse.</Text>
                    <TouchableOpacity 
                        style={[styles.boutonPrimaire, { marginTop: 30, backgroundColor: '#6C757D' }]} 
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.boutonTexte}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
  
    const onNouvelleAnalyse = () => {
        // Retourne à l'écran précédent (ImageCaptureScreen)
        navigation.goBack(); 
    };
    
    const onRechercheCollecte = () => {
        Alert.alert("Fonctionnalité Future", "La recherche de points de collecte sera implémentée prochainement !");
    };


    // 4. Rendu du composant
    const confianceFormatee = (data.confiance_modele * 100).toFixed(1) + '%';
    const couleurRecyclable = data.recyclable ? '#4CAF50' : '#F44336'; 

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <ScrollView contentContainerStyle={styles.container}>
            {/* Espace supplémentaire en haut pour descendre le contenu */}
            <View style={styles.espaceHaut}></View>
            
            <Text style={styles.titre}>Résultat de l'Analyse </Text>

            <View style={styles.card}>
                {/* --- Section RÉSULTAT PRINCIPAL --- */}
                <View style={[styles.resultRow, { marginBottom: 15 }]}>
                    <Text style={styles.label}>DECHET DÉTECTÉ :</Text>
                    <Text style={styles.valeurPrincipale}>{data.classe_detectee}</Text>
                </View>

                {/* --- Section TYPE ET RECYCLABILITÉ --- */}
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Type Spécifique :</Text>
                    <Text style={styles.valeur}>
                        {data.type_de_dechet}
                    </Text>
                </View>

                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Recyclable :</Text>
                    <Text style={[styles.valeur, { color: couleurRecyclable, fontWeight: 'bold' }]}>
                        {data.recyclable ? 'OUI' : 'NON'}
                    </Text>
                </View>
                
                {/* --- Section ACTION À FAIRE (L'information la plus importante) --- */}
                <View style={[styles.infoBlock, styles.consigneBlock]}>
                    <Text style={styles.label}>INSTRUCTION DE TRI :</Text>
                    <Text style={styles.consigne}>
                        {data.action_a_faire}
                    </Text>
                </View>

                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Confiance du Modèle :</Text>
                    <Text style={styles.valeur}>{confianceFormatee}</Text>
                </View>
            </View>

            {/* --- Section BOUTONS D'ACTIONS --- */}
            <View style={styles.boutonsContainer}>
                <TouchableOpacity 
                    style={styles.boutonPrimaire} 
                    onPress={onNouvelleAnalyse}
                >
                    <AntDesign name="camera" size={20} color="#FFFFFF" />
                    <Text style={styles.boutonTexte}>Nouvelle Analyse</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.boutonSecondaire} 
                    onPress={onRechercheCollecte}
                >
                    <MaterialIcons name="location-on" size={20} color="#3F51B5" />
                    <Text style={[styles.boutonTexte, styles.texteSecondaire]}>Trouver un point de collecte</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

// 5. Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
    flexGrow: 1,
    justifyContent: 'center', // Centre le contenu verticalement
  },
  espaceHaut: {
    height: 30, // Espace supplémentaire en haut pour descendre le contenu
  },
  titre: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 30,
  },
  resultRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  valeurPrincipale: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3F51B5', // Couleur d'accentuation (Bleu)
    textAlign: 'center',
    marginTop: 5,
  },
  infoBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  consigneBlock: {
    borderBottomWidth: 0,
    flexDirection: 'column',
    marginTop: 15,
    paddingBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#777',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  valeur: {
    fontSize: 16,
    color: '#333',
    maxWidth: '50%', // Limite la largeur pour l'alignement
    textAlign: 'right', // Assure que le texte se colle à droite
  },
  consigne: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
    lineHeight: 25,
  },
  boutonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  boutonPrimaire: {
    flex: 1,
    backgroundColor: '#2E7D32', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  boutonSecondaire: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#3F51B5',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  boutonTexte: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  texteSecondaire: {
    color: '#3F51B5',
  }
});

export default AnalyseResultat; 