import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Keyboard,
  Modal, // <-- Ajouté
  TouchableWithoutFeedback // <-- Ajouté
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import FAIcon from 'react-native-vector-icons/FontAwesome';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  // const [showQuickActions, setShowQuickActions] = useState(false); // Non utilisé/retiré
  const [menuVisible, setMenuVisible] = useState(false);  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour! Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const scrollViewRef = useRef();

  // Les données sont conservées, mais le rendu des actions rapides change
  const quickActions = [
    { id: 1, icon: 'image', title: 'Identifier un déchet', color: '#2E7D32' },
    { id: 2, icon: 'lightbulb-o', title: 'Conseils recyclage', color: '#F57C00' },
    { id: 3, icon: 'tasks', title: 'Défi du jour', color: '#4FC3F7' },
    { id: 4, icon: 'language', title: 'Traduire', color: '#009688' }
  ];

  const handleQuickAction = (action) => {
    setMenuVisible(false); // Fermer le menu après la sélection
    let response = '';
    switch(action.title) {
      case 'Identifier un déchet':
        response = "Prenez une photo du déchet et je vous dirai comment le recycler correctement !";
        break;
      case 'Conseils recyclage':
        response = "Voici un conseil : Le plastique PET (bouteilles d'eau) se recycle très bien. Retirez les bouchons !";
        break;
      case 'Défi du jour':
        response = "Votre défi : Triez 5 déchets plastiques aujourd'hui. Vous gagnerez 10 points EcoScore !";
        break;
      case 'Traduire':
        response = "Je peux vous aider à traduire des termes de recyclage. Que souhaitez-vous traduire ?";
        break;
      default:
        response = "Je suis là pour vous aider avec le recyclage !";
    }

    const newUserMessage = { id: messages.length + 1, text: action.title, sender: 'user', timestamp: new Date() };
    const newBotMessage = { id: messages.length + 2, text: response, sender: 'bot', timestamp: new Date() };
    setMessages(prev => [...prev, newUserMessage, newBotMessage]);
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const userMessage = { id: Date.now(), text: message, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    try {
      const response = await fetch("http://192.168.1.243:8000/api/users/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await response.json();
      // Assurez-vous que la réponse du bot est bien data.reply comme dans l'original
      const botMessage = { id: Date.now() + 1, text: data.reply, sender: 'bot', timestamp: new Date() }; 
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { id: Date.now() + 2, text: "Erreur bot : impossible de joindre le serveur.", sender: 'bot', timestamp: new Date() };
      setMessages(prev => [...prev, errorMessage]);
      console.error(error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <View style={[styles.messageContent, item.sender === 'user' ? styles.userContent : styles.botContent]}>
        <Text style={[styles.messageText, item.sender === 'user' ? styles.userText : styles.botText]}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FA5Icon name="robot" size={20} color="#2E7D32" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Assistant Recyclage</Text>
            <Text style={styles.headerSubtitle}>En ligne • IA Écologique</Text>
          </View>
        </View>
      </View>

    <FlatList
        ref={scrollViewRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ padding: 15, paddingBottom: 100 }}
    />

    <KeyboardAvoidingView style={styles.content} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
        
        {/* L'ancienne zone des actions rapides a été retirée pour le menu */}

        {/* Zone de saisie */}
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Posez-moi une question sur le recyclage..."
                placeholderTextColor="#999"
                multiline
            />
            
            {/* Bouton Menu pour les actions rapides (comme dans Bot.tsx) */}
            <TouchableOpacity 
                style={[styles.menuButton]}
                onPress={() => setMenuVisible(true)}
            > 
                <FAIcon name="ellipsis-v" size={22} color="#555" />
            </TouchableOpacity>


            <TouchableOpacity 
                style={[styles.sendButton, !message && styles.sendButtonDisabled]} // Ajout du style disabled
                onPress={sendMessage} 
                disabled={!message}
            >
                <FAIcon name="send" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>

    {/* Modal pour les actions rapides (copié de Bot.tsx) */}
    <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
    >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.modalOverlay}></View>
        </TouchableWithoutFeedback>

        <View style={styles.menuDropdown}>
            {quickActions.map((action) => (
                <TouchableOpacity 
                    key={action.id}
                    style={styles.menuItem}
                    onPress={() => handleQuickAction(action)}
                >
                    <FAIcon name={action.icon} size={16} color={action.color} />
                    <Text style={styles.menuItemText}>{action.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </Modal>
      
    </SafeAreaView>
  );
}

// Les styles de Bot.tsx ont été appliqués ici
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20, // Ajusté de Bot.tsx
        paddingVertical: 15, // Ajusté de Bot.tsx
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    content: {
        flex: 1,
    },
    // Le chatContainer n'est pas utilisé dans ChatScreens.js (car il utilise FlatList)
    
    messageBubble: {
        marginVertical: 5,
        maxWidth: '80%',
    },
    botMessage: {
        alignSelf: 'flex-start',
    },
    userMessage: {
        alignSelf: 'flex-end',
    },
    messageContent: {
        padding: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    botContent: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 5,
    },
    userContent: {
        backgroundColor: '#2E7D32',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    botText: {
        color: '#333',
    },
    userText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 11,
        color: '#999',
        marginTop: 5,
        alignSelf: 'flex-end',
    },

    // Styles Input et boutons de Bot.tsx
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2E7D32',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    menuButton: { // Nouveau style pour le bouton de menu
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
    },

    // Styles du Modal de Bot.tsx
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuDropdown: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        width: 200,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuItemText: {
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
});