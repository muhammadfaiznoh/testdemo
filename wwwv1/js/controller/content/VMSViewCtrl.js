(function () {
    var _module = angular.module('controller');
    _module.controller('VMSViewCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $http, $ionicScrollDelegate) {
        ControllerBase($scope, 'vmsview');
        $scope.date = new Date();
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                //                $scope.index = u.Intent.data;
                $scope.items = u.Intent.items;

                console.log("Entered :", $scope.items);
                //                u.$q.all([$scope.load()]);
            }
            //            $scope.vms = _.each($scope.items, function (o) {
            //            o.vms_id;
            //
            //        });
            //            console.log("data", $scope.items);
        });


        //        $scope.load = function (useCache) {
        //
        //                return $scope.loading =
        //                    $http.get(App.apiEndPoint + "jvms_view").then(function (res) {
        //                        $scope.data = _.sortBy(res.data, function (o) {
        //                            return o.zone;
        //                        })
        //                        $scope.vmsID = _.filter($scope.data, function (i) {
        //                            return i.flag > 0;
        //                        })
        //                        $scope.datas = $scope.vmsID[$scope.index];
        //
        //                        $scope.datafilter = _.filter($scope.datas.vms_ids, function (o) {
        //                            console.log("item", o.status)
        //                            return o.status == "1";
        //                        })
        //                    });
        //            }
        // Close the modal
        $scope.closeModal = function () {
            $scope.modal.hide();
            $scope.modal.remove()
        };

        $scope.actionItemIndex = function (index) {

            var data = index;
            console.log("enter", data);
            u.Intent.data = data;
            u.Intent.items = $scope.items.vms[index];
            u.$state.go("tab.vmsdetails");
        }

        $scope.onRefresh = function () {
            u.$q.all([$scope.load().then(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    console.log("resfreshed");
                })
            ]);
        }
            $scope.goBottom = function() {
 
      $ionicScrollDelegate.scrollBottom(true);


  }
    });

})();