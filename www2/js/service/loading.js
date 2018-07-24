(function () {
    var _module = angular.module('loading', []);
    _module.service('loading', function($ionicLoading){        
        this.show = function () {
            $ionicLoading.show({
                delay: 300,
                template: 'Loading...'
            });
        }
        this.close = function () {
            $ionicLoading.hide();
        }
        return this;
    });
}());