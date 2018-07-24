(function () {
    var _module = angular.module('controller');
    _module.controller('ProfileCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce, localStorage, $ionicHistory, $window, $http, $ionicActionSheet, ImageService, $cordovaCamera, $stateParams, $timeout) {
        ControllerBase($scope, 'profile');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap', 'back'].indexOf(state.direction) >= 0) {
                $scope.isExpanded = false;

                var storage = localStorage.getObject('userDetails');
                $scope.edit_name = {}
                $scope.staff = storage.staff;
                $scope.up_name = storage.name;
                $scope.up_email = storage.email;
                $scope.up_phone = storage.phone_no;
                $scope.blacklist_flag = storage.blacklist_flag;
                $scope.up_password = "(unchanged)";
                if (storage.image == null) {
                    $scope.up_image = null;
                } else {
                    $scope.up_image = storage.image;
                }
                console.log("try", storage);
            }
        });

        $scope.showEdit = function () {
            $ionicModal.fromTemplateUrl('templates/common/modal-edit-profile.html', {
                scope: $scope,
                //                index: index,
                animation: 'slide-in-up',
                controller: 'ProfileCtrl'
            }).then(function (modal) {
                $scope.modal = modal;
                console.log("modal", modal);

                $scope.modal.show();
            });
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
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

        $scope.changePassword = function(email) {
            u.$state.go('tab.changepassword');
        }
        
        $scope.submit = function (name,email,phone) {
            if (name == null || name == "") {
                swal("Warning", "Name must no be empty !", "error");
                return;
            }
            if (email == null || email == "") {
                swal("Warning", "Email must no be empty !", "error");
                return;
            }
            if (phone == null || phone == "") {
                swal("Warning", "Phone No must no be empty !", "error");
                return;
            }
            $http.post(App.apiEndPoint + "updateprofile", {
                username: name,
                email: email,
                mobileno: phone,
                image: btoa($scope.up_image)
            }).then(function(res) {
                if (res.data == "Success!") {
                    
                    var storage = localStorage.getObject('userDetails');
                    var vPassword = storage.password;
                    localStorage.setObject('userDetails', {
                        name: name,
                        staff: $scope.staff,
                        password: vPassword,
                        email: email,
                        phone_no: phone,
                        image: $scope.up_image,
                        blacklist_flag: $scope.blacklist_flag
                    });
                    swal("Success", "Profile updated", "success");
                    u.$state.go('tab.setting');
                } else {
                    swal("Fail!", "Fail to update User Profile", "error");
                }
            }).error(function(res) {
                swal("Fail!", "Fail to update User Profile, Please contact Administrator.", res);
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
                $scope.up_image = $scope.imgURI;
            }, function (err) {
                // An error occured. Show a message to the user
            });
        }

        //        $scope.submit = function () {
        //            if ($scope.up_name == $scope.edit_name) {
        //                $scope.data.name = $scope.up_name;
        //            } else {
        //                $scope.data.name = $scope.edit_name;
        //            }
        //            //            $scope.data.name = ;
        //            $scope.data.email = up_email;
        //            $scope.data.password = up_password;
        //            $scope.data.mobileno = up_phone;
        //            $scope.data.device = currentPlatform;
        //            $scope.data.image = $scope.imgURI;
        //        }


        $scope.back = function () {
            u.$state.go('tab.setting');
        }

    });
})();