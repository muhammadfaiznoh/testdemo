(function () {
    var _module = angular.module('controller');

    _module.controller('ParkingCtrl', function ($rootScope, $scope, ControllerBase, u, App, $ionicNavBarDelegate, apiParking, apiSignUp1, $http, $cordovaGeolocation, $cordovaLaunchNavigator, $ionicLoading, $ionicScrollDelegate) {
        ControllerBase($scope, 'parking');



        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.initLoadingCompleted = false;
                $scope.loading = null;
                $scope.loadingFilter = null;
                $scope.items = null;
                $scope.data = null;
                $scope.customizations = [];
                $scope.projects = [];
                $scope.summary = {};
                $scope.delayViewCreations = [];
                $scope.initLoadingCompleted = false;
                $scope.traffic = true;
                $scope.sttButton= true;

                $ionicLoading.show({
                    template: '<ion-spinner icon="lines"></ion-spinner>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                }).then(function () {
                    u.$q.all([$scope.load()]);
                });

                

            }

        });

        $scope.parkimg = [
            "img/parkimg/klcc.png",
            "img/parkimg/lowyat.png",
            "img/parkimg/Lot10.png",
            "img/parkimg/sungeiwanglogo.png",
            "img/parkimg/starhill.png",
            "img/parkimg/pavilion.png",
            "img/parkimg/fahrenheit.png",
            "img/parkimg/capsquare.png",
            "img/parkimg/sogo.png",
            "img/parkimg/semuahouse.png",
            "img/parkimg/majujunction.png",
            "img/parkimg/pt80.png",
            "img/parkimg/pertamacomplex.png",
            "img/parkimg/quil_logo.png"
        ];


        $scope.load = function (useCache) {

            return $scope.loading =
                $http.get(App.apiEndPoint + "jparking").then(function (res) {
                    $scope.items = res.data;
                    $ionicLoading.hide();
                });
        }
        $scope.onRefresh = function () {

            u.$q.all([$scope.load().then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    console.log("resfreshed");
                })
            ]);

        }


        //        $scope.actionDirections = function (index) {
        //            console.log("data", $scope.items[index]);
        //            u.showAlert('Directions to ' + $scope.items[index].location);
        //        }
        var posOptions = {
            timeout: 10000,
            enableHighAccuracy: true
        };
        $scope.actionDirections = function (index) {
            //            console.log(data.geometry.location.lat());
            //            console.log(data.geometry.location.lng());
            var value1 = $scope.items[index].latitude;
            var value2 = $scope.items[index].longitude;

            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
                $scope.lat = position.coords.latitude
                $scope.long = position.coords.longitude

                var destination = [value1, value2];
                var start = [$scope.lat, $scope.long];
                $cordovaLaunchNavigator.navigate(destination, start).then(function () {
                    console.log("Navigator launched");
                }, function (err) {
                    console.error(err);
                });
            });
        }
        $scope.goBottom = function() {
            $ionicScrollDelegate.scrollBottom(true);     
           // $scope.sttButton=false;
            
        }
      
        
         $scope.getScrollPosition = function() {
 //monitor the scroll
  var moveData = $ionicScrollDelegate.$getByHandle('ScrollToBot').getScrollPosition().top;
 var maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
  console.log("val",moveData);
 
     if(moveData<550){
        $scope.$apply(function(){
          $scope.sttButton=true;
        });//apply
      }else{
        $scope.$apply(function(){
          $scope.sttButton=false;
        });//apply
      }
  };






    });
})();