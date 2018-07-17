(function () {
    var _module = angular.module('controller');
    _module.controller('DirectionsCtrl', function ($scope, $interval, ControllerBase, u, App, $http, $cordovaGeolocation, $sce, localStorage, 
                                                    $ionicModal, $ionicPlatform, $ionicActionSheet, $timeout, $ionDrawerVerticalDelegate, 
                                                    $ionicNavBarDelegate, $cordovaLaunchNavigator) {
        ControllerBase($scope, 'directions');
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }

        });
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: false
        };
        $scope.sub = function (data) {
            console.log(data.geometry.location.lat());
            console.log(data.geometry.location.lng());

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.lat = position.coords.latitude
                $scope.long = position.coords.longitude

                var destination = [data.geometry.location.lat(), data.geometry.location.lng()];
                var start = [$scope.lat, $scope.long];

                $cordovaLaunchNavigator.navigate(destination, start).then(function () {
                    console.log("Navigator launched");
                }, function (err) {
                    console.error(err);
                });
            });
        }
    });
})();