angular.module('eDrive', [
    'ionic',
    'config',
    'controller',
    'service',
    'ngCordova',
    'value',
    'ionic.contrib.drawer.vertical',
    'ionic-cache-src',
    'ionic-sidetabs',
//    'ion-google-place',
    'ngCookies',
    'jett.ionic.filter.bar',
//    'ionic-material',
    'ionMDRipple',
//    'base64'
//    'ion-place-tools'
    'cb.x2js',
    'ngCordovaOauth',
    'ion-floating-menu',
//    'ion-place-tools'
    'ion-google-place',
    'ngCordovaOauth',
     'plgn.ionic-segment'
    ])



.run(function ($rootScope, $cookieStore, $ionicPlatform, $timeout, App, u, appVersionChecker, localStorage, $http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $ionicPlatform.ready(function () {
 localStorage.setObject('role', {
                            annon: true});
        //        $scope.images = FileService.images();
        //        $scope.$apply();
        console.log("packagename", App.app.version);
        App.ionicPlatformReady = true;
        var storage = localStorage.getObject('userDetails');
        		var permissions = cordova.plugins.permissions;
		var perm_to_check = permissions.ACCESS_FINE_LOCATION;
		// Vérification permission
//		permissions.hasPermission(perm_to_check, callback);
//		function callback(status) {
//			if ( status.hasPermission ) {
//				alert("");
//			}
//			else {
//				alert("");
//				permissions.requestPermission(perm_to_check, success, error);
//			}
//		}
//		function error() {
//		  console.warn('permission is not turned on');
//		  alert('permission is not turned on');
//		}
//		function success( status ) {
//		  if( !status.hasPermission ) error();
//		  else alert('permission request accepted, permission turned on');
//		}

        $ionicPlatform.ready(function () {
            document.addEventListener("deviceready", function () {
                if (storage.email !== null && storage.password !== null) {
                    $http.post(App.apiEndPoint + "login", {
                        email: storage.email,
                        password: storage.password
                    }).then(function (res) {
                        var results;
                        results = res.data.split(",");
                        console.log("array : ", results);

                        if (results[0] == "Y") {
                            u.$state.go('tab.mapmain')
                        } else if (results[0] == "N") {
                            u.$state.go('tab.mapmain')
                        } else {
                            swal({
                                title: "Error",
                                text: "LocalStorage Problem",
                                type: "error",
                                showConfirmButton: true,
                                confirmButtonColor: "#F99F1E"
                            });
                        }
                    });
                    $http.get(App.apiEndPoint + "jincident").then(function (res) {
                        var items = res.data;
                        var joblist = _.filter(items, function (a) {
                            if (a.assigned_to === storage.team) {
                                return a.assigned_to === storage.team;
                            }
                        });
                        localStorage.setObject('badgeCount', {
                            badgeCount: joblist.length
                        });
                        console.log("length : ", joblist.length);
                        $rootScope.$emit("badgeCount", joblist.length);

                    });

                } else if (storage.email === undefined && storage.password === undefined) {
                    u.$state.go("home");
                } else {
                    u.$state.go("home");
                }
            }, false);
        });
        $rootScope.isMenuOpen = $ionicSideMenuDelegate.isOpen.bind($ionicSideMenuDelegate);



        // Disable BACK button on home
        $ionicPlatform.registerBackButtonAction(function (event) {
            if ($state.current.name == "app.home") {
                navigator.app.exitApp();
            } else {
                navigator.app.backHistory();
            }
        }, 100);

        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleLightContent();
        }
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        if (window.cordova && window.cordova.getAppVersion) {
            cordova.getAppVersion.getVersionNumber().then(function (version) {
                App.app.version = version;
                cordova.getAppVersion.getPackageName().then(function (packagename) {
                    App.app.appid = packagename;
                    if (ionic.Platform.isIOS()) {
                        App.app.platform = 'ios';
                    } else if (ionic.Platform.isAndroid()) {
                        App.app.platform = 'android';
                    } else {
                        App.app.platform = 'ios';
                    }
                    appVersionChecker.init(App.app.appid, App.app.platform, App.app.version);
                });
            });
        }
    });
})

.run(["$rootScope", "$state", function($rootScope, $state) {

      $rootScope.$on('$locationChangeStart', function(event, next, current) {
        if (!$rootScope.loggedUser == null) {
          $state.go('login');
        }    
      });
}])