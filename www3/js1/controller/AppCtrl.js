(function () {
    var _module = angular.module('controller');
    _module.controller('AppCtrl', function (App, $scope, $rootScope, appVersionChecker, $timeout, u, $ionicNavBarDelegate) {
        $ionicNavBarDelegate.align('center');

        $rootScope.appVersionChecker = appVersionChecker;
        $rootScope.App = App;
        $scope.actionClickVersion = function () {
            appVersionChecker.promptDownload();
        };
        $scope.actionSideMenuItemClick = function (state) {
            $timeout(function () {
                $rootScope.$broadcast('reset-filter', state);
            });
        };

        $scope.loginData = {};
    });
})();