(function () {
    var _module = angular.module('controller');
    _module.controller('SleepmodeCtrl', function ($scope, ControllerBase, u, App, $http, $ionDrawerVerticalDelegate) {
        ControllerBase($scope, 'sleepmode');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $ionDrawerVerticalDelegate.closeDrawer();
            }
        });
        //        Implement functions here

        $scope.wake = function () {
            u.$state.go('tab.mapmain');
        }
    });
})();