(function () {
    var _module = angular.module('controller');
    _module.controller('ERTDetailsCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $window, $cordovaGeolocation, 
                                                    $cordovaLaunchNavigator, $ionicHistory, $timeout, localStorage, $sce,
                                                    $ionDrawerVerticalDelegate) {
        ControllerBase($scope, 'ert_details');
        //$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.job = u.Intent.job;
                console.log("Entered :", $scope.job);
            }
        });

        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $scope.navigateToDistance = function () {
            //alert("Start");
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.lat = position.coords.latitude
                $scope.long = position.coords.longitude
                var destination = [$scope.job.latitude, $scope.job.longitude];
                var start = [$scope.lat, $scope.long];
                //alert($scope.job.latitude + " : " + $scope.job.longitude);
                $cordovaLaunchNavigator.navigate(destination, start).then(function () {
                    console.log("Navigator launched");
                }, function (err) {
                    console.error(err);
                });
            });
            //alert("End");
        }
        $scope.satisClick = function () {
            u.$state.go('tab.ert_form');
        }
        
        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'slide-in-down'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }

        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        }

    });

})();