package com.sdkexpoexample;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.swiftctrl.sdk.SwiftCtrlCallback;
import com.swiftctrl.sdk.connector.SwiftCtrlManualClient;

import org.jetbrains.annotations.NotNull;

public class SwiftCTRLModule extends ReactContextBaseJavaModule implements @NotNull SwiftCtrlCallback {
    private SwiftCtrlManualClient client;

    SwiftCTRLModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public @NotNull String getName() {
        return "SwiftCTRLSDKModule";
    }

    @ReactMethod
    public void initialize(String userToken) {
        Log.d("Android Bridge", "initialize: " + userToken);

        ReactContext context = getReactApplicationContext();

        client = new SwiftCtrlManualClient(context, userToken, this);
        client.connect();
    }

    @ReactMethod
    public void registerForQRCode(String userToken) {
        Log.d("Android Bridge", "registerForQRCode: " + userToken);
        client.registerCryptoFeed();
    }

    @ReactMethod
    public void unregisterForQRCode(String userToken) {
        Log.d("Android Bridge", "unregisterForQRCode: " + userToken);
        client.unregisterCryptoFeed();
    }

    @ReactMethod
    public void disconnect() {
        Log.d("Android Bridge", "disconnect");
        client.disconnect();
    }

    @Override
    public void onSwiftCtrlReady() {
        Log.d("Android Bridge", "onSwiftCtrlReady");
        sendEvent("didFinishInitialization", null);
    }

    @Override
    public void onSwiftCtrlCrypto(@NotNull String base64, @NotNull byte[] bytes) {
        Log.d("Android Bridge", "onSwiftCtrlCrypto");
        sendEvent("didReceiveQRCode", base64);
    }

    @Override
    public void onSwiftCtrlError(@NotNull String s, @org.jetbrains.annotations.Nullable Exception e) {
        Log.e("Android Bridge", "onSwiftCtrlError", e);
    }

    private void sendEvent(String eventName, @Nullable Object param) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, param);
    }
}