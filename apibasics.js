myVRApp.prototype.queryVRDevices = function() {

       // Polyfill - hide FF/Webkit differences
       var getVRDevices = navigator.mozGetVRDevices /* FF */ ||
                           navigator.getVRDevices; /* webkit */

       if (!getVRDevices) {
            // handle error here, either via throwing an exception or
            // calling an error callback
       }

       var self = this;
       getVRDevices().then( gotVRDevices );
       function gotVRDevices( devices ) {
            // Look for HMDVRDevice (display) first
            var vrHMD;
            var error;
            for ( var i = 0; i < devices.length; ++i ) {
                if ( devices[i] instanceof HMDVRDevice ) {
                    vrHMD = devices[i];
                    self._vrHMD = vrHMD;
                    if ( vrHMD.getEyeParameters ) {
                      self.left = vrHMD.getEyeParameters( "left" );
                      self.right = vrHMD.getEyeParameters( "right" );
                    }
                    else {
                      self.left = {
                        renderRect: vrHMD.getRecommendedEyeRenderRect( "left" ),
                        eyeTranslation: vrHMD.getEyeTranslation( "left" ),
                        recommendedFieldOfView: vrHMD.getRecommendedEyeFieldOfView(
                            "left" )
                      };
                      self.right = {
                        renderRect: vrHMD.getRecommendedEyeRenderRect( "right" ),
                        eyeTranslation: vrHMD.getEyeTranslation( "right" ),
                        recommendedFieldOfView: vrHMD.getRecommendedEyeFieldOfView(
                            "right" )
                      };
                    }
                    self.leftEyeTranslation = vrHMD.getEyeTranslation( "left" );
                    self.rightEyeTranslation = vrHMD.getEyeTranslation( "right" );
                    self.leftEyeFOV = vrHMD.getRecommendedEyeFieldOfView( "left" );
                    self.rightEyeFOV = vrHMD.getRecommendedEyeFieldOfView( "right" );
                    break; // We keep the first we encounter
                }
            }

            // Now look for PositionSensorVRDevice (head tracking)
            var vrInput;
            var error;
            for ( var i = 0; i < devices.length; ++i ) {
                if ( devices[i] instanceof PositionSensorVRDevice ) {
                    vrInput = devices[i]
                    self._vrInput = vrInput;
                    break; // We keep the first we encounter
                }
            }

       }
    }

  myVRApp.prototype.goFullScreen = function() {

    var vrHMD = this._vrHMD;

    // this._canvas is an HTML5 canvas element
    var canvas = this._canvas;

    // Polyfill - hide FF/Webkit differences
    function requestFullScreen() {
        if ( canvas.mozRequestFullScreen ) {
         canvas.mozRequestFullScreen( { vrDisplay: vrHMD } );
        } else {
         canvas.webkitRequestFullscreen( { vrDisplay: vrHMD } );
     }
    }

    requestFullScreen();
}

myVRApp.prototype.update = function() {

        var vrInput = this._vrInput;
        var vrState = vrInput.getState();

        if ( !vrState ) {
            return;
        }

        // Update the camera's position and orientation
        if ( vrState.position !== null ) {
            this.setCameraPosition( vrState.position );
        }

        if ( vrState.orientation !== null ) {
            this.setCameraOrientation( vrState.orientation );
        }

}

