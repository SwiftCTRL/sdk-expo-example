#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCTSwiftCTRLSDKModule : RCTEventEmitter <RCTBridgeModule, SwiftCtrlObserver>

@end
