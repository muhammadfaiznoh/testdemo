(function () {
    var _module = angular.module('controller');

    _module.controller('HighlightCtrl', function ($rootScope, $scope, localStorage,ControllerBase, u, App, apiInfoTraffic, $ionicNavBarDelegate, apiEvent, $http, $ionicLoading, $ionicScrollDelegate) {
        ControllerBase($scope, 'highlight');

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        

        $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.initLoadingCompleted = false;
                $scope.loading = null;
                $scope.loadingFilter = null;
                $scope.items = [];
                $scope.data = null;
                $scope.sttButton =true;

                $scope.projects = [];
                $scope.summary = {};
                $scope.delayViewCreations = [];
                $scope.initLoadingCompleted = false;
                //$scope.show = true;
                $scope.dbkl = false;
               // $scope.skip= 0;
               // $scope.stop= 0;
            //    var dataSkip = storage.setItem('skip', 0);
 //var dataStop = storage.setItem('stop', 0);
                
               $scope.category = u.Intent.category;
            
               
                 var appStop = localStorage.getObject('stop');

                 $scope.stop = appStop;
                console.log("stop",  $scope.stop);
                 var appSkip = localStorage.getObject('skip');

                 $scope.skip = appSkip;
                console.log("skip", $scope.skip);
                
             var applaunchCount = localStorage.getObject('launchCount');

                            //Check if it already exists or not
                            if (applaunchCount) {
                                var count = applaunchCount
                                console.log("value1", count);
                                $scope.show = false;
                                //This is a second time launch, and count = applaunchCount
                            } else {
                                //Local storage is not set, hence first time launch. set the local storage item
                                var datas = localStorage.setObject('launchCount', 1);
                                console.log("value2", datas);

                                $scope.show = true;
                            }
                               // console.log("value1", count);
                              //  u.$state.go('tab.mapmain');
                                //This is a second time launch, and count = applaunchCount
                           
//                     var appSkip = localStorage.getObject('skip');
//console.log("stop", appStop);
//                 $scope.skip = appSkip.skip;


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
        $scope.images = [
            "img/icon/Accident.png",
            "img/icon/breakdown_icon.png",
            "img/icon/flood_icon.png",
            "img/icon/RoadClosure.png",
            "img/icon/landslide_icon.png",
            "img/icon/roadmaintain_icon.png",
            "img/icon/fallentree_icon.png",
            "img/icon/roadmaintain.png"
        ];
        $scope.title = ["Accident",
                       "Breakdown",
                       "Flood",
                       "Potholes",
                       "Landslide",
                       "Traffic Light",
                       "Fallen Tree",
                       "Road Maintenance"];
        $scope.load = function (useCache) {
           
            $scope.items = $http.get(App.apiEndPoint + "jinfotraffic").then(function (res) {
                $scope.items = res.data;
                $ionicLoading.hide();

            });
            $scope.data = $http.get(App.apiEndPoint + "jevent").then(function (res) {
                $scope.data = res.data;
                console.log("info", $scope.data);
                $ionicLoading.hide();

            });
            console.log("data:", $scope.data);
            $scope.loading = [$scope.items, $scope.data];
            return $scope.loading;

        }

           $scope.goBottom = function() {
      $ionicScrollDelegate.scrollBottom(true);
  }

  $scope.getScrollPosition = function() {
    //monitor the scroll
     var moveData = $ionicScrollDelegate.$getByHandle('ScrollToBot').getScrollPosition().top;
     var maxTop = $ionicScrollDelegate.getScrollView().__maxScrollTop;
     console.log("val",moveData);
     console.log("max",maxTop);
        if(moveData<maxTop){
           $scope.$apply(function(){
             $scope.sttButton=true;
           });//apply
         }else{
           $scope.$apply(function(){
             $scope.sttButton=false;
           });//apply
         }
     };
        $scope.actionStop = function () {
            $scope.show = false;
           //$scope.category = $scope.category1;
            //var storage= window.localStorage;
           var dataStop = localStorage.setObject('stop', 1);
            
        }
        $scope.actionSkip = function () {
            $scope.show = false;
           //var storage= window.localStorage;
            var dataSkip = localStorage.setObject('skip', 1);
           
        }
           $scope.expandText = function(){
	var element = document.getElementById("txtnotes");
	element.style.height =  element.scrollHeight + "px";
}
       
        $scope.actionListEvent = function (index) {
                u.Intent.data = $scope.items[index];
                u.$state.go("tab.event");
                //u.Intent.image = "img/icon/RoadEvent.png";
        }
        $scope.actionListInfo = function (index) {
                u.Intent.data = $scope.data[index];
                u.$state.go("tab.infodbkl");
                u.Intent.image = $scope.images[5];
        }
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
$scope.$broadcast('scroll.refreshComplete');
        }
         
    });
})();

