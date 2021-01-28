import React, { useState } from 'react';
import { StyleSheet, View, Button, Image, Text } from 'react-native';
import { SwiftCTRL } from './SwiftCTRL';

// TODO: Obtain a user token and set it here
const userToken = '<ADD_YOUR_USER_TOKEN>';

export default function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [qrCodeString, setQRCodeString] = useState<string>('');

  const initialize = () => {
    SwiftCTRL.initialize(userToken, () => {
      // Start listening for QR code updates
      setInitialized(true);
      SwiftCTRL.registerForQRCode(userToken, setQRCodeString);
    });
  };

  const disconnect = () => {
    SwiftCTRL.unregisterForQRCode(userToken);
    SwiftCTRL.disconnect();

    setInitialized(false);
    setQRCodeString('');
  };

  if (!initialized) {
    return (
      <View style={styles.container}>
        <Button
          title="Tap to initialize with user token"
          onPress={initialize}
        />
      </View>
    );
  }

  {
    /* initialized, waiting for the first QR code to come in */
  }
  if (qrCodeString === '') {
    return (
      <View style={styles.container}>
        <Text>Waiting to receive QR code...</Text>
      </View>
    );
  }

  {
    /* we have the QR code, we can now display it */
  }
  return (
    <View style={styles.container}>
      <Image
        style={styles.qrCode}
        source={{ uri: 'data:image/jpg;base64,' + qrCodeString }}
      />
      <Button title="Tap to disconnect" onPress={disconnect} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 300,
    height: 300,
  },
});
