(function () {
    var _module = angular.module('config', ['value', 'route']);
    _module.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-chevron-left');
        $ionicConfigProvider.backButton.text('');
//        $ionicNativeTransitionsProvider.setDefaultTransition({
//            type: 'slide',
//            direction: 'left'
//        });
//        $ionicNativeTransitionsProvider.setDefaultBackTransition({
//            type: 'slide',
//            direction: 'right'
//        });
    });

 

    _module.run(function ($rootScope, App) {
        $rootScope.sideMenu = {};
        if (window.innerWidth > App.sideMenu.sm.break) {
            $rootScope.sideMenu.width = App.sideMenu.sm.value;
        } else {
            $rootScope.sideMenu.width = App.sideMenu.xs.value;
        }
    });

})();