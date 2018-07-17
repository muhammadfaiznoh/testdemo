(function () {
    var _module = angular.module('controller');
    _module.controller('ERTFormCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce, localStorage, $ionicHistory, $window, $http, $ionicActionSheet, ImageService, $cordovaCamera, $stateParams, $timeout) {
        ControllerBase($scope, 'ert_form');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.job = u.Intent.job;
                $scope.FromUI = "Driver";
                $scope.DriverName = "Contractor";
                $scope.AssistantName = "Assistant Name";
                console.log("Entered :", $scope.job);
                var storage = localStorage.getObject('userDetails');
                $scope.entry = {};
                $scope.edit_name = {};
                $scope.up_name = storage.name;
                $scope.up_email = storage.email;
                $scope.up_phone = storage.phone_no;
                $scope.up_password = "(unchanged)";
                if (storage.image === null) {
                    $scope.up_image = null;
                } else {
                    $scope.up_image = storage.image;
                }
                console.log("try", storage);
            }
        });
        $scope.addMedia = function (ActionType) {
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
                    $scope.takePicture(index, ActionType);
                }
            });
        };
        $scope.takePicture = function (type, ActionType) {
            $scope.hideSheet();
            var source;
            var save;
            if (type === 0) {
                source = Camera.PictureSourceType.CAMERA;
                save = true;
            } else if (type === 1) {
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
                if (ActionType === "Before") {
                    $scope.entry.ImageBefore = imageData;
                    $scope.ImageBefore = imageData;
                } else if (ActionType === "After") {
                    $scope.entry.ImageAfter = imageData;
                    $scope.ImageAfter = imageData;
                } else if (ActionType === "PlateNumber") {
                    $scope.entry.PlateNumber = imageData;
                    $scope.PlateNumber = imageData;
                } else if (ActionType === "CompanyName") {
                    $scope.entry.CompanyName = imageData;
                    $scope.CompanyName = imageData;
                }
            }, function (err) {
            });
        };
        $scope.actionSearchDriver = function (TextToSearch) {
            if (TextToSearch === null || TextToSearch === "") {
                return;
            }
            $http.post(App.apiEndPoint + "searchusername", {
                name: TextToSearch
            }).then(function (res) {
                if (res.data !== "" && res.data !== null) {
                    $scope.FromUI = "Driver";
                    $scope.ResultNames = res.data;
                    //Show Modal
                    $scope.openModal();
                    //alert($scope.ResultNames[0].user_name + " : " + $scope.ResultNames[0].email);
                } else {
                    swal("Warning!", "Server Error, Please contact Administrator", "error");
                }
            }).error(function () {
                swal("Fail!", "Fail to update password, Please contact Administrator.", "error");
            });
        };
        $scope.actionSearchAssistant = function(TextToSearch) {
            if (TextToSearch === null || TextToSearch === "") {
                return;
            }
            $http.post(App.apiEndPoint + "searchusername", {
                name:TextToSearch
            }).then(function(res) {
                if (res.data !== "" && res.data !== null) {
                    $scope.FromUI = "Assistent";
                    $scope.ResultNames = res.data;
                    //ShowModal
                    $scope.openModal();
                } else {
                    swal("Warning!", "Server Error, Please contact Administrator", "error");
                }
            }).error(function() {
                swal("Fail!", "Fail to update password, Please contact Administrator.", "error");
            });
        };
        $scope.actionReportArrival = function() {
            //alert($scope.job.incident_id + " : " + $scope.job.type + " : " + $scope.up_email + " : " +$scope.entry.DriverName + " : " + $scope.entry.AssistantName);
            $scope.UploadDriverName = $scope.entry.DriverName;
            if ($scope.UploadDriverName === "") {    
                $scope.UploadDriverName = $scope.up_name;
            }
            if ($scope.UploadDriverName === "undefined") {    
                $scope.UploadDriverName = $scope.up_name;
            }
            if ($scope.UploadDriverName === null) {    
                $scope.UploadDriverName = $scope.up_name;
            }
            if (!$scope.entry.DriverName) {
                $scope.UploadDriverName = $scope.up_name;
            }
            $http.post(App.apiEndPoint + "reportarrival", {
                incidentid: $scope.job.incident_id,
                incidenttypeid: $scope.job.type,
                email: $scope.up_email,
                drivername: $scope.UploadDriverName,
                assistantname: $scope.entry.AssistantName
            }).then(function(res) {
                if (res.data != "" && res.data != null) {
                    if (res.data === "Success!") {
                        swal("Success!", "Arrival Reported", "success");
                    } else if(res.data = "Duplicate") {
                    } else {
                        swal("Fail!", "Arrival is not Reported, Please contact Administrator", "info");
                    }
                } else {
                    swal("Warning!", "Server Error, Please contact Administrator", "error");
                }
            }).error(function() {
                swal("Fail!", "Fail to update password, Please contact Administrator.", "error");
            });
        };
        $scope.actionResolveCase = function() {
            var vBeforeImage = "";
            if ($scope.entry.ImageBefore === null || $scope.entry.ImageBefore === "undefined") {
                vBeforeImage = "NULL";
            } else {
                vBeforeImage = $scope.entry.ImageBefore;
            }
            var vAfterImage = "";
            if ($scope.entry.ImageAfter === null || $scope.entry.ImageAfter === "undefined") {
                vAfterImage = "NULL";
            } else {
                vAfterImage = $scope.entry.ImageAfter;
            }
            var vPlateNumber = "";
            if ($scope.entry.PlateNumber === null || $scope.entry.PlateNumber === "undefined") {
                vPlateNumber = "NULL";
            } else {
                vPlateNumber = $scope.entry.PlateNumber;
            }
            var vCompanyName = "";
            if ($scope.entry.CompanyName === null || $scope.entry.CompanyName === "undefined") {
                vCompanyName = "NULL";
            } else {
                vCompanyName = $scope.entry.CompanyName;
            }
            //alert($scope.job.incident_id + " : " + $scope.up_email + " : " + vBeforeImage + " : " + vAfterImage);
            $http.post(App.apiEndPoint + "resolvecase", {
                incidentid: $scope.job.incident_id,
                email: $scope.up_email,
                imagebefore: vBeforeImage,
                imageafter: vAfterImage,
                platenumber: vPlateNumber,
                companyname: vCompanyName
            }).then(function(res) {
                if (res.data != "" && res.data != null) {
                    if (res.data === "Success!") {
                        swal("Success!", "Case Reported", "success");
                    } else {
                        swal("Fail!", "Case reporting fail : " + res.data + ", Please contact Administrator", "info");
                    }
                } else {
                    swal("Warning!", "Server Error, Please contact Administrator", "error");
                }
            }).error(function() {
                swal("Fail!", "Fail to update password, Please contact Administrator.", "error");
            });
        };
        $scope.actionCompleteCase = function(Landmark, VehicleInvolved, SourceOfInfo, AuthoritiesInvolved, Remarks, UserSatisfaction, ServiceEfficiency, ServiceContinuation, UserOpinion) {
            $http.post(App.apiEndPoint + "completecase", {
                incidentid: $scope.job.incident_id,
                email: $scope.up_email,
                landmark: Landmark,
                vehicleinvolved: VehicleInvolved,
                sourceofinfo: SourceOfInfo,
                authoritiesinvolved: AuthoritiesInvolved,
                remarks: Remarks,
                usersatisfaction: UserSatisfaction,
                serviceefficiency: ServiceEfficiency,
                servicecontinuation: ServiceContinuation,
                useropinion: UserOpinion
            }).then(function(res) {
                if (res.data !== "" && res.data !== null) {
                    if (res.data === "Success!") {
                        swal("Success!", "Case Solved", "success");
                        $scope.entry.ImageAfter = "NULL";
                        $scope.entry.ImageBefore = "NULL";
                        u.$state.go("tab.ert");
                    }
                } else {
                    swal("Warning!", "Server Error, Please contact Administrator", "error");
                }
            }).error(function () {
                swal("Fail!", "Fail to update password, Please contact Administrator.", "error");
            });
        };
        $scope.actionSelectName = function(UserName) {
            if ($scope.FromUI === "Driver") {
                $scope.entry.DriverName = UserName;
            } else {
                $scope.entry.AssistantName = UserName;
            }
            $scope.closeModal();
        };
        $scope.modal = $ionicModal.fromTemplate( 
            '<ion-modal-view>' +
                '<ion-header-bar>' +
                    '<h1 class = "title">User List</h1>' +
                '</ion-header-bar>' +
                '<ion-content>' +
                    '<ion-list>' +
                      '<ion-item ng-repeat="item in ResultNames" style="color:black" ng-click="actionSelectName(item.user_name)">' +
                        '{{item.user_name}}' +
                      '</ion-item>' +
                    '</ion-list>' +
                    '<button class = "button icon icon-left ion-ios-close-outline" ng-click = "closeModal()">Close</button>' +
                '</ion-content>' +
            '</ion-modal-view>', {
            scope: $scope,
            animation: 'slide-in-up'
        });
        $scope.openModal = function() {
          $scope.modal.show();
        };

        $scope.closeModal = function() {
          $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.modal.remove();
        });

        // Execute action on hide modal
        $scope.$on('modal.hidden', function() {
          // Execute action
        });

        // Execute action on remove modal
        $scope.$on('modal.removed', function() {
          // Execute action
        });
    });
})();