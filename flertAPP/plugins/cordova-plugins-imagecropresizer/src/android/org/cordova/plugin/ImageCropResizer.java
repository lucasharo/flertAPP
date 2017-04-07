package org.cordova.plugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;

import java.net.URI;
import java.net.URISyntaxException;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.util.DisplayMetrics;

public class ImageCropResizer extends CordovaPlugin {
	@Override
	public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    JSONObject params = args.getJSONObject(0);
		if ("cropResize".equals(action)) {
      //echo("cropResize called", callbackContext);
      CropResizeImage resizeImage = new CropResizeImage(params, callbackContext);
      cordova.getThreadPool().execute(resizeImage);
      return true;
		}
    Log.e("PLUGIN", "unknown action");
    return false;
	}

/*
	private void echo(String msg, CallbackContext callbackContext) {
		if (msg == null || msg.length() == 0) {
      Toast.makeText(webView.getContext(), "Empty message", Toast.LENGTH_LONG).show();
			callbackContext.error("Empty message!");
		} else {
			Toast.makeText(webView.getContext(), msg, Toast.LENGTH_LONG).show();
			callbackContext.success(msg);
		}
*/

    private class CropResizeImage implements Runnable {
      
      protected JSONObject params;
      protected CallbackContext callbackContext;
      protected int width;
      protected int height;
      protected String format;
      protected String imageData;
      
      public CropResizeImage(JSONObject params, CallbackContext callbackContext) throws JSONException {
        this.params = params;
        this.callbackContext = callbackContext;
        this.imageData = params.getString("data");
        this.width = params.getInt("width");
        this.height = params.getInt("height");
        this.format = "jpg";
        if (params.has("format")) {
            this.format = params.getString("format");
        }
      }
        
      @Override
      public void run() {
        try {
          BitmapFactory.Options options = new BitmapFactory.Options();
          Bitmap bmp = getBitmap(this.imageData , options);
          if (bmp == null) {
            throw new IOException("The image file could not be opened.");
          }
                            
          bmp = scaleCropToFit(bmp,this.width,this.height);
                  
          int quality = params.getInt("quality");
          ByteArrayOutputStream baos = new ByteArrayOutputStream();
          if (format.equals("png")) {
            bmp.compress(Bitmap.CompressFormat.PNG, quality, baos);
          } else {
            bmp.compress(Bitmap.CompressFormat.JPEG, quality, baos);
          }
          byte[] b = baos.toByteArray();
          String returnString = Base64.encodeToString(b, Base64.NO_WRAP);
          // return object
          JSONObject res = new JSONObject();
          res.put("imageData", returnString);
          res.put("width", bmp.getWidth());
          res.put("height", bmp.getHeight());
          callbackContext.success(res);

        } catch (JSONException e) {
          Log.d("PLUGIN", e.getMessage());
          callbackContext.error(e.getMessage());
        } catch (IOException e) {
          Log.d("PLUGIN", e.getMessage());
          callbackContext.error(e.getMessage());
        } catch (URISyntaxException e) {
          Log.d("PLUGIN", e.getMessage());
          callbackContext.error(e.getMessage());
        }
      }
        
      private Bitmap getBitmap(String imageData,BitmapFactory.Options options) throws IOException, URISyntaxException {
        Bitmap bmp;
        byte[] blob = Base64.decode(imageData, Base64.DEFAULT);
        bmp = BitmapFactory.decodeByteArray(blob, 0, blob.length, options);
        return bmp;
      }
              
      private Bitmap scaleCropToFit(Bitmap original, int targetWidth, int targetHeight) {
        //Need to scale the image, keeping the aspect ration first
        int width = original.getWidth();
        int height = original.getHeight();

        float widthScale = (float) targetWidth / (float) width;
        float heightScale = (float) targetHeight / (float) height;
        float scaledWidth;
        float scaledHeight;

        int startY = 0;
        int startX = 0;

        if (widthScale > heightScale) {
          scaledWidth = targetWidth;
          scaledHeight = height * widthScale;
          //crop height by...
          startY = (int) ((scaledHeight - targetHeight) / 2);
        } else {
          scaledHeight = targetHeight;
          scaledWidth = width * heightScale;
          //crop width by..
          startX = (int) ((scaledWidth - targetWidth) / 2);
        }

        Bitmap scaledBitmap = Bitmap.createScaledBitmap(original, (int) scaledWidth, (int) scaledHeight, true);
        Bitmap resizedBitmap = Bitmap.createBitmap(scaledBitmap, startX, startY, targetWidth, targetHeight);
        return resizedBitmap;
      }                
    }
}
