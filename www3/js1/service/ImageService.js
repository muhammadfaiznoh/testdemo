(function () {
    var _module = angular.module('ImageService', []);
    _module.factory('ImageService', function ($cordovaCamera, FileService, $q, $cordovaFile) {
        //        function makeid() {
        //            var text = '';
        //            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        //
        //            for (var i = 0; i < 5; i++) {
        //                text += possible.charAt(Math.floor(Math.random() * possible.length));
        //            }
        //            return text;
        //        };

        function optionsForType(type) {
            var source;
            switch (type) {
            case 0:
                source = Camera.PictureSourceType.CAMERA;
                break;
            case 1:
                source = Camera.PictureSourceType.PHOTOLIBRARY;
                break;
            }
            return {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: source,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };
        }

        function saveMedia(type) {
            console.log("imgURI : ", $scope.imgURI);
            return $q(function (resolve, reject) {
                var options = optionsForType(type);

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            })
        }
        return {
            handleMediaDialog: saveMedia
        }
    });
}());