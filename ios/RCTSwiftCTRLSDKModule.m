#import <React/RCTLog.h>
#import <SwiftCTRLSDK/SwiftCTRLSDK.h>
#import "RCTSwiftCTRLSDKModule.h"

@implementation RCTSwiftCTRLSDKModule

-(NSArray<NSString *> *)supportedEvents {
  return @[@"didFinishInitialization", @"didReceiveQRCode"];
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize:(NSString *)token)
{
  RCTLogInfo(@"Bridge: initialize");
  [SwiftCtrl.shared initializeWith:token delegate:self];
}

RCT_EXPORT_METHOD(registerForQRCode:(NSString *)userToken)
{
  RCTLogInfo(@"Bridge: registerForQRCode");
  [SwiftCtrl.shared registerForQRCodeWithUserToken:userToken];
}

RCT_EXPORT_METHOD(unregisterForQRCode:(NSString *)userToken)
{
  RCTLogInfo(@"Bridge: unregisterForQRCode");
  [SwiftCtrl.shared unregisterForQRCodeWithUserToken:userToken];
}

RCT_EXPORT_METHOD(disconnect)
{
  RCTLogInfo(@"Bridge: disconnect");
  [SwiftCtrl.shared disconnect];
}

- (void)didFinishInitialization {
  RCTLogInfo(@"Bridge: didFinishInitialization");
  [self sendEventWithName:@"didFinishInitialization" body:@{}];
}

- (void)didReceiveQRCodeWithQrBase64Image:(NSString * _Nonnull)qrBase64Image {
  RCTLogInfo(@"Bridge: didReceiveQRCodeWithQrBase64Image");
}

- (void)didReceiveQRCodeWithQrView:(UIImageView * _Nonnull)qrView {
  RCTLogInfo(@"Bridge: didReceiveQRCodeWithQrView");
}

- (void)didReceiveQRCodeWithQrBytesArray:(NSArray<NSNumber *> * _Nonnull)qrBytesArray {
  RCTLogInfo(@"Bridge: didReceiveQRCodeWithQrBytesArray");
  [self sendEventWithName:@"didReceiveQRCode" body:qrBytesArray];
}

- (void)reportErrorWithError:(NSError * _Nonnull)error {
  RCTLogInfo(@"Bridge: reportErrorWithError: %@", error);
}

@end
