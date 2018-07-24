(function () {
    var _module = angular.module('controller');
    _module.controller('TabsCtrl', function ($scope, ControllerBase, u, App, $http, $rootScope, $ionicModal, $ionDrawerVerticalDelegate, localStorage, $ionicModal, $ionicPopup, $ionicSideMenuDelegate) {
        ControllerBase($scope, 'tabs');
       
                           
        $scope.$on('$ionicView.beforeEnter', function (viewInfo, state) {
            var storage = localStorage.getObject('userDetails');
            $scope.team = storage.team;
            $scope.blacklist = storage.blacklist_flag;
            console.log($scope.blacklist);
            $scope.staff = storage.staff;
            if ($scope.blacklist == "N") {
                $scope.authorize = true;

            } else if ($scope.blacklist == "Y") {
                $scope.authorize = false;
            }
            $http.get(App.apiEndPoint + "jincident").then(function (res) {
                $scope.items = res.data;
                $scope.joblist = _.filter($scope.items, function (a) {
                    if (a.assigned_to == $scope.team && a.status == "Approve") {
                        return a.assigned_to == $scope.team;
                    }
                });
                if ($scope.joblist != null) {
                    var vERTObject = document.getElementById("ERTButton");
                    if (vERTObject != null) {
                        var vJobNumber = document.getElementById("JobNumber");
                        if (vJobNumber != null) {
                            vJobNumber.parentNode.removeChild(vJobNumber);
                        }
                        if ($scope.joblist.length > 0) {
                            var vDisplayObject = document.createElement("div");
                            var vDisplayText = document.createTextNode($scope.joblist.length);
                            vDisplayObject.appendChild(vDisplayText);
                            var rect = vERTObject.getBoundingClientRect();
                            var leftPos = document.documentElement.clientWidth - 30;
                            vDisplayObject.setAttribute("id", "JobNumber");
                            vDisplayObject.style.position = "absolute";
                            vDisplayObject.style.left = leftPos + 'px';
                            vDisplayObject.style.top = '0px';
                            vDisplayObject.style.color = "Red";
                            vDisplayObject.style.zIndex = "1";
                            vERTObject.appendChild(vDisplayObject);
                        }
                    }
                }
            });
            if (['none', 'forward', 'swap'].indexOf(state.direction) >= 0) {

            }
        });
        
        var text;
        $scope.showPopup = function () {
            swal("Blocked", "Your account had been blocked", "info");
            u.$state.go("Home");
        }

        //        u.$state.go("tab.directions");
        $scope.actionDirections = function () {
            //            $ionicModal.fromTemplateUrl('templates/common/modal_autocomplete.html', {
            //                scope: $scope,
            //                animation: 'slide-in-down'
            //            }).then(function (modal) {
            //                console.log("test");
            //                var input = (document.getElementById('pac-input'));
            //            });

            u.$state.go("tab.directions");
            $ionDrawerVerticalDelegate.closeDrawer();

            //
            //            TTS.speak({
            //                text: 'Please set your destination',
            //                locale: 'en-MY',
            //                rate: 1.5
            //            }, function () {
            //                // Do Something after success
            //            }, function (reason) {
            //                // Handle the error case
            //            });

        }
        
        $scope.actionReporttype = function () {
            
           var storage = localStorage.getObject('userDetails');
            
            if(localStorage.getObject('userDetails')==null){
                swal("Alert", "Please login to report", "info");
   
                u.$state.go("login");
            $ionDrawerVerticalDelegate.closeDrawer();}else{
                 u.$state.go("tab.reporttype");
            }
            


        }
        $scope.autotext = function () {

            var autocomplete = new google.maps.places.Autocomplete(input);
        }

        $scope.dialNumber = function (number) {
            window.open('tel:' + number, '_system');
        }


        $scope.toggleDrawer = function (state) {
            $ionDrawerVerticalDelegate.toggleDrawer().then(function () {
                $scope.isDrawer();
            });





        }

        $scope.toggleLeft = function() {
            $ionicSideMenuDelegate.toggleLeft();
          };

        $scope.isDrawer = function () {
            //            console.log("states : ", state);
            var drwState = $ionDrawerVerticalDelegate.getState();
            localStorage.setObject('drawerState', {
                state: drwState
            });


        }
        console.log("text", $scope.drawerIs);

        //
        //        $scope.CallNumber = function () {
        //            var number = '0389474002';
        //            window.plugins.CallNumber.callNumber(function () {
        //                window.open('tel:' + number);
        //            }, function () {
        //                //error logic goes here
        //            }, number)
        //        };


        //        $scope.modal = null;
        //                $scope.openAutoComplete = function () {
        //                
        //
        //

        $ionicModal.fromTemplateUrl('templates/common/modal_autocomplete.html', {
            scope: $scope,
            animation: 'slide-in-down'
        }).then(function (modal) {
            $scope.modal = modal;

        });

        $scope.toggleDrawer = function (state) {
            $ionDrawerVerticalDelegate.toggleDrawer().then(function () {
                $scope.isDrawer();
            });
        }

        $rootScope.$on("badgeCount", function (data) {
            console.log("badge", data);
            $scope.badgeCounts = data;
        });

        $scope.isDrawer = function () {
            var drwState = $ionDrawerVerticalDelegate.getState();
            if (drwState == 'opened') {
                $rootScope.$emit("DrawerOpened", {});
            } else if (drwState == 'closed') {
                $rootScope.$emit("DrawerClosed", {});
            }
        }
        $scope.sleep = function () {
                if (ionic.Platform.isAndroid()) {
                    ionic.Platform.exitApp();
                } else if (ionic.Platform.isIOS()) {
                    u.$state.go('tab.sleepmode');
                    $ionDrawerVerticalDelegate.closeDrawer();
                } else {
                    u.$state.go('tab.sleepmode');
                    $ionDrawerVerticalDelegate.closeDrawer();
                }
            }
            //          var storage = localStorage.getObject('badgeCount');
            //          $scope.badgeCount = storage.badgeCount;
            //            console.log("Storage :", storage.badgeCount);
            //        
        $scope.openModal = function () {

            $scope.modal.show();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };



        $scope.closeDrawer = function () {
            $ionDrawerVerticalDelegate.closeDrawer();
            console.log("Closed");
        }

        $scope.actionHighlight = function () {
var highlightLaunchTime = localStorage.getObject('launchTime');

                            //Check if it already exists or not
                            if (highlightLaunchTime) {
                                var count = highlightLaunchTime
                                console.log("value1", count);
                                   u.$state.go('tab.infoguide');
                               // u.$state.go('tab.highlight');
                                //This is a second time launch, and count = applaunchCount
                            } else {
                                //Local storage is not set, hence first time launch. set the local storage item
                                var datas = localStorage.setObject('launchTime', 1);
                                console.log("value2", datas);

                                u.$state.go('tab.infoguide');
                            }
            //u.$state.go("tab.highlight");
            $ionDrawerVerticalDelegate.closeDrawer();

        }
        $scope.actionCCTV = function () {
                u.$state.go("tab.cameralist");
            $ionDrawerVerticalDelegate.closeDrawer();
          /*  var cctvLaunchTime = localStorage.getObject('launchCctv');

                            //Check if it already exists or not
                            if (cctvLaunchTime) {
                                var count = cctvLaunchTime
                                console.log("value1", count);
                                u.$state.go('tab.cctvguide');
                               // u.$state.go("tab.cameralist");
                                //This is a second time launch, and count = applaunchCount
                            } else {
                                //Local storage is not set, hence first time launch. set the local storage item
                                var datas = localStorage.setObject('launchCctv', 1);
                                console.log("value2", datas);

                                u.$state.go('tab.cctvguide');
                            }
            
            $ionDrawerVerticalDelegate.closeDrawer(); */
        }

        $scope.actionLighthouse = function () {
            u.$state.go("tab.lighthouse");
       
 
    }
        $scope.actionParking = function () {
            u.$state.go("tab.parking");
            $ionDrawerVerticalDelegate.closeDrawer();
        }
        $scope.actionERT = function () {
            u.$state.go("ert");

        }
        $scope.actionReport = function () {
            $ionDrawerVerticalDelegate.closeDrawer();
        }
        $scope.actionSetting = function () {
            u.$state.go("tab.setting");
            console.log("click");
            $ionDrawerVerticalDelegate.closeDrawer();
        }
        $scope.actionVMS = function () {
            u.$state.go("tab.vms");
            $ionDrawerVerticalDelegate.closeDrawer();
        }

        $scope.actionSleep = function () {
            u.$state.go("tab.sleepmode");
            
            $ionDrawerVerticalDelegate.closeDrawer();
        }
        $scope.actionTTS = function () {
            u.$state.go("tab.TTS");

            $ionDrawerVerticalDelegate.closeDrawer();
        }


    });

})();