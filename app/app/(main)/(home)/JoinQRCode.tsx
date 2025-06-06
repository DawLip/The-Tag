import { StyleSheet, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState, useRef } from 'react';
import { joinLobby } from '@/store/slices/gameSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useSocket } from '@/socket/socket';

export default function JoinQRCodeScreen() {
  const router = useRouter();
  const socket = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  const handleCodeScanned = (gameCode: string) => {
    console.log('=== Join lobby ===');
    if (!gameCode) {
      console.error('No game code received');
      return;
    }

    socket?.emit('join_lobby', { gameCode }, (response: any) => {
      if (response.status !== 'SUCCESS') {
        console.error('Error joining lobby:', response.status, response.message);
        return;
      }
      
      console.log('Joined successfully:', response);
      dispatch(joinLobby(response.game));
      router.replace('/(lobby)/(players)/Players');
    });
  };

  return (
    <View style={styles.screenContainer}>
      <QRCodeScanner onCodeScanned={handleCodeScanned} />
    </View>
  );
}

const QRCodeScanner = ({ onCodeScanned }: { onCodeScanned: (code: string) => void }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    const getPermissions = async () => {
      await requestPermission();
    };
    getPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned && data) {
      setScanned(true);
      onCodeScanned(data);
      // Reset scanning after 2 seconds
      setTimeout(() => setScanned(false), 2000);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff', // Replace with your bg-bgc color
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});