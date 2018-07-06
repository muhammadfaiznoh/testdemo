(function () {
    var _module = angular.module('controller');
    _module.controller('TrafficCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce) {
        ControllerBase($scope, 'traffic');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.data = u.Intent.data;
                $scope.updateMapUrl();
            }
        });
        
        $scope.updateMapUrl = function() {
            $scope.latitude = $scope.data.latitude;
            $scope.longitude = $scope.data.longitude;
            $scope.apiKey = App.googleApiKey;
            if($scope.latitude && $scope.longitude) {
                $scope.mapurl = 
                    'https://www.google.com/maps/embed/v1/place'+
                    '?key='+$scope.apiKey+
                    '&q='+$scope.latitude+','+$scope.longitude+
                    '&zoom=16'
                ;
                $scope.mapurl = $sce.trustAsResourceUrl($scope.mapurl);
            }else{
                $scope.mapurl = '';   
            }  
            return $scope.mapurl;
        }
        $scope.actionMap = function() {
            if(!$scope.mapurl)return;
            u.$state.go('app.location', {lot:$scope.longitude, lat:$scope.latitude});
        }
    });

})();