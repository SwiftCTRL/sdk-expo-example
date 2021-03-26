import { Buffer } from 'buffer';
import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';

const { SwiftCTRLSDKModule } = NativeModules;

interface SwiftCTRLSDKInterface {
  initialize: (userToken: string, onInitialized: () => void) => void;
  registerForQRCode: (
    userToken: string,
    onQRCodeReceived: (qrByteArray: Uint8Array) => void
  ) => void;
  unregisterForQRCode: (userToken: string) => void;
  disconnect: () => void;
}

const eventEmitter = new NativeEventEmitter(SwiftCTRLSDKModule);
let qrCodeSubscription: EmitterSubscription;

const initialize = (userToken: string, onInitialized: () => void) => {
  const subscription = eventEmitter.addListener(
    'didFinishInitialization',
    () => {
      subscription.remove();
      onInitialized();
    }
  );

  SwiftCTRLSDKModule.initialize(userToken);
};

const registerForQRCode = (
  userToken: string,
  onQRCodeReceived: (value: Uint8Array) => void
) => {
  qrCodeSubscription = eventEmitter.addListener(
    'didReceiveQRCode',
    (value: string | Uint8Array) => {
      // If the value is in base64, decode it first
      const byteArray =
        typeof value === 'string' ? Buffer.from(value, 'base64') : value;
      onQRCodeReceived(byteArray);
    }
  );

  SwiftCTRLSDKModule.registerForQRCode(userToken);
};

const unregisterForQRCode = (userToken: string) => {
  qrCodeSubscription.remove();
  SwiftCTRLSDKModule.unregisterForQRCode(userToken);
};

export const SwiftCTRL: SwiftCTRLSDKInterface = {
  initialize,
  registerForQRCode,
  unregisterForQRCode,
  disconnect: SwiftCTRLSDKModule.disconnect,
};
