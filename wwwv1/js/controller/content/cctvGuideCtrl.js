(function () {
    var _module = angular.module('controller');
    _module.controller('cctvGuideCtrl', function ($scope, ControllerBase, u, App, $http, $ionicSlideBoxDelegate) {
        ControllerBase($scope, 'walkthrough');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }
        });
        //        Implement functions here
        $scope.actionCctv = function () {
            u.$state.go('tab.cameralist');
            u.Intent.category = "traffic";
        };
        $scope.actionDbkl = function () {
            u.$state.go('tab.highlight');
            u.Intent.category = "dbkl";
        };
        
    });
})();