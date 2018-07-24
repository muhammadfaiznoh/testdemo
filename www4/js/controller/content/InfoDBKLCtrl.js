(function () {
    var _module = angular.module('controller');
    _module.controller('InfoDBKLCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce) {
        ControllerBase($scope, 'event');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                $scope.data = u.Intent.data;
                $scope.images = $scope.data.url;
                
            }
            
        });
    });
})();