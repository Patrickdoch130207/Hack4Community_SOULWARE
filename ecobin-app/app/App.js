import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen'; 
import ChatScreens from "./screens/ChatScreens";
import ImageCaptureScreen  from "./screens/ImageUploading";
import AnalyseResultat from "./screens/ResultatScreen";
import PasswordResetRequestScreen from "./screens/PasswordResetRequestScreen";
import PasswordResetConfirmScreen from "./screens/PasswordResetConfirmScreen";
import VerifyCodeScreen from "./screens/EmailVerification";






const Stack = createNativeStackNavigator();

export default function App(){
    return (
      
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} /> 
          <Stack.Screen name="Home" component={HomeScreen} /> 
          <Stack.Screen name="ChatScreens" component={ChatScreens} />   
          <Stack.Screen name="ImageCaptureScreen" component={ImageCaptureScreen}/>
          <Stack.Screen name="AnalyseResultat" component={AnalyseResultat}/>
          <Stack.Screen name="PasswordResetRequest" component={PasswordResetRequestScreen} />
          <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirmScreen} />
          <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
        </Stack.Navigator>
      
      
    
    )
}