import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

const { SwiftCTRLSDKModule } = NativeModules;

interface SwiftCTRLSDKInterface {
  initialize: (userToken: string, onInitialized: () => void) => void;
  registerForQRCode: (
    userToken: string,
    onQRCodeReceived: (base64Image: string) => void
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
  onQRCodeReceived: (base64Image: string) => void
) => {
  qrCodeSubscription = eventEmitter.addListener(
    'didReceiveQRCode',
    onQRCodeReceived
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
