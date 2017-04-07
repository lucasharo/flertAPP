/* ModusEcho.h */

#import <Cordova/CDV.h>

@interface ImageCropResizer : CDVPlugin {
  NSString* callbackID;
}

@property (nonatomic, copy) NSString* callbackID;

//- (void)echo:(CDVInvokedUrlCommand*)command;
- (void)cropResize:(CDVInvokedUrlCommand*)command;

@end