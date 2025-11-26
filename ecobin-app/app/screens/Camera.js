import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function SmartCameraScreen() {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  if (!permission?.granted) {
    return <Text style={{textAlign:'center', marginTop:50}}>Autorise la caméra</Text>;
  }

  const takePhoto = async () => {
    const data = await cameraRef.current.takePictureAsync({ quality: 0.7 });
    setPhoto(data.uri);
  };

  const analyzeWaste = async () => {
    setLoading(true);

    let formData = new FormData();
    formData.append('image', {
      uri: photo,
      name: 'waste.jpg',
      type: 'image/jpeg'
    });

    try {
      const res = await fetch('http://TON_BACKEND/api/analyze-waste/', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>

      {!photo ? (
        <CameraView ref={cameraRef} style={styles.camera}>
          <View style={styles.scanFrame} />
          <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} />
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />

          {loading && <ActivityIndicator size="large" color="#2E7D32" />}

          {!result ? (
            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)}>
                <Text style={styles.buttonText}>Reprendre</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonPrimary} onPress={analyzeWaste}>
                <Text style={styles.buttonText}>Analyser</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.resultBox}>
              <Text style={styles.resultTitle}>Déchet identifié :</Text>
              <Text style={styles.resultValue}>{result.type}</Text>
              <Text style={styles.resultAdvice}>{result.advice}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  controls: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureBtn: {
    width: 70,
    height: 70,
    backgroundColor: '#2E7D32',
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#fff'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 8
  },
  text: { color: '#fff' }
});
