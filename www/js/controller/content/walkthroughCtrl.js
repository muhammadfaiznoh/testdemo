(function () {
    var _module = angular.module('controller');
    _module.controller('walkthroughCtrl', function ($scope, ControllerBase, u, App, $http, $ionicSlideBoxDelegate) {
        ControllerBase($scope, 'walkthrough');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }
        });
        //        Implement functions here
        $scope.skipintro = function () {
            u.$state.go('tab.setting');
        };
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };
        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
        };
        $scope.startApp = function () {
            u.$state.go('tab.mapmain');
        };
    });
})();