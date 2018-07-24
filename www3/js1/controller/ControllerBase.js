(function() {
    var _module = angular.module('controller');
    _module.factory('ControllerBase', function ($timeout, u, App) {
        var ret = function ($scope, id) {
            $scope.id = id;
            $scope.ionContentHandleName = 'ion-content-delegate-handle-' + id;
            $scope.afterEnterCompleted = false;
            $scope.afterLeaveCompleted = false;
            $scope.contentVisible = true;
            
            $scope.scrollTop = function () {
                $scope.$scroll.scrollTop(0);
                $scope.$scroll.css({'transform' : 'translate3d(0px,0px,0px) scale(1)'});
                $scope.$scroll.css({'-webkit-transform' : 'translate3d(0px,0px,0px) scale(1)'});
                $scope.$scroll.css({'-ms-transform' : 'translate3d(0px,0px,0px) scale(1)'});
            };
            $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
                if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {
                    if (!$scope.$element && id) {
                        $scope.$element = angular.element(sprintf('#%s[nav-view=active], #%s[nav-view=entering], #%s[nav-view=stage]', id, id, id));
                        $scope.$ioncontent = angular.element('ion-content', $scope.$element);
                        $scope.$scroll = angular.element('ion-content>.scroll', $scope.$element);
                    }
                    if ($scope.$element && $scope.$element.length && $scope.$scroll && $scope.$scroll.length) {
                        $scope.scrollTop();
                    }
                }
                
                $scope.afterEnterDefer = u.$q.defer();
                $scope.afterEnterPromise = $scope.afterEnterDefer.promise;
                $scope.afterEnterCompleted = false;
                $scope.contentVisible = true;
            });
            
            $scope.$on('$ionicView.afterEnter', function (viewInfo, state) {
                $scope.afterEnterDefer.resolve();
                $scope.afterEnterCompleted = true;
            });
            
            $scope.$on('$ionicView.beforeLeave', function (viewInfo, state) {
                if ($scope.triggerPullToRefreshAnimationDelay) {
                    $timeout.cancel($scope.triggerPullToRefreshAnimationDelay);
                    $scope.triggerPullToRefreshAnimationDelay = null;
                }
                $timeout(function () {
                    $scope.afterLeaveCompleted = false;
                });
                $timeout(function () {
                    $scope.afterLeaveCompleted = true;
                    $scope.contentVisible = false;
                });
            });
            
            $scope.$on('$ionicView.afterLeave', function (viewInfo, state) {
                if ($scope.triggerPullToRefreshAnimationDelay) {
                    $timeout.cancel($scope.triggerPullToRefreshAnimationDelay);
                    $scope.triggerPullToRefreshAnimationDelay = null;
                }
            });
            
            $scope.LoadAndShowPullToRefreshAnimation = function (promise, ionContentHandleName) {
                var vionContentHandleName = ionContentHandleName || $scope.ionContentHandleName;
                if ($scope.loading) { return $scope.loading; }
                $scope.triggerPullToRefreshAnimationDelay = $timeout(function () {
                    u.triggerPullToRefreshAnimation(ionContentHandleName);
                    $scope.pullToRefreshShowing = true;
                }, App.pullToRefreshMinimumDelay);
                
                $scope.loading = promise.finally(function () {
                    $scope.loading = null;
                    if ($scope.triggerPullToRefreshAnimationDelay) {
                        $timeout.cancel($scope.triggerPullToRefreshAnimationDelay);
                        $scope.triggerPullToRefreshAnimationDelay = null;
                    }
                    $timeout(function () {
                        $scope.$broadcast('scroll.refreshComplete');
                        $timeout(function () {
                            $scope.pullToRefreshShowing = false;
                        }, App.pullToRefreshCompletedTimeout);
                    }, App.refreshCompleteTimeout);
                });
                return $scope.loading;
            };
            
            $scope.startPendingDelayLoad = function () {
                if ($scope.pendingDelayLoad) {
                    u.$timeout.cancel($scope.pendingDelayLoad);
                    $scope.pendingDelayLoad = null;
                    $scope.load();
                }
            };
            
            $scope.startPendingDelayLoadOrNewDelayLoad = function () {
                if ($scope.pendingDelayLoad) {
                    u.$timeout.cancel($scope.pendingDelayLoad);
                    $scope.pendingDelayLoad = null;
                    $scope.load();
                } else {
                    $scope.load();
                }
            };
            
            $scope.startAndReplacePendingDelayLoad = function () {
                if ($scope.pendingDelayLoad) {
                    u.$timeout.cancel($scope.pendingDelayLoad);
                    $scope.pendingDelayLoad = null;
                }
                $scope.pendingDelayLoad = u.$timeout(function () {
                    $scope.pendingDelayLoad = null;
                    $scope.load();
                }, App.filterChangedLoadDelay);
            };
            
            $scope.inAppBrowserOpen = function (url) {
                cordova.InAppBrowser.open(url, '_blank', null);
            };
        };
        return ret;
    });
})();