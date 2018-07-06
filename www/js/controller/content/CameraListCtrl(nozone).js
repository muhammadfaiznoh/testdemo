(function () {
    var _module = angular.module('controller');

    _module.controller('CameraListCtrl', function ($rootScope, $scope, ControllerBase, u, App, apiCamera, $ionicNavBarDelegate, $http, $ionicFilterBar, $ionicLoading, $ionicModal) {
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
                 $scope.index = [];
                $scope.data1 = {};
                console.log("Entered :", $scope.index);
                $ionicLoading.show({
                    template: '<ion-spinner icon="lines"></ion-spinner>',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0,
                    
                }).then(function () {
                    u.$q.all([$scope.load()]);
                });

            }

        });
        //       _.filter($scope.camera, function(o){ 
        //          return o.status = 0 
        //       });
        $scope.load = function (useCache) {
//              $scope.load = function (useCache) {
//
//            $scope.items = $http.get(App.apiEndPoint + "jinfotraffic").then(function (res) {
//                $scope.items = res.data;
//                $ionicLoading.hide();
//
//            });
//            $scope.data = $http.get(App.apiEndPoint + "jevent").then(function (res) {
//                $scope.data = res.data;
//                console.log("test: ", res.data[1].location);
//                $ionicLoading.hide();
//
//            });
//            console.log("data:", $scope.data);
//            $scope.loading = [$scope.items, $scope.data];
//            return $scope.loading;
//
//        }
//if($scope.traffic==true){
            //return $scope.loading =
               $scope.items= $http.get(App.apiEndPoint + "jcctv_view").then(function (res) {
                    $scope.items = _.sortBy(res.data, function (o) {
                        
                        return o.zone;
                    }).reverse()
                    $scope.datafilter = _.filter($scope.items, function (y) {
                        //if(y.category=="traffic") 
                            return y.flag > 0;

                    })
//                $scope.datafilter = _.filter($scope.datas.camera, function (o) {
//                        console.log("item", o.status)
//                        return o.status == "1";
//                    })
                    console.log("test", $scope.datafilter);
                    $ionicLoading.hide();
                });
//}
//            if($scope.traffic==false){
 //return $scope.loading =
               $scope.data=  $http.get(App.apiEndPoint + "jcctv_view_1").then(function (res) {
     $scope.data = res.data;
//                console.log("test: ", res.data[1].location);
//                    $scope.data1 = _.sortBy(res.data, function (o) {
//                        //swal("Alert", o.zone, "info");
//                        return o.zone;
//                    })
//                    $scope.camera = _.filter($scope.data1, function (i) {
//                        return i.flag > 0;
//                    })
//                    $scope.datas = $scope.camera[$scope.index];
//swal("Alert", $scope.index , "info");
//                    $scope.datafilter = _.filter($scope.datas.camera, function (o) {
//                       // if(o.category!=="traffic"){
//                        
//                        
//                        return o.status == "1";//}
//                    })
                   
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

        $scope.showImages = function (index) {
           // swal("Alert", index , "info");
            $scope.activeSlide = index;
            $scope.showModal('templates/common/modal-cctv.html');
        }

        $scope.showModal = function (templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: "$scope",
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
        
$scope.actionButtonTraffic = function () {
            $scope.traffic = true;
        }
        $scope.actionButtonEvent = function () {
            $scope.traffic = false;
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

        }

        $scope.actionItemIndex = function (index) {
            var data;
            data = index;
//swal("Alert", data, "info");
            u.Intent.data = data;
            u.$state.go("tab.cctv");
            console.log("enter", data);
        }


    });
})();