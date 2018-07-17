(function () {
    var _module = angular.module('route', []);
    _module.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {//add routeProvider 8/dec,$routeProvider
        $ionicConfigProvider.tabs.position('bottom');
        // var storage = localStorage.getObject('userDetails');
        $stateProvider
            .state('home', {
                url: '/home',
                cache: false,
           
                views: {
                    'main': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl'        
//                        templateUrl: 'templates/tabs.html',
//                        controller: 'TabsCtrl'
//                        templateUrl: 'templates/loginno.html',
//                        controller: 'LoginNoCtrl'
                        
                            }
                    
                        }
            })

            
            .state('tab', {
                url: '/tab',
                //cache: true,
                abstract: true,
//            templateUrl: "templates/tabs.html"
                views: {
                    'main': {
                        templateUrl: 'templates/menu.html',
                        controller: 'TabsCtrl'
                    }
                }
            })
        

            .state('tab.mapmain', {
                url: '/mapmain',
                cache: true,
                views: {
                    'MapMain': {
                        templateUrl: 'templates/MapMain.html',
                        controller: 'MapMainCtrl'
                    }
                }
            })

       
        
      .state('login', {
                url: '/login',
                cache: true,
                views: {
                    'main': {
                        templateUrl: 'templates/login.html',
                        controller: 'LoginCtrl' 
                    }
                }
            })
            
            .state('verify', {
                url: '/verify',
                cache: true,
                views: {
                    'main': {
                        templateUrl: 'templates/Verify.html',
                        controller: 'VerifyCtrl'
                    }
                }
            })
            .state('signup', {
                url: '/signup',
                cache: true,
                views: {
                    'main': {
                        templateUrl: 'templates/SignUp.html',
                        controller: 'SignUpCtrl'
                    }
                }
            })
        
               
        
            .state('forgot', {
                url: '/forgot',
                cache: true,
                views: {
                    'main': {
                        templateUrl: 'templates/forgot.html',
                        controller: 'ForgotCtrl'
                    }
                }
            })
/*         
            .state('tab.mapfilter', {
                url: '/mapfilter',
                cache: true,
                views: {
                    'MapFilter': {
                        templateUrl: 'templates/MapFilter.html',
                        controller: 'MapFilterCtrl'
                    }
                }
            })
*/
            .state('tab.reporttype', {
                url: '/reporttype',
                cache: true,
                views: {
                    'ReportGrid': {
                        templateUrl: 'templates/ReportGrid.html',
                        controller: 'ReportGridCtrl'
                    }
                }
            })
            .state('tab.report', {
                url: '/report',
                cache: true,
                views: {
                    'ReportGrid': {
                        templateUrl: 'templates/Report.html',
                        controller: 'ReportCtrl'
                    }
                }
            })
        
//         .when('tab.reporttype', {
//                templateUrl: 'templates/ReportGrid.html',
//                resolve:{
//        "check":function(accessFac,$location){   //function to be resolved, accessFac and $location Injected
//            if(accessFac.checkPermission()){    //check if the user has permission -- This happens before the page loads
//                
//            }else{
//                $location.path('/login');                //redirect user to home if it does not have permission.
//                alert("Login to continue");
//            }
//        }}
//            })
        
            .state('tab.ert', {
                url: '/ert',
                cache: true,
                views: {
                    'ERT': {
                        templateUrl: 'templates/ERTInfo.html',
                        controller: 'ERTInfoCtrl'
                    }
                }
            })
            .state('tab.lighthouse', {
                url: '/lighthouse',
                cache: true,
                views: {
                    'LightHouse': {
                        templateUrl: 'templates/LightHouse.html',
                        controller: 'LightHouseCtrl'
                    }
                }
            })
            .state('tab.ert_report', {
                url: '/ert_report',
                cache: true,
                views: {
                    'ERT': {
                        templateUrl: 'templates/ERTReport.html',
                        controller: 'ERTReportCtrl'
                    }
                }
            })
            .state('tab.ert_details', {
                url: '/ert_details',
                views: {
                    'ERT': {
                        templateUrl: 'templates/ERTDetails.html',
                        controller: 'ERTDetailsCtrl'
                    }
                }
            })
            .state('tab.ert_form', {
                url: '/ert_form',
                views: {
                    'ERT': {
                        templateUrl: 'templates/ERTForm.html',
                        controller: 'ERTFormCtrl'
                    }
                }
            })
            .state('tab.cameralist', {
                url: '/cameralist',
                views: {
                    'Drawer': {
                        templateUrl: 'templates/CameraList.html',
                        controller: 'CameraListCtrl'
                    }
                }
            })
            .state('tab.cctv', {
                url: '/cctv',
                views: {
                    'Drawer': {
                        templateUrl: 'templates/CCTVPic.html',
                        controller: 'CCTVPicCtrl'
                    }
                }
            })
        
            .state('tab.setting', {
                url: '/setting',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/Settings.html',
                        controller: 'SettingCtrl'
                    }
                }
            })
            .state('tab.about', {
                url: '/about',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/about.html',
                        controller: 'aboutCtrl'
                    }
                }
            })
            .state('tab.guide', {
                url: '/guide',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/walkthrough.html',
                        controller: 'walkthroughCtrl'
                    }
                }
            })
         .state('tab.infoguide', {
                url: '/infoguide',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/info-guide.html',
                        controller: 'info-guideCtrl'
                    }
                }
            })
        .state('tab.cctvguide', {
                url: '/infoguide',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/CctvGuide.html',
                        controller: 'cctvGuideCtrl'
                    }
                }
            })
            .state('tab.profile', {
                url: '/profile',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/SubPage/Profile.html',
                        controller: 'ProfileCtrl'
                    }
                }
            })
            .state('tab.changepassword', {
                url: '/changepassword',
                views: {
                    'Drawer': {
                        templateUrl: 'templates/SubPage/ChangePassword.html',
                        controller: 'ChangePasswordCtrl'
                    }
                }
            })
            .state('tab.highlight', {
                url: '/highlight',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/Highlight.html',
                        controller: 'HighlightCtrl'
                    }
                }
            })
            .state('tab.event', {
                url: '/event',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/Event.html',
                        controller: 'EventCtrl'
                    }
                }
            })
            .state('tab.infodbkl', {
                url: '/infodbkl',
                cache: true,
                views: {
                    'Drawer' : {
                        templateUrl: 'templates/InfoDBKL.html',
                        controller: 'InfoDBKLCtrl'
                    }
                }
            })
            .state('tab.traffic', {
                url: '/traffic',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/InfoTraffic.html',
                        controller: 'TrafficCtrl'
                    }
                }
            })
            .state('tab.parking', {
                url: '/parking',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/Parking.html',
                        controller: 'ParkingCtrl'
                    }
                }
            })

            .state('tab.vms', {
                url: '/vms',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/VMS.html',
                        controller: 'VMSCtrl'
                    }
                }
            })

            .state('tab.vmsview', {
                url: '/vmsview',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/VMSView.html',
                        controller: 'VMSViewCtrl'
                    }
                }
            })

            .state('tab.vmsdetails', {
                url: '/vmsdetails',
                cache: true,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/VMSDetails.html',
                        controller: 'VMSDetailsCtrl'
                    }
                }
            })
        
            .state('tab.sleepmode', {
                url: '/sleepmode',
                cache: false,
                views: {
                    'Drawer': {
                        templateUrl: 'templates/SleepMode.html',
                        controller: 'SleepmodeCtrl'
                    }
                }
            })

            .state('tab.directions', {
                url: '/directions',
                cache: false,
                views: {
                    'SearchPlace': {
                        templateUrl: 'templates/Directions.html',
                        controller: 'DirectionsCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('home');
//         $routeProvider
//    .when('/report' ,{    
//    templateUrl: "templates/report.html",
//    resolve:{
//        "check":function(accessFac,$location){   //function to be resolved, accessFac and $location Injected
//            if(accessFac.checkPermission()){    //check if the user has permission -- This happens before the page loads
//                
//            }else{
//                $location.path('/login.html');                //redirect user to home if it does not have permission.
//                alert("Login to continue");
//                
//            }
//        }
//    }
//        
//    }
          });
})

();

//http://codepen.io/markbeekman/pen/ogwqax

//http://codepen.io/gnomeontherun/pen/encAb