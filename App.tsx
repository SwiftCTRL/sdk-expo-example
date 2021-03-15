import QRCode from 'qrcode';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { SwiftCTRL } from './SwiftCTRL';

// TODO: Obtain a user token and set it here
const userToken = '<ADD_YOUR_USER_TOKEN>';

export default function App() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [qrXml, setQrXml] = useState<string>('');

  const initialize = () => {
    SwiftCTRL.initialize(userToken, () => {
      // Start listening for QR code updates
      setInitialized(true);
      SwiftCTRL.registerForQRCode(userToken, (qrByteArray) => {
        // Encode the byte array as an SVG
        QRCode.toString(
          [
            {
              // @ts-ignore
              data: qrByteArray,
              mode: 'byte',
            },
          ],
          {
            version: 5,
            errorCorrectionLevel: 'M',
            type: 'utf8',
          }
        )
          .then(setQrXml)
          .catch((err) => console.error(err));
      });
    });
  };

  const disconnect = () => {
    SwiftCTRL.unregisterForQRCode(userToken);
    SwiftCTRL.disconnect();

    setInitialized(false);
    setQrXml('');
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
  if (qrXml === '') {
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
      <SvgXml style={styles.qrCode} xml={qrXml} />
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
