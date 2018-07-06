(function () {
    var _module = angular.module('ion-content-error', []);
    _module.directive('ionContentError', function () {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                error: '=error'  
            },
            link: function (scope, element, attrs, controllers) {
                console.log('ionContentError');  
            },
            template: '<div ng-if="error.show" class="ion-content-error-container">' +
                '<div><strong>{{error.title}}</strong></div>' +
                '<div><small>{{error.description</small>}}</div>' +
                '<button class="button button-clear button-dark" ng-click="error.button.onTap()">{{error.button.text}}</button>' +
                '</div>'
        };
    });
}())