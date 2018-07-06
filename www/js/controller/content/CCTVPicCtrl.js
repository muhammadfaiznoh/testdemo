(function () {
    var _module = angular.module('controller');
    _module.controller('CCTVPicCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $http, $ionicLoading, $ionicScrollDelegate) {
        ControllerBase($scope, 'cctv');
        //                $scope.date = new Date();
        
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap', 'back', 'enter'].indexOf(state.direction) >= 0) {
                $scope.index = u.Intent.data;
                $scope.category = u.Intent.category;
                $scope.sttButton=true;
                $scope.data = {};
                //console.log("Entered :", $scope.data);
//   swal("Alert", $scope.datas, "info");
                $ionicLoading.show({
                    template: '<ion-spinner icon="lines"></ion-spinner>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0,
                    duration: 3000
                }).then(function () {
                    u.$q.all([$scope.load()]);
                });
            }
        });

        $scope.load = function (useCache) {
if($scope.category=="traffic"){
            return $scope.loading =
                $http.get(App.apiEndPoint + "jcctv_view").then(function (res) {
                    $scope.data = _.sortBy(res.data, function (o) {
                        return o.zone;
                    }).reverse();
                    $scope.camera = _.filter($scope.data, function (i) {
                        return i.flag > 0;
                    })
                    $scope.datas = $scope.camera[$scope.index];
//swal("Alert", $scope.index, "info");
                    $scope.datafilter = _.filter($scope.datas.camera, function (o) {
                        //if(o.category=="traffic") {
                       // console.log("item", o.status)
                        return o.status == "1";//}
                    })
                    $ionicLoading.hide();
               
                    //                    if ($scope.datafilter.length == 0){
                    //                        $scope.nodata = true;
                    //                        console.log("log", $scope.nodata);
                    //                    }
                    //                    else {
                    //                        $scope.nodata = false;
                    //                        console.log("log", $scope.nodata);
                    //                    }
                    //                    console.log("filter", $scope.datafilter.length);
                });
}else{
     return $scope.loading =
                $http.get(App.apiEndPoint + "jcctv_view_1").then(function (res) {
                    $scope.data = _.sortBy(res.data, function (o) {
                        return o.zone;
                    })
                    $scope.camera = _.filter($scope.data, function (i) {
                        return i.flag > 0;
                    })
                    $scope.datas = $scope.camera[$scope.index];
//swal("Alert", $scope.index, "info");
                    $scope.datafilter = _.filter($scope.datas.camera, function (o) {
                        //if(o.category=="traffic") {
                        console.log("item", o.status)
                        return o.status == "1";//}
                    })
                    $ionicLoading.hide();
               
                    //                    if ($scope.datafilter.length == 0){
                    //                        $scope.nodata = true;
                    //                        console.log("log", $scope.nodata);
                    //                    }
                    //                    else {
                    //                        $scope.nodata = false;
                    //                        console.log("log", $scope.nodata);
                    //                    }
                    //                    console.log("filter", $scope.datafilter.length);
                });
}
        }

        $scope.date = moment().format("D MMMM YYYY");

        $scope.showImages = function (index) {
            $scope.activeSlide = index;
            $scope.showModal('templates/common/modal-cctv.html');
          
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
     if(moveData<1160){
        $scope.$apply(function(){
          $scope.sttButton=true;
        });//apply
      }else{
        $scope.$apply(function(){
          $scope.sttButton=false;
        });//apply
      }
  };

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope,
                animation: 'fade-in-scale'
            }).then(function (modal) {
                $scope.modal = modal;
                $scope.dataimg = $scope.datafilter[$scope.activeSlide];
                $scope.modal.show();
            });
        }

        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
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
    });

})();