(function () {
    var _module = angular.module('controller');
    _module.controller('SettingCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $window, $ionicHistory, $timeout, localStorage, $ionDrawerVerticalDelegate) {
        ControllerBase($scope, 'setting');
        //                $scope.date = new Date();
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $scope.device_os = ionic.Platform.platform();
            
            if (['none', 'forward', 'swap', 'back'].indexOf(state.direction) >= 0) {
                $scope.data = u.Intent.data;
                var storage = localStorage.getObject('userDetails');
                $scope.edit_name = {}
                    if (storage.name == null) {
                    $scope.up_name =null;
                } else {
                    $scope.up_name = storage.name;
                }
                if (storage.email == null) {
                    $scope.up_email = null;
                } else {
                    $scope.up_email = storage.email;
                }
//                $scope.up_name = storage.name;
//                $scope.up_email = storage.email;
                $scope.up_phone = storage.phone_no;
                $scope.up_password = "(unchanged)";
                if (storage.image == null) {
                    $scope.up_image = null;
                } else {
                    $scope.up_image = storage.image;
                }
            }
        });
        //
        //        ionicMaterialMotion.fadeSlideInRight({
        //            startVelocity: 400,
        //            //                finishSpeedPercent : 0.1,
        //            //                finsihDelayThrottle: 1
        //        });
        //        ionicMaterialMotion.blinds({
        //            startVelocity: 400,
        //            //                finishSpeedPercent : 0.1,
        //            //                finsihDelayThrottle: 1
        //        });



        //        ionicMaterialInk.displayEffect();

        $scope.edit_profile = function () {
            var storage = localStorage.getObject('userDetails');
            if(localStorage.getObject('userDetails')==null){
                swal("Alert", "You're not login yet", "info");
   
                u.$state.go("login");
            $ionDrawerVerticalDelegate.closeDrawer();}else{
                 u.$state.go('tab.profile');
            }
        }

        $scope.actionLogout = function () {
           // var storage = localStorage.getObject('userDetails');
            //if(localStorage.getObject('userDetails')!=null){
            console.log("item removed");
            //            $window.localStorage.clear();
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            localStorage.removeItem('userDetails');
            console.log(localStorage.getObject('userDetails'));

            swal({
                title: "Log Out",
                text: "Are you sure you want to log Out!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Log Out!",
                cancelButtonText: "Cancel",
                closeOnConfirm: false,
                closeOnCancel: false
            }, function (isConfirm) {
                if (isConfirm) {
                    swal({
                        title: "Log Out",
                        text: "Thank you for using e-Drive applications",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    }, function () {
                        swal.close();
                        u.$state.go('home');
                        
                        $timeout(function () {
          $ionicHistory.clearCache();
      }, 200) 

                    });


                } else {
                    swal("Cancelled", " ", "error");
                }
            });
        }//}
        $scope.actionGuide = function () {
            u.$state.go('tab.guide');
        }
        $scope.actionLang = function () {
            u.$state.go('language');
        }
        $scope.actionabout = function () {
            u.$state.go("tab.about");
            $ionDrawerVerticalDelegate.closeDrawer();
        }
    });

})();