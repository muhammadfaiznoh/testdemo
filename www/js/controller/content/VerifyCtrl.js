(function () {
    var _module = angular.module('controller');
    _module.controller('VerifyCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $http, $timeout, localStorage, $ionicLoading) {
        ControllerBase($scope, 'verify');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.userData = u.Intent.data;
                $scope.passcode = "";
                console.log("userData", $scope.userData);
            }
        });
        //        $scope.test = function () {
        //            console.log("Clicked");
        //        }



        $scope.add = function (value) {
            console.log($scope.passcode.length);
            if ($scope.passcode.length < 5) {
                $scope.passcode = $scope.passcode + value;
                if ($scope.passcode.length == 5) {
                    console.log("log", $scope.passcode);
                }
            }
        }

        $scope.delete = function () {
            if ($scope.passcode.length > 0) {
                $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
            }
        }

        $scope.resend = function () {
            var x2js = new X2JS();
            var json2xml;
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            }).then(function () {

                json2xml = {
                    "root": {
                        "command": "sendPrivateSMS",
                        "sendType": "shortCode",
                        "email": "aminuddin@janasys.com.my",
                        "password": "8313",
                        "params": {
                            "items": {
                                "recipient": $scope.userData.mobileno,
                                "textMessage": "Your verification code is " + $scope.userData.vCode
                            }
                        }
                    }
                }

            });

            var jsondata = x2js.json2xml_str(json2xml);
            $http({
                method: 'POST',
                url: 'https://www.sms123.net/xmlgateway.php',
                data: jsondata,
                headers: {
                    "Content-Type": 'application/xml'
                }
            }).then(function () {
                $ionicLoading.hide();
            });

            console.log("Enter:", $scope.userData.mobileno);

        }

        $scope.actionBack = function () {
            u.$state.go('signup');
        }

        $scope.send = function () {
            if ($scope.passcode == $scope.userData.vCode) {
                localStorage.setObject('userDetails', {
                    staff: false,
                    name: $scope.userData.name,
                    password: $scope.userData.password,
                    email: $scope.userData.email,
                    phone_no: $scope.userData.mobileno,
                    blacklist_flag: 'N',
                    image: $scope.userData.image,
                    session: 1
                });
                /*
                localStorage.setObject('test', {
                    session: 1
                });
                */
                //$scope.DeviceRegistered = true;
                /*
                $scope.cordovaVersion = 0;
                try {
                    if ($scope.cordovaVersion === 0) {
                        if ($scope.userData.device == "android") {
                            var androidConfig = {
                                "senderID": "1022418999350",
                            };
                            $cordovaPush.register(androidConfig).then(function(result) {
                            }, function(err) {
                                swal("Device Registration", "Fail to register Device", "fail");
                            })
                            $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
                                switch(notification.event) {
                                    case 'registered':
                                        if (notification.regid.length > 0 ) {
                                            $scope.AndroidRegistrantID = notification.regid;
                                            $scope.DeviceRegistered = true;
                                        }
                                        break;
                                    case 'message':
                                        break;
                                    case 'error':
                                        swal("Device Registration", "Error : " + notification.msg, "fail");
                                        break;
                                    default:
                                        swal("Device Registration", "An unknown GCM event has occurred", "fail");
                                        break;
                                }
                            });
                        } else if ($scope.userData.device == "ios") {
                            var iosConfig = {
                                "badge": true,
                                "sound": true,
                                "alert": true,
                            };
                            $cordovaPush.register(iosConfig).then(function(deviceToken) {
                                $scope.iOSDeviceToken = deviceToken;
                                $scope.DeviceRegistered = true;
                            }, function(err) {
                                swal("Device Registration", "Error : " + err, "fail");
                            });
                        }
                    } else if ($scope.cordovaVersion === 5) {
                        if ($scope.userData.device == "android") {
                            var androidConfig = {
                                "senderID": "1022418999350",
                            };
                            $cordovaPushV5.initialize(androidConfig).then(function() {
                            // start listening for new notifications
                            $cordovaPushV5.onNotification();
                            // start listening for errors
                            $cordovaPushV5.onError();

                            // register to get registrationId
                            $cordovaPushV5.register().then(function(registrationId) {
                                scope.AndroidRegistrantID = registrationId;
                            });
                        });
                        } else if ($scope.userData.device == "ios") {
                            var iosConfig = {
                                "badge": true,
                                "sound": true,
                                "alert": true,
                            };
                            $cordovaPushV5.initialize(iosConfig).then(function() {
                                // start listening for new notifications
                                $cordovaPushV5.onNotification();
                                // start listening for errors
                                $cordovaPushV5.onError();

                                // register to get registrationId
                                $cordovaPushV5.register().then(function(registrationId) {
                                    $scope.iOSDeviceToken = registrationId;
                                });
                            });
                        }
                    }
                    */
                    //if ($scope.DeviceRegistered === true) {
                        $http.post(App.apiEndPoint + "signup", {
                            //Usser Registration Information
                            username: $scope.userData.name,
                            password: $scope.userData.password,
                            email: $scope.userData.email,
                            mobileno: $scope.userData.mobileno,
                            device_os: $scope.userData.device,
                            image: btoa($scope.userData.image),
                            //Device Registration Information
                            //devicetoken: $scope.iOSDeviceToken,
                            //registrantid: $scope.AndroidRegistrantID,
                        }).then(function (res) {
                            if (res.data == "Success!") {
                                swal("Success", "User Created", "success");
                                u.$state.go('tab.setting');
                            } else if (res.data == "UserExist!") {
                                swal({
                                    title: "Warning",
                                    text: "The username already registered!",
                                    type: "error",
                                    showConfirmButton: true,
                                    confirmButtonColor: "#F99F1E"
                                });
                            } else if (res.data == "ServerError" ) {
                                swal({
                                    title: "Error",
                                    text: "Please contact Administrator",
                                    type: "error",
                                    showConfirmButton: true,
                                    confirmButtonColor: "#F99F1E"
                                });
                            }
                        }, function errorCallback(response) {
                            swal({
                                title: "Connection Error",
                                text: "Please contact Administrator",
                                type: "error",
                                showConfirmButton: true,
                                confirmButtonColor: "#F99F1E"
                            });
                        });
                    //}
                /*
                } catch (exc) {
                    alert(exc.message);
                }
                */
            }
        }
    });
})();