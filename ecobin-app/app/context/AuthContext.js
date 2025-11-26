import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginRequest } from '../services/api';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await loginRequest(email, password);
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('token', data.access);
        setUserToken(data.access);
      } else {
        Alert.alert("Erreur", data.error || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      Alert.alert("Erreur réseau");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
  };

  const isLoggedIn = async () => {
    const token = await AsyncStorage.getItem('token');
    setUserToken(token);
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};
