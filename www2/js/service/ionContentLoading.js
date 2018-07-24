(function () {
    var _module = angular.module('ion-content-loading', []);
    _module.directive('ionContentLoading', function () {
        return {
            restrict: 'E',
            transclude: true,
            link: function (scope, element, attrs, controllers) {},
            template: '<div ng-if="getShowLoading()" class="ion-content-loading-container">' +
//                '<strong class="ion-content-loading">Loading...</strong>' +
            '<div class="img-wrapper"><div class="img-scaler"><img src="img/logo_ball_xs.png"></div></div>' +
                '</div>'
        };
    });
}())