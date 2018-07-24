(function () {
    var _module = angular.module('controller');
    _module.controller('ReportCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $http, $ionicActionSheet, ImageService, $cordovaCamera, $cordovaGeolocation, $ionicPopover, localStorage) {
        ControllerBase($scope, 'report');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

        var storage = localStorage.getObject('userDetails');
        $scope.edit_name = {}
        $scope.up_name = storage.name;
        $scope.up_email = storage.email;
        $scope.up_phone = storage.phone_no;
       

        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.data = [];
                $scope.clicked = false;
                $scope.type = u.Intent.data;
                $scope.text = u.Intent.text;
                $scope.id = u.Intent.id;

            }
                
        });

        $scope.returnClick = function (bool) {
            $scope.clicked = false;
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
 
        $ionicPopover.fromTemplateUrl('templates/popover/popover-report.html', {
            scope: $scope,
        }).then(function (popover) {
            $scope.popoverReport = popover;
        });

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

        $scope.showImages = function () {
            //            $scope.activeSlide = index;
            $scope.showModal('templates/common/modal-report.html');
        }

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'fade-in-scale'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.dataimg = $scope.imgURI;
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $scope.clearFields = function () {
            document.getElementById("textareaField").value = "";
            $scope.imgURI = undefined;
        }
        $scope.actionSubmit = function (message) {
            console.log($scope.up_email);
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.lat = position.coords.latitude
                $scope.long = position.coords.longitude
                $http.post(App.apiEndPoint + "incidentreport", {
                    title: $scope.text,
                    description: message,
                    latitude: $scope.lat,
                    longitude: $scope.long,
                    image: $scope.imgURI,
                    reported_by: $scope.up_email,
                    incident_type_id: $scope.id
                }).then(function (res) {
                    $scope.items = res;
                    console.log(res);
                    if (res.data == "Success!") {
                        swal({
                            title: "Success",
                            text: "Thank you. Your report has been received and action will be taken",
                            timer: 2000,
                            type: "success",
                            showConfirmButton: false
                        }, function () {
                            swal.close();
                            $scope.clearFields();
                            u.$state.go('tab.reporttype');
                        });
                    }
                });
                console.log("latitude", $scope.lat);
                console.log("longitude", $scope.long);
            });


        }
        $scope.show = function () {


            u.$state.go("directions");


            // Show the action sheet
            //            var hideSheet = $ionicActionSheet.show({
            //                buttons: [
            //                    {
            //                        text: '<b>Share</b> This'
            //                },
            //                    {
            //                        text: 'Move'
            //                }
            //     ],
            //                destructiveText: 'Delete',
            //                titleText: 'Modify your album',
            //                cancelText: 'Cancel',
            //                cancel: function () {
            //                    // add cancel code..
            //                },
            //                buttonClicked: function (index) {
            //                    return true;
            //                }
            //            });
            //
            //            // For example's sake, hide the sheet after two seconds
            //            $timeout(function () {
            //                hideSheet();
            //            }, 2000);

        }

        $scope.toggleDrawer = function (handle) {
            console.log(handle);
            $ionDrawerVerticalDelegate.$getByHandle(handle).toggleDrawer();
        }

        $scope.openModal = function (index) {
            $ionicModal.fromTemplateUrl('templates/common/modal-hotline.html', {
                scope: $scope,
                index: index,
                animation: 'fade-in-scale',
                controller: 'MapMainCtrl'
            }).then(function (modal) {
                $scope.modal = modal;
                console.log("modal", modal);
                $scope.staff = $scope.staffBool.staff;
                $scope.modal.show();
            });
        };

        console.log($scope.staffBool);
            
            
        
    });
    
})();