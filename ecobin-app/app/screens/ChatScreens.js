import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [message, setMessage] = useState("");

  const messages = [
    { id: '1', text: "Bonjour 👋", sender: "other" },
    { id: '2', text: "Salut, ça va ?", sender: "me" },
    { id: '3', text: "Oui très bien et toi ?", sender: "other" },
  ];

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === "me" ? styles.myMessage : styles.otherMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://cdn.pixabay.com/photo/2021/08/10/16/31/chatbot-6534483_1280.png" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>John Doe</Text>
          <Text style={styles.status}>En ligne</Text>
        </View>
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatArea}
      />

      {/* INPUT */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Écrire un message..."
            style={styles.input}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecfdf5',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#22c55e',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },

  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  status: {
    color: '#dcfce7',
    fontSize: 13,
  },

  chatArea: {
    padding: 15,
  },

  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
  },

  myMessage: {
    backgroundColor: '#22c55e',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 3,
  },

  otherMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 3,
  },

  messageText: {
    color: '#1f2933',
    fontSize: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 15,
  },

  sendButton: {
    backgroundColor: '#22c55e',
    width: 45,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 3,
  },
});
