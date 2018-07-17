(function () {
    var _module = angular.module('controller');
    _module.controller('SignUpCtrl', function ($scope, ControllerBase, u, App, $http, $ionicActionSheet, ImageService, $cordovaCamera) {
        ControllerBase($scope, 'signup');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        var currentPlatform = ionic.Platform.platform();
        console.log("platform", currentPlatform);
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.userNew = {};
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.data = {};

            }
        });
        $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
            $scope.userNew = {};
            if (['none', 'forward', 'swap', 'back'].indexOf(state.direction) >= 0) {
                $scope.data = {};
                $scope.clearFields();
            }
        });


        $scope.clearFields = function () {
            document.getElementById("txtName").value = "";
            document.getElementById("txtEmail").value = "";
            document.getElementById("txtNum").value = "";
            document.getElementById("txtPass").value = "";
            $scope.imgURI = undefined;
        }
        $scope.actionBack = function () {
            u.$state.go('home');
        }
        $scope.addMedia = function () {
            $scope.hideSheet = $ionicActionSheet.show({
                buttons: [
                    {
                        text: 'Take photo'
                                    },
                    {
                        text: 'Photo from library'
                                    }
                      ],
                titleText: 'Add images',
                cancelText: 'Cancel',
                buttonClicked: function (index) {
                    $scope.takePicture(index);
                }
            });
        }


        $scope.takePicture = function (type) {
            $scope.hideSheet();
            var source;
            var save;
            if (type == 0) {
                source = Camera.PictureSourceType.CAMERA;
                save = true;
            } else if (type == 1) {
                source = Camera.PictureSourceType.PHOTOLIBRARY;
                save = false;
            }
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: source,
                allowEdit: false,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 250,
                targetHeight: 250,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: save
            };
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = imageData;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        }




        $scope.actionSignUp = function (name, password, email, mobileno) {
            swal({
                title: "Start Signup",
                text: "Start",
                type: "info",
                showConfirmButton: true,
                confirmButtonColor: "#F99F1E"
            });
            //            u.showLoading('Loading...').then(function(){
            $scope.data.name = name;
            $scope.data.email = email;
            $scope.data.password = password;
            $scope.data.mobileno = mobileno;
            $scope.data.device = currentPlatform;
            $scope.data.image = $scope.imgURI;

             
            
            var vpassword = new RegExp("^[a-zA-Z0-9]{6,10}$"); // regexp 6~10 alphanumeric caharacter only
            
          
            
            if ($scope.data.name == "" || $scope.data.email == "" || $scope.data.password == "" || $scope.data.mobileno == "" ) {
                swal({
                    title: "Error",
                    text: "Please fill all fields!",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
                });
                
            } else if ($scope.data.name == undefined || $scope.data.email == undefined || $scope.data.password == undefined || $scope.data.mobileno == undefined ) {
                swal({
                    title: "Error",
                    text: "Please fill all fields!",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
                });

            } else if (vpassword.test($scope.data.password) == false ) {
                swal({
                    title: "Error",
                    text: "Please re-enter password with 6~10 alphanumeric character!",
                    type: "error",
                    showConfirmButton: true,
                    confirmButtonColor: "#F99F1E"
             });    
            } else {
                $scope.data.vCode = Math.round(Math.random() * (99999 - 10000));
                var x2js = new X2JS();
                var json2xml = {
                    "root": {
                        "command": "sendPrivateSMS",
                        "sendType": "shortCode",
                        "email": "aminuddin@janasys.com.my",
                        "password": "8313",
                        "params": {
                            "items": {
                                "recipient": $scope.data.mobileno,
                                "textMessage": "Your verification code is " + $scope.data.vCode
                            }
                        }
                    }
                }


                var jsondata = x2js.json2xml_str(json2xml);
                u.Intent.data = $scope.data;
                
                u.$state.go('verify');
                
                $scope.test = $http({
                    method: 'POST',
                    url: 'https://www.sms123.net/xmlgateway.php',
                    data: jsondata,
                    headers: {
                        "Content-Type": 'application/xml'
                    }
                });
            }
        }

    });
})();