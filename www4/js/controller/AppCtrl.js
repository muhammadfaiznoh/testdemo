(function () {
    var _module = angular.module('controller');
    _module.controller('AppCtrl', function (App, $scope, $rootScope, appVersionChecker, $timeout, u, $ionicNavBarDelegate, $ionicSideMenuDelegate) {
        $ionicNavBarDelegate.align('center');
        // $scope.$watch(function() {
        //     return $ionicSideMenuDelegate.getOpenRatio();
        // }, function(newValue, oldValue) {
    
        //     if (newValue == 0) {
        //         $scope.hideLeft = true;
        //         $scope.hideRight = true;
        //     } else {
        //         if (newValue == 1) {
        //             $scope.hideLeft = false;
        //         } else {
        //             $scope.hideRight = false;
        //         }
        //     }
        // });
        $rootScope.hide_menu = false;
$scope.$watch(function(){
return $ionicSideMenuDelegate.isOpenLeft();
},
function(isOpen){
if(isOpen){
$rootScope.hide_menu = false;
} else {
$rootScope.hide_menu = true;
}
});
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