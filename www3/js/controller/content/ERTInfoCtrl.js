(function () {
    var _module = angular.module('controller');
    _module.controller('ERTInfoCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $http, localStorage, $ionicLoading) {
        ControllerBase($scope, 'ert');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                var storage = localStorage.getObject('userDetails');
                console.log(storage);
                $scope.edit_name = {}
                $scope.up_name = storage.name;
                $scope.up_email = storage.email;
                $scope.up_phone = storage.phone_no;
                //                $scope.images = [];
                $scope.team = storage.team;
                $scope.type = true;
                
                $scope.show = true;
                $scope.hide = false;

                $scope.selVal = 1;
                $scope.selectVal = 1;
                $scope.selectedVal = 1;
                $scope.external = 1;
        
                $scope.items = [{
                    value: 1,
                    text: 'Maintainance 1'
                }, {
                    value: 2,
                    text: 'Maintainance 2'
                }, {
                    value: 3,
                    text: 'Maintainance 3'
                }, {
                    value: 4,
                    text: 'Maintainance 4'
                }, {
                    value: 5,
                    text: 'Maintainance 5'
                }, {
                    value: 6,
                    text: 'Maintainance 6'
                }, {
                    value: 7,
                    text: 'Maintainance 7'
                }, {
                    value: 8,
                    text: 'Maintainance 8'
                }, {
                    value: 9,
                    text: 'Maintainance 9'
                }];
        
                $scope.settings = {
                    minWidth: 200
                };
        
                $scope.headerSettings = {
                    minWidth: 200,
                    headerText: 'Pick location'
                };
        
                $scope.nonFormSettings = {
                    minWidth: 200,
                    inputClass: 'demo-non-form'
                };
        
                $scope.externalSettings = {
                    minWidth: 200,
                    inputClass: 'demo-non-form',
                    showOnTap: false,
                    showOnFocus: false
                }

                u.$q.all([$scope.load()]);
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
            "img/icon/roadmaintain_icon.png",
            "img/icon/landslide_icon.png",
            "img/icon/RoadClosure.png",
            "img/icon/fallentree_icon.png",
            "img/icon/trafficjam.png"

        ];
        $scope.actionJobList = function () {
            $scope.type = true;
             $scope.show = true;
                $scope.hide = false;
        }
        $scope.actionReport = function () {
            $scope.type = false;
             $scope.show = false;
                $scope.hide = true;
        }
        $scope.load = function (useCache) {

                return $scope.loading =
                    $http.get(App.apiEndPoint + "jincident").then(function (res) {
                        $scope.items = res.data;
                        //                    _.each($scope.items, function (o) {
                        //
                        //                        //                        if (o.category_id == "1") {
                        //                        //                            $scope.images = "img/Accident.png";
                        //                        //                        }
                        //                    });

                        $scope.joblist = _.filter($scope.items, function (a) {
                            if (a.assigned_to == $scope.team) {
                                return a.assigned_to == $scope.team;
                            }
                        });
                        $ionicLoading.hide();
                        console.log("Length", $scope.joblist.length);

                        //                    console.log("ert", $scope.items);
                    });




            }
            //        $scope.image = function () {
            //
            //            if ($scope.items.title == "Accident") {
            //                $scope.images = "img/Accident.png";
            //            }
            //
            //        }
        $scope.actionJobDetails = function (index) {
            u.Intent.job = $scope.joblist[index];
            u.$state.go('tab.ert_details');
        }
        $scope.actionType = function (value) {
            if (value == 1) {

                $scope.type = "img/ktrafficlight.png"
                u.$state.go('tab.ert_report');
                console.log("clicked");
                u.Intent.data = $scope.type;
                u.Intent.text = "Faulty Traffic Light";
                u.Intent.typeid = "6";
            } else if (value == 2) {
                $scope.clicked = true;
                $scope.type = "img/icon/Accident.png";
                $scope.text = "Accident";
                u.$state.go('tab.ert_report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
                u.Intent.typeid = "1";
            } else if (value == 3) {
                $scope.clicked = true;
                $scope.type = "img/icon/breakdown_icon.png";
                $scope.text = "Breakdown";

                u.$state.go('tab.ert_report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
                u.Intent.typeid = "2";
            } else if (value == 4) {
                $scope.clicked = true;
                $scope.type = "img/icon/flood_icon.png";
                $scope.text = "Flood";
                u.$state.go('tab.ert_report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
                u.Intent.typeid = "3";
            } else if (value == 5) {
                $scope.clicked = true;
                $scope.type = "img/icon/fallentree_icon.png";
                $scope.text = "Fallen Trees";
                u.$state.go('tab.ert_report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
                u.Intent.typeid = "7";
            } else if (value == 6) {
                $scope.clicked = true;
                $scope.type = "img/icon/landslide_icon.png";
                $scope.text = "Landslide";
                u.$state.go('tab.ert_report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
                u.Intent.typeid = "5";
            } else if (value == 7) {
                $scope.clicked = true;
                $scope.type = "img/kpotholes.png";
                $scope.text = "Potholes";
                u.$state.go('tab.ert_report');
                u.Intent.data = $scope.type;
                u.Intent.typeid = "4";
                u.Intent.text = $scope.text;
            }
        }
       $scope.onRefresh = function () {
            $ionicLoading.show({
                template: '<ion-spinner icon="lines" ng-click="ItemClick()"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            }).then(function () {
                u.$q.all([$scope.load().then(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        //console.log("resfreshed");
                    })
                ]);
            });

        }
        
        
    });

})();