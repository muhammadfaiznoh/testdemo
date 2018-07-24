(function () {
    var _module = angular.module('controller');
    _module.controller('aboutCtrl', function ($scope, ControllerBase, u, App, $http) {
        ControllerBase($scope, 'about');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }
        });
//        Implement functions here
    });
})();