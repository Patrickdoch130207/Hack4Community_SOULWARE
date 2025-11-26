import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import MyCamera from "./screens/Camera";  
import ChatScreens from "./screens/ChatScreens";
import ImageCaptureScreen  from "./screens/ImageUploading";





const Stack = createNativeStackNavigator();

export default function App(){
    return (
      
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} /> 
          <Stack.Screen name="Home" component={HomeScreen} /> 
          <Stack.Screen name="Camera" component={MyCamera} /> 
          <Stack.Screen name="ChatScreens" component={ChatScreens} />   
          <Stack.Screen name="ImageCaptureScreen" component={ImageCaptureScreen}/>
        </Stack.Navigator>
      
      
    
    )
}