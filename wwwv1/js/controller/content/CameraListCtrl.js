(function () {
    var _module = angular.module('controller');

    _module.controller('CameraListCtrl', function ($rootScope, $scope, ControllerBase, u, App, apiCamera, $ionicNavBarDelegate, $http, $ionicFilterBar, $ionicLoading, $ionicModal, $ionicScrollDelegate) {
        ControllerBase($scope, 'cameralist');


        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                var data1=1;
                $scope.initLoadingCompleted = false;
                $scope.loading = null;
                $scope.loadingFilter = null;
                $scope.items = null;
                $scope.data = null;
                $scope.delayViewCreations = [];
                $scope.initLoadingCompleted = false;
                $scope.traffic=true;
                 $scope.hide=false;
                $scope.show=true;
                $scope.sttButton=true;
                 $scope.index = [];
                $scope.calcTraffic = 0;
                 $scope.calcWater = 0;
                $scope.data1 = {};
                
               // console.log("Entered :", $scope.index);
                $scope.loading =$ionicLoading.show({
                    template: '<ion-spinner icon="lines"></ion-spinner>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0,
                    
                duration: 3000
                }).then(function () {
                    u.$q.all([$scope.load()]);
                    $ionicLoading.hide();
                });
               

            }

        });
        //       _.filter($scope.camera, function(o){ 
        //          return o.status = 0 
        //       });
        $scope.goBottom = function() {
            $ionicScrollDelegate.scrollBottom(true);     
            //$scope.sttButton=false;
        }
        
         $scope.getScrollPosition = function() {
 //monitor the scroll
  var moveData = $ionicScrollDelegate.$getByHandle('ScrollToBot').getScrollPosition().top;
  var maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
  console.log("val",moveData);
     if(moveData<500){
        $scope.$apply(function(){
          $scope.sttButton=true;
        });//apply
      }else{
        $scope.$apply(function(){
          $scope.sttButton=false;
        });//apply
      }
  };
        
        $scope.load = function (useCache) {

               $scope.items= $http.get(App.apiEndPoint + "jcctv_view").then(function (res) {
                    $scope.items = _.sortBy(res.data, function (o) {
                        $scope.calcTraffic+=1;
        // console.log("123", $scope.calcTraffic);
                        return o.zone;
                    }).reverse()
                    $scope.datafilter = _.filter($scope.items, function (y) {
                        //if(y.category=="traffic") 
                            return y.flag > 0;

                    })

                  //  console.log("test", $scope.datafilter);
                    $ionicLoading.hide();
                });
//}
//            if($scope.traffic==false){
 //return $scope.loading =
               $scope.data=  $http.get(App.apiEndPoint + "jcctv_view_1").then(function (res) {
     $scope.data = _.sortBy(res.data, function (o) {
                       $scope.calcWater+=1;
                        return o.zone;
                    })
                    $scope.datafilter = _.filter($scope.data, function (y) {
                        //if(y.category=="hotspot") 
                            return y.flag > 0 ;

                    })

                 //   console.log("test1", $scope.datafilter);
                   
                    $ionicLoading.hide();
           
                });
            $scope.loading = [$scope.items, $scope.data];
            return $scope.loading;
//        }
        }
           
        $scope.showFilterBar = function () {
            $ionicFilterBar.show({
                items: $scope.items,

                update: function (actualFilter, filteredName) {
                    if (filteredName !== undefined && filteredName.length >= 3) {
                        $scope.items.zone = filteredName;
                    } else {
                        $scope.items.zone = null;
                    }


                },
                filterProperties: 'zone',

            });

        }

        $scope.date = moment().format("D MMMM YYYY");

     
$scope.actionButtonTraffic = function () {
            $scope.traffic = true;
    $scope.show = true; 
    $scope.hide = false; 
    var sumTraffic= $scope.calcTraffic;
   // console.log("count", $scope.items.zone.length;
    //$scope.rows = rows ;
    
        }
        $scope.actionButtonEvent = function () {
            $scope.traffic = false;
             $scope.show = false;
             $scope.hide = true; 
            var sumWater= $scope.calcWater;
        }
        

        
        $scope.onRefresh = function () {
                $scope.calcTraffic = 0;
                 $scope.calcWater = 0;
           
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 100,
                duration: 3000
            })
                .then(function () {
                u.$q.all([$scope.load().then(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        //console.log("resfreshed");
                   $ionicLoading.hide();
                    
                
                    })
                ]);
            });  $scope.$broadcast('scroll.refreshComplete');
//            $timeout(function() {
//             $ionicLoading.hide();
//                swal("Alert", "refresh", "info");
//          }, 2000);
            

        }


        $scope.actionItemIndex = function (index) {
            var data;
            data = index;
//swal("Alert", data, "info");
            u.Intent.data = data;
            u.Intent.category = "traffic";
            u.$state.go("tab.cctv");
           // console.log("enter", data);
        }
$scope.actionItemIndexFlood = function (index) {
            var data;
            data = index;
//swal("Alert", data, "info");
            u.Intent.data = data;
    u.Intent.category = "hotspot";
            u.$state.go("tab.cctv");
            
        }

    });
})();