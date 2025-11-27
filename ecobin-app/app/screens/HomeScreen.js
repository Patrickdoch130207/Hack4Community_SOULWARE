import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from "react-native";
import { useRef, useState } from "react";
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';


const RecyclingApp = ({navigation}) => {
    const [activeTab, setActiveTab] = useState('home');

// Animation pour l'icône
const scaleAnim = useRef({
  home: new Animated.Value(1),
  dashboard: new Animated.Value(1),
  map: new Animated.Value(1),
  blog: new Animated.Value(1),
  profile: new Animated.Value(1)
}).current;

const animateIcon = (tabName) => {
  // reset
  Object.keys(scaleAnim).forEach(key => {
    scaleAnim[key].setValue(1);
  });

  Animated.spring(scaleAnim[tabName], {
    toValue: 1.3,
    useNativeDriver: true
  }).start();

  setActiveTab(tabName);
};

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Salut, Éco-Warrior !</Text>
            <Text style={styles.welcome}>Bienvenue sur Le Guide du Recyclage Intelligent 🌱</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Actions Rapides */}
        <Text style={styles.sectionTitle}></Text>
        <View style={styles.quickActions}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.recycle]} onPress={() => { animateIcon("home");navigation.navigate('ImageCaptureScreen')}}>
              <FAIcon name="camera" size={24} color="#fff" />
              <Text style={styles.actionTitle}> Recycler</Text>
              <Text style={styles.actionSubtitle}>Prendre une photo pour identifier le déchet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.collect]}>
              <FAIcon name="trash" size={24} color="#fff" />
              <Text style={styles.actionTitle}> Collecter</Text>
              <Text style={styles.actionSubtitle}>Enregistrer les déchets prêts à être collectés</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.actionButton, styles.report]}>
              <FAIcon name="map-marker" size={24} color="#fff" />
              <Text style={styles.actionTitle}>Signaler un point</Text>
              <Text style={styles.actionSubtitle}>Ajouter ou signaler un point de collecte</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.map]}>
              <FAIcon name="map" size={24} color="#fff" />
              <Text style={styles.actionTitle}>Voir la carte</Text>
              <Text style={styles.actionSubtitle}>Consulter les points de collecte proches</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Éducative */}
        <View style={styles.educationSection}>
          <Text style={styles.sectionTitle}> Section Éducative</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <FAIcon name="lightbulb-o" size={20} color="#FFD700" />
              <Text style={styles.tipTitle}>Astuce du jour</Text>
            </View>
            <Text style={styles.tipText}>"Saviez-vous que le plastique PET se recycle jusqu'à 7 fois ?"</Text>
            <TouchableOpacity style={styles.seeMore}>
              <Text style={styles.seeMoreText}>Voir plus <FAIcon name="arrow-right" size={12} color={activeTab === "home" ? "#2E7D32" : "#666"} /></Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>Notifications / Alertes </Text>
          <View style={styles.notification}>
            <FAIcon name="globe" size={16} color="#4CAF50" />
            <Text style={styles.notificationText}>Nouveau point de collecte ouvert près de chez vous </Text>
          </View>
          <View style={styles.notification}>
            <FAIcon name="recycle" size={16} color="#2196F3" />
            <Text style={styles.notificationText}>Défi recyclage du jour : triez 5 déchets </Text>
          </View>
          <View style={styles.notification}>
            <FAIcon name="trophy" size={16} color="#FF9800" />
            <Text style={styles.notificationText}>Badge "Eco-Héros" débloqué ! </Text>
          </View>
        </View>
      </ScrollView>

     
    <View style={styles.footer}>
    <TouchableOpacity style={styles.navItem} onPress={() => animateIcon("home")}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.home }] }}>
        <FAIcon name="home" size={16} color={activeTab === "home" ? "#2E7D32" : "#666"} />
        </Animated.View>
        <Text style={styles.navText}>Accueil</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem} onPress={() => animateIcon("home")}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.home }] }}>
        <FAIcon name="bar-chart" size={16} color={activeTab === "home" ? "#2E7D32" : "#666"} />
        </Animated.View>
        <Text style={styles.navText}>Dashboard</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem} onPress={() => { animateIcon("home");navigation.navigate('ImageCaptureScreen')}}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.home }] }}>
        <FAIcon name="recycle" size={16} color={activeTab === "home" ? "#2E7D32" : "#666"} />
        </Animated.View>
        <Text style={styles.navText}>Recycler</Text>
    </TouchableOpacity>
        
    <TouchableOpacity style={styles.navItem} onPress={() => animateIcon("home")}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.home }] }}>
        <FAIcon name="newspaper-o" size={16} color={activeTab === "home" ? "#2E7D32" : "#666"} />
        </Animated.View>
        <Text style={styles.navText}>Blog</Text>
    </TouchableOpacity>
       
    <TouchableOpacity style={styles.navItem} onPress={() => animateIcon("home")}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.home }] }}>
        <FAIcon name="user" size={16} color={activeTab === "home" ? "#2E7D32" : "#666"} />
        </Animated.View>
        <Text style={styles.navText}>Profil</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.navItem} onPress={() =>{ animateIcon("home"); navigation.navigate('ChatScreens')}}>
        <Animated.View style={{ transform: [{ scale: scaleAnim.home }] }}>
        <FA5Icon name="robot" size={16} color={activeTab === "home" ? "#2E7D32" : "#666"} />
        </Animated.View>
        <Text style={styles.navText}>Chatbot</Text>
    </TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  welcome: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionButton: {
    flex: 0.48,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recycle: {
    backgroundColor: '#2E7D32', // Vert
  },
  collect: {
    backgroundColor: '#4FC3F7', // Bleu
  },
  report: {
    backgroundColor: '#F57C00', // Orange
  },
  map: {
    backgroundColor: '#009688', // Turquoise
  },
  actionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
  educationSection: {
    marginBottom: 20,
  },
  tipCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  seeMore: {
    alignSelf: 'flex-end',
  },
  seeMoreText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  notificationsSection: {
    marginBottom: 30,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default RecyclingApp;