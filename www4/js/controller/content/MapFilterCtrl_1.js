(function () {
    var _module = angular.module('controller');
    _module.controller('MapFilterCtrl', function ($scope, $rootScope, $http, $interval, ControllerBase, $ionicSideMenuDelegate, $window, u, App, $compile, $cordovaGeolocation, $sce, $ionicModal, $ionicPlatform, $ionicActionSheet, $timeout, $ionDrawerVerticalDelegate, $ionicNavBarDelegate, $ionicPopup, $http, localStorage) {
        ControllerBase($scope, 'mapfilter');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $ionDrawerVerticalDelegate.closeDrawer();
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
            }
        });
    });
})();