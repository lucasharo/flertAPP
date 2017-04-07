var exec = require('cordova/exec');

exports.cropResize = function(success, fail, imageData, width, height, options) {
  if (!options) {
    options = {};
  }
  
  var params = {
    data: imageData,
    width: width ? width : 0,
    height: height ? height : 0,
    format: options.format ? options.format : "jpg",
    quality: options.quality ? options.quality : 75
  }
  
  exec(success, fail, "ImageCropResizer", "cropResize", [params]);
}
