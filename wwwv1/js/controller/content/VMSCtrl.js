(function () {
    var _module = angular.module('controller');

    _module.controller('VMSCtrl', function ($rootScope, $scope, ControllerBase, u, App, apiCamera, $ionicNavBarDelegate, $http, $ionicLoading, $ionicScrollDelegate) {
        ControllerBase($scope, 'vms');


        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.initLoadingCompleted = false;
                $scope.loading = null;
                $scope.loadingFilter = null;
                $scope.items = null;
                $scope.data = null;
                $scope.delayViewCreations = [];
                $scope.initLoadingCompleted = false;
                $scope.sttButton =true;

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
        //       _.filter($scope.camera, function(o){
        //          return o.status = 0 
        //       });
        $scope.load = function (useCache) {

            return $scope.loading =
                $http.get(App.apiEndPoint + "jvms_view").then(function (res) {




                    $scope.items = _.sortBy(res.data, function (o) {
                        return o.zone;
                    })
                   
                    console.log("test", $scope.items);
                    $ionicLoading.hide();
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
     if(moveData<900){
        $scope.$apply(function(){
          $scope.sttButton=true;
        });//apply
      }else{
        $scope.$apply(function(){
          $scope.sttButton=false;
        });//apply
      }
  };

        $scope.onRefresh = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            }).then(function () {
                u.$q.all([$scope.load().then(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        console.log("resfreshed");
                    })
                ]);
            });

        }

        $scope.actionItemIndex = function (index) {
            var data = index;
            console.log("enter", data);
            u.Intent.data = data;
            u.Intent.items = $scope.items[index];
            u.$state.go("tab.vmsview");
        }


    });
})();