(function () {
    var _module = angular.module('controller');
    _module.controller('LanguageCtrl', function ($scope, ControllerBase, u, App, $ionicModal, $sce) {
        ControllerBase($scope, 'language');
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {

            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }
        });

        $scope.filter = [
            {
                text: "English",
                checked: true
            },
            {
                text: "Bahasa Melayu",
                checked: false
            }
        ];
    });

})();