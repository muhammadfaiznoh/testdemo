(function () {
    var _module = angular.module('controller');
    _module.controller('ReportGridCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $ionDrawerVerticalDelegate, $ionicNavBarDelegate) {
        ControllerBase($scope, 'reportgrid');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            $ionDrawerVerticalDelegate.closeDrawer();
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }

        });


        $scope.actionType = function (value) {
            if (value == 1) {
                $scope.type = "img/maintain/light-bulb-1.png"
                u.$state.go('tab.report');
                u.Intent.data = $scope.type;
                u.Intent.text = "Lightbulb";
                $scope.id = "6";
                u.Intent.id = $scope.id;
            } else if (value == 2) {
                $scope.clicked = true;
                $scope.type = "img/maintain/grass.png";
                $scope.text = "Grass";
                $scope.id = "1";
                u.$state.go('tab.report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
                u.Intent.id = $scope.id;
            } else if (value == 3) {
                $scope.clicked = true;
                $scope.type = "img/maintain/paint-roller-1.png";
                $scope.text = "Paint";
                $scope.id = "2";
                u.Intent.id = $scope.id;
                u.$state.go('tab.report');
                u.Intent.id = $scope.id;
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
            } else if (value == 4) {
                $scope.clicked = true;
                $scope.type = "img/maintain/tools-1.png";
                $scope.text = "Equipment";
                $scope.id = "3";
                u.Intent.id = $scope.id;
                u.$state.go('tab.report');
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
            } else if (value == 5) {
                $scope.clicked = true;
                $scope.type = "img/maintain/plug-4.png";
                $scope.text = "Electrification";
                u.$state.go('tab.report');
                $scope.id = "7";
                u.Intent.id = $scope.id;
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
            } else if (value == 6) {
                $scope.clicked = true;
                $scope.type = "img/icon/landslide_icon.png";
                $scope.text = "Landslide";
                u.$state.go('tab.report');
                $scope.id = "5";
                u.Intent.id = $scope.id;
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
            } else if (value == 7) {
                $scope.clicked = true;
                $scope.type = "img/icon/RoadClosure.png";
                $scope.text = "Potholes";
                u.$state.go('tab.report');
                $scope.id = "4";
                u.Intent.id = $scope.id;
                u.Intent.data = $scope.type;
                u.Intent.text = $scope.text;
            }
        }



    });
})();