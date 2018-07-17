(function () {
    var _module = angular.module('controller');
_module.controller('MenuCtrl', ['$scope', '$ionicSideMenuDelegate', function($scope, $ionicSideMenuDelegate) {
    $scope.$watch(function(){
    return $ionicSideMenuDelegate.getOpenRatio();
    }, function(newValue, oldValue) {
    if (newValue == 0){
    $scope.hideLeft = true;
    } else{
    $scope.hideLeft = false;
    }
    });
    }])})();