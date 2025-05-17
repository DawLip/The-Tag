import React from 'react';
import { Text, Linking, StyleSheet, View } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default function MyScanner() {
  const onSuccess = (e: { data: string }) => {
    alert(`QR code: ${e.data}`);
    // Możesz np. otworzyć link:
    Linking.openURL(e.data).catch(() => {
      alert('Cannot open URL');
    });
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      topContent={<Text style={styles.centerText}>Scan QR code</Text>}
      bottomContent={<Text style={styles.centerText}>Point the camera at a QR code</Text>}
    />
  );
}

const styles = StyleSheet.create({
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#777',
    textAlign: 'center',
  },
});