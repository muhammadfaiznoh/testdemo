(function () {
    var _module = angular.module('controller');
    _module.controller('VMSDetailsCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $http, $ionicLoading) {
        ControllerBase($scope, 'vmsdetails');
        $scope.date = new Date();
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap', 'enter', 'back'].indexOf(state.direction) >= 0) {
                //                $scope.index = u.Intent.data;
                $scope.items = u.Intent.items;
               
               $scope.data1 = $scope.items.page.replace(/,/g,"\r\n");
               $scope.data = $scope.data1.split(";");
                 
     console.log("enter1",  $scope.data1 );   



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
            u.Intent.items = $scope.items[index];
            u.$state.go("tab.vmsview");
        }

       
    });

})();