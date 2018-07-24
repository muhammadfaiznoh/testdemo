(function () {
    var _module = angular.module('controller');
    _module.controller('EventCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce, $ionicScrollDelegate) {
        ControllerBase($scope, 'event');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.data = u.Intent.data;
                console.log("data", $scope.data);
                //$scope.images = $scope.data.image;
                $scope.updateMapUrl();
            }
        });
        $scope.images = [
            "img/icon/Accident.png",
            "img/icon/breakdown_icon.png",
            "img/icon/flood_icon.png",
            "img/icon/RoadClosure.png",
            "img/icon/landslide_icon.png",
            "img/icon/roadmaintain_icon.png",
            "img/icon/fallentree_icon.png",
            // "img/icon/trafficjam.png",
            "img/icon/roadmaintain.png"
        ];
        
        $scope.expandText = function(){
	var element = document.getElementById("txtnotes");
	element.style.height =  element.scrollHeight + "px";
}
        
          $scope.goBottom = function() {
      $ionicScrollDelegate.scrollBottom(true);
  }
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