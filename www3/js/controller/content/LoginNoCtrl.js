(function () {
    var _module = angular.module('controller');
_module.controller('LoginNoCtrl', function($scope, $ionicPopup, $timeout, u, App, $http,$ionicHistory) { 
  $scope.data = {}
	
  $scope.showPopup = function() {
//    var alertPopup = $ionicPopup.alert({
//      title: 'Continue!',
//      template: 'Thank you for using eDrive!'
//    });
	 u.$state.go('tab.mapmain'); 
	      $timeout(function () {
          $ionicHistory.clearCache();
      }, 200) 
  };
});
})();